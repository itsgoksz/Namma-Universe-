"""
Aiva — Vapi AI Voice Provider
"""

import hmac
import hashlib
from typing import Any

import httpx
from fastapi import Request

from app.core.config import settings
from app.voice.base import VoiceProvider


class VapiProvider(VoiceProvider):
    """Vapi AI integration for voice calls."""

    BASE_URL = "https://api.vapi.ai"

    def __init__(self):
        self.api_key = settings.VAPI_API_KEY
        self.webhook_secret = settings.VAPI_WEBHOOK_SECRET

    async def verify_webhook(self, request: Request) -> bool:
        """Verify Vapi webhook signature."""
        if not self.webhook_secret:
            return True  # Skip verification in dev

        body = await request.body()
        signature = request.headers.get("x-vapi-signature", "")
        expected = hmac.new(
            self.webhook_secret.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(signature, expected)

    async def handle_event(self, payload: dict) -> dict[str, Any]:
        """
        Handle Vapi webhook events.
        Routes function calls to the appropriate handlers.
        """
        message = payload.get("message", {})
        message_type = message.get("type", "")

        if message_type == "function-call":
            function_call = message.get("functionCall", {})
            function_name = function_call.get("name", "")
            parameters = function_call.get("parameters", {})

            return {
                "type": "function_call",
                "function_name": function_name,
                "parameters": parameters,
            }

        elif message_type == "status-update":
            status_val = message.get("status", "")
            return {
                "type": "status_update",
                "status": status_val,
                "call_id": payload.get("call", {}).get("id"),
            }

        elif message_type == "end-of-call-report":
            return {
                "type": "call_ended",
                "call_id": payload.get("call", {}).get("id"),
                "transcript": message.get("transcript", ""),
                "recording_url": message.get("recordingUrl"),
                "duration": message.get("durationSeconds"),
                "summary": message.get("summary", ""),
            }

        return {"type": "unknown", "raw": payload}

    async def create_assistant(self, business_config: dict) -> str:
        """Create a Vapi assistant with business-specific configuration."""
        assistant_config = {
            "name": f"Aiva - {business_config.get('business_name', 'Assistant')}",
            "model": {
                "provider": "openai",
                "model": "gpt-4o",
                "systemPrompt": self._build_system_prompt(business_config),
            },
            "voice": {
                "provider": "11labs",
                "voiceId": "21m00Tcm4TlvDq8ikWAM",
            },
            "firstMessage": business_config.get(
                "ai_greeting",
                "Hello! Thank you for calling. How can I help you today?",
            ),
            "serverUrl": business_config.get("webhook_url", ""),
            "functions": self.get_tool_definitions(),
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/assistant",
                json=assistant_config,
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
            response.raise_for_status()
            return response.json().get("id", "")

    def get_tool_definitions(self) -> list[dict]:
        """Vapi function/tool definitions for the AI assistant."""
        return [
            {
                "name": "check_availability",
                "description": "Check available appointment slots for a specific service and date",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "service_name": {
                            "type": "string",
                            "description": "The name of the service (e.g., 'Haircut', 'Manicure')",
                        },
                        "date": {
                            "type": "string",
                            "description": "The date to check in YYYY-MM-DD format",
                        },
                        "time_preference": {
                            "type": "string",
                            "description": "Preferred time of day: morning, afternoon, or evening",
                            "enum": ["morning", "afternoon", "evening"],
                        },
                    },
                    "required": ["service_name", "date"],
                },
            },
            {
                "name": "book_appointment",
                "description": "Book an appointment for a customer",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "customer_name": {"type": "string", "description": "Customer's name"},
                        "customer_phone": {"type": "string", "description": "Customer's phone number"},
                        "service_name": {"type": "string", "description": "Service name"},
                        "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                        "time": {"type": "string", "description": "Time in HH:MM format"},
                    },
                    "required": ["customer_name", "customer_phone", "service_name", "date", "time"],
                },
            },
            {
                "name": "reschedule_appointment",
                "description": "Reschedule an existing appointment",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "customer_phone": {"type": "string", "description": "Customer's phone number"},
                        "new_date": {"type": "string", "description": "New date in YYYY-MM-DD format"},
                        "new_time": {"type": "string", "description": "New time in HH:MM format"},
                    },
                    "required": ["customer_phone", "new_date", "new_time"],
                },
            },
            {
                "name": "cancel_appointment",
                "description": "Cancel an existing appointment",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "customer_phone": {"type": "string", "description": "Customer's phone number"},
                        "reason": {"type": "string", "description": "Reason for cancellation"},
                    },
                    "required": ["customer_phone"],
                },
            },
            {
                "name": "answer_faq",
                "description": "Answer a frequently asked question about the business",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "question": {"type": "string", "description": "The customer's question"},
                    },
                    "required": ["question"],
                },
            },
            {
                "name": "transfer_to_human",
                "description": "Transfer the call to a human staff member",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "reason": {"type": "string", "description": "Reason for transfer"},
                    },
                    "required": ["reason"],
                },
            },
        ]

    def _build_system_prompt(self, config: dict) -> str:
        """Build the AI system prompt from business configuration."""
        hours = config.get("opening_hours", {})
        services = config.get("services", [])
        policies = config.get("policies", {})
        faqs = config.get("faq_knowledge_base", [])

        hours_text = "\n".join(
            f"  {day}: {info.get('open', 'Closed')} - {info.get('close', 'Closed')}"
            + (" (Closed)" if info.get("closed") else "")
            for day, info in hours.items()
        ) if hours else "Standard business hours"

        services_text = "\n".join(
            f"  - {s['name']}: {s.get('duration_minutes', 30)} min, ${s.get('price', 0)}"
            for s in services
        ) if services else "Please check with staff"

        faq_text = "\n".join(
            f"  Q: {f['question']}\n  A: {f['answer']}"
            for f in faqs
        ) if faqs else ""

        return f"""You are an AI receptionist for {config.get('business_name', 'our business')}.
You are friendly, professional, and efficient. Your goal is to help customers
book appointments, answer questions, and provide excellent service.

BUSINESS HOURS:
{hours_text}

SERVICES OFFERED:
{services_text}

{f'FREQUENTLY ASKED QUESTIONS:{chr(10)}{faq_text}' if faq_text else ''}

POLICIES:
{', '.join(f'{k}: {v}' for k, v in policies.items()) if policies else 'Standard policies apply'}

RULES:
1. Always be polite and professional
2. If you can't find availability, suggest alternative dates/times
3. Always confirm booking details before finalizing
4. If the customer wants to speak to a human, transfer immediately
5. Never make up information — use the tools provided
6. Keep responses concise and natural-sounding
"""
