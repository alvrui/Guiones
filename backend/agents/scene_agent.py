"""
AI Agent specialized in generating scene-related content.
"""

from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from .. import schemas


class SceneAgent(BaseAgent):
    """Agent for generating scene content (texto, notas de dirección, etc.)."""
    
    def __init__(self):
        super().__init__("scene_prompts.yaml", "SceneAgent")
    
    def generate_texto_escena(
        self,
        titulo: str,
        ubicacion: str,
        personajes_involucrados: List[str],
        elementos_narrativos: Optional[List[str]] = None,
        duracion_estimada: Optional[str] = None,
        notas_direccion: Optional[str] = None,
        trasfondos: Optional[Dict[str, str]] = None,
        objetivos: Optional[Dict[str, List[str]]] = None,
        conflictos: Optional[str] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> str:
        """Generate the text for a scene."""
        context = {
            "titulo": titulo,
            "ubicacion": ubicacion,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "elementos_narrativos": ", ".join(elementos_narrativos) if elementos_narrativos else "",
            "duracion_estimada": duracion_estimada or "5 minutos",
            "notas_direccion": notas_direccion or "",
            "trasfondos": str(trasfondos) if trasfondos else "",
            "objetivos": str(objetivos) if objetivos else "",
            "conflictos": conflictos or "",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        return self.generate("texto_escena", context, max_tokens=600)
    
    def generate_notas_direccion(
        self,
        titulo: str,
        ubicacion: str,
        personajes_involucrados: List[str],
        texto_escena: Optional[str] = None,
        duracion_estimada: Optional[str] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> str:
        """Generate direction notes for a scene."""
        context = {
            "titulo": titulo,
            "ubicacion": ubicacion,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "texto_escena": texto_escena or "",
            "duracion_estimada": duracion_estimada or "5 minutos",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        return self.generate("notas_direccion", context, max_tokens=300)
    
    def generate_dialogos(
        self,
        titulo: str,
        personajes_involucrados: List[str],
        contexto: str,
        objetivo: str,
        personajes_detalles: Optional[Dict[str, Dict[str, str]]] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> str:
        """Generate dialogues between characters."""
        context = {
            "titulo": titulo,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "contexto": contexto,
            "objetivo": objetivo,
            "personajes_detalles": str(personajes_detalles) if personajes_detalles else "",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        return self.generate("dialogos", context, max_tokens=400)
    
    def generate_ubicacion(
        self,
        titulo: str,
        ubicacion_actual: str,
        tono_general: str = "Melancólico",
        personajes_involucrados: Optional[List[str]] = None,
        estilo: str = "Realista",
    ) -> str:
        """Generate a detailed description of a location."""
        context = {
            "titulo": titulo,
            "ubicacion_actual": ubicacion_actual,
            "tono_general": tono_general,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "estilo": estilo,
        }
        return self.generate("ubicacion", context, max_tokens=200)
    
    def generate_duracion_estimada(
        self,
        titulo: str,
        texto_escena: Optional[str] = None,
        personajes_involucrados: Optional[List[str]] = None,
        elementos_narrativos: Optional[List[str]] = None,
        estilo: str = "Realista",
    ) -> str:
        """Estimate the duration of a scene."""
        context = {
            "titulo": titulo,
            "texto_escena": texto_escena or "",
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "elementos_narrativos": ", ".join(elementos_narrativos) if elementos_narrativos else "",
            "estilo": estilo,
        }
        return self.generate("duracion_estimada", context, max_tokens=150)
    
    def generate_from_escena(
        self,
        escena: schemas.EstructuraNarrativaCreate,
        proyecto: schemas.Proyecto,
        personajes: Optional[List[schemas.Personaje]] = None,
        tramas: Optional[List[schemas.Trama]] = None,
    ) -> schemas.EstructuraNarrativaCreate:
        """
        Generate all missing fields for a scene based on the project context.
        
        Args:
            escena: The scene data (with some fields possibly missing).
            proyecto: The project data for context.
            personajes: List of characters in the project.
            tramas: List of plots in the project.
        
        Returns:
            A new EstructuraNarrativaCreate with all fields filled.
        """
        data = escena.model_dump()
        
        # Get character details for context
        personajes_detalles = {}
        if personajes:
            for p in personajes:
                personajes_detalles[p.nombre] = {
                    "trasfondo": p.trasfondo,
                    "personalidad": p.personalidad or "",
                    "objetivos": p.objetivos,
                    "motivaciones": p.motivaciones,
                }
        
        # Get trama details for elementos narrativos
        elementos_narrativos = []
        if data.get("elementos_narrativos") and tramas:
            for trama_id in data["elementos_narrativos"]:
                for trama in tramas:
                    if trama.id == trama_id:
                        for elemento in trama.elementos_narrativos:
                            elementos_narrativos.append(elemento.descripcion)
                        break
        
        # Generate missing fields
        if not data.get("texto_escena") and data.get("tipo") == "Escena":
            data["texto_escena"] = self.generate_texto_escena(
                titulo=data.get("titulo", ""),
                ubicacion=data.get("ubicacion", ""),
                personajes_involucrados=data.get("personajes_involucrados", []),
                elementos_narrativos=elementos_narrativos,
                duracion_estimada=data.get("duracion_estimada"),
                notas_direccion=data.get("notas_direccion"),
                trasfondos=personajes_detalles,
                objetivos={p.nombre: p.objetivos for p in personajes} if personajes else None,
                conflictos="",
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
            )
        
        if not data.get("notas_direccion") and data.get("tipo") == "Escena":
            data["notas_direccion"] = self.generate_notas_direccion(
                titulo=data.get("titulo", ""),
                ubicacion=data.get("ubicacion", ""),
                personajes_involucrados=data.get("personajes_involucrados", []),
                texto_escena=data.get("texto_escena"),
                duracion_estimada=data.get("duracion_estimada"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
            )
        
        if not data.get("ubicacion") and data.get("tipo") == "Escena":
            data["ubicacion"] = self.generate_ubicacion(
                titulo=data.get("titulo", ""),
                ubicacion_actual=data.get("ubicacion", "Un lugar no especificado"),
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
                personajes_involucrados=data.get("personajes_involucrados", []),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("duracion_estimada") and data.get("tipo") == "Escena":
            data["duracion_estimada"] = self.generate_duracion_estimada(
                titulo=data.get("titulo", ""),
                texto_escena=data.get("texto_escena"),
                personajes_involucrados=data.get("personajes_involucrados", []),
                elementos_narrativos=elementos_narrativos,
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        return schemas.EstructuraNarrativaCreate(**data)
