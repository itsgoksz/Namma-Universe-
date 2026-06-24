"""
Aiva — Analytics API Routes
"""

from datetime import date, datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Query
from sqlalchemy import and_, case, cast, func, select, Date

from app.core.deps import CurrentUser, DbSession
from app.models.appointment import Appointment
from app.models.call import Call
from app.models.customer import Customer
from app.models.service import Service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
async def get_overview(current_user: CurrentUser, db: DbSession):
    """Dashboard KPI overview."""
    today = date.today()
    business_id = current_user.business_id

    # Today's appointments
    today_count = await db.execute(
        select(func.count()).where(
            Appointment.business_id == business_id,
            Appointment.date == today,
        )
    )
    todays_appointments = today_count.scalar() or 0

    # Upcoming appointments (next 7 days)
    upcoming_count = await db.execute(
        select(func.count()).where(
            Appointment.business_id == business_id,
            Appointment.date > today,
            Appointment.date <= today + timedelta(days=7),
            Appointment.status.in_(["scheduled", "confirmed"]),
        )
    )
    upcoming_appointments = upcoming_count.scalar() or 0

    # Today's calls
    today_start = datetime.combine(today, datetime.min.time()).replace(
        tzinfo=timezone.utc
    )
    today_end = datetime.combine(today, datetime.max.time()).replace(
        tzinfo=timezone.utc
    )
    calls_today_result = await db.execute(
        select(func.count()).where(
            Call.business_id == business_id,
            Call.call_start >= today_start,
            Call.call_start <= today_end,
        )
    )
    calls_today = calls_today_result.scalar() or 0

    # AI bookings
    ai_bookings_result = await db.execute(
        select(func.count()).where(
            Appointment.business_id == business_id,
            Appointment.source == "ai",
        )
    )
    ai_bookings = ai_bookings_result.scalar() or 0

    # Total bookings for AI percentage
    total_bookings_result = await db.execute(
        select(func.count()).where(Appointment.business_id == business_id)
    )
    total_bookings = total_bookings_result.scalar() or 1

    # Missed calls
    missed_calls_result = await db.execute(
        select(func.count()).where(
            Call.business_id == business_id,
            Call.outcome == "missed",
        )
    )
    missed_calls = missed_calls_result.scalar() or 0

    # Repeat customers (more than 1 visit)
    repeat_result = await db.execute(
        select(func.count()).where(
            Customer.business_id == business_id,
            Customer.total_visits > 1,
        )
    )
    repeat_customers = repeat_result.scalar() or 0

    total_customers_result = await db.execute(
        select(func.count()).where(Customer.business_id == business_id)
    )
    total_customers = total_customers_result.scalar() or 1

    # Revenue estimate (from completed appointments)
    revenue_result = await db.execute(
        select(func.sum(Service.price))
        .join(Appointment, Appointment.service_id == Service.id)
        .where(
            Appointment.business_id == business_id,
            Appointment.status == "completed",
        )
    )
    revenue = float(revenue_result.scalar() or 0)

    # Estimated revenue (from scheduled/confirmed appointments)
    estimated_revenue_result = await db.execute(
        select(func.sum(Service.price))
        .join(Appointment, Appointment.service_id == Service.id)
        .where(
            Appointment.business_id == business_id,
            Appointment.status.in_(["scheduled", "confirmed"]),
        )
    )
    estimated_revenue = float(estimated_revenue_result.scalar() or 0)

    # AI performance (successful AI calls / total AI calls)
    ai_calls_result = await db.execute(
        select(func.count()).where(
            Call.business_id == business_id,
            Call.outcome.in_(["booked", "rescheduled", "cancelled", "faq"]),
        )
    )
    successful_ai_calls = ai_calls_result.scalar() or 0

    total_calls_result = await db.execute(
        select(func.count()).where(Call.business_id == business_id)
    )
    total_calls = total_calls_result.scalar() or 1

    return {
        "todays_appointments": todays_appointments,
        "upcoming_appointments": upcoming_appointments,
        "calls_today": calls_today,
        "ai_bookings": ai_bookings,
        "ai_booking_percentage": round((ai_bookings / total_bookings) * 100, 1),
        "missed_calls": missed_calls,
        "repeat_customers": repeat_customers,
        "repeat_customer_percentage": round(
            (repeat_customers / total_customers) * 100, 1
        ),
        "revenue_estimate": revenue,
        "estimated_revenue": estimated_revenue,
        "ai_performance": round((successful_ai_calls / total_calls) * 100, 1),
    }


