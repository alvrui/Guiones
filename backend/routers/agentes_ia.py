"""
Router for AgenteIA endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud
from ..database import get_db

router = APIRouter(tags=["agentes_ia"])


@router.get("/", response_model=List[schemas.AgenteIA])
def read_agentes_ia(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all AI agents."""
    agentes = crud.get_agentes_ia(db, skip=skip, limit=limit)
    return agentes


@router.get("/seccion/{seccion}", response_model=List[schemas.AgenteIA])
def read_agentes_ia_by_seccion(seccion: str, db: Session = Depends(get_db)):
    """Get all AI agents for a specific section."""
    agentes = crud.get_agentes_ia_by_seccion(db, seccion=seccion)
    return agentes


@router.get("/{agente_id}", response_model=schemas.AgenteIA)
def read_agente_ia(agente_id: str, db: Session = Depends(get_db)):
    """Get an AI agent by ID."""
    db_agente = crud.get_agente_ia(db, agente_id=agente_id)
    if db_agente is None:
        raise HTTPException(status_code=404, detail="Agente IA no encontrado")
    return db_agente


@router.post("/", response_model=schemas.AgenteIA, status_code=status.HTTP_201_CREATED)
def create_agente_ia(agente: schemas.AgenteIACreate, db: Session = Depends(get_db)):
    """Create a new AI agent."""
    return crud.create_agente_ia(db=db, agente=agente)


@router.put("/{agente_id}", response_model=schemas.AgenteIA)
def update_agente_ia(agente_id: str, agente: schemas.AgenteIAUpdate, db: Session = Depends(get_db)):
    """Update an AI agent."""
    db_agente = crud.update_agente_ia(db, agente_id=agente_id, agente=agente)
    if db_agente is None:
        raise HTTPException(status_code=404, detail="Agente IA no encontrado")
    return db_agente


@router.delete("/{agente_id}", response_model=schemas.AgenteIA)
def delete_agente_ia(agente_id: str, db: Session = Depends(get_db)):
    """Delete an AI agent."""
    db_agente = crud.delete_agente_ia(db, agente_id=agente_id)
    if db_agente is None:
        raise HTTPException(status_code=404, detail="Agente IA no encontrado")
    return db_agente
