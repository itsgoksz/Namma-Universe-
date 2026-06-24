"""
Aiva — Calls API Routes
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, select

from app.core.deps import CurrentUser, DbSession
from app.models.call import Call
from app.schemas.call import CallListResponse, CallResponse

router = APIRouter(prefix="/calls", tags=["Calls"])


@router.get("", response_model=CallListResponse)
async def list_calls(
    current_user: CurrentUser,
    db: DbSession,
    outcome: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    """List call history with optional filters."""
    query = select(Call).where(Call.business_id == current_user.business_id)

    if outcome:
        query = query.where(Call.outcome == outcome)

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginate
    query = query.order_by(Call.call_start.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    calls = result.scalars().all()

    items = []
    for call in calls:
        call_data = CallResponse.model_validate(call)
        if call.customer:
            call_data.customer_name = call.customer.name
        items.append(call_data)

    return CallListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{call_id}", response_model=CallResponse)
async def get_call(call_id: int, current_user: CurrentUser, db: DbSession):
    """Get call details including transcript."""
    result = await db.execute(
        select(Call).where(
            Call.id == call_id,
            Call.business_id == current_user.business_id,
        )
    )
    call = result.scalar_one_or_none()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    call_data = CallResponse.model_validate(call)
    if call.customer:
        call_data.customer_name = call.customer.name
    return call_data
