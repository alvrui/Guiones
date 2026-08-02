"""
Service for interacting with Mistral API using configured agents.
"""

import os
import json
from typing import Optional, Dict, Any, List
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from ..models import AgenteIA
from .. import schemas
from ..config import settings


class MistralService:
    """Service to handle Mistral API calls with configured agents."""
    
    def __init__(self):
        """Initialize the Mistral service."""
        self.api_key = settings.MISTRAL_API_KEY or os.getenv("MISTRAL_API_KEY")
        if not self.api_key:
            raise ValueError("MISTRAL_API_KEY is not set in environment variables")
        
        self.client = MistralClient(api_key=self.api_key)
    
    def generate_with_agent(
        self,
        agente: AgenteIA,
        user_prompt: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Generate content using a specific agent configuration.
        
        Args:
            agente: The configured AI agent
            user_prompt: The user's prompt/request
            context: Additional context to include in the conversation
        
        Returns:
            Generated content string
        """
        # Build messages list
        messages: List[ChatMessage] = []
        
        # Add system prompt if available
        if agente.prompt_sistema:
            messages.append(ChatMessage(
                role="system",
                content=agente.prompt_sistema
            ))
        
        # Add context as system message if provided
        if context:
            context_str = self._format_context(context)
            messages.append(ChatMessage(
                role="system",
                content=f"Contexto adicional: {context_str}"
            ))
        
        # Add specific prompt if available
        if agente.prompt_especifico:
            messages.append(ChatMessage(
                role="system",
                content=agente.prompt_especifico
            ))
        
        # Add user prompt
        messages.append(ChatMessage(
            role="user",
            content=user_prompt
        ))
        
        # Make the API call
        try:
            response = self.client.chat(
                model=agente.modelo_mistral or "mistral-tiny",
                messages=messages,
                temperature=agente.temperatura or 0.7,
                max_tokens=agente.max_tokens or 500,
            )
            
            content = response.choices[0].message.content
            
            # Basic validation
            if not content or not content.strip():
                return self._get_fallback(agente, user_prompt, context)
            
            return content
            
        except Exception as e:
            print(f"Error calling Mistral API with agent {agente.id}: {e}")
            return self._get_fallback(agente, user_prompt, context)
    
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format context dictionary to string."""
        try:
            return json.dumps(context, ensure_ascii=False, indent=2)
        except Exception:
            return str(context)
    
    def _get_fallback(
        self,
        agente: AgenteIA,
        user_prompt: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Get fallback content when API call fails."""
        context_str = self._format_context(context or {})
        return f"[Error: No se pudo generar contenido con el agente '{agente.nombre}']\n\nPrompt: {user_prompt}\n\nContexto: {context_str}"
    
    def generate_for_section(
        self,
        seccion: str,
        user_prompt: str,
        context: Optional[Dict[str, Any]] = None,
        agent_id: Optional[str] = None
    ) -> str:
        """
        Generate content for a specific section using the configured agent.
        
        Args:
            seccion: The section name (proyectos, personajes, narrativas, etc.)
            user_prompt: The user's prompt/request
            context: Additional context
            agent_id: Specific agent ID to use (optional)
        
        Returns:
            Generated content string
        """
        from ..database import SessionLocal
        from .. import crud
        
        db = SessionLocal()
        try:
            # Get the agent
            agente = None
            if agent_id:
                agente = crud.get_agente_ia(db, agent_id)
            
            # If no specific agent, get the first active agent for this section
            if not agente:
                agentes = crud.get_agentes_ia_by_seccion(db, seccion)
                agente = agentes[0] if agentes else None
            
            # If still no agent, use default configuration
            if not agente:
                return self._get_default_response(seccion, user_prompt, context)
            
            return self.generate_with_agent(agente, user_prompt, context)
            
        finally:
            db.close()
    
    def _get_default_response(
        self,
        seccion: str,
        user_prompt: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Get default response when no agent is configured."""
        context_str = self._format_context(context or {})
        return f"[No hay agente IA configurado para la sección '{seccion}']\n\nPrompt: {user_prompt}\n\nContexto: {context_str}"


# Singleton instance
mistral_service = MistralService()
