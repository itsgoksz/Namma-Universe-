import asyncio
from app.services.ai_agent_service import AIAgentService
from unittest.mock import AsyncMock, MagicMock

async def test_integration():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_business = MagicMock()
    mock_business.faq_knowledge_base = []
    
    mock_result.scalar_one_or_none.return_value = mock_business
    mock_db.execute.return_value = mock_result
    
    agent = AIAgentService(mock_db, 1)
    
    print("Testing farm query (Echo should fail and fallback):")
    result = await agent.answer_faq("How are my crops doing?")
    print(result)

    print("\nTesting normal query (should not route to Echo):")
    result2 = await agent.answer_faq("I need a haircut")
    print(result2)

if __name__ == "__main__":
    asyncio.run(test_integration())
