"""
Router for Scene AI endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from .. import schemas, crud
from ..database import get_db
from ..agents import SceneAgent

router = APIRouter(prefix="/ai/scene", tags=["IA - Escenas"])

# Initialize agent
scene_agent = SceneAgent()


@router.post("/texto_escena", response_model=schemas.AIResponse)
def generate_texto_escena(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate the text for a scene."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    # Get character details if provided
    personajes = []
    if "personajes_ids" in context:
        for personaje_id in context["personajes_ids"]:
            personaje = crud.get_personaje(db, personaje_id=personaje_id)
            if personaje:
                personajes.append(personaje)
    
    texto = scene_agent.generate_texto_escena(
        titulo=context.get("titulo", ""),
        ubicacion=context.get("ubicacion", ""),
        personajes_involucrados=context.get("personajes_involucrados", []),
        elementos_narrativos=context.get("elementos_narrativos"),
        duracion_estimada=context.get("duracion_estimada"),
        notas_direccion=context.get("notas_direccion"),
        trasfondos={p.nombre: p.trasfondo for p in personajes} if personajes else None,
        objetivos={p.nombre: p.objetivos for p in personajes} if personajes else None,
        conflictos=context.get("conflictos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    return schemas.AIResponse(
        content=texto,
        model=scene_agent.model,
        prompt=scene_agent._format_prompt("texto_escena", context)
    )


@router.post("/notas_direccion", response_model=schemas.AIResponse)
def generate_notas_direccion(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate direction notes for a scene."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    notas = scene_agent.generate_notas_direccion(
        titulo=context.get("titulo", ""),
        ubicacion=context.get("ubicacion", ""),
        personajes_involucrados=context.get("personajes_involucrados", []),
        texto_escena=context.get("texto_escena"),
        duracion_estimada=context.get("duracion_estimada"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    return schemas.AIResponse(
        content=notas,
        model=scene_agent.model,
        prompt=scene_agent._format_prompt("notas_direccion", context)
    )


@router.post("/dialogos", response_model=schemas.AIResponse)
def generate_dialogos(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate dialogues between characters."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    # Get character details if provided
    personajes_detalles = {}
    if "personajes_ids" in context:
        for personaje_id in context["personajes_ids"]:
            personaje = crud.get_personaje(db, personaje_id=personaje_id)
            if personaje:
                personajes_detalles[personaje.nombre] = {
                    "trasfondo": personaje.trasfondo,
                    "personalidad": personaje.personalidad or "",
                    "objetivos": personaje.objetivos,
                    "motivaciones": personaje.motivaciones,
                }
    
    dialogos = scene_agent.generate_dialogos(
        titulo=context.get("titulo", ""),
        personajes_involucrados=context.get("personajes_involucrados", []),
        contexto=context.get("contexto", ""),
        objetivo=context.get("objetivo", ""),
        personajes_detalles=personajes_detalles if personajes_detalles else None,
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    return schemas.AIResponse(
        content=dialogos,
        model=scene_agent.model,
        prompt=scene_agent._format_prompt("dialogos", context)
    )


@router.post("/ubicacion", response_model=schemas.AIResponse)
def generate_ubicacion(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a detailed description of a location."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    ubicacion = scene_agent.generate_ubicacion(
        titulo=context.get("titulo", ""),
        ubicacion_actual=context.get("ubicacion_actual", ""),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=ubicacion,
        model=scene_agent.model,
        prompt=scene_agent._format_prompt("ubicacion", context)
    )


@router.post("/duracion_estimada", response_model=schemas.AIResponse)
def generate_duracion_estimada(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Estimate the duration of a scene."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    duracion = scene_agent.generate_duracion_estimada(
        titulo=context.get("titulo", ""),
        texto_escena=context.get("texto_escena"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        elementos_narrativos=context.get("elementos_narrativos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=duracion,
        model=scene_agent.model,
        prompt=scene_agent._format_prompt("duracion_estimada", context)
    )
