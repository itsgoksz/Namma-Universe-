"""
Aiva — Chat API Routes
"""

import base64
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.core.deps import CurrentUser, DbSession
from app.services.local_ai_service import local_ai_service

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    generate_audio: bool = False

class ChatResponse(BaseModel):
    response: str
    audio_base64: Optional[str] = None

@router.post("", response_model=ChatResponse)
async def chat_with_aiva(
    request: ChatRequest,
    current_user: CurrentUser,
    db: DbSession,
):
    """Chat with Aiva using local Ollama model."""
    
    # Convert pydantic models to dicts
    messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    
    # Process through local AI service
    response_text = await local_ai_service.process_chat(
        messages=messages,
        db=db,
        business_id=current_user.business_id
    )
    
    audio_b64 = None
    if request.generate_audio and response_text:
        audio_bytes = await local_ai_service.generate_tts(response_text)
        if audio_bytes:
            audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')
            
    return ChatResponse(
        response=response_text,
        audio_base64=audio_b64
    )
