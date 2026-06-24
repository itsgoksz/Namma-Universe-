"""
Aiva — WhatsApp Notification Adapter (Twilio)
"""

import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class WhatsAppClient:
    """Sends WhatsApp messages via Twilio."""

    def __init__(self):
        self._client = None

    def _get_client(self):
        """Lazily initialise the Twilio client."""
        if self._client is None:
            if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
                logger.warning("Twilio credentials not configured — WhatsApp will be logged only")
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
        Send a WhatsApp message.
        Twilio requires 'whatsapp:' prefix on both from and to numbers.
        Returns True on success, False on failure.
        """
        client = self._get_client()

        if client is None:
            logger.info(f"[WhatsApp-LOG] To: {to} | {message}")
            return True  # Log-only mode

        whatsapp_to = f"whatsapp:{to}" if not to.startswith("whatsapp:") else to
        whatsapp_from = f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}"

        try:
            msg = client.messages.create(
                body=message,
                from_=whatsapp_from,
                to=whatsapp_to,
            )
            logger.info(f"[WhatsApp] Sent to {to} — SID: {msg.sid}")
            return True
        except Exception as e:
            logger.error(f"[WhatsApp] Failed to send to {to}: {e}")
            return False


# Module-level singleton
whatsapp_client = WhatsAppClient()


async def send_whatsapp(to: str, message: str) -> bool:
    """Convenience function to send a WhatsApp message."""
    return await whatsapp_client.send(to, message)
