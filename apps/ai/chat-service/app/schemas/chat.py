from pydantic import BaseModel, Field
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    sessionId: Optional[str] = Field(None, description="Optional persistent session identifier")

class SourceItem(BaseModel):
    title: str
    url: Optional[str] = None
    sourceType: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    sessionId: str
    sources: List[SourceItem] = []
    cached: bool = False
    provider_used: str = "unknown"
