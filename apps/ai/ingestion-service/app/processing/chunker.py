def chunk_documents(documents: list, chunk_size: int = 800, chunk_overlap: int = 100) -> list:
    """
    Takes raw documents [{source_id, source_type, title, content, url}]
    and returns a list of chunk dicts: [{chunk_id, source_id, source_type, title, content, url, chunk_index}]
    """
    chunks = []
    
    for doc in documents:
        content = doc.get("content", "").strip()
        if not content:
            continue
            
        source_id = doc.get("source_id", "")
        source_type = doc.get("source_type", "")
        title = doc.get("title", "")
        url = doc.get("url", "")
        
        # If document is small enough, treat as 1 chunk
        if len(content) <= chunk_size:
            chunks.append({
                "chunk_id": f"{source_type}-{source_id}-0",
                "source_id": source_id,
                "source_type": source_type,
                "title": title,
                "content": content,
                "url": url,
                "chunk_index": 0
            })
            continue

        # Split long text by paragraphs or length
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        current_chunk = ""
        chunk_idx = 0

        for p in paragraphs:
            if len(current_chunk) + len(p) + 2 <= chunk_size:
                current_chunk = f"{current_chunk}\n\n{p}".strip()
            else:
                if current_chunk:
                    chunks.append({
                        "chunk_id": f"{source_type}-{source_id}-{chunk_idx}",
                        "source_id": source_id,
                        "source_type": source_type,
                        "title": title,
                        "content": current_chunk,
                        "url": url,
                        "chunk_index": chunk_idx
                    })
                    chunk_idx += 1
                
                # If a single paragraph is longer than chunk_size, split by characters
                if len(p) > chunk_size:
                    start = 0
                    while start < len(p):
                        sub_content = p[start:start + chunk_size]
                        chunks.append({
                            "chunk_id": f"{source_type}-{source_id}-{chunk_idx}",
                            "source_id": source_id,
                            "source_type": source_type,
                            "title": title,
                            "content": sub_content,
                            "url": url,
                            "chunk_index": chunk_idx
                        })
                        chunk_idx += 1
                        start += chunk_size - chunk_overlap
                    current_chunk = ""
                else:
                    current_chunk = p

        if current_chunk:
            chunks.append({
                "chunk_id": f"{source_type}-{source_id}-{chunk_idx}",
                "source_id": source_id,
                "source_type": source_type,
                "title": title,
                "content": current_chunk,
                "url": url,
                "chunk_index": chunk_idx
            })

    return chunks
