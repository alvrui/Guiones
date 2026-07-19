"""
FastAPI Application for Guiones
Main entry point for the backend server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


# Import and include routers (will be added in future steps)
# from .routers import proyectos, personajes, narrativas, tramas, estructura
# app.include_router(proyectos.router, prefix="/api/proyectos", tags=["proyectos"])
# app.include_router(personajes.router, prefix="/api/personajes", tags=["personajes"])
# app.include_router(narrativas.router, prefix="/api/narrativas", tags=["narrativas"])
# app.include_router(tramas.router, prefix="/api/tramas", tags=["tramas"])
# app.include_router(estructura.router, prefix="/api/estructura", tags=["estructura"])

# Import and include AI routers (will be added in future steps)
# from .agents import character_router, plot_router, scene_router, narrative_router
# app.include_router(character_router, prefix="/api/ai/character", tags=["IA - Personajes"])
# app.include_router(plot_router, prefix="/api/ai/plot", tags=["IA - Tramas"])
# app.include_router(scene_router, prefix="/api/ai/scene", tags=["IA - Escenas"])
# app.include_router(narrative_router, prefix="/api/ai/narrative", tags=["IA - Narrativas"])
