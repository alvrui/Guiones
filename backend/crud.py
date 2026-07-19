"""
CRUD operations for all database models.
Includes special handling for cascading deletes with markers.
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional, Dict, Any
import json
from datetime import date

from . import models, schemas


# --- Proyecto CRUD ---
def get_proyecto(db: Session, proyecto_id: str) -> Optional[models.Proyecto]:
    """Get a project by ID."""
    return db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()


def get_proyectos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Proyecto]:
    """Get all projects with pagination."""
    return db.query(models.Proyecto).offset(skip).limit(limit).all()


def create_proyecto(db: Session, proyecto: schemas.ProyectoCreate) -> models.Proyecto:
    """Create a new project."""
    db_proyecto = models.Proyecto(
        **proyecto.model_dump(),
        fecha_creacion=date.today(),
        fecha_ultima_modificacion=date.today(),
    )
    db.add(db_proyecto)
    db.commit()
    db.refresh(db_proyecto)
    return db_proyecto


def update_proyecto(db: Session, proyecto_id: str, proyecto: schemas.ProyectoUpdate) -> Optional[models.Proyecto]:
    """Update a project."""
    db_proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not db_proyecto:
        return None
    
    update_data = proyecto.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_proyecto, field, value)
    
    db_proyecto.fecha_ultima_modificacion = date.today()
    db.add(db_proyecto)
    db.commit()
    db.refresh(db_proyecto)
    return db_proyecto


def delete_proyecto(db: Session, proyecto_id: str) -> Optional[models.Proyecto]:
    """Delete a project and all its related data (cascading)."""
    db_proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not db_proyecto:
        return None
    
    db.delete(db_proyecto)
    db.commit()
    return db_proyecto


# --- Personaje CRUD ---
def get_personaje(db: Session, personaje_id: str) -> Optional[models.Personaje]:
    """Get a character by ID."""
    return db.query(models.Personaje).filter(models.Personaje.id == personaje_id).first()


def get_personajes(db: Session, proyecto_id: str, skip: int = 0, limit: int = 100) -> List[models.Personaje]:
    """Get all characters for a project."""
    return db.query(models.Personaje).filter(
        models.Personaje.proyecto_id == proyecto_id
    ).offset(skip).limit(limit).all()


def create_personaje(db: Session, personaje: schemas.PersonajeCreate, proyecto_id: str) -> models.Personaje:
    """Create a new character for a project."""
    db_personaje = models.Personaje(
        **personaje.model_dump(),
        proyecto_id=proyecto_id,
    )
    db.add(db_personaje)
    db.commit()
    db.refresh(db_personaje)
    return db_personaje


def update_personaje(db: Session, personaje_id: str, personaje: schemas.PersonajeUpdate) -> Optional[models.Personaje]:
    """Update a character."""
    db_personaje = db.query(models.Personaje).filter(models.Personaje.id == personaje_id).first()
    if not db_personaje:
        return None
    
    update_data = personaje.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_personaje, field, value)
    
    db.add(db_personaje)
    db.commit()
    db.refresh(db_personaje)
    return db_personaje


def delete_personaje(db: Session, personaje_id: str) -> Optional[models.Personaje]:
    """
    Delete a character and update references in other tables with markers.
    """
    db_personaje = db.query(models.Personaje).filter(models.Personaje.id == personaje_id).first()
    if not db_personaje:
        return None
    
    proyecto_id = db_personaje.proyecto_id
    marker = f"[PERSONAJE BORRADO: {personaje_id}]"
    
    # Update references in Tramas
    tramas = db.query(models.Trama).filter(
        models.Trama.proyecto_id == proyecto_id
    ).all()
    
    for trama in tramas:
        if trama.personajes_involucrados:
            try:
                personajes = json.loads(trama.personajes_involucrados)
                if isinstance(personajes, list) and personaje_id in personajes:
                    personajes = [p if p != personaje_id else marker for p in personajes]
                    trama.personajes_involucrados = json.dumps(personajes)
                    db.add(trama)
            except (json.JSONDecodeError, TypeError):
                # If the field is not valid JSON, skip it
                pass
    
    # Update references in Narrativas
    narrativas = db.query(models.Narrativa).filter(
        models.Narrativa.proyecto_id == proyecto_id
    ).all()
    
    for narrativa in narrativas:
        if narrativa.personajes_involucrados:
            try:
                personajes = json.loads(narrativa.personajes_involucrados)
                if isinstance(personajes, list) and personaje_id in personajes:
                    personajes = [p if p != personaje_id else marker for p in personajes]
                    narrativa.personajes_involucrados = json.dumps(personajes)
                    db.add(narrativa)
            except (json.JSONDecodeError, TypeError):
                pass
    
    # Update references in EstructuraNarrativa
    estructuras = db.query(models.EstructuraNarrativa).filter(
        models.EstructuraNarrativa.proyecto_id == proyecto_id
    ).all()
    
    for estructura in estructuras:
        if estructura.personajes_involucrados:
            try:
                personajes = json.loads(estructura.personajes_involucrados)
                if isinstance(personajes, list) and personaje_id in personajes:
                    personajes = [p if p != personaje_id else marker for p in personajes]
                    estructura.personajes_involucrados = json.dumps(personajes)
                    db.add(estructura)
            except (json.JSONDecodeError, TypeError):
                pass
    
    # Delete the character
    db.delete(db_personaje)
    db.commit()
    return db_personaje


# --- Narrativa CRUD ---
def get_narrativa(db: Session, narrativa_id: str) -> Optional[models.Narrativa]:
    """Get a narrative by ID."""
    return db.query(models.Narrativa).filter(models.Narrativa.id == narrativa_id).first()


def get_narrativas(db: Session, proyecto_id: str, skip: int = 0, limit: int = 100) -> List[models.Narrativa]:
    """Get all narratives for a project."""
    return db.query(models.Narrativa).filter(
        models.Narrativa.proyecto_id == proyecto_id
    ).offset(skip).limit(limit).all()


def create_narrativa(db: Session, narrativa: schemas.NarrativaCreate, proyecto_id: str) -> models.Narrativa:
    """Create a new narrative for a project."""
    db_narrativa = models.Narrativa(
        **narrativa.model_dump(),
        proyecto_id=proyecto_id,
    )
    db.add(db_narrativa)
    db.commit()
    db.refresh(db_narrativa)
    return db_narrativa


def update_narrativa(db: Session, narrativa_id: str, narrativa: schemas.NarrativaUpdate) -> Optional[models.Narrativa]:
    """Update a narrative."""
    db_narrativa = db.query(models.Narrativa).filter(models.Narrativa.id == narrativa_id).first()
    if not db_narrativa:
        return None
    
    update_data = narrativa.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_narrativa, field, value)
    
    db.add(db_narrativa)
    db.commit()
    db.refresh(db_narrativa)
    return db_narrativa


def delete_narrativa(db: Session, narrativa_id: str) -> Optional[models.Narrativa]:
    """
    Delete a narrative and update references in other tables with markers.
    """
    db_narrativa = db.query(models.Narrativa).filter(models.Narrativa.id == narrativa_id).first()
    if not db_narrativa:
        return None
    
    proyecto_id = db_narrativa.proyecto_id
    marker = f"[NARRATIVA BORRADA: {narrativa_id}]"
    
    # Update references in EstructuraNarrativa (if any)
    # Note: Narrativas are not directly referenced in other tables in the current schema
    # But we include this for future extensibility
    
    db.delete(db_narrativa)
    db.commit()
    return db_narrativa


# --- Trama CRUD ---
def get_trama(db: Session, trama_id: str) -> Optional[models.Trama]:
    """Get a plot by ID."""
    return db.query(models.Trama).filter(models.Trama.id == trama_id).first()


def get_tramas(db: Session, proyecto_id: str, skip: int = 0, limit: int = 100) -> List[models.Trama]:
    """Get all plots for a project."""
    return db.query(models.Trama).filter(
        models.Trama.proyecto_id == proyecto_id
    ).offset(skip).limit(limit).all()


def create_trama(db: Session, trama: schemas.TramaCreate, proyecto_id: str) -> models.Trama:
    """Create a new plot for a project."""
    db_trama = models.Trama(
        **trama.model_dump(),
        proyecto_id=proyecto_id,
    )
    db.add(db_trama)
    db.commit()
    db.refresh(db_trama)
    return db_trama


def update_trama(db: Session, trama_id: str, trama: schemas.TramaUpdate) -> Optional[models.Trama]:
    """Update a plot."""
    db_trama = db.query(models.Trama).filter(models.Trama.id == trama_id).first()
    if not db_trama:
        return None
    
    update_data = trama.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_trama, field, value)
    
    db.add(db_trama)
    db.commit()
    db.refresh(db_trama)
    return db_trama


def delete_trama(db: Session, trama_id: str) -> Optional[models.Trama]:
    """
    Delete a plot and update references in other tables with markers.
    """
    db_trama = db.query(models.Trama).filter(models.Trama.id == trama_id).first()
    if not db_trama:
        return None
    
    proyecto_id = db_trama.proyecto_id
    marker = f"[TRAMA BORRADA: {trama_id}]"
    
    # Update references in other Tramas (subtramas)
    tramas = db.query(models.Trama).filter(
        models.Trama.proyecto_id == proyecto_id
    ).all()
    
    for trama in tramas:
        if trama.subtramas:
            try:
                subtramas = json.loads(trama.subtramas)
                if isinstance(subtramas, list) and trama_id in subtramas:
                    subtramas = [t if t != trama_id else marker for t in subtramas]
                    trama.subtramas = json.dumps(subtramas)
                    db.add(trama)
            except (json.JSONDecodeError, TypeError):
                pass
    
    # Update references in EstructuraNarrativa
    estructuras = db.query(models.EstructuraNarrativa).filter(
        models.EstructuraNarrativa.proyecto_id == proyecto_id
    ).all()
    
    for estructura in estructuras:
        if estructura.elementos_narrativos:
            try:
                elementos = json.loads(estructura.elementos_narrativos)
                if isinstance(elementos, list) and trama_id in elementos:
                    elementos = [e if e != trama_id else marker for e in elementos]
                    estructura.elementos_narrativos = json.dumps(elementos)
                    db.add(estructura)
            except (json.JSONDecodeError, TypeError):
                pass
    
    # Delete the plot
    db.delete(db_trama)
    db.commit()
    return db_trama


# --- EstructuraNarrativa CRUD ---
def get_estructura(db: Session, estructura_id: str) -> Optional[models.EstructuraNarrativa]:
    """Get a narrative structure element by ID."""
    return db.query(models.EstructuraNarrativa).filter(
        models.EstructuraNarrativa.id == estructura_id
    ).first()


def get_estructuras(db: Session, proyecto_id: str, skip: int = 0, limit: int = 100) -> List[models.EstructuraNarrativa]:
    """Get all narrative structure elements for a project."""
    return db.query(models.EstructuraNarrativa).filter(
        models.EstructuraNarrativa.proyecto_id == proyecto_id
    ).offset(skip).limit(limit).all()


def get_estructuras_by_acto(db: Session, proyecto_id: str, numero_acto: int) -> List[models.EstructuraNarrativa]:
    """Get all scenes for a specific act."""
    return db.query(models.EstructuraNarrativa).filter(
        and_(
            models.EstructuraNarrativa.proyecto_id == proyecto_id,
            models.EstructuraNarrativa.tipo == "Escena",
            models.EstructuraNarrativa.numero_acto == numero_acto,
        )
    ).order_by(models.EstructuraNarrativa.numero_escena).all()


def create_estructura(db: Session, estructura: schemas.EstructuraNarrativaCreate, proyecto_id: str) -> models.EstructuraNarrativa:
    """Create a new narrative structure element for a project."""
    db_estructura = models.EstructuraNarrativa(
        **estructura.model_dump(),
        proyecto_id=proyecto_id,
    )
    db.add(db_estructura)
    db.commit()
    db.refresh(db_estructura)
    return db_estructura


def update_estructura(db: Session, estructura_id: str, estructura: schemas.EstructuraNarrativaUpdate) -> Optional[models.EstructuraNarrativa]:
    """Update a narrative structure element."""
    db_estructura = db.query(models.EstructuraNarrativa).filter(
        models.EstructuraNarrativa.id == estructura_id
    ).first()
    if not db_estructura:
        return None
    
    update_data = estructura.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_estructura, field, value)
    
    db.add(db_estructura)
    db.commit()
    db.refresh(db_estructura)
    return db_estructura


def delete_estructura(db: Session, estructura_id: str) -> Optional[models.EstructuraNarrativa]:
    """Delete a narrative structure element."""
    db_estructura = db.query(models.EstructuraNarrativa).filter(
        models.EstructuraNarrativa.id == estructura_id
    ).first()
    if not db_estructura:
        return None
    
    db.delete(db_estructura)
    db.commit()
    return db_estructura


# --- Utility Functions ---
def get_proyecto_completo(db: Session, proyecto_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a complete project with all its related data.
    Returns a dictionary with all sections.
    """
    proyecto = get_proyecto(db, proyecto_id)
    if not proyecto:
        return None
    
    return {
        "proyecto": proyecto,
        "personajes": get_personajes(db, proyecto_id),
        "narrativas": get_narrativas(db, proyecto_id),
        "tramas": get_tramas(db, proyecto_id),
        "estructura_narrativa": get_estructuras(db, proyecto_id),
    }


