"""
Aiva — Staff Model
"""

from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Staff(Base):
    __tablename__ = "staff"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    business_id: Mapped[int] = mapped_column(
        ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False, default="Stylist")
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    availability: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
        default=lambda: {
            "monday": {"start": "09:00", "end": "17:00", "available": True},
            "tuesday": {"start": "09:00", "end": "17:00", "available": True},
            "wednesday": {"start": "09:00", "end": "17:00", "available": True},
            "thursday": {"start": "09:00", "end": "17:00", "available": True},
            "friday": {"start": "09:00", "end": "17:00", "available": True},
            "saturday": {"start": "10:00", "end": "16:00", "available": True},
            "sunday": {"start": "00:00", "end": "00:00", "available": False},
        },
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    business = relationship("Business", back_populates="staff")
    appointments = relationship("Appointment", back_populates="staff_member")

    def __repr__(self) -> str:
        return f"<Staff(id={self.id}, name='{self.name}')>"
