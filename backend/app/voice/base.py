"""
Aiva — Voice Provider Base Interface
Abstract adapter for voice AI services (Vapi, Retell).
"""

from abc import ABC, abstractmethod
from typing import Any

from fastapi import Request


class VoiceProvider(ABC):
    """Abstract base class for voice provider integrations."""

    @abstractmethod
    async def verify_webhook(self, request: Request) -> bool:
        """Verify that the webhook request is authentic."""
        ...

    @abstractmethod
    async def handle_event(self, payload: dict) -> dict[str, Any]:
        """
        Handle an incoming webhook event.
        Returns a response dict to send back to the provider.
        """
        ...

    @abstractmethod
    async def create_assistant(self, business_config: dict) -> str:
        """
        Create or update an AI assistant for a business.
        Returns the assistant ID.
        """
        ...

    @abstractmethod
    def get_tool_definitions(self) -> list[dict]:
        """Return the tool/function definitions for the AI assistant."""
        ...
