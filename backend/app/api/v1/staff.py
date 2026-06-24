"""
Aiva — Staff API Routes
"""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.deps import CurrentUser, DbSession, OwnerUser
from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffResponse, StaffUpdate

router = APIRouter(prefix="/staff", tags=["Staff"])


@router.get("", response_model=list[StaffResponse])
async def list_staff(current_user: CurrentUser, db: DbSession):
    result = await db.execute(
        select(Staff)
        .where(Staff.business_id == current_user.business_id)
        .order_by(Staff.name)
    )
    staff_list = result.scalars().all()
    return [StaffResponse.model_validate(s) for s in staff_list]


@router.get("/{staff_id}", response_model=StaffResponse)
async def get_staff(staff_id: int, current_user: CurrentUser, db: DbSession):
    result = await db.execute(
        select(Staff).where(
            Staff.id == staff_id,
            Staff.business_id == current_user.business_id,
        )
    )
    staff = result.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return StaffResponse.model_validate(staff)


@router.post("", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
async def create_staff(data: StaffCreate, current_user: OwnerUser, db: DbSession):
    staff = Staff(business_id=current_user.business_id, **data.model_dump())
    db.add(staff)
    await db.flush()
    await db.refresh(staff)
    return StaffResponse.model_validate(staff)


@router.put("/{staff_id}", response_model=StaffResponse)
async def update_staff(
    staff_id: int, data: StaffUpdate, current_user: OwnerUser, db: DbSession
):
    result = await db.execute(
        select(Staff).where(
            Staff.id == staff_id,
            Staff.business_id == current_user.business_id,
        )
    )
    staff = result.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(staff, field, value)

    await db.flush()
    await db.refresh(staff)
    return StaffResponse.model_validate(staff)


@router.delete("/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_staff(staff_id: int, current_user: OwnerUser, db: DbSession):
    result = await db.execute(
        select(Staff).where(
            Staff.id == staff_id,
            Staff.business_id == current_user.business_id,
        )
    )
    staff = result.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    staff.is_active = False
    await db.flush()
