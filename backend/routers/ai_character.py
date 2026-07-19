"""
Router for Character AI endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from .. import schemas, crud
from ..database import get_db
from ..agents import CharacterAgent

router = APIRouter(tags=["IA - Personajes"])

# Initialize agent
character_agent = CharacterAgent()


@router.post("/trasfondo", response_model=schemas.AIResponse)
def generate_trasfondo(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a character's backstory."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    trasfondo = character_agent.generate_trasfondo(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        objetivos=context.get("objetivos"),
        motivaciones=context.get("motivaciones"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
        titulo_proyecto=proyecto.titulo if proyecto else context.get("titulo_proyecto", ""),
        contexto_historico=proyecto.contexto_historico if proyecto else context.get("contexto_historico"),
        contexto_social=proyecto.contexto_social if proyecto else context.get("contexto_social"),
        contexto_geografico=proyecto.contexto_geografico if proyecto else context.get("contexto_geografico"),
    )
    
    return schemas.AIResponse(
        content=trasfondo,
        model=character_agent.model,
        prompt=character_agent._format_prompt("trasfondo", context)
    )


@router.post("/personalidad", response_model=schemas.AIResponse)
def generate_personalidad(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a character's personality description."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    personalidad = character_agent.generate_personalidad(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        motivaciones=context.get("motivaciones"),
        conflictos_internos=context.get("conflictos_internos"),
        conflictos_externos=context.get("conflictos_externos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    return schemas.AIResponse(
        content=personalidad,
        model=character_agent.model,
        prompt=character_agent._format_prompt("personalidad", context)
    )


@router.post("/objetivos", response_model=schemas.AIResponse)
def generate_objetivos(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a list of objectives for a character."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    objetivos = character_agent.generate_objetivos(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        motivaciones=context.get("motivaciones"),
        conflictos_internos=context.get("conflictos_internos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    # Convert list to string for response
    content = "\n".join([f"- {obj}" for obj in objetivos])
    
    return schemas.AIResponse(
        content=content,
        model=character_agent.model,
        prompt=character_agent._format_prompt("objetivos", context)
    )


@router.post("/motivaciones", response_model=schemas.AIResponse)
def generate_motivaciones(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a description of a character's motivations."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    motivaciones = character_agent.generate_motivaciones(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        objetivos=context.get("objetivos"),
        conflictos_internos=context.get("conflictos_internos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=motivaciones,
        model=character_agent.model,
        prompt=character_agent._format_prompt("motivaciones", context)
    )


@router.post("/conflictos_internos", response_model=schemas.AIResponse)
def generate_conflictos_internos(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a description of a character's internal conflicts."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    conflictos = character_agent.generate_conflictos_internos(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        personalidad=context.get("personalidad"),
        objetivos=context.get("objetivos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=conflictos,
        model=character_agent.model,
        prompt=character_agent._format_prompt("conflictos_internos", context)
    )


@router.post("/conflictos_externos", response_model=schemas.AIResponse)
def generate_conflictos_externos(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a description of a character's external conflicts."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    conflictos = character_agent.generate_conflictos_externos(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        objetivos=context.get("objetivos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=conflictos,
        model=character_agent.model,
        prompt=character_agent._format_prompt("conflictos_externos", context)
    )


@router.post("/relaciones", response_model=schemas.AIResponse)
def generate_relaciones(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a list of relationships for a character."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    relaciones = character_agent.generate_relaciones(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        objetivos=context.get("objetivos"),
        motivaciones=context.get("motivaciones"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    # Convert list of dicts to string
    content = "\n".join([f"- {r['nombre']} ({r['relacion']}): {r['descripcion']}" for r in relaciones])
    
    return schemas.AIResponse(
        content=content,
        model=character_agent.model,
        prompt=character_agent._format_prompt("relaciones", context)
    )


@router.post("/evolucion", response_model=schemas.AIResponse)
def generate_evolucion(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a description of a character's evolution."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    evolucion = character_agent.generate_evolucion(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        personalidad=context.get("personalidad"),
        objetivos=context.get("objetivos"),
        conflictos_internos=context.get("conflictos_internos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=evolucion,
        model=character_agent.model,
        prompt=character_agent._format_prompt("evolucion", context)
    )


@router.post("/apariencia_fisica", response_model=schemas.AIResponse)
def generate_apariencia_fisica(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a description of a character's physical appearance."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    apariencia = character_agent.generate_apariencia_fisica(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        genero=context.get("genero"),
        trasfondo=context.get("trasfondo"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        contexto_geografico=proyecto.contexto_geografico if proyecto else context.get("contexto_geografico"),
    )
    
    return schemas.AIResponse(
        content=apariencia,
        model=character_agent.model,
        prompt=character_agent._format_prompt("apariencia_fisica", context)
    )


@router.post("/habilidades", response_model=schemas.AIResponse)
def generate_habilidades(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a list of skills for a character."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    habilidades = character_agent.generate_habilidades(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        objetivos=context.get("objetivos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    # Convert list to string
    content = "\n".join([f"- {h}" for h in habilidades])
    
    return schemas.AIResponse(
        content=content,
        model=character_agent.model,
        prompt=character_agent._format_prompt("habilidades", context)
    )


@router.post("/debilidades", response_model=schemas.AIResponse)
def generate_debilidades(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a list of weaknesses for a character."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    debilidades = character_agent.generate_debilidades(
        nombre=context.get("nombre", ""),
        edad=context.get("edad"),
        arquetipo=context.get("arquetipo"),
        trasfondo=context.get("trasfondo"),
        personalidad=context.get("personalidad"),
        conflictos_internos=context.get("conflictos_internos"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    # Convert list to string
    content = "\n".join([f"- {d}" for d in debilidades])
    
    return schemas.AIResponse(
        content=content,
        model=character_agent.model,
        prompt=character_agent._format_prompt("debilidades", context)
    )
