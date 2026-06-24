def should_route_to_echo(message: str) -> bool:
    """
    Detects if a user message should be routed to the Echo Farm Agent.
    Uses simple keyword matching for farm-related intents.
    """
    if not message:
        return False
        
    keywords = {
        "farm",
        "irrigation",
        "watering",
        "moisture",
        "crop",
        "crops",
        "field",
        "fields",
        "soil",
        "harvest",
        "greenhouse",
        "agriculture"
    }
    
    # Simple check for keyword existence in the message
    # using lower() for case-insensitive matching.
    message_lower = message.lower()
    
    for kw in keywords:
        if kw in message_lower:
            return True
            
    return False
