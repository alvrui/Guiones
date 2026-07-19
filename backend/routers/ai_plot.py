"""
Router for Plot AI endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from .. import schemas, crud
from ..database import get_db
from ..agents import PlotAgent

router = APIRouter(prefix="/ai/plot", tags=["IA - Tramas"])

# Initialize agent
plot_agent = PlotAgent()


@router.post("/elementos_narrativos", response_model=schemas.AIResponse)
def generate_elementos_narrativos(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate narrative elements for a plot."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    elementos = plot_agent.generate_elementos_narrativos(
        titulo=context.get("titulo", ""),
        arquetipo_narrativo=context.get("arquetipo_narrativo", "Viaje del Héroe"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        sinopsis=context.get("sinopsis"),
        num_elementos=context.get("num_elementos", 3),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    # Convert list of dicts to string
    content = "\n".join([f"- {e['tipo']}: {e['descripcion']}" for e in elementos])
    
    return schemas.AIResponse(
        content=content,
        model=plot_agent.model,
        prompt=plot_agent._format_prompt("elementos_narrativos", context)
    )


@router.post("/obstaculos", response_model=schemas.AIResponse)
def generate_obstaculos(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a list of obstacles for a plot."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    obstaculos = plot_agent.generate_obstaculos(
        titulo=context.get("titulo", ""),
        arquetipo_narrativo=context.get("arquetipo_narrativo", "Viaje del Héroe"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        sinopsis=context.get("sinopsis"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    # Convert list to string
    content = "\n".join([f"- {o}" for o in obstaculos])
    
    return schemas.AIResponse(
        content=content,
        model=plot_agent.model,
        prompt=plot_agent._format_prompt("obstaculos", context)
    )


@router.post("/sinopsis", response_model=schemas.AIResponse)
def generate_sinopsis(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate a synopsis for a plot."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    sinopsis = plot_agent.generate_sinopsis(
        titulo=context.get("titulo", ""),
        arquetipo_narrativo=context.get("arquetipo_narrativo", "Viaje del Héroe"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        temas_principales=context.get("temas_principales"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
        tono_general=proyecto.tono_general.value if proyecto and hasattr(proyecto.tono_general, 'value') else context.get("tono_general", "Melancólico"),
    )
    
    return schemas.AIResponse(
        content=sinopsis,
        model=plot_agent.model,
        prompt=plot_agent._format_prompt("sinopsis", context)
    )


@router.post("/titulo", response_model=schemas.AIResponse)
def generate_titulo(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate title options for a plot."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    titulos = plot_agent.generate_titulo(
        arquetipo_narrativo=context.get("arquetipo_narrativo", "Viaje del Héroe"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        temas_principales=context.get("temas_principales"),
        contexto=context.get("contexto"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    # Convert list to string
    content = "\n".join([f"- {t}" for t in titulos])
    
    return schemas.AIResponse(
        content=content,
        model=plot_agent.model,
        prompt=plot_agent._format_prompt("titulo", context)
    )


@router.post("/subtramas", response_model=schemas.AIResponse)
def generate_subtramas(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate subplot ideas for a plot."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    subtramas = plot_agent.generate_subtramas(
        titulo=context.get("titulo", ""),
        arquetipo_narrativo=context.get("arquetipo_narrativo", "Viaje del Héroe"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        sinopsis=context.get("sinopsis"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    # Convert list of dicts to string
    content = "\n".join([f"- {s['titulo']}: {s['descripcion']}" for s in subtramas])
    
    return schemas.AIResponse(
        content=content,
        model=plot_agent.model,
        prompt=plot_agent._format_prompt("subtramas", context)
    )


@router.post("/notas", response_model=schemas.AIResponse)
def generate_notas(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate production notes for a plot."""
    context = request.context
    
    # Get project context if proyecto_id is provided
    proyecto = None
    if "proyecto_id" in context:
        proyecto = crud.get_proyecto(db, proyecto_id=context["proyecto_id"])
    
    notas = plot_agent.generate_notas(
        titulo=context.get("titulo", ""),
        arquetipo_narrativo=context.get("arquetipo_narrativo", "Viaje del Héroe"),
        personajes_involucrados=context.get("personajes_involucrados", []),
        sinopsis=context.get("sinopsis"),
        estilo=proyecto.estilo.value if proyecto and hasattr(proyecto.estilo, 'value') else context.get("estilo", "Realista"),
    )
    
    return schemas.AIResponse(
        content=notas,
        model=plot_agent.model,
        prompt=plot_agent._format_prompt("notas", context)
    )
