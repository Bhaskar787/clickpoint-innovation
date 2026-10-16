import json
import logging
from typing import Optional, Dict
from app.core.config import settings

logger = logging.getLogger("chat-service.cache")

_redis_client = None

def get_redis():
    global _redis_client
    if _redis_client is None:
        try:
            import redis
            _redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True, socket_timeout=2)
            _redis_client.ping()
        except Exception as e:
            logger.warning(f"Redis cache connection failed: {e}. Running without Redis cache.")
            _redis_client = False
    return _redis_client if _redis_client else None

def get_cached_response(query: str) -> Optional[Dict]:
    r = get_redis()
    if not r:
        return None
    try:
        key = f"chat_cache:{query.strip().lower()}"
        cached = r.get(key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        logger.error(f"Redis get error: {e}")
    return None

def set_cached_response(query: str, reply: str, sources: list, ttl: int = 86400):
    r = get_redis()
    if not r:
        return
    try:
        key = f"chat_cache:{query.strip().lower()}"
        val = json.dumps({"reply": reply, "sources": sources})
        r.setex(key, ttl, val)
    except Exception as e:
        logger.error(f"Redis set error: {e}")
