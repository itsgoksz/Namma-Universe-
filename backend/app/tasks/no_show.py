"""
Aiva — No-Show Detection Task
Detects appointments past their end time that are still marked as
'scheduled' and flags them as no-shows. Updates customer reliability scores.
"""

from datetime import datetime, timezone, date, time, timedelta
import logging

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models.appointment import Appointment
from app.models.customer import Customer

logger = logging.getLogger(__name__)


async def detect_no_shows():
    """
    Find appointments that are past their scheduled end time but still
    marked as 'scheduled' (never confirmed or completed). Mark as no_show
    and update the customer's no-show count and reliability score.
    """
    async with AsyncSessionLocal() as db:
        try:
            now = datetime.now(timezone.utc)
            today = now.date()
            current_time = now.time()

            # Find appointments from today or earlier that are past end time
            # and still in 'scheduled' status (not confirmed, completed, or cancelled)
            result = await db.execute(
                select(Appointment)
                .where(
                    Appointment.status == "scheduled",
                    Appointment.date <= today,
                )
            )
            appointments = result.scalars().all()

            no_show_count = 0
            for appt in appointments:
                # Check if the appointment is past its end time
                is_past = False
                if appt.date < today:
                    is_past = True
                elif appt.date == today and appt.end_time < current_time:
                    is_past = True

                if is_past:
                    appt.status = "no_show"
                    no_show_count += 1

                    # Update customer reliability
                    if appt.customer_id:
                        customer_result = await db.execute(
                            select(Customer).where(Customer.id == appt.customer_id)
                        )
                        customer = customer_result.scalar_one_or_none()
                        if customer:
                            customer.no_show_count = (customer.no_show_count or 0) + 1
                            total = customer.total_visits + customer.no_show_count
                            if total > 0:
                                customer.reliability_score = round(
                                    (customer.total_visits / total) * 100, 1
                                )

            await db.commit()
            if no_show_count > 0:
                logger.info(f"[No-Show] Marked {no_show_count} appointments as no-show")

        except Exception as e:
            await db.rollback()
            logger.error(f"[No-Show] Detection task failed: {e}")
