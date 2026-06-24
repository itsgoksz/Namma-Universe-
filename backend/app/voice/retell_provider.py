"""
Aiva — Retell AI Voice Provider
"""

import hmac
import hashlib
from typing import Any

import httpx
from fastapi import Request

from app.core.config import settings
from app.voice.base import VoiceProvider


class RetellProvider(VoiceProvider):
    """Retell AI integration for voice calls."""

    BASE_URL = "https://api.retellai.com"

    def __init__(self):
        self.api_key = settings.RETELL_API_KEY

    async def verify_webhook(self, request: Request) -> bool:
        """Verify Retell webhook signature via x-retell-signature header."""
        if not self.api_key:
            return True

        body = await request.body()
        signature = request.headers.get("x-retell-signature", "")

        expected = hmac.new(
            self.api_key.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(signature, expected)

    async def handle_event(self, payload: dict) -> dict[str, Any]:
        """Handle Retell webhook events."""
        event_type = payload.get("event", "")

        if event_type == "call_started":
            return {
                "type": "call_started",
                "call_id": payload.get("call_id"),
            }

        elif event_type == "call_ended":
            return {
                "type": "call_ended",
                "call_id": payload.get("call_id"),
                "transcript": payload.get("transcript", ""),
                "recording_url": payload.get("recording_url"),
                "duration": payload.get("duration_ms", 0) // 1000,
            }

        elif event_type == "call_analyzed":
            return {
                "type": "call_analyzed",
                "call_id": payload.get("call_id"),
                "summary": payload.get("call_analysis", {}).get("call_summary", ""),
                "sentiment": payload.get("call_analysis", {}).get("user_sentiment", ""),
            }

        elif event_type == "function_call":
            return {
                "type": "function_call",
                "function_name": payload.get("function_name", ""),
                "parameters": payload.get("arguments", {}),
                "call_id": payload.get("call_id"),
            }

        return {"type": "unknown", "raw": payload}

    async def create_assistant(self, business_config: dict) -> str:
        """Create a Retell agent with business configuration."""
        from app.voice.vapi_provider import VapiProvider
        vapi = VapiProvider()
        system_prompt = vapi._build_system_prompt(business_config)

        agent_config = {
            "agent_name": f"Aiva - {business_config.get('business_name', 'Assistant')}",
            "response_engine": {
                "type": "retell-llm",
                "llm_id": None,  # Will be created separately
            },
            "voice_id": "11labs-Adrian",
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/create-agent",
                json=agent_config,
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            return response.json().get("agent_id", "")

    def get_tool_definitions(self) -> list[dict]:
        """Retell function definitions (same logic as Vapi, different format)."""
        return [
            {
                "name": "check_availability",
                "description": "Check available appointment slots",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "service_name": {"type": "string"},
                        "date": {"type": "string"},
                        "time_preference": {"type": "string"},
                    },
                    "required": ["service_name", "date"],
                },
            },
            {
                "name": "book_appointment",
                "description": "Book an appointment",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "customer_name": {"type": "string"},
                        "customer_phone": {"type": "string"},
                        "service_name": {"type": "string"},
                        "date": {"type": "string"},
                        "time": {"type": "string"},
                    },
                    "required": ["customer_name", "customer_phone", "service_name", "date", "time"],
                },
            },
            {
                "name": "reschedule_appointment",
                "description": "Reschedule an appointment",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "customer_phone": {"type": "string"},
                        "new_date": {"type": "string"},
                        "new_time": {"type": "string"},
                    },
                    "required": ["customer_phone", "new_date", "new_time"],
                },
            },
            {
                "name": "cancel_appointment",
                "description": "Cancel an appointment",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "customer_phone": {"type": "string"},
                        "reason": {"type": "string"},
                    },
                    "required": ["customer_phone"],
                },
            },
            {
                "name": "answer_faq",
                "description": "Answer a customer question",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "question": {"type": "string"},
                    },
                    "required": ["question"],
                },
            },
            {
                "name": "transfer_to_human",
                "description": "Transfer call to human",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "reason": {"type": "string"},
                    },
                    "required": ["reason"],
                },
            },
        ]
