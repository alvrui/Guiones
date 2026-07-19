"""
Router for Narrative AI endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from .. import schemas, crud
from ..database import get_db
from ..agents import NarrativeAgent

router = APIRouter(tags=["IA - Narrativas"])

# Initialize agent
narrative_agent = NarrativeAgent()


@router.post("/sinopsis", response_model=schemas.AIResponse)
def generate_sinopsis(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a synopsis for a narrative."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    sinopsis = narrative_agent.generate_sinopsis(
        titulo=context.get("titulo", ""),
        tipo_estructura=context.get("tipo_estructura", "Lineal"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        temas_asociados=context.get("temas_asociados"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    return schemas.AIResponse(
        content=sinopsis,
        model=narrative_agent.model,
        prompt=narrative_agent._format_prompt("sinopsis", context)
    )


@router.post("/titulo", response_model=schemas.AIResponse)
def generate_titulo(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate title options for a narrative."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    titulos = narrative_agent.generate_titulo(
        tipo_estructura=context.get("tipo_estructura", "Lineal"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        temas_asociados=context.get("temas_asociados"),
        contexto=context.get("contexto"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    # Convert list to string
    content = "\n".join([f"- {t}" for t in titulos])
    
    return schemas.AIResponse(
        content=content,
        model=narrative_agent.model,
        prompt=narrative_agent._format_prompt("titulo", context)
    )


@router.post("/temas_asociados", response_model=schemas.AIResponse)
def generate_temas_asociados(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate associated themes for a narrative."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    temas = narrative_agent.generate_temas_asociados(
        titulo=context.get("titulo", ""),
        sinopsis=context.get("sinopsis", ""),
        personajes_involucrados=context.get("personajes_involucrados", []),
        tipo_estructura=context.get("tipo_estructura", "Lineal"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    # Convert list to string
    content = "\n".join([f"- {t}" for t in temas])
    
    return schemas.AIResponse(
        content=content,
        model=narrative_agent.model,
        prompt=narrative_agent._format_prompt("temas_asociados", context)
    )


@router.post("/conexiones", response_model=schemas.AIResponse)
def generate_conexiones(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate connections with other narratives."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    # Get other narratives if provided
    otras_narrativas = []
    if "otras_narrativas_ids" in context:
        for narrativa_id in context["otras_narrativas_ids"]:
            narrativa = crud.get_narrativa(db, narrativa_id=narrativa_id)
            if narrativa:
                otras_narrativas.append({
                    "titulo": narrativa.titulo,
                    "sinopsis": narrativa.sinopsis
                })
    
    conexiones = narrative_agent.generate_conexiones(
        titulo=context.get("titulo", ""),
        sinopsis=context.get("sinopsis", ""),
        personajes_involucrados=context.get("personajes_involucrados", []),
        temas_asociados=context.get("temas_asociados"),
        otras_narrativas=otras_narrativas if otras_narrativas else None,
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=conexiones,
        model=narrative_agent.model,
        prompt=narrative_agent._format_prompt("conexiones", context)
    )


@router.post("/tipo_estructura", response_model=schemas.AIResponse)
def generate_tipo_estructura(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Recommend a structure type for a narrative."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    tipo_data = narrative_agent.generate_tipo_estructura(
        titulo=context.get("titulo", ""),
        sinopsis=context.get("sinopsis", ""),
        personajes_involucrados=context.get("personajes_involucrados", []),
        temas_asociados=context.get("temas_asociados"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    content = f"Tipo: {tipo_data.get('tipo', 'Lineal')}\nJustificación: {tipo_data.get('justificacion', '')}"
    
    return schemas.AIResponse(
        content=content,
        model=narrative_agent.model,
        prompt=narrative_agent._format_prompt("tipo_estructura", context)
    )


@router.post("/tono", response_model=schemas.AIResponse)
def generate_tono(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Recommend a tone for a narrative."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    tono_data = narrative_agent.generate_tono(
        titulo=context.get("titulo", ""),
        sinopsis=context.get("sinopsis", ""),
        personajes_involucrados=context.get("personajes_involucrados", []),
        temas_asociados=context.get("temas_asociados"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    content = f"Tono: {tono_data.get('tono', 'Drama')}\nJustificación: {tono_data.get('justificacion', '')}"
    
    return schemas.AIResponse(
        content=content,
        model=narrative_agent.model,
        prompt=narrative_agent._format_prompt("tono", context)
    )
