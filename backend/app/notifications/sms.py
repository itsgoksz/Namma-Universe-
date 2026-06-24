"""
Aiva — SMS Notification Adapter (Twilio)
"""

import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class SMSClient:
    """Sends SMS messages via Twilio."""

    def __init__(self):
        self._client = None

    def _get_client(self):
        """Lazily initialise the Twilio client."""
        if self._client is None:
            if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
                logger.warning("Twilio credentials not configured — SMS will be logged only")
                return None
            try:
                from twilio.rest import Client
                self._client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            except Exception as e:
                logger.error(f"Failed to initialise Twilio client: {e}")
                return None
        return self._client

    async def send(self, to: str, message: str) -> bool:
        """
        Send an SMS message.
        Returns True on success, False on failure.
        """
        client = self._get_client()

        if client is None:
            logger.info(f"[SMS-LOG] To: {to} | {message}")
            return True  # Log-only mode — treat as success

        try:
            msg = client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to,
            )
            logger.info(f"[SMS] Sent to {to} — SID: {msg.sid}")
            return True
        except Exception as e:
            logger.error(f"[SMS] Failed to send to {to}: {e}")
            return False


# Module-level singleton
sms_client = SMSClient()


async def send_sms(to: str, message: str) -> bool:
    """Convenience function to send an SMS."""
    return await sms_client.send(to, message)
