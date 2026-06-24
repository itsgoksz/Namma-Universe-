"""
Aiva — Availability Service
Calculates available time slots for booking based on business hours,
existing appointments, staff availability, and service duration.
"""

from datetime import date, time, timedelta, datetime
from typing import Optional
import logging

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.business import Business
from app.models.service import Service
from app.models.staff import Staff

logger = logging.getLogger(__name__)

# Default slot interval in minutes
SLOT_INTERVAL = 15
# Buffer time between appointments in minutes
BUFFER_MINUTES = 10


def _time_to_minutes(t: time) -> int:
    """Convert a time object to minutes since midnight."""
    return t.hour * 60 + t.minute


def _minutes_to_time(m: int) -> time:
    """Convert minutes since midnight to a time object."""
    return time(hour=m // 60, minute=m % 60)


async def get_available_slots(
    db: AsyncSession,
    business_id: int,
    service_id: int,
    target_date: date,
    staff_id: Optional[int] = None,
) -> list[dict]:
    """
    Returns available time slots for a given service on a given date.

    Logic:
    1. Get business opening hours for the day of week
    2. Get service duration
    3. Get existing appointments for the day (optionally filtered by staff)
    4. Generate all possible slots
    5. Filter out slots that conflict with existing appointments
    6. If staff_id is specified, also check staff availability

    Returns a list of dicts: [{"time": "10:00", "staff_id": 1, "staff_name": "Jane"}, ...]
    """
    # --- 1. Load business hours ---
    business_result = await db.execute(
        select(Business).where(Business.id == business_id)
    )
    business = business_result.scalar_one_or_none()
    if not business:
        return []

    day_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    day_name = day_names[target_date.weekday()]

    opening_hours = business.opening_hours or {}
    day_hours = opening_hours.get(day_name, {})

    if not day_hours or day_hours.get("closed", False):
        return []

    open_str = day_hours.get("open", "09:00")
    close_str = day_hours.get("close", "17:00")

    open_time = time.fromisoformat(open_str)
    close_time = time.fromisoformat(close_str)

    open_minutes = _time_to_minutes(open_time)
    close_minutes = _time_to_minutes(close_time)

    # --- 2. Load service duration ---
    service_result = await db.execute(
        select(Service).where(Service.id == service_id, Service.business_id == business_id)
    )
    service = service_result.scalar_one_or_none()
    if not service or not service.is_active:
        return []

    duration = service.duration_minutes

    # --- 3. Load existing appointments for the day ---
    appt_query = select(Appointment).where(
        Appointment.business_id == business_id,
        Appointment.date == target_date,
        Appointment.status.in_(["scheduled", "confirmed"]),
    )
    if staff_id:
        appt_query = appt_query.where(Appointment.staff_id == staff_id)

    appt_result = await db.execute(appt_query)
    existing_appointments = appt_result.scalars().all()

    # Convert existing appointments to occupied time ranges (in minutes)
    occupied_ranges: list[tuple[int, int]] = []
    for appt in existing_appointments:
        start_min = _time_to_minutes(appt.start_time)
        end_min = _time_to_minutes(appt.end_time)
        # Add buffer time
        occupied_ranges.append((start_min - BUFFER_MINUTES, end_min + BUFFER_MINUTES))

    # --- 4. Load staff if filtering ---
    staff_members: list[Staff] = []
    if staff_id:
        staff_result = await db.execute(
            select(Staff).where(Staff.id == staff_id, Staff.business_id == business_id)
        )
        staff_member = staff_result.scalar_one_or_none()
        if staff_member and staff_member.is_active:
            staff_members = [staff_member]
    else:
        # Get all active staff
        staff_result = await db.execute(
            select(Staff).where(Staff.business_id == business_id, Staff.is_active == True)
        )
        staff_members = list(staff_result.scalars().all())

    # --- 5. Generate available slots ---
    slots: list[dict] = []
    current_min = open_minutes

    while current_min + duration <= close_minutes:
        slot_start = current_min
        slot_end = current_min + duration

        # Check if this slot conflicts with any existing appointment
        is_available = True
        for occ_start, occ_end in occupied_ranges:
            if slot_start < occ_end and slot_end > occ_start:
                is_available = False
                break

        if is_available:
            slot_time = _minutes_to_time(slot_start)

            # If we have staff, check their availability
            if staff_members:
                for sm in staff_members:
                    if _is_staff_available(sm, day_name, slot_time, duration):
                        slots.append({
                            "time": slot_time.strftime("%H:%M"),
                            "staff_id": sm.id,
                            "staff_name": sm.name,
                        })
                        break  # First available staff member
            else:
                slots.append({
                    "time": slot_time.strftime("%H:%M"),
                    "staff_id": None,
                    "staff_name": None,
                })

        current_min += SLOT_INTERVAL

    return slots


def _is_staff_available(staff: Staff, day_name: str, slot_time: time, duration: int) -> bool:
    """Check if a staff member is available for a given time slot."""
    availability = staff.availability or {}
    day_avail = availability.get(day_name, {})

    if not day_avail or not day_avail.get("available", True):
        return False

    staff_start_str = day_avail.get("start", "09:00")
    staff_end_str = day_avail.get("end", "17:00")

    staff_start = time.fromisoformat(staff_start_str)
    staff_end = time.fromisoformat(staff_end_str)

    slot_end_minutes = _time_to_minutes(slot_time) + duration
    slot_end_time = _minutes_to_time(slot_end_minutes)

    return slot_time >= staff_start and slot_end_time <= staff_end
