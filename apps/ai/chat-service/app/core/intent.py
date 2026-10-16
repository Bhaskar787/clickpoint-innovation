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
            if "who are you" in msg_clean or "your name" in msg_clean:
                return {
                    "is_greeting": True,
                    "response": "Hello! I am Clickpoint Innovation's AI Assistant. I'm here to help answer questions about our services, software development capabilities, case studies, team, pricing, careers, and engineering solutions. How can I assist you today?"
                }
            return {
                "is_greeting": True,
                "response": "Hello! How can I assist you today? You can ask me about Clickpoint's software engineering services, tech stack, case studies, team, or open job roles."
            }

    return {"is_greeting": False, "response": None}