@router.get("/services")
async def get_service_analytics(
    current_user: CurrentUser,
    db: DbSession,
    days: int = Query(30, ge=7, le=365),
):
    """Most popular services."""
    since = date.today() - timedelta(days=days)

    result = await db.execute(
        select(
            Service.name,
            func.count(Appointment.id).label("booking_count"),
            func.sum(Service.price).label("revenue"),
        )
        .join(Appointment, Appointment.service_id == Service.id)
        .where(
            Appointment.business_id == current_user.business_id,
            Appointment.date >= since,
        )
        .group_by(Service.name)
        .order_by(func.count(Appointment.id).desc())
        .limit(10)
    )

    services = []
    for row in result:
        services.append({
            "name": row[0],
            "booking_count": row[1],
            "revenue": float(row[2] or 0),
        })

    return {"services": services, "period_days": days}


@router.get("/peak-hours")
async def get_peak_hours(
    current_user: CurrentUser,
    db: DbSession,
    days: int = Query(30, ge=7, le=365),
):
    """Peak booking hours heatmap data."""
    since = date.today() - timedelta(days=days)

    result = await db.execute(
        select(
            func.extract("dow", Appointment.date).label("day_of_week"),
            func.extract("hour", Appointment.start_time).label("hour"),
            func.count(Appointment.id).label("count"),
        )
        .where(
            Appointment.business_id == current_user.business_id,
            Appointment.date >= since,
        )
        .group_by("day_of_week", "hour")
        .order_by("day_of_week", "hour")
    )

    heatmap = []
    for row in result:
        heatmap.append({
            "day": int(row[0]),
            "hour": int(row[1]),
            "count": row[2],
        })

    return {"heatmap": heatmap, "period_days": days}


@router.get("/calls")
async def get_call_analytics(
    current_user: CurrentUser,
    db: DbSession,
    days: int = Query(30, ge=7, le=365),
):
    """Call outcome breakdown."""
    since = datetime.now(timezone.utc) - timedelta(days=days)

    result = await db.execute(
        select(
            Call.outcome,
            func.count(Call.id).label("count"),
        )
        .where(
            Call.business_id == current_user.business_id,
            Call.call_start >= since,
        )
        .group_by(Call.outcome)
    )

    outcomes = {}
    for row in result:
        outcomes[row[0]] = row[1]

    # Average call duration
    avg_duration = await db.execute(
        select(func.avg(Call.duration_seconds)).where(
            Call.business_id == current_user.business_id,
            Call.call_start >= since,
            Call.duration_seconds.isnot(None),
        )
    )
    avg_dur = avg_duration.scalar()

    return {
        "outcomes": outcomes,
        "average_duration_seconds": round(float(avg_dur or 0), 1),
        "period_days": days,
    }


@router.get("/revenue")
async def get_revenue_analytics(
    current_user: CurrentUser,
    db: DbSession,
    days: int = Query(30, ge=7, le=365),
):
    """Revenue by day."""
    since = date.today() - timedelta(days=days)

    result = await db.execute(
        select(
            Appointment.date,
            func.sum(Service.price).label("revenue"),
            func.count(Appointment.id).label("bookings"),
        )
        .join(Service, Appointment.service_id == Service.id)
        .where(
            Appointment.business_id == current_user.business_id,
            Appointment.date >= since,
            Appointment.status == "completed",
        )
        .group_by(Appointment.date)
        .order_by(Appointment.date)
    )

    data = []
    for row in result:
        data.append({
            "date": row[0].isoformat(),
            "revenue": float(row[1] or 0),
            "bookings": row[2],
        })

    return {"data": data, "period_days": days}
