"""
Aiva — Analytics Service
Aggregated business intelligence queries with optional Redis caching.
"""

from datetime import date, datetime, timedelta, timezone
from typing import Optional
import json
import logging

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.call import Call
from app.models.customer import Customer
from app.models.service import Service

logger = logging.getLogger(__name__)

# Cache TTL in seconds (5 minutes)
CACHE_TTL = 300


class AnalyticsService:
    """Provides aggregated analytics for a business."""

    def __init__(self):
        self._redis = None

    async def _get_redis(self):
        """Lazy Redis connection (returns None if unavailable)."""
        if self._redis is None:
            try:
                import redis.asyncio as aioredis
                from app.core.config import settings
                self._redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
                # Test connection
                await self._redis.ping()
            except Exception as e:
                logger.debug(f"Redis not available for analytics caching: {e}")
                self._redis = False  # Sentinel: tried and failed
        return self._redis if self._redis is not False else None

    async def _get_cached(self, key: str) -> Optional[dict]:
        """Get cached value from Redis."""
        r = await self._get_redis()
        if r is None:
            return None
        try:
            value = await r.get(key)
            return json.loads(value) if value else None
        except Exception:
            return None

    async def _set_cached(self, key: str, value: dict):
        """Set cached value in Redis with TTL."""
        r = await self._get_redis()
        if r is None:
            return
        try:
            await r.setex(key, CACHE_TTL, json.dumps(value, default=str))
        except Exception:
            pass

    async def invalidate_overview_cache(self, business_id: int):
        """Invalidate the overview cache for a specific business."""
        r = await self._get_redis()
        if r is None:
            return
        try:
            await r.delete(f"analytics:overview:{business_id}")
        except Exception:
            pass

    async def get_overview(self, db: AsyncSession, business_id: int) -> dict:
        """Dashboard KPI overview with caching."""
        cache_key = f"analytics:overview:{business_id}"
        cached = await self._get_cached(cache_key)
        if cached:
            return cached

        today = date.today()

        # Today's appointments
        today_result = await db.execute(
            select(func.count()).where(
                Appointment.business_id == business_id,
                Appointment.date == today,
            )
        )
        todays_appointments = today_result.scalar() or 0

        # Upcoming (next 7 days)
        upcoming_result = await db.execute(
            select(func.count()).where(
                Appointment.business_id == business_id,
                Appointment.date > today,
                Appointment.date <= today + timedelta(days=7),
                Appointment.status.in_(["scheduled", "confirmed"]),
            )
        )
        upcoming_appointments = upcoming_result.scalar() or 0

        # Today's calls
        today_start = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
        today_end = datetime.combine(today, datetime.max.time()).replace(tzinfo=timezone.utc)
        calls_result = await db.execute(
            select(func.count()).where(
                Call.business_id == business_id,
                Call.call_start >= today_start,
                Call.call_start <= today_end,
            )
        )
        calls_today = calls_result.scalar() or 0

        # AI bookings
        ai_result = await db.execute(
            select(func.count()).where(
                Appointment.business_id == business_id,
                Appointment.source == "ai",
            )
        )
        ai_bookings = ai_result.scalar() or 0

        # Total bookings
        total_result = await db.execute(
            select(func.count()).where(Appointment.business_id == business_id)
        )
        total_bookings = total_result.scalar() or 1

        # Revenue from completed appointments
        revenue_result = await db.execute(
            select(func.sum(Service.price))
            .join(Appointment, Appointment.service_id == Service.id)
            .where(
                Appointment.business_id == business_id,
                Appointment.status == "completed",
            )
        )
        revenue = float(revenue_result.scalar() or 0)

        # Estimated revenue from booked (scheduled/confirmed) appointments TODAY
        estimated_revenue_result = await db.execute(
            select(func.sum(Service.price))
            .join(Appointment, Appointment.service_id == Service.id)
            .where(
                Appointment.business_id == business_id,
                Appointment.status.in_(["scheduled", "confirmed"]),
                Appointment.date == today,
            )
        )
        estimated_revenue = float(estimated_revenue_result.scalar() or 0)

        result = {
            "todays_appointments": todays_appointments,
            "upcoming_appointments": upcoming_appointments,
            "calls_today": calls_today,
            "ai_bookings": ai_bookings,
            "ai_booking_percentage": round((ai_bookings / total_bookings) * 100, 1),
            "revenue_estimate": revenue,
            "estimated_revenue": estimated_revenue,
        }

        await self._set_cached(cache_key, result)
        return result

    async def get_service_breakdown(
        self, db: AsyncSession, business_id: int, days: int = 30
    ) -> list[dict]:
        """Top services by booking count."""
        since = date.today() - timedelta(days=days)

        result = await db.execute(
            select(
                Service.name,
                func.count(Appointment.id).label("booking_count"),
                func.sum(Service.price).label("revenue"),
            )
            .join(Appointment, Appointment.service_id == Service.id)
            .where(
                Appointment.business_id == business_id,
                Appointment.date >= since,
            )
            .group_by(Service.name)
            .order_by(func.count(Appointment.id).desc())
            .limit(10)
        )

        return [
            {"name": row[0], "booking_count": row[1], "revenue": float(row[2] or 0)}
            for row in result
        ]

    async def get_customer_retention(
        self, db: AsyncSession, business_id: int
    ) -> dict:
        """Calculate customer retention metrics."""
        total_result = await db.execute(
            select(func.count()).where(Customer.business_id == business_id)
        )
        total = total_result.scalar() or 0

        repeat_result = await db.execute(
            select(func.count()).where(
                Customer.business_id == business_id,
                Customer.total_visits > 1,
            )
        )
        repeat = repeat_result.scalar() or 0

        no_show_result = await db.execute(
            select(func.avg(Customer.no_show_count)).where(
                Customer.business_id == business_id
            )
        )
        avg_no_show = float(no_show_result.scalar() or 0)

        return {
            "total_customers": total,
            "repeat_customers": repeat,
            "retention_rate": round((repeat / total) * 100, 1) if total > 0 else 0,
            "avg_no_show_rate": round(avg_no_show, 2),
        }


# Module-level singleton
analytics_service = AnalyticsService()
