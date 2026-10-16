import psycopg2
from app.core.config import settings, clean_url

def save_chunks_to_pgvector(chunks: list) -> int:
    """
    Clears existing knowledge_chunks & question_cache, and inserts new vectorized chunks into pgvector.
    Returns the number of saved chunks.
    """
    if not chunks:
        return 0

    raw_dsn = clean_url(settings.DATABASE_URL)
    conn = psycopg2.connect(raw_dsn)
    count = 0

    try:
        with conn.cursor() as cur:
            # 1. Clear old chunks and question cache (cache becomes invalid on reindex)
            cur.execute("TRUNCATE TABLE knowledge_chunks RESTART IDENTITY CASCADE;")
            cur.execute("TRUNCATE TABLE question_cache RESTART IDENTITY CASCADE;")
            
            # 2. Insert new chunks
            insert_query = """
                INSERT INTO knowledge_chunks (id, title, content, "sourceType", "sourceId", url, embedding, "contentVersion", "createdAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s::vector, 1, NOW());
            """

            for chunk in chunks:
                chunk_id = chunk.get("chunk_id")
                title = chunk.get("title")
                content = chunk.get("content")
                source_type = chunk.get("source_type")
                source_id = str(chunk.get("source_id", ""))
                url = chunk.get("url")
                embedding = chunk.get("embedding") # list of 384 floats

                if embedding and len(embedding) == 384:
                    vec_str = f"[{','.join(map(str, embedding))}]"
                    cur.execute(insert_query, (
                        chunk_id,
                        title,
                        content,
                        source_type,
                        source_id,
                        url,
                        vec_str
                    ))
                    count += 1

            conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error writing to pgvector: {e}")
        raise e
    finally:
        conn.close()

    return count
