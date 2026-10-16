from fastapi import Header, HTTPException
from app.core.config import settings

def verify_internal_key(x_internal_key: str = Header(None)):
    if settings.INTERNAL_API_KEY and x_internal_key != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized internal request")
    return x_internal_key
