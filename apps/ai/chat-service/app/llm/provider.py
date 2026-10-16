import os
import json
import logging
import urllib.request
import urllib.error
from typing import Optional
from app.core.config import settings
from app.llm.prompts import SYSTEM_PROMPT, build_rag_prompt

logger = logging.getLogger("chat-service.llm")

def try_extract_short_fact(query: str, chunks: list) -> str:
    """
    Fallback deterministic text extractor if LLM API is unavailable or unconfigured.
    """
    if not chunks:
        return "I'm having trouble connecting to our AI server right now. Please try again or reach out to us on our contact page!"
    
    top_chunk = chunks[0]
    title = top_chunk.get("title", "")
    content = top_chunk.get("content", "")
    
    lines = [line.strip() for line in content.split("\n") if line.strip()]
    extracted = "\n".join(lines[:4])
    
    return f"Here is what I found regarding **{title}**:\n\n{extracted}\n\nFor more details, feel free to contact our team!"

def call_gemini_rest(prompt_text: str, api_key: str) -> Optional[str]:
    models = [
        os.getenv("GEMINI_MODEL_NAME") or "gemini-3.5-flash-lite",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.7-flash",
        "gemini-3.5-flash",
        "gemini-3.8-flash",
        "gemini-flash-latest",
    ]
    seen = set()
    for m in models:
        if m in seen:
            continue
        seen.add(m)
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
            gen_config = {"temperature": 0.2}
            if "3.7" in m or "3.8" in m:
                gen_config["thinkingConfig"] = {"thinkingBudget": 0}

            payload_data = {
                "contents": [{"role": "user", "parts": [{"text": prompt_text}]}],
                "generationConfig": gen_config
            }
            payload = json.dumps(payload_data).encode("utf-8")
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=35) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            logger.info(f"Gemini REST synthesis succeeded using model '{m}'")
                            return parts[0]["text"].strip()
        except urllib.error.HTTPError as he:
            err_body = he.read().decode("utf-8", errors="ignore") if hasattr(he, "read") else ""
            logger.error(f"Gemini REST API error for model '{m}': HTTP {he.code} {he.reason} - {err_body[:300]}")
        except Exception as e:
            logger.error(f"Gemini REST call for model '{m}' failed: {e}")
    return None

def generate_rag_response(user_query: str, chunks: list, history: list = None) -> dict:
    """
    Synthesizes a final response using Google Gemini LLM grounded on RAG context chunks.
    Returns dict: {"text": str, "provider_used": "gemini" | "local_fallback"}
    """
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    
    if not api_key:
        logger.warning("GEMINI_API_KEY not set. Using fallback fact extraction.")
        return {"text": try_extract_short_fact(user_query, chunks), "provider_used": "local_fallback"}

    rag_prompt = build_rag_prompt(user_query, chunks, history)
    full_prompt = f"{SYSTEM_PROMPT}\n\n{rag_prompt}"

    # 1. Try REST call (35s timeout, logger.error detailing status)
    rest_reply = call_gemini_rest(full_prompt, api_key)
    if rest_reply:
        return {"text": rest_reply, "provider_used": "gemini"}

    # 2. Try SDK fallback paths
    models_to_try = [
        os.getenv("GEMINI_MODEL_NAME") or "gemini-3.5-flash-lite",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-3.7-flash",
        "gemini-3.5-flash",
        "gemini-3.8-flash",
    ]

    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        for m in models_to_try:
            try:
                cfg = {"temperature": 0.2}
                if "3.7" in m or "3.8" in m:
                    cfg["thinking_config"] = {"thinking_budget": 0}
                response = client.models.generate_content(
                    model=m,
                    contents=full_prompt,
                    config=cfg
                )
                if response and response.text:
                    logger.info(f"google.genai SDK synthesis succeeded using model '{m}'")
                    return {"text": response.text.strip(), "provider_used": "gemini"}
            except Exception as sdk_err:
                logger.error(f"google.genai SDK error for model '{m}': {sdk_err}")
    except Exception as e1:
        logger.error(f"google.genai initialization failed: {e1}")

    try:
        import google.generativeai as genai_sdk
        genai_sdk.configure(api_key=api_key)
        for m in models_to_try:
            try:
                model = genai_sdk.GenerativeModel(m)
                response = model.generate_content(
                    full_prompt,
                    generation_config=genai_sdk.GenerationConfig(temperature=0.2)
                )
                if response and response.text:
                    logger.info(f"google.generativeai SDK synthesis succeeded using model '{m}'")
                    return {"text": response.text.strip(), "provider_used": "gemini"}
            except Exception as legacy_err:
                logger.error(f"google.generativeai SDK error for model '{m}': {legacy_err}")
    except Exception as e2:
        logger.error(f"google.generativeai initialization failed: {e2}")

    return {"text": try_extract_short_fact(user_query, chunks), "provider_used": "local_fallback"}
