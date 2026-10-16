import logging
from fastapi import FastAPI, Header, HTTPException, Security, BackgroundTasks
from app.core.config import settings
from app.sources.db_reader import read_all_content
from app.processing.chunker import chunk_documents
from app.processing.embedder import generate_embeddings
from app.loaders.pgvector_writer import save_chunks_to_pgvector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ingestion-service")

app = FastAPI(title="Clickpoint Ingestion Service", version="1.0.0")

def clear_chat_cache():
    try:
        import redis
        redis_url = os.getenv("REDIS_URL") or "redis://redis:6379/0"
        r = redis.Redis.from_url(redis_url, decode_responses=True, socket_timeout=2)
        r.flushall()
        logger.info(f"Successfully flushed Redis chat cache via FLUSHALL on {redis_url}.")
    except Exception as e:
        logger.warning(f"Could not clear Redis chat cache: {e}")

def run_ingestion_pipeline():
    logger.info("Starting ingestion pipeline...")
    docs = read_all_content()
    logger.info(f"Extracted {len(docs)} documents from database.")
    
    chunks = chunk_documents(docs)
    logger.info(f"Generated {len(chunks)} text chunks.")
    
    embedded_chunks = generate_embeddings(chunks)
    logger.info(f"Generated vector embeddings for {len(embedded_chunks)} chunks.")
    
    saved_count = save_chunks_to_pgvector(embedded_chunks)
    logger.info(f"Successfully saved {saved_count} chunks to pgvector database.")
    
    clear_chat_cache()
    return saved_count

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ingestion-service"}

@app.post("/reindex")
def reindex_knowledge_base(x_internal_key: str = Header(None)):
    if settings.INTERNAL_API_KEY and x_internal_key != settings.INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized internal request")
    
    try:
        count = run_ingestion_pipeline()
        return {
            "status": "success",
            "message": f"Successfully reindexed knowledge base with {count} vector chunks.",
            "indexed_chunks": count
        }
    except Exception as e:
        logger.error(f"Reindexing failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
