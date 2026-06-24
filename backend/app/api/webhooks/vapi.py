"""
Aiva — Vapi Webhook Handler
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Request, HTTPException
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.business import Business
from app.models.call import Call
from app.services.ai_agent_service import AIAgentService
from app.voice.vapi_provider import VapiProvider

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])
vapi = VapiProvider()


@router.post("/vapi/{business_id}")
async def vapi_webhook(business_id: int, request: Request):
    """Handle incoming Vapi AI webhook events."""
    # Verify webhook authenticity
    if not await vapi.verify_webhook(request):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    payload = await request.json()
    event = await vapi.handle_event(payload)

    async with AsyncSessionLocal() as db:
        # Verify business exists
        biz_result = await db.execute(
            select(Business).where(Business.id == business_id)
        )
        business = biz_result.scalar_one_or_none()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")

        if event["type"] == "function_call":
            # Route to AI agent service
            agent = AIAgentService(db, business_id)
            fn_name = event["function_name"]
            params = event["parameters"]

            handler = getattr(agent, fn_name, None)
            if handler:
                result = await handler(**params)
                await db.commit()
                return {"result": result.get("message", ""), "data": result}
            else:
                return {"result": "Sorry, I'm not sure how to help with that."}

        elif event["type"] == "call_ended":
            # Store call record
            call = Call(
                business_id=business_id,
                call_start=datetime.now(timezone.utc),
                call_end=datetime.now(timezone.utc),
                duration_seconds=event.get("duration"),
                transcript=event.get("transcript"),
                recording_url=event.get("recording_url"),
                voice_provider="vapi",
                provider_call_id=event.get("call_id"),
                outcome="unknown",  # Will be determined from transcript analysis
            )
            db.add(call)
            await db.commit()
            return {"status": "recorded"}

        return {"status": "ok"}
