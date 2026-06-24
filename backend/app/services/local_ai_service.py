import json
import logging
import httpx
from datetime import datetime
from typing import List, Dict, Any

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import StructuredTool
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.services.ai_agent_service import AIAgentService
from app.models.business import Business

logger = logging.getLogger(__name__)

class LocalAIService:
    def __init__(self):
        self.llm = ChatOllama(
            model="gemma3:4b", 
            base_url="http://localhost:11434",
            temperature=0.3
        )

    async def _get_system_prompt(self, db: AsyncSession, business_id: int) -> str:
        biz_result = await db.execute(select(Business).where(Business.id == business_id))
        business = biz_result.scalar_one_or_none()
        biz_name = business.business_name if business else "the salon"
        current_date = datetime.now().strftime("%Y-%m-%d")
        current_day = datetime.now().strftime("%A")
        
        return f"""You are Aiva, an AI receptionist for {biz_name}.
Current Date: {current_date} ({current_day})
You are friendly, professional, and concise. Your goal is to help customers book appointments, answer questions, and provide excellent service.
ALWAYS use the provided tools to check availability, book appointments, or answer FAQs.
DO NOT make up information. If a user asks for a booking, ask for their name, phone number, service, and desired date/time.
IMPORTANT: When resolving dates like "today" or "tomorrow", use the Current Date provided above to calculate the exact YYYY-MM-DD format for the tool arguments.
If you successfully book an appointment using the tool, simply tell the user it was booked.
Keep your responses short and natural."""

    def _get_tools(self, agent: AIAgentService) -> List[StructuredTool]:
        async def check_availability(service_name: str, date: str, time_preference: str = None) -> str:
            """Check available appointment slots for a specific service and date. date should be YYYY-MM-DD."""
            return json.dumps(await agent.check_availability(service_name, date, time_preference))

        async def book_appointment(customer_name: str, customer_phone: str, service_name: str, date: str, time: str) -> str:
            """Book an appointment for a customer. date should be YYYY-MM-DD and time HH:MM."""
            return json.dumps(await agent.book_appointment(customer_name, customer_phone, service_name, date=date, time=time))

        async def reschedule_appointment(customer_phone: str, new_date: str, new_time: str) -> str:
            """Reschedule an existing appointment."""
            return json.dumps(await agent.reschedule_appointment(customer_phone, new_date, new_time))

        async def cancel_appointment(customer_phone: str, reason: str = "") -> str:
            """Cancel an existing appointment."""
            return json.dumps(await agent.cancel_appointment(customer_phone, reason))

        async def answer_faq(question: str) -> str:
            """Answer a frequently asked question about the business."""
            return json.dumps(await agent.answer_faq(question))

        return [
            StructuredTool.from_function(coroutine=check_availability, name="check_availability", description="Check available appointment slots for a specific service and date"),
            StructuredTool.from_function(coroutine=book_appointment, name="book_appointment", description="Book an appointment for a customer"),
            StructuredTool.from_function(coroutine=reschedule_appointment, name="reschedule_appointment", description="Reschedule an existing appointment"),
            StructuredTool.from_function(coroutine=cancel_appointment, name="cancel_appointment", description="Cancel an existing appointment"),
            StructuredTool.from_function(coroutine=answer_faq, name="answer_faq", description="Answer a frequently asked question about the business")
        ]

    async def process_chat(self, messages: List[Dict[str, Any]], db: AsyncSession, business_id: int) -> str:
        """Process a chat interaction using LangChain and ChatOllama with a manual tool-calling loop."""
        try:
            agent = AIAgentService(db, business_id)
            tools = self._get_tools(agent)
            
            system_prompt = await self._get_system_prompt(db, business_id)
            
            tool_descriptions = "\\n".join([f"- {t.name}: {t.description}" for t in tools])
            
            enhanced_system_prompt = f"""{system_prompt}

You have access to the following tools:
{tool_descriptions}

To use a tool, you MUST reply with EXACTLY a JSON block in the following format (and nothing else):
```json
{{
  "tool": "tool_name",
  "args": {{
    "arg1": "value1",
    "arg2": "value2"
  }}
}}
```

EXAMPLES:
If the user says: "Can I book a haircut for John at 5pm on 2026-06-04? My number is 555-1234"
You MUST output:
```json
{{
  "tool": "book_appointment",
  "args": {{
    "customer_name": "John",
    "customer_phone": "555-1234",
    "service_name": "Haircut",
    "date": "2026-06-04",
    "time": "17:00"
  }}
}}
```

If you do not need to use a tool, just reply normally to the user in a natural conversational way."""

            # Convert incoming dict messages to LangChain message objects
            lc_messages = [SystemMessage(content=enhanced_system_prompt)]
            
            for msg in messages:
                if msg["role"] == "user":
                    lc_messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    lc_messages.append(AIMessage(content=msg["content"]))
                elif msg["role"] == "tool":
                    lc_messages.append(SystemMessage(content=f"Tool Output: {msg['content']}"))

            MAX_STEPS = 3
            for step in range(MAX_STEPS):
                # Ask LLM
                response_msg = await self.llm.ainvoke(lc_messages)
                content = response_msg.content.strip()
                
                lc_messages.append(AIMessage(content=content))
                
                # Check if it looks like a tool call
                import re
                json_match = re.search(r'```json\s*(\{.*?\})\s*```', content, re.DOTALL)
                
                if json_match:
                    try:
                        tool_call = json.loads(json_match.group(1))
                        tool_name = tool_call.get("tool")
                        tool_args = tool_call.get("args", {})
                        
                        # Resiliency mapping for common LLM mistakes
                        if "service" in tool_args and "service_name" not in tool_args:
                            tool_args["service_name"] = tool_args.pop("service")
                        if "name" in tool_args and "customer_name" not in tool_args:
                            tool_args["customer_name"] = tool_args.pop("name")
                        if "phone" in tool_args and "customer_phone" not in tool_args:
                            tool_args["customer_phone"] = tool_args.pop("phone")
                            
                        selected_tool = next((t for t in tools if t.name == tool_name), None)
                        if selected_tool:
                            result = await selected_tool.ainvoke(tool_args)
                            await db.commit()
                            lc_messages.append(SystemMessage(content=f"Tool {tool_name} returned: {result}\\nUse this information to answer the user naturally."))
                        else:
                            lc_messages.append(SystemMessage(content=f"Error: Tool {tool_name} not found."))
                            
                    except Exception as e:
                        logger.error(f"Error parsing or executing tool: {e}")
                        lc_messages.append(SystemMessage(content=f"Error executing tool: {str(e)}"))
                        
                    # Continue the loop to let the LLM generate the final response
                    continue
                
                # No tool call, return the final response
                # Strip out any trailing ``` if the model got confused
                return content.replace("```", "").strip()

            return "I have completed my actions."
            
        except Exception as e:
            logger.error(f"Error in process_chat: {e}", exc_info=True)
            return "I'm sorry, I'm having a little trouble connecting to my systems right now. Could you please try again?"

    async def generate_tts(self, text: str) -> bytes | None:
        """Generate TTS audio using Kokoro on Voicebox."""
        url = "http://127.0.0.1:17493/generate"
        payload = {
            "profile_id": "51f51d17-d8a3-4109-b23e-ac8d7c02f8ff", # Kokoro profile ID
            "text": text,
            "engine": "kokoro"
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # 1. Start generation
                response = await client.post(url, json=payload)
                if response.status_code != 200:
                    logger.error(f"Voicebox TTS failed to start: {response.status_code} {response.text}")
                    return None
                    
                data = response.json()
                gen_id = data.get("id")
                if not gen_id:
                    return None
                    
                import asyncio
                # 2. Poll for completion
                max_retries = 20
                for _ in range(max_retries):
                    status_resp = await client.get(f"http://127.0.0.1:17493/history/{gen_id}")
                    if status_resp.status_code == 200:
                        status_data = status_resp.json()
                        if status_data.get("status") == "completed":
                            # 3. Fetch audio
                            audio_resp = await client.get(f"http://127.0.0.1:17493/audio/{gen_id}")
                            if audio_resp.status_code == 200:
                                return audio_resp.content
                            break
                        elif status_data.get("status") == "failed":
                            logger.error(f"Voicebox TTS generation failed internally for {gen_id}")
                            break
                    await asyncio.sleep(0.5)
                    
                return None
        except Exception as e:
            logger.error(f"Voicebox TTS request error: {e}")
            return None

local_ai_service = LocalAIService()
