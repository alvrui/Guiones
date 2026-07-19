"""
Base class for AI agents.
Provides common functionality for all specialized agents.
"""

import yaml
from pathlib import Path
from typing import Dict, Any, Optional
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from ..config import settings


class BaseAgent:
    """Base class for all AI agents."""
    
    def __init__(self, prompts_file: str, agent_name: str = "BaseAgent"):
        """
        Initialize the agent with prompts from a YAML file.
        
        Args:
            prompts_file: Name of the YAML file in the prompts directory.
            agent_name: Name of the agent (for logging/debugging).
        """
        self.agent_name = agent_name
        self.prompts = self._load_prompts(prompts_file)
        self.client = MistralClient(api_key=settings.MISTRAL_API_KEY)
        self.model = settings.MISTRAL_MODEL
        self.temperature = settings.MISTRAL_TEMPERATURE
    
    def _load_prompts(self, prompts_file: str) -> Dict[str, str]:
        """Load prompts from a YAML file."""
        prompts_path = Path(__file__).parent.parent / "prompts" / prompts_file
        with open(prompts_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    
    def _format_prompt(self, prompt_name: str, context: Dict[str, Any]) -> str:
        """
        Format a prompt with the given context.
        
        Args:
            prompt_name: Name of the prompt in the YAML file.
            context: Dictionary with context variables.
        
        Returns:
            Formatted prompt string.
        """
        if prompt_name not in self.prompts:
            raise ValueError(f"Prompt '{prompt_name}' not found in {self.agent_name}")
        
        prompt = self.prompts[prompt_name]
        try:
            return prompt.format(**context)
        except KeyError as e:
            # If a context variable is missing, use a placeholder
            missing_key = str(e).strip("'")
            context[missing_key] = f"[{missing_key.upper()}_NO_PROPORCIONADO]"
            return prompt.format(**context)
    
    def generate(self, prompt_name: str, context: Dict[str, Any], max_tokens: int = 500) -> str:
        """
        Generate content using the specified prompt and context.
        
        Args:
            prompt_name: Name of the prompt to use.
            context: Dictionary with context variables.
            max_tokens: Maximum number of tokens to generate.
        
        Returns:
            Generated content string.
        """
        formatted_prompt = self._format_prompt(prompt_name, context)
        
        messages = [
            ChatMessage(role="user", content=formatted_prompt)
        ]
        
        try:
            response = self.client.chat(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=max_tokens,
            )
            content = response.choices[0].message.content
            
            # Basic validation
            if not content or not content.strip():
                return self._get_fallback(prompt_name, context)
            
            return content
        except Exception as e:
            # Fallback in case of API error
            print(f"Error generating content with {self.agent_name}: {e}")
            return self._get_fallback(prompt_name, context)
    
    def _get_fallback(self, prompt_name: str, context: Dict[str, Any]) -> str:
        """
        Get fallback content when AI generation fails.
        
        Args:
            prompt_name: Name of the prompt that failed.
            context: Original context.
        
        Returns:
            Fallback content string.
        """
        # Default fallback
        fallbacks = {
            "trasfondo": f"{context.get('nombre', 'El personaje')} creció en un entorno difícil que lo marcó para siempre. Su vida ha estado llena de desafíos que lo han convertido en quien es hoy.",
            "personalidad": f"{context.get('nombre', 'El personaje')} es una persona compleja, con fortalezas y debilidades que lo hacen único en su contexto.",
            "sinopsis": f"Esta es una historia sobre {context.get('titulo', 'un evento importante')} que involucra a {context.get('personajes_involucrados', 'varios personajes')} en un contexto de {context.get('estilo', 'drama')}.",
            "texto_escena": f"[Escena: {context.get('titulo', 'Sin título')}]\n\n{context.get('ubicacion', 'Un lugar no especificado')}.\n\n[Diálogo o acciones no generados. Por favor, edita esta escena.]",
            "elementos_narrativos": '[{"tipo": "Conflicto", "descripcion": "Conflicto principal no especificado. Por favor, edita."}]',
        }
        
        return fallbacks.get(prompt_name, f"Contenido no generado para {prompt_name}. Por favor, proporciona más detalles.")
