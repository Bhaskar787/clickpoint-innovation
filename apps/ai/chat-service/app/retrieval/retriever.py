import re
import psycopg2
from typing import Optional
from psycopg2.extras import RealDictCursor
from sentence_transformers import SentenceTransformer
from app.core.config import settings, clean_url

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
    return _model

LEADERSHIP_KEYWORDS = {
    "founder", "ceo", "cto", "coo", "chief", "president", "director",
    "leadership", "executive", "lead", "leads", "runs", "charge", "owner",
    "founder and ceo", "head of", "in charge", "who runs", "who leads"
}

LOCATION_KEYWORDS = {
    "office", "headquarters", "hq", "located", "address", "based",
    "where", "location", "city", "country", "nepal", "baneshwor", "location"
}

PRICING_KEYWORDS = {
    "pricing", "cost", "timeline", "package", "price", "how much",
    "rate", "budget", "quote", "fee", "estimate", "packages"
}

SERVICE_KEYWORDS = {
    "service", "services", "work", "do you do", "offer", "capabilities",
    "disciplines", "develop", "build", "solutions", "engineering", "kind of work"
}

def detect_explicit_listing_intent(query: str) -> Optional[str]:
    q = query.lower()
    has_list_keyword = any(kw in q for kw in ["list all", "show all", "list of all", "every service", "every blog", "all services", "all blogs", "all case studies"])
    if not has_list_keyword:
        return None

    if any(k in q for k in ["blog", "article", "post"]):
        return "blogPost"
    if any(k in q for k in ["service", "offering"]):
        return "service"
    if any(k in q for k in ["case stud", "portfolio"]):
        return "caseStudy"
    if any(k in q for k in ["testimonial", "review"]):
        return "testimonial"
    if any(k in q for k in ["faq", "question"]):
        return "faq"
    if any(k in q for k in ["job", "career", "vacancy"]):
        return "career"
    if any(k in q for k in ["team", "leadership"]):
        return "about"
    if any(k in q for k in ["industry", "sector"]):
        return "industry"

    return None

