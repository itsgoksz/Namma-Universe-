"""
Aiva — Email Notification Adapter (SendGrid)
"""

import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailClient:
    """Sends emails via SendGrid."""

    def __init__(self):
        self._client = None

    def _get_client(self):
        """Lazily initialise the SendGrid client."""
        if self._client is None:
            if not settings.SENDGRID_API_KEY:
                logger.warning("SendGrid API key not configured — emails will be logged only")
                return None
            try:
                import sendgrid
                self._client = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialise SendGrid client: {e}")
                return None
        return self._client

    async def send(
        self,
        to_email: str,
        subject: str,
        plain_text: str,
        html_content: Optional[str] = None,
    ) -> bool:
        """
        Send an email via SendGrid.
        Returns True on success, False on failure.
        """
        client = self._get_client()

        if client is None:
            logger.info(f"[Email-LOG] To: {to_email} | Subject: {subject} | {plain_text}")
            return True  # Log-only mode

        try:
            from sendgrid.helpers.mail import Mail, Email, To, Content

            message = Mail(
                from_email=Email(settings.SENDGRID_FROM_EMAIL, "Aiva"),
                to_emails=To(to_email),
                subject=subject,
            )
            message.add_content(Content("text/plain", plain_text))
            if html_content:
                message.add_content(Content("text/html", html_content))

            response = client.send(message)
            logger.info(
                f"[Email] Sent to {to_email} — Status: {response.status_code}"
            )
            return response.status_code in (200, 201, 202)
        except Exception as e:
            logger.error(f"[Email] Failed to send to {to_email}: {e}")
            return False

    async def send_appointment_confirmation(
        self, to_email: str, customer_name: str, service_name: str, date_str: str, time_str: str
    ) -> bool:
        """Send a branded appointment confirmation email."""
        subject = f"Appointment Confirmed — {service_name} on {date_str}"
        plain_text = (
            f"Hi {customer_name},\n\n"
            f"Your {service_name} appointment is confirmed for {date_str} at {time_str}.\n\n"
            f"See you then!\n— Aiva"
        )
        html_content = f"""
        <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 16px; padding: 32px; color: white; text-align: center; margin-bottom: 24px;">
                <h1 style="margin: 0 0 8px; font-size: 24px;">✅ Appointment Confirmed</h1>
                <p style="margin: 0; opacity: 0.9; font-size: 14px;">You're all set!</p>
            </div>
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 16px; color: #334155;">Hi <strong>{customer_name}</strong>,</p>
                <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Service</p>
                    <p style="margin: 0; font-weight: 600; color: #0f172a;">{service_name}</p>
                </div>
                <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                    <div style="flex: 1; background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Date</p>
                        <p style="margin: 0; font-weight: 600; color: #0f172a;">{date_str}</p>
                    </div>
                    <div style="flex: 1; background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">Time</p>
                        <p style="margin: 0; font-weight: 600; color: #0f172a;">{time_str}</p>
                    </div>
                </div>
                <p style="margin: 0; font-size: 13px; color: #64748b;">Need to change anything? Just call us and our AI assistant will help you reschedule.</p>
            </div>
            <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">Powered by Aiva — AI Receptionist</p>
        </div>
        """
        return await self.send(to_email, subject, plain_text, html_content)


# Module-level singleton
email_client = EmailClient()


async def send_email(
    to_email: str,
    subject: str,
    plain_text: str,
    html_content: Optional[str] = None,
) -> bool:
    """Convenience function to send an email."""
    return await email_client.send(to_email, subject, plain_text, html_content)
