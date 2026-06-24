"""
Aiva — Appointments API Routes
"""

from datetime import date, datetime, timedelta, time
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select

from app.core.deps import CurrentUser, DbSession
from app.models.appointment import Appointment
from app.models.customer import Customer
from app.models.service import Service
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentListResponse,
    AppointmentResponse,
    AppointmentStatusUpdate,
    AppointmentUpdate,
    AvailabilityResponse,
    AvailableSlot,
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("", response_model=AppointmentListResponse)
async def list_appointments(
    current_user: CurrentUser,
    db: DbSession,
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    customer_id: Optional[int] = Query(None),
    staff_id: Optional[int] = Query(None),
):
    """List appointments with optional filters."""
    query = select(Appointment).where(
        Appointment.business_id == current_user.business_id
    )

    if date_from:
        query = query.where(Appointment.date >= date_from)
    if date_to:
        query = query.where(Appointment.date <= date_to)
    if status_filter:
        query = query.where(Appointment.status == status_filter)
    if customer_id:
        query = query.where(Appointment.customer_id == customer_id)
    if staff_id:
        query = query.where(Appointment.staff_id == staff_id)

    query = query.order_by(Appointment.date.desc(), Appointment.start_time.desc())

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    result = await db.execute(query)
    appointments = result.scalars().all()

    return AppointmentListResponse(
        items=[AppointmentResponse.model_validate(a) for a in appointments],
        total=total or 0,
    )


@router.get("/availability", response_model=AvailabilityResponse)
async def check_availability(
    current_user: CurrentUser,
    db: DbSession,
    target_date: date = Query(..., alias="date"),
    service_id: int = Query(...),
    staff_id: Optional[int] = Query(None),
):
    """Check available appointment slots for a given date and service."""
    service_result = await db.execute(
        select(Service).where(
            Service.id == service_id,
            Service.business_id == current_user.business_id,
            Service.is_active == True,
        )
    )
    service = service_result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    business = current_user.business
    day_name = target_date.strftime("%A").lower()
    day_hours = (business.opening_hours or {}).get(day_name, {})

    if day_hours.get("closed", True):
        return AvailabilityResponse(
            date=target_date,
            service_name=service.name,
            duration_minutes=service.duration_minutes,
            slots=[],
        )

    open_time = time.fromisoformat(day_hours.get("open", "09:00"))
    close_time = time.fromisoformat(day_hours.get("close", "17:00"))

    existing_query = select(Appointment).where(
        Appointment.business_id == current_user.business_id,
        Appointment.date == target_date,
        Appointment.status.in_(["scheduled", "confirmed"]),
    )
    if staff_id:
        existing_query = existing_query.where(Appointment.staff_id == staff_id)

    existing_result = await db.execute(existing_query)
    existing_appointments = existing_result.scalars().all()

    slots = []
    current_time = open_time
    duration = timedelta(minutes=service.duration_minutes)
    slot_interval = timedelta(minutes=30)

    while True:
        end = (datetime.combine(target_date, current_time) + duration).time()
        if end > close_time:
            break

        conflict = False
        for apt in existing_appointments:
            if current_time < apt.end_time and end > apt.start_time:
                conflict = True
                break

        if not conflict:
            slots.append(AvailableSlot(time=current_time, staff_id=staff_id))

        current_time = (
            datetime.combine(target_date, current_time) + slot_interval
        ).time()

    return AvailabilityResponse(
        date=target_date,
        service_name=service.name,
        duration_minutes=service.duration_minutes,
        slots=slots,
    )


@router.get("/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(appointment_id: int, current_user: CurrentUser, db: DbSession):
    """Get a single appointment."""
    result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.business_id == current_user.business_id,
        )
    )
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return AppointmentResponse.model_validate(appointment)


@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    data: AppointmentCreate, current_user: CurrentUser, db: DbSession
):
    """Create a new appointment."""
    customer_result = await db.execute(
        select(Customer).where(
            Customer.id == data.customer_id,
            Customer.business_id == current_user.business_id,
        )
    )
    if not customer_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Customer not found")

    end_time = data.end_time
    if not end_time and data.service_id:
        service_result = await db.execute(
            select(Service).where(Service.id == data.service_id)
        )
        service = service_result.scalar_one_or_none()
        if service:
            end_time = (
                datetime.combine(data.date, data.start_time)
                + timedelta(minutes=service.duration_minutes)
            ).time()

    if not end_time:
        end_time = (
            datetime.combine(data.date, data.start_time) + timedelta(minutes=30)
        ).time()

    appointment = Appointment(
        business_id=current_user.business_id,
        customer_id=data.customer_id,
        service_id=data.service_id,
        staff_id=data.staff_id,
        date=data.date,
        start_time=data.start_time,
        end_time=end_time,
        source=data.source,
        notes=data.notes,
    )
    db.add(appointment)
    await db.flush()
    await db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    current_user: CurrentUser,
    db: DbSession,
):
    """Update an appointment."""
    result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.business_id == current_user.business_id,
        )
    )
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)

    await db.flush()
    await db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)


@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
async def update_appointment_status(
    appointment_id: int,
    data: AppointmentStatusUpdate,
    current_user: CurrentUser,
    db: DbSession,
):
    """Change appointment status."""
    result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.business_id == current_user.business_id,
        )
    )
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = data.status

    if data.status == "completed":
        customer_result = await db.execute(
            select(Customer).where(Customer.id == appointment.customer_id)
        )
        customer = customer_result.scalar_one_or_none()
        if customer:
            customer.total_visits += 1
    elif data.status == "no_show":
        customer_result = await db.execute(
            select(Customer).where(Customer.id == appointment.customer_id)
        )
        customer = customer_result.scalar_one_or_none()
        if customer:
            customer.no_show_count += 1
            total = customer.total_visits + customer.no_show_count
            customer.reliability_score = round(
                ((total - customer.no_show_count) / total) * 100, 1
            ) if total > 0 else 100.0

    await db.flush()
    await db.refresh(appointment)

    from app.services.analytics_service import AnalyticsService
    await AnalyticsService().invalidate_overview_cache(current_user.business_id)

    return AppointmentResponse.model_validate(appointment)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(
    appointment_id: int, current_user: CurrentUser, db: DbSession
):
    """Cancel/delete an appointment."""
    result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.business_id == current_user.business_id,
        )
    )
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = "cancelled"
    await db.flush()
