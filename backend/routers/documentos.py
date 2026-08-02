"""
Router for Documento endpoints.
"""

import os
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import schemas, crud
from ..database import get_db

router = APIRouter(tags=["documentos"])


# Configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_TYPES = {".txt", ".md", ".pdf", ".docx"}

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/proyectos/{proyecto_id}/documentos", response_model=List[schemas.Documento])
def read_documentos(proyecto_id: str, db: Session = Depends(get_db)):
    """Get all documents for a project."""
    documentos = crud.get_documentos_by_proyecto(db, proyecto_id=proyecto_id)
    return documentos


@router.post("/proyectos/{proyecto_id}/documentos", response_model=schemas.Documento, status_code=status.HTTP_201_CREATED)
async def create_documento(
    proyecto_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a document for a project."""
    # Validate project exists
    proyecto = crud.get_proyecto(db, proyecto_id=proyecto_id)
    if proyecto is None:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Validate file type
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de archivo no soportado. Tipos permitidos: {', '.join(sorted(ALLOWED_TYPES))}"
        )

    # Validate file size
    file_size = 0
    # Read file content to check size and extract text
    try:
        content = await file.read()
        file_size = len(content)
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Archivo demasiado grande. Máximo {MAX_FILE_SIZE // (1024*1024)}MB"
            )

        # Extract text content based on file type
        texto_contenido = extract_text_from_file(content, file_ext)

        # Create document
        documento = schemas.DocumentoCreate(
            proyecto_id=proyecto_id,
            nombre=file.filename,
            tipo=file_ext[1:],  # Remove dot
            contenido=texto_contenido,
            tamano_bytes=file_size,
            ruta_archivo=f"{UPLOAD_DIR}/{file.filename}"
        )

        return crud.create_documento(db=db, documento=documento)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando el archivo: {str(e)}"
        )


@router.get("/documentos/{documento_id}", response_model=schemas.Documento)
def read_documento(documento_id: str, db: Session = Depends(get_db)):
    """Get a document by ID."""
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return db_documento


@router.delete("/documentos/{documento_id}", response_model=schemas.Documento)
def delete_documento(documento_id: str, db: Session = Depends(get_db)):
    """Delete a document."""
    db_documento = crud.delete_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    # Clean up file if it exists
    try:
        if db_documento.ruta_archivo and os.path.exists(db_documento.ruta_archivo):
            os.remove(db_documento.ruta_archivo)
    except Exception as e:
        print(f"Error deleting file: {e}")
    
    return db_documento


def extract_text_from_file(content: bytes, file_ext: str) -> str:
    """Extract text content from file based on its type."""
    try:
        if file_ext == ".txt":
            return content.decode("utf-8", errors="replace")
        elif file_ext == ".md":
            return content.decode("utf-8", errors="replace")
        elif file_ext == ".pdf":
            # Simple PDF text extraction (basic)
            text = content.decode("latin-1", errors="replace")
            # Remove binary characters and keep readable text
            return "".join(c if 32 <= ord(c) <= 126 else " " for c in text)
        elif file_ext == ".docx":
            # DOCX is a zip file with XML content
            # Simple extraction - in production, use python-docx library
            text = content.decode("utf-8", errors="replace")
            return "".join(c if 32 <= ord(c) <= 126 else " " for c in text)
        else:
            return content.decode("utf-8", errors="replace")
    except Exception:
        return "[Contenido no legible]"
