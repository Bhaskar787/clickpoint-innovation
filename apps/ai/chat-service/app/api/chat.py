import re
import logging
from fastapi import APIRouter, Depends, HTTPException, Header
from app.core.security import verify_internal_key
from app.core.intent import check_intent
from app.schemas.chat import ChatRequest, ChatResponse, SourceItem
from app.retrieval.retriever import retrieve_relevant_chunks
from app.llm.provider import generate_rag_response
from app.storage.session_store import get_or_create_session, save_chat_message, get_session_history
from app.storage.response_cache import get_cached_response, set_cached_response

logger = logging.getLogger("chat-service.api")
router = APIRouter()

def clean_output_markdown(text: str) -> str:
    # 1. Fix double-slash markdown links like ](//careers) -> ](/careers)
    text = re.sub(r'\]\(\/{2,}', '](/', text)
    # 2. Strip rogue emojis while preserving English and standard punctuation
    text = re.sub(r'[\U00010000-\U0010ffff]', '', text)
    return text.strip()

@router.post("/chat", response_model=ChatResponse)
@router.post("/api/chat", response_model=ChatResponse)
def handle_chat_request(
    request: ChatRequest,
    x_internal_key: str = Depends(verify_internal_key)
):
    try:
        query = request.message.strip()
        if not query:
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        session_id = get_or_create_session(request.sessionId)

        # 1. Intent check (Greetings / Identity)
        intent = check_intent(query)
        if intent["is_greeting"]:
            reply = intent["response"]
            save_chat_message(session_id, "user", query)
            save_chat_message(session_id, "assistant", reply)
            return ChatResponse(
                reply=reply,
                sessionId=session_id,
                sources=[],
                cached=False,
                provider_used="intent"
            )

        # 2. Check Cache
        cached_data = get_cached_response(query)
        if cached_data:
            save_chat_message(session_id, "user", query)
            save_chat_message(session_id, "assistant", cached_data["reply"], cached_data.get("sources"))
            return ChatResponse(
                reply=cached_data["reply"],
                sessionId=session_id,
                sources=cached_data.get("sources", []),
                cached=True,
                provider_used="cache"
            )

        # 3. Retrieve Knowledge Chunks via pgvector
        chunks = retrieve_relevant_chunks(query, top_k=5)
        
        # Fallback Guard: If no chunks retrieved (similarity < 0.35 threshold)
        if not chunks:
            fallback_reply = "I couldn't find specific information about that in our website content. Please reach out directly to our team at info@clickpoint.com.np or +977-9825630080, and we will be happy to assist you!"
            contact_source = SourceItem(title="Contact Us", url="/contact", sourceType="contact")
            save_chat_message(session_id, "user", query)
            save_chat_message(session_id, "assistant", fallback_reply, [contact_source.model_dump()])
            return ChatResponse(
                reply=fallback_reply,
                sessionId=session_id,
                sources=[contact_source],
                cached=False,
                provider_used="threshold_fallback"
            )
        
        # Extract clean source metadata
        sources = []
        seen_urls = set()
        for c in chunks:
            url = c.get("url") or "/services"
            title = c.get("title") or "Clickpoint Resource"
            stype = c.get("sourceType")
            if url not in seen_urls:
                seen_urls.add(url)
                sources.append(SourceItem(title=title, url=url, sourceType=stype))

        # 4. Fetch session history
        history = get_session_history(session_id, limit=6)

        # 5. Synthesize LLM Response
        res_dict = generate_rag_response(query, chunks, history)
        raw_reply = res_dict.get("text", "") if isinstance(res_dict, dict) else str(res_dict)
        reply = clean_output_markdown(raw_reply)
        provider_used = res_dict.get("provider_used", "gemini") if isinstance(res_dict, dict) else "gemini"

        # 6. Save to Session Store & Cache
        save_chat_message(session_id, "user", query)
        save_chat_message(session_id, "assistant", reply, [s.model_dump() for s in sources])
        set_cached_response(query, reply, [s.model_dump() for s in sources])

        return ChatResponse(
            reply=reply,
            sessionId=session_id,
            sources=sources,
            cached=False,
            provider_used=provider_used
        )
    except Exception as e:
        logger.error(f"Error handling chat request: {e}", exc_info=True)
        return ChatResponse(
            reply="I'm having trouble connecting to our AI server right now. Please try again or reach out to us on our contact page!",
            sessionId=request.sessionId or "default",
            sources=[],
            cached=False,
            provider_used="error_fallback"
        )
