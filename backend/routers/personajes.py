"""
Router for Personaje endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/personajes", tags=["personajes"])


@router.get("/proyecto/{proyecto_id}", response_model=List[schemas.Personaje])
def read_personajes(proyecto_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all characters for a project."""
    personajes = crud.get_personajes(db, proyecto_id=proyecto_id, skip=skip, limit=limit)
    return personajes


@router.get("/{personaje_id}", response_model=schemas.Personaje)
def read_personaje(personaje_id: str, db: Session = Depends(get_db)):
    """Get a character by ID."""
    db_personaje = crud.get_personaje(db, personaje_id=personaje_id)
    if db_personaje is None:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return db_personaje


@router.post("/proyecto/{proyecto_id}", response_model=schemas.Personaje, status_code=status.HTTP_201_CREATED)
def create_personaje(proyecto_id: str, personaje: schemas.PersonajeCreate, db: Session = Depends(get_db)):
    """Create a new character for a project."""
    # Verify project exists
    db_proyecto = crud.get_proyecto(db, proyecto_id=proyecto_id)
    if db_proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    return crud.create_personaje(db=db, personaje=personaje, proyecto_id=proyecto_id)


@router.put("/{personaje_id}", response_model=schemas.Personaje)
def update_personaje(personaje_id: str, personaje: schemas.PersonajeUpdate, db: Session = Depends(get_db)):
    """Update a character."""
    db_personaje = crud.update_personaje(db, personaje_id=personaje_id, personaje=personaje)
    if db_personaje is None:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return db_personaje


@router.delete("/{personaje_id}", response_model=schemas.Personaje)
def delete_personaje(personaje_id: str, db: Session = Depends(get_db)):
    """Delete a character and update references with markers."""
    db_personaje = crud.delete_personaje(db, personaje_id=personaje_id)
    if db_personaje is None:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return db_personaje