def retrieve_relevant_chunks(query: str, top_k: int = 8) -> list:
    """
    1. Fetches candidate pool of up to 30 chunks from pgvector.
    2. Performs keyword-boost re-ranking for leadership, location, pricing, and service domain terms.
    3. Trims to final top_k (default 8) chunks for LLM context grounding.
    """
    raw_dsn = clean_url(settings.DATABASE_URL)
    conn = psycopg2.connect(raw_dsn)
    matched_chunks = []
    seen_ids = set()

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            q_lower = query.lower()

            # 1. Explicit Full-Set Listing Intent
            listing_stype = detect_explicit_listing_intent(query)
            if listing_stype:
                sql = """
                    SELECT id, title, content, "sourceType", "sourceId", url, 0.95 as similarity
                    FROM knowledge_chunks
                    WHERE "sourceType" = %s
                    ORDER BY title ASC
                    LIMIT 30;
                """
                cur.execute(sql, (listing_stype,))
                rows = cur.fetchall()
                for row in rows:
                    if row["id"] not in seen_ids:
                        seen_ids.add(row["id"])
                        matched_chunks.append({
                            "id": row["id"],
                            "title": row.get("title") or "Knowledge Item",
                            "content": row.get("content", ""),
                            "sourceType": row.get("sourceType"),
                            "sourceId": row.get("sourceId"),
                            "url": row.get("url"),
                            "similarity": float(row["similarity"])
                        })
                if len(matched_chunks) >= 3:
                    return matched_chunks[:top_k]

            # 2. Fetch Wide Candidate Pool (top_k = 40) from pgvector without restrictive similarity cutoff
            model = get_model()
            query_vec = model.encode(query, normalize_embeddings=True).tolist()
            vec_str = f"[{','.join(map(str, query_vec))}]"

            sql = """
                SELECT 
                    id, title, content, "sourceType", "sourceId", url,
                    (1 - (embedding <=> %s::vector)) as similarity
                FROM knowledge_chunks
                ORDER BY similarity DESC
                LIMIT 40;
            """
            cur.execute(sql, (vec_str,))
            rows = cur.fetchall()

            # Identify query keyword concepts
            q_words = set(re.findall(r'\w+', q_lower))
            has_leadership_q = bool(q_words & LEADERSHIP_KEYWORDS) or any(phrase in q_lower for phrase in ["who leads", "who runs", "in charge", "who is the founder", "who is in charge", "boss", "head of"])
            has_location_q = bool(q_words & LOCATION_KEYWORDS) or "where is" in q_lower or "located" in q_lower
            has_pricing_q = bool(q_words & PRICING_KEYWORDS) or "how much" in q_lower or "cost" in q_lower
            has_service_q = bool(q_words & SERVICE_KEYWORDS) or "what kind of work" in q_lower or "what do you do" in q_lower

            # Domain Fallback Candidate Injection (if vector pool missed domain chunks)
            if has_leadership_q:
                cur.execute("""
                    SELECT id, title, content, "sourceType", "sourceId", url, 0.40 as similarity
                    FROM knowledge_chunks
                    WHERE "sourceType" = 'about' AND (title ILIKE '%Leadership Profile%' OR content ILIKE '%Founder%' OR content ILIKE '%CEO%')
                    LIMIT 10;
                """)
                rows.extend(cur.fetchall())

            for row in rows:
                if row["id"] in seen_ids:
                    continue

                sim = float(row["similarity"])
                stype = row.get("sourceType", "")
                title_lower = (row.get("title") or "").lower()
                content_lower = (row.get("content") or "").lower()

                # Re-ranking Rule A: Leadership / Founder / CEO / Management queries
                if has_leadership_q:
                    if any(k in title_lower or k in content_lower for k in ["leadership profile", "founder", "ceo", "cto", "chief executive officer", "head of digital marketing"]):
                        sim += 0.65
                    elif stype == "about" and any(k in title_lower or k in content_lower for k in ["role:", "executive", "name:"]):
                        sim += 0.40
                    elif stype == "about" and any(k in title_lower for k in ["mission", "stats", "performance", "metrics"]):
                        sim -= 0.15

                # Re-ranking Rule B: Location / Office / Address queries
                if has_location_q:
                    if stype == "contact" or any(k in title_lower or k in content_lower for k in ["address", "baneshwor", "kathmandu", "nepal", "contact"]):
                        sim += 0.35

                # Re-ranking Rule C: Pricing / Cost / Package queries
                if has_pricing_q:
                    if "pricing" in title_lower or "package" in title_lower or "price range" in content_lower or "billing" in content_lower:
                        sim += 0.35

                # Re-ranking Rule D: Service / Work queries
                if has_service_q:
                    if stype == "service":
                        sim += 0.25

                # Generic keyword overlap boosting
                for word in q_words:
                    if len(word) > 3 and (word in title_lower or word in content_lower):
                        sim += 0.05

                # Demote testimonials for direct service/leadership queries
                if (has_leadership_q or has_service_q or has_pricing_q) and stype == "testimonial":
                    sim -= 0.15

                seen_ids.add(row["id"])
                matched_chunks.append({
                    "id": row["id"],
                    "title": row.get("title") or "Knowledge Item",
                    "content": row.get("content", ""),
                    "sourceType": stype,
                    "sourceId": row.get("sourceId"),
                    "url": row.get("url"),
                    "similarity": sim
                })

            # Re-sort candidate pool by boosted similarity score
            matched_chunks.sort(key=lambda x: x["similarity"], reverse=True)
            matched_chunks = matched_chunks[:top_k]

    except Exception as e:
        print(f"Retrieval error: {e}")
    finally:
        conn.close()

    return matched_chunks
