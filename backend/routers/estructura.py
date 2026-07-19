"""
Router for EstructuraNarrativa endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud
from ..database import get_db

router = APIRouter(tags=["estructura_narrativa"])


@router.get("/", response_model=List[schemas.EstructuraNarrativa])
def read_all_estructuras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all narrative structure elements."""
    estructuras = crud.get_all_estructuras(db, skip=skip, limit=limit)
    return estructuras


@router.get("/proyecto/{proyecto_id}", response_model=List[schemas.EstructuraNarrativa])
def read_estructuras(proyecto_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all narrative structure elements for a project."""
    estructuras = crud.get_estructuras(db, proyecto_id=proyecto_id, skip=skip, limit=limit)
    return estructuras


@router.get("/proyecto/{proyecto_id}/acto/{numero_acto}", response_model=List[schemas.EstructuraNarrativa])
def read_escenas_por_acto(proyecto_id: str, numero_acto: int, db: Session = Depends(get_db)):
    """Get all scenes for a specific act."""
    escenas = crud.get_estructuras_by_acto(db, proyecto_id=proyecto_id, numero_acto=numero_acto)
    return escenas


@router.get("/{estructura_id}", response_model=schemas.EstructuraNarrativa)
def read_estructura(estructura_id: str, db: Session = Depends(get_db)):
    """Get a narrative structure element by ID."""
    db_estructura = crud.get_estructura(db, estructura_id=estructura_id)
    if db_estructura is None:
        raise HTTPException(status_code=404, detail="Estructura narrativa no encontrada")
    return db_estructura


@router.post("/proyecto/{proyecto_id}", response_model=schemas.EstructuraNarrativa, status_code=status.HTTP_201_CREATED)
def create_estructura(proyecto_id: str, estructura: schemas.EstructuraNarrativaCreate, db: Session = Depends(get_db)):
    """Create a new narrative structure element for a project."""
    # Verify project exists
    db_proyecto = crud.get_proyecto(db, proyecto_id=proyecto_id)
    if db_proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    return crud.create_estructura(db=db, estructura=estructura, proyecto_id=proyecto_id)


@router.put("/{estructura_id}", response_model=schemas.EstructuraNarrativa)
def update_estructura(estructura_id: str, estructura: schemas.EstructuraNarrativaUpdate, db: Session = Depends(get_db)):
    """Update a narrative structure element."""
    db_estructura = crud.update_estructura(db, estructura_id=estructura_id, estructura=estructura)
    if db_estructura is None:
        raise HTTPException(status_code=404, detail="Estructura narrativa no encontrada")
    return db_estructura


@router.delete("/{estructura_id}", response_model=schemas.EstructuraNarrativa)
def delete_estructura(estructura_id: str, db: Session = Depends(get_db)):
    """Delete a narrative structure element."""
    db_estructura = crud.delete_estructura(db, estructura_id=estructura_id)
    if db_estructura is None:
        raise HTTPException(status_code=404, detail="Estructura narrativa no encontrada")
    return db_estructura
