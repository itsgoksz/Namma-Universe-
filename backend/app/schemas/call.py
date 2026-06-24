"""
Aiva — Pydantic Schemas for Call
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CallResponse(BaseModel):
    id: int
    business_id: int
    customer_id: Optional[int] = None
    call_start: datetime
    call_end: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    outcome: str
    transcript: Optional[str] = None
    recording_url: Optional[str] = None
    transfer_reason: Optional[str] = None
    voice_provider: str
    provider_call_id: Optional[str] = None
    customer_name: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class CallListResponse(BaseModel):
    items: list[CallResponse]
    total: int
    page: int
    page_size: int
