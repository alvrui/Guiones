"""
AI Agent specialized in generating narrative-related content.
"""

from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from .. import schemas


class NarrativeAgent(BaseAgent):
    """Agent for generating narrative content (sinopsis, temas, etc.)."""
    
    def __init__(self):
        super().__init__("narrative_prompts.yaml", "NarrativeAgent")
    
    def generate_sinopsis(
        self,
        titulo: str,
        tipo_estructura: str,
        personajes_involucrados: List[str],
        temas_asociados: Optional[List[str]] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> str:
        """Generate a synopsis for a narrative."""
        context = {
            "titulo": titulo,
            "tipo_estructura": tipo_estructura,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "temas_asociados": ", ".join(temas_asociados) if temas_asociados else "",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        return self.generate("sinopsis", context, max_tokens=300)
    
    def generate_titulo(
        self,
        tipo_estructura: str,
        personajes_involucrados: List[str],
        temas_asociados: Optional[List[str]] = None,
        contexto: Optional[str] = None,
        estilo: str = "Realista",
    ) -> List[str]:
        """Generate title options for a narrative."""
        context = {
            "tipo_estructura": tipo_estructura,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "temas_asociados": ", ".join(temas_asociados) if temas_asociados else "",
            "contexto": contexto or "",
            "estilo": estilo,
        }
        result = self.generate("titulo", context, max_tokens=200)
        
        # Parse the result as a list
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return [item.strip() for item in result.split("\n") if item.strip()]
    
    def generate_temas_asociados(
        self,
        titulo: str,
        sinopsis: str,
        personajes_involucrados: List[str],
        tipo_estructura: str,
        estilo: str = "Realista",
    ) -> List[str]:
        """Generate associated themes for a narrative."""
        context = {
            "titulo": titulo,
            "sinopsis": sinopsis,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "tipo_estructura": tipo_estructura,
            "estilo": estilo,
        }
        result = self.generate("temas_asociados", context, max_tokens=200)
        
        # Parse the result as a list
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return [item.strip() for item in result.split("\n") if item.strip()]
    
    def generate_conexiones(
        self,
        titulo: str,
        sinopsis: str,
        personajes_involucrados: List[str],
        temas_asociados: Optional[List[str]] = None,
        otras_narrativas: Optional[List[Dict[str, str]]] = None,
        estilo: str = "Realista",
    ) -> str:
        """Generate connections with other narratives."""
        context = {
            "titulo": titulo,
            "sinopsis": sinopsis,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "temas_asociados": ", ".join(temas_asociados) if temas_asociados else "",
            "otras_narrativas": str(otras_narrativas) if otras_narrativas else "",
            "estilo": estilo,
        }
        return self.generate("conexiones", context, max_tokens=200)
    
    def generate_tipo_estructura(
        self,
        titulo: str,
        sinopsis: str,
        personajes_involucrados: List[str],
        temas_asociados: Optional[List[str]] = None,
        estilo: str = "Realista",
    ) -> Dict[str, str]:
        """Recommend a structure type for a narrative."""
        context = {
            "titulo": titulo,
            "sinopsis": sinopsis,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "temas_asociados": ", ".join(temas_asociados) if temas_asociados else "",
            "estilo": estilo,
        }
        result = self.generate("tipo_estructura", context, max_tokens=200)
        
        # Parse the result as a dict
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return {
                "tipo": "Lineal",
                "justificacion": "Estructura lineal recomendada por defecto."
            }
    
    def generate_tono(
        self,
        titulo: str,
        sinopsis: str,
        personajes_involucrados: List[str],
        temas_asociados: Optional[List[str]] = None,
        estilo: str = "Realista",
    ) -> Dict[str, str]:
        """Recommend a tone for a narrative."""
        context = {
            "titulo": titulo,
            "sinopsis": sinopsis,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "temas_asociados": ", ".join(temas_asociados) if temas_asociados else "",
            "estilo": estilo,
        }
        result = self.generate("tono", context, max_tokens=200)
        
        # Parse the result as a dict
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return {
                "tono": "Drama",
                "justificacion": "Tono dramático recomendado por defecto."
            }
    
    def generate_from_narrativa(
        self,
        narrativa: schemas.NarrativaCreate,
        proyecto: schemas.Proyecto,
        personajes: Optional[List[schemas.Personaje]] = None,
        otras_narrativas: Optional[List[schemas.Narrativa]] = None,
    ) -> schemas.NarrativaCreate:
        """
        Generate all missing fields for a narrative based on the project context.
        
        Args:
            narrativa: The narrative data (with some fields possibly missing).
            proyecto: The project data for context.
            personajes: List of characters in the project.
            otras_narrativas: List of other narratives in the project.
        
        Returns:
            A new NarrativaCreate with all fields filled.
        """
        data = narrativa.model_dump()
        
        # Generate missing fields
        if not data.get("sinopsis"):
            data["sinopsis"] = self.generate_sinopsis(
                titulo=data.get("titulo", ""),
                tipo_estructura=data.get("tipo_estructura", "Lineal"),
                personajes_involucrados=data.get("personajes_involucrados", []),
                temas_asociados=data.get("temas_asociados"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
            )
        
        if not data.get("temas_asociados"):
            data["temas_asociados"] = self.generate_temas_asociados(
                titulo=data.get("titulo", ""),
                sinopsis=data.get("sinopsis", ""),
                personajes_involucrados=data.get("personajes_involucrados", []),
                tipo_estructura=data.get("tipo_estructura", "Lineal"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("conexiones_con_otras_narrativas") and otras_narrativas:
            otras_narrativas_data = [
                {"titulo": n.titulo, "sinopsis": n.sinopsis}
                for n in otras_narrativas
            ]
            data["conexiones_con_otras_narrativas"] = self.generate_conexiones(
                titulo=data.get("titulo", ""),
                sinopsis=data.get("sinopsis", ""),
                personajes_involucrados=data.get("personajes_involucrados", []),
                temas_asociados=data.get("temas_asociados"),
                otras_narrativas=otras_narrativas_data,
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("tono"):
            tono_data = self.generate_tono(
                titulo=data.get("titulo", ""),
                sinopsis=data.get("sinopsis", ""),
                personajes_involucrados=data.get("personajes_involucrados", []),
                temas_asociados=data.get("temas_asociados"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
            data["tono"] = tono_data.get("tono", "Drama")
        
        return schemas.NarrativaCreate(**data)
