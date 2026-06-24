"""
Aiva — Pydantic Schemas for Business
"""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class DayHours(BaseModel):
    open: str = "09:00"
    close: str = "17:00"
    closed: bool = False


class OpeningHoursSchema(BaseModel):
    monday: DayHours = DayHours()
    tuesday: DayHours = DayHours()
    wednesday: DayHours = DayHours()
    thursday: DayHours = DayHours()
    friday: DayHours = DayHours()
    saturday: DayHours = DayHours(open="10:00", close="16:00")
    sunday: DayHours = DayHours(closed=True)


class FAQItem(BaseModel):
    question: str
    answer: str


class BusinessBase(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=255)
    phone_number: str = Field(..., min_length=5, max_length=20)
    address: Optional[str] = None
    timezone: str = "America/New_York"


class BusinessCreate(BusinessBase):
    pass


class BusinessUpdate(BaseModel):
    business_name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone_number: Optional[str] = Field(None, min_length=5, max_length=20)
    address: Optional[str] = None
    timezone: Optional[str] = None
    opening_hours: Optional[dict[str, Any]] = None
    ai_greeting: Optional[str] = None
    faq_knowledge_base: Optional[list[dict[str, str]]] = None
    policies: Optional[dict[str, Any]] = None


class BusinessResponse(BusinessBase):
    id: int
    opening_hours: Optional[dict[str, Any]] = None
    ai_greeting: Optional[str] = None
    faq_knowledge_base: Optional[list[dict[str, str]]] = None
    policies: Optional[dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
