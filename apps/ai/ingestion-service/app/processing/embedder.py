from sentence_transformers import SentenceTransformer
from app.core.config import settings

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
    return _model

def generate_embeddings(chunks: list) -> list:
    """
    Given a list of chunks, generates 384-dimensional vector embeddings for each chunk.
    Input format for model: f"{source_type.upper()}: {title}\n{content}"
    Returns the chunks updated with an 'embedding' field containing float list.
    """
    if not chunks:
        return []

    model = get_model()
    
    texts_to_embed = [
        f"{c.get('source_type', '').upper()}: {c.get('title', '')}\n{c.get('content', '')}"
        for c in chunks
    ]

    embeddings = model.encode(texts_to_embed, normalize_embeddings=True, show_progress_bar=False)

    for idx, chunk in enumerate(chunks):
        chunk["embedding"] = embeddings[idx].tolist()

    return chunks
