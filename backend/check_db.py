import asyncio
from datetime import date
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.appointment import Appointment
from app.models.service import Service
from app.core.config import settings
from sqlalchemy import select, func

async def main():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        today = date.today()
        print(f"Checking for date: {today}")
        
        estimated_revenue_result = await session.execute(
            select(func.sum(Service.price))
            .join(Appointment, Appointment.service_id == Service.id)
            .where(
                Appointment.business_id == 1,
                Appointment.status.in_(["scheduled", "confirmed"]),
                Appointment.date == today,
            )
        )
        print(f"Result: {estimated_revenue_result.scalar()}")
            
asyncio.run(main())
