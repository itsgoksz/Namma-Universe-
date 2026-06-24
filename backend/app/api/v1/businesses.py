"""
Aiva — Business API Routes
"""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.deps import CurrentUser, DbSession, OwnerUser
from app.models.business import Business
from app.schemas.business import BusinessResponse, BusinessUpdate

router = APIRouter(prefix="/business", tags=["Business"])


@router.get("", response_model=BusinessResponse)
async def get_business(current_user: CurrentUser, db: DbSession):
    """Get the current user's business."""
    result = await db.execute(
        select(Business).where(Business.id == current_user.business_id)
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return BusinessResponse.model_validate(business)


@router.put("", response_model=BusinessResponse)
async def update_business(
    data: BusinessUpdate, current_user: OwnerUser, db: DbSession
):
    """Update business settings (owner only)."""
    result = await db.execute(
        select(Business).where(Business.id == current_user.business_id)
    )
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(business, field, value)

    await db.flush()
    await db.refresh(business)
    return BusinessResponse.model_validate(business)
