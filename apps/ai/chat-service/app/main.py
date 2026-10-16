import logging
from fastapi import FastAPI
from app.api.chat import router as chat_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chat-service")

app = FastAPI(title="Clickpoint Chat Service", version="1.0.0")

app.include_router(chat_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "chat-service"}
