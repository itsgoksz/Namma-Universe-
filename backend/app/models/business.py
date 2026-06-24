"""
Aiva — Business Model
"""

import enum
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    business_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    timezone: Mapped[str] = mapped_column(
        String(50), nullable=False, default="America/New_York"
    )
    opening_hours: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
        default=lambda: {
            "monday": {"open": "09:00", "close": "17:00", "closed": False},
            "tuesday": {"open": "09:00", "close": "17:00", "closed": False},
            "wednesday": {"open": "09:00", "close": "17:00", "closed": False},
            "thursday": {"open": "09:00", "close": "17:00", "closed": False},
            "friday": {"open": "09:00", "close": "17:00", "closed": False},
            "saturday": {"open": "10:00", "close": "16:00", "closed": False},
            "sunday": {"open": "00:00", "close": "00:00", "closed": True},
        },
        comment="Weekly schedule as JSON",
    )
    ai_greeting: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        default="Hello! Thank you for calling. How can I help you today?",
    )
    faq_knowledge_base: Mapped[dict | None] = mapped_column(
        JSON, nullable=True, default=list
    )
    policies: Mapped[dict | None] = mapped_column(
        JSON, nullable=True, default=dict
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    users = relationship("User", back_populates="business", lazy="selectin")
    services = relationship("Service", back_populates="business", lazy="selectin")
    staff = relationship("Staff", back_populates="business", lazy="selectin")
    appointments = relationship("Appointment", back_populates="business")
    calls = relationship("Call", back_populates="business")
    customers = relationship("Customer", back_populates="business")

    def __repr__(self) -> str:
        return f"<Business(id={self.id}, name='{self.business_name}')>"
