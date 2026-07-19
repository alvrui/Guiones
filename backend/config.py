"""
Configuration settings for the Guiones backend application.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application settings
    APP_NAME: str = "Guiones API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database settings (SQLite)
    DATABASE_URL: str = "sqlite:///./guiones.db"
    
    # Mistral API settings
    MISTRAL_API_KEY: Optional[str] = Field(
        default=None,
        description="API key for Mistral AI. Get it from https://console.mistral.ai/"
    )
    MISTRAL_MODEL: str = "mistral-tiny"  # Alternatives: mistral-small, mistral-medium
    MISTRAL_TEMPERATURE: float = 0.7
    
    # Server settings
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Create settings instance
settings = Settings()
