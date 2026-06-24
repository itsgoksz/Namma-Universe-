import asyncio
from datetime import date
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.appointment import Appointment
from app.core.config import settings
from sqlalchemy import select

async def main():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        target_date = date(2026, 6, 3)
        print(f"Checking for date: {target_date}")
        
        result = await session.execute(
            select(Appointment)
            .where(
                Appointment.date == target_date,
                Appointment.status.in_(["scheduled", "confirmed"])
            )
        )
        
        for row in result.scalars().all():
            print(f"Apt ID: {row.id}, Status: {row.status}, Date: {row.date}, Start: {row.start_time}, End: {row.end_time}")
            
asyncio.run(main())
