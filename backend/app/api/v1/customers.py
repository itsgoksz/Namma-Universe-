"""
Aiva — Customers API Routes
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, or_, select

from app.core.deps import CurrentUser, DbSession
from app.models.appointment import Appointment
from app.models.customer import Customer
from app.schemas.appointment import AppointmentResponse
from app.schemas.customer import (
    CustomerCreate,
    CustomerListResponse,
    CustomerResponse,
    CustomerUpdate,
)

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=CustomerListResponse)
async def list_customers(
    current_user: CurrentUser,
    db: DbSession,
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    """List customers with search and pagination."""
    query = select(Customer).where(
        Customer.business_id == current_user.business_id
    )

    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Customer.name.ilike(search_term),
                Customer.phone.ilike(search_term),
                Customer.email.ilike(search_term),
            )
        )

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginate
    query = query.order_by(Customer.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    customers = result.scalars().all()

    return CustomerListResponse(
        items=[CustomerResponse.model_validate(c) for c in customers],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: int, current_user: CurrentUser, db: DbSession):
    """Get a single customer."""
    result = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.business_id == current_user.business_id,
        )
    )
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return CustomerResponse.model_validate(customer)


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    data: CustomerCreate, current_user: CurrentUser, db: DbSession
):
    """Create a new customer."""
    customer = Customer(
        business_id=current_user.business_id,
        **data.model_dump(),
    )
    db.add(customer)
    await db.flush()
    await db.refresh(customer)
    return CustomerResponse.model_validate(customer)


@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    current_user: CurrentUser,
    db: DbSession,
):
    """Update a customer."""
    result = await db.execute(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.business_id == current_user.business_id,
        )
    )
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(customer, field, value)

    await db.flush()
    await db.refresh(customer)
    return CustomerResponse.model_validate(customer)


@router.get("/{customer_id}/appointments", response_model=list[AppointmentResponse])
async def get_customer_appointments(
    customer_id: int, current_user: CurrentUser, db: DbSession
):
    """Get all appointments for a customer."""
    result = await db.execute(
        select(Appointment)
        .where(
            Appointment.customer_id == customer_id,
            Appointment.business_id == current_user.business_id,
        )
        .order_by(Appointment.date.desc(), Appointment.start_time.desc())
    )
    appointments = result.scalars().all()
    return [AppointmentResponse.model_validate(a) for a in appointments]
