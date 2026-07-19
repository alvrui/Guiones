"""
AI Agent specialized in generating plot-related content.
"""

from typing import Dict, Any, List, Optional
from .base_agent import BaseAgent
from .. import schemas


class PlotAgent(BaseAgent):
    """Agent for generating plot content (elementos narrativos, obstáculos, etc.)."""
    
    def __init__(self):
        super().__init__("plot_prompts.yaml", "PlotAgent")
    
    def generate_elementos_narrativos(
        self,
        titulo: str,
        arquetipo_narrativo: str,
        personajes_involucrados: List[str],
        sinopsis: Optional[str] = None,
        num_elementos: int = 3,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> List[Dict[str, str]]:
        """Generate narrative elements for a plot."""
        context = {
            "titulo": titulo,
            "arquetipo_narrativo": arquetipo_narrativo,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "sinopsis": sinopsis or "",
            "num_elementos": num_elementos,
            "estilo": estilo,
            "tono_general": tono_general,
        }
        result = self.generate("elementos_narrativos", context, max_tokens=500)
        
        # Parse the result as a list of dicts
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            # If not JSON, return a default list
            return [
                {"tipo": "Conflicto", "descripcion": f"Conflicto principal en {titulo}"},
                {"tipo": "Revelación", "descripcion": f"Revelación clave en {titulo}"},
                {"tipo": "Clímax", "descripcion": f"Clímax de {titulo}"},
            ]
    
    def generate_obstaculos(
        self,
        titulo: str,
        arquetipo_narrativo: str,
        personajes_involucrados: List[str],
        sinopsis: Optional[str] = None,
        estilo: str = "Realista",
    ) -> List[str]:
        """Generate a list of obstacles for a plot."""
        context = {
            "titulo": titulo,
            "arquetipo_narrativo": arquetipo_narrativo,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "sinopsis": sinopsis or "",
            "estilo": estilo,
        }
        result = self.generate("obstaculos", context, max_tokens=300)
        
        # Parse the result as a list
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return [item.strip() for item in result.split("\n") if item.strip()]
    
    def generate_sinopsis(
        self,
        titulo: str,
        arquetipo_narrativo: str,
        personajes_involucrados: List[str],
        temas_principales: Optional[List[str]] = None,
        estilo: str = "Realista",
        tono_general: str = "Melancólico",
    ) -> str:
        """Generate a synopsis for a plot."""
        context = {
            "titulo": titulo,
            "arquetipo_narrativo": arquetipo_narrativo,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "temas_principales": ", ".join(temas_principales) if temas_principales else "",
            "estilo": estilo,
            "tono_general": tono_general,
        }
        return self.generate("sinopsis", context, max_tokens=300)
    
    def generate_titulo(
        self,
        arquetipo_narrativo: str,
        personajes_involucrados: List[str],
        temas_principales: Optional[List[str]] = None,
        contexto: Optional[str] = None,
        estilo: str = "Realista",
    ) -> List[str]:
        """Generate title options for a plot."""
        context = {
            "arquetipo_narrativo": arquetipo_narrativo,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "temas_principales": ", ".join(temas_principales) if temas_principales else "",
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
    
    def generate_subtramas(
        self,
        titulo: str,
        arquetipo_narrativo: str,
        personajes_involucrados: List[str],
        sinopsis: Optional[str] = None,
        estilo: str = "Realista",
    ) -> List[Dict[str, str]]:
        """Generate subplot ideas for a plot."""
        context = {
            "titulo": titulo,
            "arquetipo_narrativo": arquetipo_narrativo,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "sinopsis": sinopsis or "",
            "estilo": estilo,
        }
        result = self.generate("subtramas", context, max_tokens=400)
        
        # Parse the result as a list of dicts
        try:
            import json
            return json.loads(result)
        except json.JSONDecodeError:
            return [
                {"titulo": "Subtrama 1", "descripcion": f"Subtrama relacionada con {titulo}"},
                {"titulo": "Subtrama 2", "descripcion": f"Otra subtrama para {titulo}"},
            ]
    
    def generate_notas(
        self,
        titulo: str,
        arquetipo_narrativo: str,
        personajes_involucrados: List[str],
        sinopsis: Optional[str] = None,
        estilo: str = "Realista",
    ) -> str:
        """Generate production notes for a plot."""
        context = {
            "titulo": titulo,
            "arquetipo_narrativo": arquetipo_narrativo,
            "personajes_involucrados": ", ".join(personajes_involucrados) if personajes_involucrados else "",
            "sinopsis": sinopsis or "",
            "estilo": estilo,
        }
        return self.generate("notas", context, max_tokens=200)
    
    def generate_from_trama(self, trama: schemas.TramaCreate, proyecto: schemas.Proyecto) -> schemas.TramaCreate:
        """
        Generate all missing fields for a plot based on the project context.
        
        Args:
            trama: The plot data (with some fields possibly missing).
            proyecto: The project data for context.
        
        Returns:
            A new TramaCreate with all fields filled.
        """
        data = trama.model_dump()
        
        # Generate missing fields
        if not data.get("elementos_narrativos"):
            elementos = self.generate_elementos_narrativos(
                titulo=data.get("titulo", ""),
                arquetipo_narrativo=data.get("arquetipo_narrativo", "Viaje del Héroe"),
                personajes_involucrados=data.get("personajes_involucrados", []),
                sinopsis=data.get("sinopsis"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
            )
            # Convert to ElementoNarrativoSchema objects
            data["elementos_narrativos"] = [
                schemas.ElementoNarrativoSchema(tipo=e["tipo"], descripcion=e["descripcion"])
                for e in elementos
            ]
        
        if not data.get("obstaculos"):
            data["obstaculos"] = self.generate_obstaculos(
                titulo=data.get("titulo", ""),
                arquetipo_narrativo=data.get("arquetipo_narrativo", "Viaje del Héroe"),
                personajes_involucrados=data.get("personajes_involucrados", []),
                sinopsis=data.get("sinopsis"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        if not data.get("sinopsis"):
            data["sinopsis"] = self.generate_sinopsis(
                titulo=data.get("titulo", ""),
                arquetipo_narrativo=data.get("arquetipo_narrativo", "Viaje del Héroe"),
                personajes_involucrados=data.get("personajes_involucrados", []),
                temas_principales=proyecto.temas_principales,
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
                tono_general=proyecto.tono_general.value if hasattr(proyecto.tono_general, 'value') else proyecto.tono_general,
            )
        
        if not data.get("notas"):
            data["notas"] = self.generate_notas(
                titulo=data.get("titulo", ""),
                arquetipo_narrativo=data.get("arquetipo_narrativo", "Viaje del Héroe"),
                personajes_involucrados=data.get("personajes_involucrados", []),
                sinopsis=data.get("sinopsis"),
                estilo=proyecto.estilo.value if hasattr(proyecto.estilo, 'value') else proyecto.estilo,
            )
        
        return schemas.TramaCreate(**data)
