"""
Unified router for AI endpoints using configured agents.
This router uses the MistralService with configured agents instead of hardcoded agents.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from pydantic import BaseModel

from .. import schemas
from ..database import get_db
from ..services.mistral_service import mistral_service
from .. import crud

router = APIRouter(tags=["IA - Unified"])


class AIFieldRequest(BaseModel):
    """Request model for AI field generation."""
    field: str  # The field to generate
    context: Dict[str, Any]  # Context for generation
    agent_id: Optional[str] = None  # Optional specific agent ID
    seccion: str  # Section (proyectos, personajes, narrativas, tramas, estructura)


@router.post("/generate", response_model=schemas.AIResponse)
def generate_field(
    request: AIFieldRequest,
    db: Session = Depends(get_db)
):
    """
    Generate content for a specific field using the configured agent for the section.
    
    This endpoint replaces the individual AI endpoints and uses the agent configuration
    from the database.
    """
    try:
        # Build the prompt based on the field and context
        prompt = _build_prompt_for_field(request.field, request.context)
        
        # Use the Mistral service with the configured agent
        content = mistral_service.generate_for_section(
            seccion=request.seccion,
            user_prompt=prompt,
            context=request.context,
            agent_id=request.agent_id
        )
        
        return schemas.AIResponse(
            content=content,
            model="mistral-api",
            prompt=prompt
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating content: {str(e)}"
        )


def _build_prompt_for_field(field: str, context: Dict[str, Any]) -> str:
    """
    Build a specific prompt based on the field name.
    This maintains compatibility with existing frontend calls.
    """
    # Field-specific prompts
    prompts = {
        # Character fields
        "trasfondo": f"Genera un trasfondo detallado para un personaje llamado {context.get('nombre', '')} con las siguientes características: {context.get('descripcion', '')}",
        "personalidad": f"Describe la personalidad de un personaje llamado {context.get('nombre', '')} basado en: {context.get('descripcion', '')}",
        "objetivos": f"Genera objetivos realistas para un personaje llamado {context.get('nombre', '')} en el contexto de: {context.get('descripcion', '')}",
        "motivaciones": f"Describe las motivaciones de un personaje llamado {context.get('nombre', '')} basado en: {context.get('descripcion', '')}",
        "conflictos_internos": f"Genera conflictos internos para un personaje llamado {context.get('nombre', '')}",
        "conflictos_externos": f"Genera conflictos externos para un personaje llamado {context.get('nombre', '')}",
        "relaciones": f"Genera relaciones para un personaje llamado {context.get('nombre', '')}",
        "evolucion": f"Describe la evolución de un personaje llamado {context.get('nombre', '')}",
        "apariencia_fisica": f"Describe la apariencia física de un personaje llamado {context.get('nombre', '')}",
        "habilidades": f"Genera habilidades para un personaje llamado {context.get('nombre', '')}",
        "debilidades": f"Genera debilidades para un personaje llamado {context.get('nombre', '')}",
        
        # Plot fields
        "elementos_narrativos": f"Genera elementos narrativos para una trama sobre: {context.get('descripcion', '')}",
        "obstaculos": f"Genera obstáculos para una trama sobre: {context.get('descripcion', '')}",
        "sinopsis": f"Genera una sinopsis para: {context.get('descripcion', '')}",
        "titulo": f"Genera opciones de título para: {context.get('descripcion', '')}",
        "subtramas": f"Genera subtramas para: {context.get('descripcion', '')}",
        "notas": f"Genera notas para una trama sobre: {context.get('descripcion', '')}",
        
        # Scene fields
        "texto_escena": f"Genera el texto de una escena sobre: {context.get('descripcion', '')}",
        "notas_direccion": f"Genera notas de dirección para una escena sobre: {context.get('descripcion', '')}",
        "dialogos": f"Genera diálogos para una escena sobre: {context.get('descripcion', '')}",
        "ubicacion": f"Describe la ubicación para una escena sobre: {context.get('descripcion', '')}",
        "duracion_estimada": f"Estima la duración para una escena sobre: {context.get('descripcion', '')}",
        
        # Narrative fields
        "temas_asociados": f"Genera temas asociados para una narrativa sobre: {context.get('descripcion', '')}",
        "conexiones": f"Genera conexiones con otras narrativas para: {context.get('descripcion', '')}",
        "tipo_estructura": f"Sugiere un tipo de estructura para: {context.get('descripcion', '')}",
        "tono": f"Sugiere un tono para: {context.get('descripcion', '')}",
        
        # Project fields
        "contexto_historico": f"Genera contexto histórico para: {context.get('descripcion', '')}",
        "contexto_social": f"Genera contexto social para: {context.get('descripcion', '')}",
        "contexto_geografico": f"Genera contexto geográfico para: {context.get('descripcion', '')}",
        "contexto_ambiental": f"Genera contexto ambiental para: {context.get('descripcion', '')}",
        "inspiraciones_referencias": f"Sugiere inspiraciones o referencias para: {context.get('descripcion', '')}",
        "restricciones_limitaciones": f"Sugiere restricciones o limitaciones para: {context.get('descripcion', '')}",
    }
    
    # Return the specific prompt or a generic one
    return prompts.get(field, f"Genera contenido para el campo '{field}': {context.get('descripcion', '')}")


# Backward compatibility endpoints for existing frontend

@router.post("/character/trasfondo", response_model=schemas.AIResponse)
def generate_character_trasfondo(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate character backstory - backward compatible."""
    context = request.context
    context["seccion"] = "personajes"
    context["field"] = "trasfondo"
    return generate_field(AIFieldRequest(**context), db)


@router.post("/character/personalidad", response_model=schemas.AIResponse)
def generate_character_personalidad(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate character personality - backward compatible."""
    context = request.context
    context["seccion"] = "personajes"
    context["field"] = "personalidad"
    return generate_field(AIFieldRequest(**context), db)


@router.post("/plot/sinopsis", response_model=schemas.AIResponse)
def generate_plot_sinopsis(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate plot synopsis - backward compatible."""
    context = request.context
    context["seccion"] = "tramas"
    context["field"] = "sinopsis"
    return generate_field(AIFieldRequest(**context), db)


@router.post("/narrative/sinopsis", response_model=schemas.AIResponse)
def generate_narrative_sinopsis(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate narrative synopsis - backward compatible."""
    context = request.context
    context["seccion"] = "narrativas"
    context["field"] = "sinopsis"
    return generate_field(AIFieldRequest(**context), db)


@router.post("/scene/texto_escena", response_model=schemas.AIResponse)
def generate_scene_texto(request: schemas.AIRequest, db: Session = Depends(get_db)):
    """Generate scene text - backward compatible."""
    context = request.context
    context["seccion"] = "estructura"
    context["field"] = "texto_escena"
    return generate_field(AIFieldRequest(**context), db)
