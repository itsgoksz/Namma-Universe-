"""
Aiva — Services API Routes
"""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.deps import CurrentUser, DbSession, OwnerUser
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=list[ServiceResponse])
async def list_services(current_user: CurrentUser, db: DbSession):
    """List all services for the business."""
    result = await db.execute(
        select(Service)
        .where(Service.business_id == current_user.business_id)
        .order_by(Service.name)
    )
    services = result.scalars().all()
    return [ServiceResponse.model_validate(s) for s in services]


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: int, current_user: CurrentUser, db: DbSession):
    result = await db.execute(
        select(Service).where(
            Service.id == service_id,
            Service.business_id == current_user.business_id,
        )
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceResponse.model_validate(service)


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(data: ServiceCreate, current_user: OwnerUser, db: DbSession):
    service = Service(business_id=current_user.business_id, **data.model_dump())
    db.add(service)
    await db.flush()
    await db.refresh(service)
    return ServiceResponse.model_validate(service)


@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int, data: ServiceUpdate, current_user: OwnerUser, db: DbSession
):
    result = await db.execute(
        select(Service).where(
            Service.id == service_id,
            Service.business_id == current_user.business_id,
        )
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)

    await db.flush()
    await db.refresh(service)
    return ServiceResponse.model_validate(service)


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(service_id: int, current_user: OwnerUser, db: DbSession):
    result = await db.execute(
        select(Service).where(
            Service.id == service_id,
            Service.business_id == current_user.business_id,
        )
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    service.is_active = False
    await db.flush()
