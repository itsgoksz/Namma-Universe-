"""
Aiva — Pydantic Schemas for Appointment
"""

from datetime import date, datetime, time
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class AppointmentBase(BaseModel):
    customer_id: int
    service_id: Optional[int] = None
    staff_id: Optional[int] = None
    date: date
    start_time: time
    end_time: time
    notes: Optional[str] = None


class AppointmentCreate(BaseModel):
    customer_id: int
    service_id: Optional[int] = None
    staff_id: Optional[int] = None
    date: date
    start_time: time
    end_time: Optional[time] = None  # Auto-calculated from service duration if omitted
    source: str = "manual"  # ai, manual, online
    notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    customer_id: Optional[int] = None
    service_id: Optional[int] = None
    staff_id: Optional[int] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    notes: Optional[str] = None


class AppointmentStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(scheduled|confirmed|completed|cancelled|no_show)$")


class CustomerSummary(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None

    model_config = {"from_attributes": True}


class ServiceSummary(BaseModel):
    id: int
    name: str
    duration_minutes: int
    price: Optional[Decimal] = None

    model_config = {"from_attributes": True}


class StaffSummary(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class AppointmentResponse(BaseModel):
    id: int
    business_id: int
    customer_id: int
    service_id: Optional[int] = None
    staff_id: Optional[int] = None
    date: date
    start_time: time
    end_time: time
    status: str
    source: str
    notes: Optional[str] = None
    customer: Optional[CustomerSummary] = None
    service: Optional[ServiceSummary] = None
    staff_member: Optional[StaffSummary] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class AppointmentListResponse(BaseModel):
    items: list[AppointmentResponse]
    total: int


class AvailableSlot(BaseModel):
    time: time
    staff_id: Optional[int] = None
    staff_name: Optional[str] = None


class AvailabilityResponse(BaseModel):
    date: date
    service_name: str
    duration_minutes: int
    slots: list[AvailableSlot]
