"""
Aiva — Pydantic Schemas for Staff
"""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field


class StaffBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(default="Stylist", max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None


class StaffCreate(StaffBase):
    availability: Optional[dict[str, Any]] = None


class StaffUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    role: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    availability: Optional[dict[str, Any]] = None
    is_active: Optional[bool] = None


class StaffResponse(StaffBase):
    id: int
    business_id: int
    availability: Optional[dict[str, Any]] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