def export_proyecto_to_json(db: Session, proyecto_id: str) -> Optional[Dict[str, Any]]:
    """
    Export a project to a JSON-serializable dictionary.
    """
    completo = get_proyecto_completo(db, proyecto_id)
    if not completo:
        return None
    
    # Convert SQLAlchemy models to dictionaries
    def model_to_dict(model):
        if model is None:
            return None
        return {c.name: getattr(model, c.name) for c in model.__table__.columns}
    
    def list_to_dict(list_of_models):
        if list_of_models is None:
            return None
        return [model_to_dict(m) for m in list_of_models]
    
    return {
        "version": "1.0",
        "proyecto": model_to_dict(completo["proyecto"]),
        "personajes": list_to_dict(completo["personajes"]),
        "narrativas": list_to_dict(completo["narrativas"]),
        "tramas": list_to_dict(completo["tramas"]),
        "estructura_narrativa": list_to_dict(completo["estructura_narrativa"]),
    }


def import_proyecto_from_json(db: Session, data: Dict[str, Any]) -> Optional[models.Proyecto]:
    """
    Import a project from a JSON dictionary.
    Creates a new project with all its related data.
    """
    if "proyecto" not in data:
        return None
    
    proyecto_data = data["proyecto"]
    
    # Create the project
    proyecto_create = schemas.ProyectoCreate(
        titulo=proyecto_data.get("titulo", "Nuevo Proyecto"),
        tipo_narracion=proyecto_data.get("tipo_narracion", "Lineal"),
        estilo=proyecto_data.get("estilo", "Realista"),
        tono_general=proyecto_data.get("tono_general", "Melancólico"),
        sinopsis=proyecto_data.get("sinopsis", ""),
        contexto_historico=proyecto_data.get("contexto_historico"),
        contexto_social=proyecto_data.get("contexto_social"),
        contexto_geografico=proyecto_data.get("contexto_geografico"),
        contexto_cultural=proyecto_data.get("contexto_cultural"),
        entorno_sensorial=proyecto_data.get("entorno_sensorial"),
        temas_principales=proyecto_data.get("temas_principales"),
    )
    
    proyecto = create_proyecto(db, proyecto_create)
    
    # Import personajes
    for p in data.get("personajes", []):
        personaje_create = schemas.PersonajeCreate(
            nombre=p.get("nombre", ""),
            apodo=p.get("apodo"),
            edad=p.get("edad"),
            genero=p.get("genero"),
            trasfondo=p.get("trasfondo", ""),
            objetivos=p.get("objetivos", []),
            motivaciones=p.get("motivaciones", ""),
            conflictos_internos=p.get("conflictos_internos"),
            conflictos_externos=p.get("conflictos_externos"),
            relaciones=p.get("relaciones"),
            arquetipo=p.get("arquetipo"),
            personalidad=p.get("personalidad"),
            evolucion=p.get("evolucion"),
            habilidades=p.get("habilidades"),
            debilidades=p.get("debilidades"),
            apariencia_fisica=p.get("apariencia_fisica"),
            notas_adicionales=p.get("notas_adicionales"),
        )
        create_personaje(db, personaje_create, proyecto.id)
    
    # Import narrativas
    for n in data.get("narrativas", []):
        narrativa_create = schemas.NarrativaCreate(
            titulo=n.get("titulo", ""),
            tipo_estructura=n.get("tipo_estructura", "Lineal"),
            sinopsis=n.get("sinopsis", ""),
            temas_asociados=n.get("temas_asociados"),
            tono=n.get("tono"),
            personajes_involucrados=n.get("personajes_involucrados"),
            conexiones_con_otras_narrativas=n.get("conexiones_con_otras_narrativas"),
            estado=n.get("estado"),
        )
        create_narrativa(db, narrativa_create, proyecto.id)
    
    # Import tramas
    for t in data.get("tramas", []):
        elementos = []
        for e in t.get("elementos_narrativos", []):
            if isinstance(e, dict):
                elementos.append(schemas.ElementoNarrativoSchema(
                    tipo=e.get("tipo", "Conflicto"),
                    descripcion=e.get("descripcion", ""),
                ))
        
        trama_create = schemas.TramaCreate(
            titulo=t.get("titulo", ""),
            arquetipo_narrativo=t.get("arquetipo_narrativo", "Viaje del Héroe"),
            elementos_narrativos=elementos,
            personajes_involucrados=t.get("personajes_involucrados", []),
            subtramas=t.get("subtramas"),
            obstaculos=t.get("obstaculos"),
            estado=t.get("estado"),
            notas=t.get("notas"),
        )
        create_trama(db, trama_create, proyecto.id)
    
    # Import estructura narrativa
    for e in data.get("estructura_narrativa", []):
        estructura_create = schemas.EstructuraNarrativaCreate(
            tipo=e.get("tipo", "Escena"),
            titulo=e.get("titulo", ""),
            numero_acto=e.get("numero_acto"),
            numero_escena=e.get("numero_escena"),
            elementos_narrativos=e.get("elementos_narrativos"),
            personajes_involucrados=e.get("personajes_involucrados"),
            ubicacion=e.get("ubicacion"),
            texto_escena=e.get("texto_escena"),
            duracion_estimada=e.get("duracion_estimada"),
            notas_direccion=e.get("notas_direccion"),
            estado=e.get("estado"),
        )
        create_estructura(db, estructura_create, proyecto.id)
    
    return proyecto
