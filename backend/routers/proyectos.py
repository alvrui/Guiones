"""
Router for Proyecto endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json

from .. import schemas, crud
from ..database import get_db

router = APIRouter(tags=["proyectos"])


@router.get("/", response_model=List[schemas.Proyecto])
def read_proyectos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all projects."""
    proyectos = crud.get_proyectos(db, skip=skip, limit=limit)
    return proyectos


@router.get("/{proyecto_id}", response_model=schemas.Proyecto)
def read_proyecto(proyecto_id: str, db: Session = Depends(get_db)):
    """Get a project by ID."""
    db_proyecto = crud.get_proyecto(db, proyecto_id=proyecto_id)
    if db_proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return db_proyecto


@router.post("/", response_model=schemas.Proyecto, status_code=status.HTTP_201_CREATED)
def create_proyecto(proyecto: schemas.ProyectoCreate, db: Session = Depends(get_db)):
    """Create a new project."""
    return crud.create_proyecto(db=db, proyecto=proyecto)


@router.put("/{proyecto_id}", response_model=schemas.Proyecto)
def update_proyecto(proyecto_id: str, proyecto: schemas.ProyectoUpdate, db: Session = Depends(get_db)):
    """Update a project."""
    db_proyecto = crud.update_proyecto(db, proyecto_id=proyecto_id, proyecto=proyecto)
    if db_proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return db_proyecto


@router.delete("/{proyecto_id}", response_model=schemas.Proyecto)
def delete_proyecto(proyecto_id: str, db: Session = Depends(get_db)):
    """Delete a project and all its related data."""
    db_proyecto = crud.delete_proyecto(db, proyecto_id=proyecto_id)
    if db_proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return db_proyecto


@router.get("/{proyecto_id}/completo")
def get_proyecto_completo(proyecto_id: str, db: Session = Depends(get_db)):
    """Get a complete project with all its related data."""
    completo = crud.get_proyecto_completo(db, proyecto_id=proyecto_id)
    if completo is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Convert to JSON-serializable format
    def model_to_dict(model):
        if model is None:
            return None
        return {c.name: getattr(model, c.name) for c in model.__table__.columns}
    
    def list_to_dict(list_of_models):
        if list_of_models is None:
            return None
        return [model_to_dict(m) for m in list_of_models]
    
    result = {
        "version": "1.0",
        "proyecto": model_to_dict(completo["proyecto"]),
        "personajes": list_to_dict(completo["personajes"]),
        "narrativas": list_to_dict(completo["narrativas"]),
        "tramas": list_to_dict(completo["tramas"]),
        "estructura_narrativa": list_to_dict(completo["estructura_narrativa"]),
    }
    
    return result


@router.get("/{proyecto_id}/export")
def export_proyecto(proyecto_id: str, db: Session = Depends(get_db)):
    """Export a project to JSON format."""
    json_data = crud.export_proyecto_to_json(db, proyecto_id=proyecto_id)
    if json_data is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return json_data


@router.post("/import", response_model=schemas.Proyecto, status_code=status.HTTP_201_CREATED)
def import_proyecto(data: Dict[str, Any], db: Session = Depends(get_db)):
    """Import a project from JSON format."""
    proyecto = crud.import_proyecto_from_json(db, data=data)
    if proyecto is None:
        raise HTTPException(status_code=400, detail="Datos de importaci\u00f3n inv\u00e1lidos")
    return proyecto
