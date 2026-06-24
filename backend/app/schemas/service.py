"""
Aiva — Pydantic Schemas for Service
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    duration_minutes: int = Field(..., gt=0, le=480)
    price: Decimal = Field(..., ge=0)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    duration_minutes: Optional[int] = Field(None, gt=0, le=480)
    price: Optional[Decimal] = Field(None, ge=0)
    is_active: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: int
    business_id: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
