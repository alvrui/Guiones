"""
Router for Narrativa endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/narrativas", tags=["narrativas"])


@router.get("/proyecto/{proyecto_id}", response_model=List[schemas.Narrativa])
def read_narrativas(proyecto_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all narratives for a project."""
    narrativas = crud.get_narrativas(db, proyecto_id=proyecto_id, skip=skip, limit=limit)
    return narrativas


@router.get("/{narrativa_id}", response_model=schemas.Narrativa)
def read_narrativa(narrativa_id: str, db: Session = Depends(get_db)):
    """Get a narrative by ID."""
    db_narrativa = crud.get_narrativa(db, narrativa_id=narrativa_id)
    if db_narrativa is None:
        raise HTTPException(status_code=404, detail="Narrativa no encontrada")
    return db_narrativa


@router.post("/proyecto/{proyecto_id}", response_model=schemas.Narrativa, status_code=status.HTTP_201_CREATED)
def create_narrativa(proyecto_id: str, narrativa: schemas.NarrativaCreate, db: Session = Depends(get_db)):
    """Create a new narrative for a project."""
    # Verify project exists
    db_proyecto = crud.get_proyecto(db, proyecto_id=proyecto_id)
    if db_proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    return crud.create_narrativa(db=db, narrativa=narrativa, proyecto_id=proyecto_id)


@router.put("/{narrativa_id}", response_model=schemas.Narrativa)
def update_narrativa(narrativa_id: str, narrativa: schemas.NarrativaUpdate, db: Session = Depends(get_db)):
    """Update a narrative."""
    db_narrativa = crud.update_narrativa(db, narrativa_id=narrativa_id, narrativa=narrativa)
    if db_narrativa is None:
        raise HTTPException(status_code=404, detail="Narrativa no encontrada")
    return db_narrativa


@router.delete("/{narrativa_id}", response_model=schemas.Narrativa)
def delete_narrativa(narrativa_id: str, db: Session = Depends(get_db)):
    """Delete a narrative."""
    db_narrativa = crud.delete_narrativa(db, narrativa_id=narrativa_id)
    if db_narrativa is None:
        raise HTTPException(status_code=404, detail="Narrativa no encontrada")
    return db_narrativa
