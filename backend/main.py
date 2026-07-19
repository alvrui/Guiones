"""
FastAPI Application for Guiones
Main entry point for the backend server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from .routers import (
    proyectos,
    personajes,
    narrativas,
    tramas,
    estructura,
)
from .routers import (
    ai_character,
    ai_plot,
    ai_scene,
    ai_narrative,
)

# Create FastAPI app
app = FastAPI(
    title="Guiones API",
    description="Backend para la aplicación de creación de guiones con asistencia de IA.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration (allow frontend to access backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Proyecto routes
app.include_router(proyectos.router, prefix="/api/proyectos", tags=["proyectos"])

# Personaje routes
app.include_router(personajes.router, prefix="/api/personajes", tags=["personajes"])

# Narrativa routes
app.include_router(narrativas.router, prefix="/api/narrativas", tags=["narrativas"])

# Trama routes
app.include_router(tramas.router, prefix="/api/tramas", tags=["tramas"])

# Estructura Narrativa routes
app.include_router(estructura.router, prefix="/api/estructura", tags=["estructura_narrativa"])

# AI Character routes
app.include_router(ai_character.router, prefix="/api/ai/character", tags=["IA - Personajes"])

# AI Plot routes
app.include_router(ai_plot.router, prefix="/api/ai/plot", tags=["IA - Tramas"])

# AI Scene routes
app.include_router(ai_scene.router, prefix="/api/ai/scene", tags=["IA - Escenas"])

# AI Narrative routes
app.include_router(ai_narrative.router, prefix="/api/ai/narrative", tags=["IA - Narrativas"])


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Bienvenido a la API de Guiones",
        "documentation": "/docs",
        "version": "1.0.0",
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
