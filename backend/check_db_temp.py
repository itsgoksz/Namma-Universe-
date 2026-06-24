import asyncio
import sys
sys.path.insert(0, '/Users/gokulgautham/Aiva/backend')
from app.core.database import AsyncSessionLocal
from app.services.ai_agent_service import AIAgentService

async def main():
    async with AsyncSessionLocal() as db:
        agent = AIAgentService(db, 3)
        res = await agent.book_appointment(
            customer_name="Gokul",
            customer_phone="+91 99000 12345",
            service_name="Hair Cut",
            date="2026-06-04",
            time="14:30"
        )
        print("Result:", res)

asyncio.run(main())
