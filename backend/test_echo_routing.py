import asyncio
from app.services.agent_router import should_route_to_echo

def test_router():
    messages = [
        ("Ask Echo if my farm needs watering", True),
        ("Check soil moisture", True),
        ("How are my crops doing?", True),
        ("What is the irrigation status?", True),
        ("I need a haircut", False),
        ("What are your opening hours?", False)
    ]
    
    for msg, expected in messages:
        result = should_route_to_echo(msg)
        print(f"[{'PASS' if result == expected else 'FAIL'}] '{msg}' -> {result} (Expected: {expected})")

if __name__ == "__main__":
    test_router()
