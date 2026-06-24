"""
Aiva — Notification Service
Orchestrates sending confirmations, reminders, and follow-ups
via SMS, WhatsApp, or Email channels.
"""

from typing import Optional
import logging

from app.models.appointment import Appointment
from app.notifications.sms import send_sms
from app.notifications.whatsapp import send_whatsapp
from app.notifications.email import send_email

logger = logging.getLogger(__name__)


class NotificationService:
    """Sends notifications via configured channels."""

    async def send_confirmation(self, appointment: Appointment, channel: str = "sms") -> bool:
        """Send appointment confirmation."""
        customer = appointment.customer
        service = appointment.service

        service_name = service.name if service else "appointment"
        date_str = appointment.date.strftime("%B %d, %Y")
        time_str = appointment.start_time.strftime("%I:%M %p")

        message = (
            f"Hi {customer.name}! Your {service_name} "
            f"is confirmed for {date_str} "
            f"at {time_str}. "
            f"See you then! - Aiva"
        )

        return await self._send(customer.phone, customer.email, message, channel)

    async def send_reminder(
        self, appointment: Appointment, reminder_type: str = "24h", channel: str = "sms"
    ) -> bool:
        """Send appointment reminder (24h or 2h before)."""
        customer = appointment.customer
        service = appointment.service
        service_name = service.name if service else "appointment"

        if reminder_type == "24h":
            time_text = "tomorrow"
        else:
            time_text = "in 2 hours"

        message = (
            f"Reminder: Hi {customer.name}, your {service_name} "
            f"is {time_text} at {appointment.start_time.strftime('%I:%M %p')}. "
            f"Reply CANCEL to cancel. - Aiva"
        )

        return await self._send(customer.phone, customer.email, message, channel)

    async def send_cancellation(self, appointment: Appointment, channel: str = "sms") -> bool:
        """Send cancellation notification."""
        customer = appointment.customer
        service = appointment.service
        service_name = service.name if service else "appointment"

        message = (
            f"Hi {customer.name}, your {service_name} "
            f"on {appointment.date.strftime('%B %d')} has been cancelled. "
            f"Call us to rebook! - Aiva"
        )

        return await self._send(customer.phone, customer.email, message, channel)

    async def send_followup(self, appointment: Appointment, channel: str = "sms") -> bool:
        """Send post-appointment follow-up."""
        customer = appointment.customer

        message = (
            f"Thanks for visiting, {customer.name}! "
            f"We hope you enjoyed your visit. "
            f"Book your next appointment anytime! - Aiva"
        )

        return await self._send(customer.phone, customer.email, message, channel)

    async def _send(
        self,
        phone: Optional[str],
        email_addr: Optional[str],
        message: str,
        channel: str,
    ) -> bool:
        """Send via the specified channel."""
        try:
            if channel == "sms" and phone:
                return await send_sms(phone, message)
            elif channel == "whatsapp" and phone:
                return await send_whatsapp(phone, message)
            elif channel == "email" and email_addr:
                return await send_email(
                    to_email=email_addr,
                    subject="Aiva — Appointment Update",
                    plain_text=message,
                )
            else:
                logger.warning(f"No valid contact info for channel={channel}")
                return False
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
            return False


# Module-level singleton
notification_service = NotificationService()
