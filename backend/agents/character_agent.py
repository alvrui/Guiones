"""
AI Agent specialized in generating character-related content.
"""

from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from .. import schemas


class CharacterAgent(BaseAgent):
    """Agent for generating character content (trasfondo, personalidad, etc.)."""
    
    def __init__(self):
        super().__init__("character_prompts.yaml", "CharacterAgent")
    
    def generate_trasfondo(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        objetivos: Optional[List[str]] = None,
        motivaciones: Optional[str] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
        titulo_proyecto: str = "",
        contexto_historico: Optional[str] = None,
        contexto_social: Optional[str] = None,
        contexto_geografico: Optional[str] = None,
    ) -> str:
        """Generate a character's backstory."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "objetivos": ", ".join(objetivos) if objetivos else "",
            "motivaciones": motivaciones or "",
            "estilo": estilo,
            "tono_general": tono_general,
            "titulo_proyecto": titulo_proyecto,
            "contexto_historico": contexto_historico or "",
            "contexto_social": contexto_social or "",
            "contexto_geografico": contexto_geografico or "",
        }
        return self.generate("trasfondo", context, max_tokens=400)
    
    def generate_personalidad(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        motivaciones: Optional[str] = None,
        conflictos_internos: Optional[str] = None,
        conflictos_externos: Optional[str] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> str:
        """Generate a character's personality description."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "motivaciones": motivaciones or "",
            "conflictos_internos": conflictos_internos or "",
            "conflictos_externos": conflictos_externos or "",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        return self.generate("personalidad", context, max_tokens=200)
    
    def generate_objetivos(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        motivaciones: Optional[str] = None,
        conflictos_internos: Optional[str] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> List[str]:
        """Generate a list of objectives for a character."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "motivaciones": motivaciones or "",
            "conflictos_internos": conflictos_internos or "",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        result = self.generate("objetivos", context, max_tokens=200)
        
        # Parse the result as a list (it should be a JSON array or comma-separated)
        try:
            # Try to parse as JSON
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            # If not JSON, split by newlines or commas
            if "[" in result and "]" in result:
                # Try to extract list content
                start = result.find("[") + 1
                end = result.rfind("]")
                content = result[start:end]
                return [item.strip().strip('"').strip("'") for item in content.split(",") if item.strip()]
            else:
                return [item.strip() for item in result.split("\n") if item.strip()]
    
    def generate_motivaciones(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        objetivos: Optional[List[str]] = None,
        conflictos_internos: Optional[str] = None,
        estilo: str = "Realista",
    ) -> str:
        """Generate a description of a character's motivations."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "objetivos": ", ".join(objetivos) if objetivos else "",
            "conflictos_internos": conflictos_internos or "",
            "estilo": estilo,
        }
        return self.generate("motivaciones", context, max_tokens=200)
    
    def generate_conflictos_internos(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        personalidad: Optional[str] = None,
        objetivos: Optional[List[str]] = None,
        estilo: str = "Realista",
    ) -> str:
        """Generate a description of a character's internal conflicts."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "personalidad": personalidad or "",
            "objetivos": ", ".join(objetivos) if objetivos else "",
            "estilo": estilo,
        }
        return self.generate("conflictos_internos", context, max_tokens=150)
    
    def generate_conflictos_externos(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        objetivos: Optional[List[str]] = None,
        estilo: str = "Realista",
    ) -> str:
        """Generate a description of a character's external conflicts."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "objetivos": ", ".join(objetivos) if objetivos else "",
            "estilo": estilo,
        }
        return self.generate("conflictos_externos", context, max_tokens=150)
    
    def generate_relaciones(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        objetivos: Optional[List[str]] = None,
        motivaciones: Optional[str] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> List[Dict[str, str]]:
        """Generate a list of relationships for a character."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "objetivos": ", ".join(objetivos) if objetivos else "",
            "motivaciones": motivaciones or "",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        result = self.generate("relaciones", context, max_tokens=300)
        
        # Parse the result as a list of dicts
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            # If not JSON, return a default list
            return [
                {"nombre": "Aliado", "relacion": "Aliado", "descripcion": "Un aliado clave en su viaje"},
                {"nombre": "Antagonista", "relacion": "Antagonista", "descripcion": "Su principal oponente"},
            ]
    
    def generate_evolucion(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        personalidad: Optional[str] = None,
        objetivos: Optional[List[str]] = None,
        conflictos_internos: Optional[str] = None,
        estilo: str = "Realista",
    ) -> str:
        """Generate a description of a character's evolution."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "personalidad": personalidad or "",
            "objetivos": ", ".join(objetivos) if objetivos else "",
            "conflictos_internos": conflictos_internos or "",
            "estilo": estilo,
        }
        return self.generate("evolucion", context, max_tokens=200)
    
    def generate_apariencia_fisica(
        self,
        nombre: str,
        edad: Optional[int] = None,
        genero: Optional[str] = None,
        trasfondo: Optional[str] = None,
        estilo: str = "Realista",
        contexto_geografico: Optional[str] = None,
    ) -> str:
        """Generate a description of a character's physical appearance."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "genero": genero or "Hombre",
            "trasfondo": trasfondo or "",
            "estilo": estilo,
            "contexto_geografico": contexto_geografico or "",
        }
        return self.generate("apariencia_fisica", context, max_tokens=150)
    
    def generate_habilidades(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        objetivos: Optional[List[str]] = None,
        estilo: str = "Realista",
    ) -> List[str]:
        """Generate a list of skills for a character."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "objetivos": ", ".join(objetivos) if objetivos else "",
            "estilo": estilo,
        }
        result = self.generate("habilidades", context, max_tokens=150)
        
        # Parse the result as a list
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return [item.strip() for item in result.split("\n") if item.strip()]
    
    def generate_debilidades(
        self,
        nombre: str,
        edad: Optional[int] = None,
        arquetipo: Optional[str] = None,
        trasfondo: Optional[str] = None,
        personalidad: Optional[str] = None,
        conflictos_internos: Optional[str] = None,
        estilo: str = "Realista",
    ) -> List[str]:
        """Generate a list of weaknesses for a character."""
        context = {
            "nombre": nombre,
            "edad": edad,
            "arquetipo": arquetipo or "Héroe",
            "trasfondo": trasfondo or "",
            "personalidad": personalidad or "",
            "conflictos_internos": conflictos_internos or "",
            "estilo": estilo,
        }
        result = self.generate("debilidades", context, max_tokens=150)
        
        # Parse the result as a list
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return [item.strip() for item in result.split("\n") if item.strip()]
    
    def generate_from_personaje(self, personaje: schemas.PersonajeCreate, proyecto: schemas.Proyecto) -> schemas.PersonajeCreate:
        """
        Generate all missing fields for a character based on the project context.
        
        Args:
            personaje: The character data (with some fields possibly missing).
            proyecto: The project data for context.
        
        Returns:
            A new PersonajeCreate with all fields filled.
        """
        # Start with the original data
        data = personaje.model_dump()
        
        # Generate missing fields
        if not data.get("trasfondo"):
            data["trasfondo"] = self.generate_trasfondo(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                objetivos=data.get("objetivos"),
                motivaciones=data.get("motivaciones"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
                titulo_proyecto=proyecto.titulo,
                contexto_historico=proyecto.contexto_historico,
                contexto_social=proyecto.contexto_social,
                contexto_geografico=proyecto.contexto_geografico,
            )
        
        if not data.get("personalidad"):
            data["personalidad"] = self.generate_personalidad(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                trasfondo=data.get("trasfondo"),
                motivaciones=data.get("motivaciones"),
                conflictos_internos=data.get("conflictos_internos"),
                conflictos_externos=data.get("conflictos_externos"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
            )
        
        if not data.get("objetivos"):
            data["objetivos"] = self.generate_objetivos(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                trasfondo=data.get("trasfondo"),
                motivaciones=data.get("motivaciones"),
                conflictos_internos=data.get("conflictos_internos"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
            )
        
        if not data.get("motivaciones"):
            data["motivaciones"] = self.generate_motivaciones(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                trasfondo=data.get("trasfondo"),
                objetivos=data.get("objetivos"),
                conflictos_internos=data.get("conflictos_internos"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("conflictos_internos"):
            data["conflictos_internos"] = self.generate_conflictos_internos(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                trasfondo=data.get("trasfondo"),
                personalidad=data.get("personalidad"),
                objetivos=data.get("objetivos"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("conflictos_externos"):
            data["conflictos_externos"] = self.generate_conflictos_externos(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                trasfondo=data.get("trasfondo"),
                objetivos=data.get("objetivos"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("apariencia_fisica"):
            data["apariencia_fisica"] = self.generate_apariencia_fisica(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                genero=data.get("genero"),
                trasfondo=data.get("trasfondo"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                contexto_geografico=proyecto.contexto_geografico,
            )
        
        if not data.get("habilidades"):
            data["habilidades"] = self.generate_habilidades(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                trasfondo=data.get("trasfondo"),
                objetivos=data.get("objetivos"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("debilidades"):
            data["debilidades"] = self.generate_debilidades(
                nombre=data.get("nombre", ""),
                edad=data.get("edad"),
                arquetipo=data.get("arquetipo"),
                trasfondo=data.get("trasfondo"),
                personalidad=data.get("personalidad"),
                conflictos_internos=data.get("conflictos_internos"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        return schemas.PersonajeCreate(**data)
