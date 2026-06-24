"""
Aiva Backend — Configuration
Uses Pydantic BaseSettings for env-var loading with .env file support.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    APP_NAME: str = "Aiva"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://aiva:aiva@localhost:5432/aiva"
    DB_ECHO: bool = False

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str = "change-me-in-production-use-a-real-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Voice Providers
    VOICE_PROVIDER: str = "vapi"  # "vapi" or "retell"
    VAPI_API_KEY: Optional[str] = None
    VAPI_WEBHOOK_SECRET: Optional[str] = None
    RETELL_API_KEY: Optional[str] = None

    # Twilio (SMS + WhatsApp)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None

    # SendGrid (Email)
    SENDGRID_API_KEY: Optional[str] = None
    SENDGRID_FROM_EMAIL: str = "noreply@aiva.ai"

    # Default timezone
    DEFAULT_TIMEZONE: str = "America/New_York"

    # Echo Agent
    ECHO_AGENT_URL: Optional[str] = "http://192.168.2.12:8000/chat"


settings = Settings()
