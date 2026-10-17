import re

GREETING_PATTERNS = [
    r"^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))\b",
    r"^who\s+are\s+you\b",
    r"^what\s+is\s+your\s+name\b",
    r"^what\s+can\s+you\s+do\b",
    r"^help\b"
]

def check_intent(message: str) -> dict:
    msg_clean = message.strip().lower()
    
    # Check for simple greetings or agent identity questions
    for pattern in GREETING_PATTERNS:
        if re.search(pattern, msg_clean):
            if "who are you" in msg_clean or "your name" in msg_clean or "what can you do" in msg_clean:
                return {
                    "is_greeting": True,
                    "response": (
                        "Hello! I am **Clix**, your Clickpoint Innovation AI Assistant.\n\n"
                        "I'm here to help answer questions about our digital product engineering services, "
                        "custom AI solutions, pricing packages, client case studies, team, and career opportunities.\n\n"
                        "How can I assist you today?"
                    )
                }
            return {
                "is_greeting": True,
                "response": (
                    "Hello! Welcome to **Clickpoint Innovation**.\n\n"
                    "I'm **Clix**, your AI assistant. How can I help you today?\n\n"
                    "* **Engineering & AI Services** — Full-stack web, mobile, and custom AI systems\n"
                    "* **Case Studies & Portfolio** — Real client projects and results\n"
                    "* **Pricing & Timelines** — Transparent packages for your project\n"
                    "* **Careers & Culture** — Remote-first openings and team opportunities\n\n"
                    "Feel free to ask any question or tap one of the quick options below!"
                )
            }

    return {"is_greeting": False, "response": None}
