"""
Aiva — Auth API Routes
Handles registration, login, token refresh, and profile.
"""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.deps import CurrentUser, DbSession
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_token,
)
from app.models.business import Business
from app.models.user import User
from app.models.service import Service
from decimal import Decimal
from app.schemas.user import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

DEFAULT_SERVICES = [
    {"name": "Haircut & Styling", "duration_minutes": 30, "price": Decimal("250.00")},
    {"name": "Hair Spa for Men", "duration_minutes": 45, "price": Decimal("699.00")},
    {"name": "Global Hair Colour For Women", "duration_minutes": 90, "price": Decimal("1499.00")},
    {"name": "Blowout Dry", "duration_minutes": 30, "price": Decimal("399.00")},
    {"name": "Hair Streaks / Highlights", "duration_minutes": 90, "price": Decimal("1199.00")},
    {"name": "Detanning - Face", "duration_minutes": 20, "price": Decimal("399.00")},
    {"name": "Bleach - Under Arms", "duration_minutes": 15, "price": Decimal("249.00")},
    {"name": "Bleach - Face", "duration_minutes": 15, "price": Decimal("299.00")},
    {"name": "Bleach - Arms", "duration_minutes": 25, "price": Decimal("499.00")},
    {"name": "Bleach - Back", "duration_minutes": 25, "price": Decimal("399.00")},
    {"name": "Bleach - Feet", "duration_minutes": 20, "price": Decimal("299.00")},
    {"name": "D-Tan - Face", "duration_minutes": 20, "price": Decimal("499.00")},
    {"name": "Basic Clean Up", "duration_minutes": 30, "price": Decimal("499.00")},
    {"name": "Clean Up", "duration_minutes": 40, "price": Decimal("599.00")},
    {"name": "Gold Clean Up", "duration_minutes": 40, "price": Decimal("799.00")},
    {"name": "Silver Facial", "duration_minutes": 60, "price": Decimal("999.00")},
    {"name": "Gold Facial", "duration_minutes": 60, "price": Decimal("1299.00")},
    {"name": "Pearl Facial", "duration_minutes": 60, "price": Decimal("1199.00")},
    {"name": "Fruit Facial", "duration_minutes": 50, "price": Decimal("899.00")},
    {"name": "Manicure Gel", "duration_minutes": 30, "price": Decimal("399.00")},
    {"name": "Pedicure Spa", "duration_minutes": 45, "price": Decimal("499.00")},
]


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: DbSession):
    """Register a new business and owner account."""
    # Check if email already exists
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create business
    business = Business(
        business_name=data.business_name,
        phone_number=data.phone_number,
        address=data.address,
        timezone=data.timezone,
    )
    db.add(business)
    await db.flush()

    # Create owner user
    user = User(
        business_id=business.id,
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role="owner",
    )
    db.add(user)
    await db.flush()

    # Seed default services
    for svc in DEFAULT_SERVICES:
        service = Service(
            business_id=business.id,
            name=svc["name"],
            duration_minutes=svc["duration_minutes"],
            price=svc["price"],
            is_active=True,
        )
        db.add(service)
    await db.flush()

    # Generate tokens
    token_data = {"sub": str(user.id), "business_id": business.id, "role": user.role}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )



@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: DbSession):
    """Login with email and password."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    token_data = {"sub": str(user.id), "business_id": user.business_id, "role": user.role}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: RefreshRequest, db: DbSession):
    """Refresh an access token using a refresh token."""
    payload = verify_token(data.refresh_token, token_type="refresh")
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    token_data = {"sub": str(user.id), "business_id": user.business_id, "role": user.role}
    access_token = create_access_token(token_data)
    new_refresh_token = create_refresh_token(token_data)

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: CurrentUser):
    """Get the current user's profile."""
    return UserResponse.model_validate(current_user)
