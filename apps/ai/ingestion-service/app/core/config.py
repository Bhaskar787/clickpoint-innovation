import os
import re
from pydantic_settings import BaseSettings

def clean_url(url: str) -> str:
    """Strip pgBouncer parameters and ensure sslmode=require for Supabase in psycopg2."""
    if not url:
        return ""
    # Remove ?pgbouncer=true or &pgbouncer=true
    cleaned = re.sub(r'[\?&]pgbouncer=[^&]+', '', url)
    if "supabase.com" in cleaned and "sslmode" not in cleaned:
        sep = "&" if "?" in cleaned else "?"
        cleaned += f"{sep}sslmode=require"
    return cleaned

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5433/clickpoint_db"
    )
    INTERNAL_API_KEY: str = os.getenv(
        "INTERNAL_API_KEY",
        "clickpoint-secret-internal-key-2026"
    )
    EMBEDDING_MODEL_NAME: str = os.getenv(
        "EMBEDDING_MODEL_NAME",
        "all-MiniLM-L6-v2"
    )
    REDIS_URL: str = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379/0"
    )
    DEFAULT_SIMILARITY_THRESHOLD: float = float(os.getenv("DEFAULT_SIMILARITY_THRESHOLD", "0.35"))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
