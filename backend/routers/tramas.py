"""
Router for Trama endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, crud
from ..database import get_db

router = APIRouter(prefix="/tramas", tags=["tramas"])


@router.get("/proyecto/{proyecto_id}", response_model=List[schemas.Trama])
def read_tramas(proyecto_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all plots for a project."""
    tramas = crud.get_tramas(db, proyecto_id=proyecto_id, skip=skip, limit=limit)
    return tramas


@router.get("/{trama_id}", response_model=schemas.Trama)
def read_trama(trama_id: str, db: Session = Depends(get_db)):
    """Get a plot by ID."""
    db_trama = crud.get_trama(db, trama_id=trama_id)
    if db_trama is None:
        raise HTTPException(status_code=404, detail="Trama no encontrada")
    return db_trama


@router.post("/proyecto/{proyecto_id}", response_model=schemas.Trama, status_code=status.HTTP_201_CREATED)
def create_trama(proyecto_id: str, trama: schemas.TramaCreate, db: Session = Depends(get_db)):
    """Create a new plot for a project."""
    # Verify project exists
    db_proyecto = crud.get_proyecto(db, proyecto_id=proyecto_id)
    if db_proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    return crud.create_trama(db=db, trama=trama, proyecto_id=proyecto_id)


@router.put("/{trama_id}", response_model=schemas.Trama)
def update_trama(trama_id: str, trama: schemas.TramaUpdate, db: Session = Depends(get_db)):
    """Update a plot."""
    db_trama = crud.update_trama(db, trama_id=trama_id, trama=trama)
    if db_trama is None:
        raise HTTPException(status_code=404, detail="Trama no encontrada")
    return db_trama


@router.delete("/{trama_id}", response_model=schemas.Trama)
def delete_trama(trama_id: str, db: Session = Depends(get_db)):
    """Delete a plot and update references with markers."""
    db_trama = crud.delete_trama(db, trama_id=trama_id)
    if db_trama is None:
        raise HTTPException(status_code=404, detail="Trama no encontrada")
    return db_trama
