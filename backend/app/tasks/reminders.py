"""
Aiva — Reminder Background Tasks
Checks for upcoming appointments and sends 24h and 2h reminders.
Designed to run as a periodic Celery beat task or standalone cron.
"""

from datetime import datetime, timedelta, timezone, date, time
import logging

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models.appointment import Appointment
from app.services.notification_service import notification_service

logger = logging.getLogger(__name__)


async def process_24h_reminders():
    """
    Find appointments scheduled ~24 hours from now that haven't had
    their 24h reminder sent. Send reminder and mark as sent.
    """
    async with AsyncSessionLocal() as db:
        try:
            now = datetime.now(timezone.utc)
            # Target: appointments tomorrow at approximately the same time
            target_date = (now + timedelta(hours=24)).date()

            result = await db.execute(
                select(Appointment)
                .where(
                    Appointment.date == target_date,
                    Appointment.status.in_(["scheduled", "confirmed"]),
                    Appointment.reminder_24h_sent == False,
                )
            )
            appointments = result.scalars().all()

            sent_count = 0
            for appt in appointments:
                try:
                    success = await notification_service.send_reminder(appt, "24h")
                    if success:
                        appt.reminder_24h_sent = True
                        sent_count += 1
                except Exception as e:
                    logger.error(f"Failed to send 24h reminder for appointment {appt.id}: {e}")

            await db.commit()
            logger.info(f"[Reminders] Sent {sent_count} / {len(appointments)} 24h reminders")

        except Exception as e:
            await db.rollback()
            logger.error(f"[Reminders] 24h reminder task failed: {e}")


async def process_2h_reminders():
    """
    Find appointments scheduled ~2 hours from now that haven't had
    their 2h reminder sent. Send reminder and mark as sent.
    """
    async with AsyncSessionLocal() as db:
        try:
            now = datetime.now(timezone.utc)
            target_time = now + timedelta(hours=2)
            target_date = target_time.date()

            # Get the target hour range (±30 minutes)
            target_start = (target_time - timedelta(minutes=15)).time()
            target_end = (target_time + timedelta(minutes=15)).time()

            result = await db.execute(
                select(Appointment)
                .where(
                    Appointment.date == target_date,
                    Appointment.status.in_(["scheduled", "confirmed"]),
                    Appointment.reminder_2h_sent == False,
                    Appointment.start_time >= target_start,
                    Appointment.start_time <= target_end,
                )
            )
            appointments = result.scalars().all()

            sent_count = 0
            for appt in appointments:
                try:
                    success = await notification_service.send_reminder(appt, "2h")
                    if success:
                        appt.reminder_2h_sent = True
                        sent_count += 1
                except Exception as e:
                    logger.error(f"Failed to send 2h reminder for appointment {appt.id}: {e}")

            await db.commit()
            logger.info(f"[Reminders] Sent {sent_count} / {len(appointments)} 2h reminders")

        except Exception as e:
            await db.rollback()
            logger.error(f"[Reminders] 2h reminder task failed: {e}")


async def process_followups():
    """
    Send follow-up messages 24 hours after completed appointments.
    """
    async with AsyncSessionLocal() as db:
        try:
            now = datetime.now(timezone.utc)
            yesterday = (now - timedelta(hours=24)).date()

            result = await db.execute(
                select(Appointment)
                .where(
                    Appointment.date == yesterday,
                    Appointment.status == "completed",
                    Appointment.followup_sent == False,
                )
            )
            appointments = result.scalars().all()

            sent_count = 0
            for appt in appointments:
                try:
                    success = await notification_service.send_followup(appt)
                    if success:
                        appt.followup_sent = True
                        sent_count += 1
                except Exception as e:
                    logger.error(f"Failed to send follow-up for appointment {appt.id}: {e}")

            await db.commit()
            logger.info(f"[Followups] Sent {sent_count} / {len(appointments)} follow-ups")

        except Exception as e:
            await db.rollback()
            logger.error(f"[Followups] Follow-up task failed: {e}")
