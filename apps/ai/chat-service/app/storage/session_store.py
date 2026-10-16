import uuid
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from app.core.config import settings, clean_url

def get_or_create_session(session_id: str = None) -> str:
    if not session_id or len(session_id) < 8:
        session_id = str(uuid.uuid4())

    raw_dsn = clean_url(settings.DATABASE_URL)
    try:
        conn = psycopg2.connect(raw_dsn)
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM chat_sessions WHERE id = %s;", (session_id,))
            if not cur.fetchone():
                cur.execute(
                    "INSERT INTO chat_sessions (id, \"createdAt\") VALUES (%s, NOW());",
                    (session_id,)
                )
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"Session store DB error: {e}")

    return session_id

def save_chat_message(session_id: str, role: str, content: str, matched_chunks: list = None):
    raw_dsn = clean_url(settings.DATABASE_URL)
    try:
        conn = psycopg2.connect(raw_dsn)
        with conn.cursor() as cur:
            msg_id = f"msg-{uuid.uuid4()}"
            chunks_json = json.dumps(matched_chunks) if matched_chunks else None
            cur.execute(
                """
                INSERT INTO chat_messages (id, "sessionId", role, content, "matchedChunks", "createdAt")
                VALUES (%s, %s, %s, %s, %s, NOW());
                """,
                (msg_id, session_id, role, content, chunks_json)
            )
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error saving chat message: {e}")

def get_session_history(session_id: str, limit: int = 10) -> list:
    raw_dsn = clean_url(settings.DATABASE_URL)
    messages = []
    try:
        conn = psycopg2.connect(raw_dsn)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT role, content FROM chat_messages 
                WHERE "sessionId" = %s 
                ORDER BY "createdAt" DESC LIMIT %s;
                """,
                (session_id, limit)
            )
            rows = cur.fetchall()
            messages = list(reversed(rows))
        conn.close()
    except Exception as e:
        print(f"Error fetching session history: {e}")

    return messages
