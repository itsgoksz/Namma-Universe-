import logging
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

class EchoAgentService:
    """Service to communicate with the external Echo Farm Agent."""
    
    async def ask(self, message: str) -> str | None:
        """
        Send a query to the Echo agent and return its response.
        Returns None if Echo is unavailable or an error occurs.
        """
        if not settings.ECHO_AGENT_URL:
            logger.warning("ECHO_AGENT_URL is not configured.")
            return None

        payload = {"message": message}
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(settings.ECHO_AGENT_URL, json=payload)
                response.raise_for_status()
                data = response.json()
                return data.get("reply")
        except httpx.TimeoutException:
            logger.error("Echo Agent timeout after 10 seconds.")
            return None
        except httpx.RequestError as e:
            logger.error(f"Echo Agent request failed: {e}")
            return None
        except Exception as e:
            # Never raise uncaught exceptions from Echo, just log and fallback
            logger.error(f"Unexpected error communicating with Echo Agent: {e}")
            return None
