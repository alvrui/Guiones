"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any, Union
from datetime import date
from enum import Enum


# Enums for Pydantic
class TipoNarracion(str, Enum):
    LINEAL = "Lineal"
    NO_LINEAL = "No lineal"
    IN_MEDIA_RES = "In media res"
    PARALELA = "Paralela"
    EPISODICA = "Episódica"
    CIRCULAR = "Circular"
    ASOCIATIVA = "Asociativa"


class Estilo(str, Enum):
    REALISTA = "Realista"
    SURREALISTA = "Surrealista"
    EPICO = "Épico"
    SATIRA = "Sátira"
    FABULA = "Fábula"
    DRAMA = "Drama"
    COMEDIA = "Comedia"
    TERROR = "Terror"
    AVENTURA = "Aventura"
    CIENCIA_FICCION = "Ciencia ficción"
    FANTASIA = "Fantasía"


class TonoGeneral(str, Enum):
    OSCURO = "Oscuro"
    LIGERO = "Ligero"
    MELANCOLICO = "Melancólico"
    ESPERANZADOR = "Esperanzador"
    IRONICO = "Irónico"
    SUSPENSE = "Suspense"
    TENSO = "Tenso"
    COMICO = "Cómico"


class Genero(str, Enum):
    HOMBRE = "Hombre"
    MUJER = "Mujer"
    NO_BINARIO = "No binario"
    OTRO = "Otro"


class Arquetipo(str, Enum):
    HEROE = "Héroe"
    MENTOR = "Mentor"
    ANTAGONISTA = "Antagonista"
    ALIADO = "Aliado"
    VICTIMA = "Víctima"
    TRICKSTER = "Trickster"
    GUARDIAN = "Guardian"
    EXPLORADOR = "Explorador"


class ArquetipoNarrativo(str, Enum):
    VIAJE_DEL_HEROE = "Viaje del Héroe"
    TRAGEDIA = "Tragedia"
    COMEDIA = "Comedia"
    BUSQUEDA = "Búsqueda"
    AVENTURA = "Aventura"
    MISTERIO = "Misterio"
    ROMANCE = "Romance"
    SUPERVIVENCIA = "Supervivencia"


class TipoEstructura(str, Enum):
    LINEAL = "Lineal"
    EPISODICA = "Episódica"
    TEMATICA = "Temática"
    CIRCULAR = "Circular"
    ASOCIATIVA = "Asociativa"


class Estado(str, Enum):
    BORRADOR = "Borrador"
    EN_DESARROLLO = "En Desarrollo"
    COMPLETADA = "Completada"
    IDEA = "Idea"
    REVISION = "Revisión"
    FINALIZADA = "Finalizada"


class TipoEstructuraNarrativa(str, Enum):
    ACTO = "Acto"
    ESCENA = "Escena"


class ElementoNarrativo(str, Enum):
    CONFLICTO = "Conflicto"
    REVELACION = "Revelación"
    CLIMAX = "Clímax"
    GIRO_ARGUMENTAL = "Giro Argumental"
    EXPOSICION = "Exposición"
    DESARROLLO = "Desarrollo"
    RESOLUCION = "Resolución"


# --- Schemas for Proyecto ---
class ProyectoBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=255, description="Nombre del proyecto")
    tipo_narracion: TipoNarracion = Field(..., description="Tipo de narración")
    estilo: Estilo = Field(..., description="Estilo narrativo")
    tono_general: TonoGeneral = Field(..., description="Tono emocional general")
    sinopsis: str = Field(..., min_length=10, description="Resumen breve de la historia")
    contexto_historico: Optional[str] = Field(None, description="Contexto histórico")
    contexto_social: Optional[str] = Field(None, description="Contexto social")
    contexto_geografico: Optional[str] = Field(None, description="Contexto geográfico")
    contexto_cultural: Optional[str] = Field(None, description="Contexto cultural")
    entorno_sensorial: Optional[str] = Field(None, description="Entorno sensorial")
    temas_principales: Optional[List[str]] = Field(None, description="Temas principales")
    fecha_creacion: Optional[date] = Field(None, description="Fecha de creación")
    fecha_ultima_modificacion: Optional[date] = Field(None, description="Fecha de última modificación")


class ProyectoCreate(ProyectoBase):
    pass


class ProyectoUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=1, max_length=255)
    tipo_narracion: Optional[TipoNarracion] = None
    estilo: Optional[Estilo] = None
    tono_general: Optional[TonoGeneral] = None
    sinopsis: Optional[str] = Field(None, min_length=10)
    contexto_historico: Optional[str] = None
    contexto_social: Optional[str] = None
    contexto_geografico: Optional[str] = None
    contexto_cultural: Optional[str] = None
    entorno_sensorial: Optional[str] = None
    temas_principales: Optional[List[str]] = None


class Proyecto(ProyectoBase):
    id: str = Field(..., description="UUID del proyecto")

    class Config:
        from_attributes = True


# --- Schemas for Personaje ---
class Relacion(BaseModel):
    nombre: str = Field(..., description="Nombre del personaje relacionado")
    relacion: str = Field(..., description="Tipo de relación")
    id: str = Field(..., description="ID del personaje relacionado")


class PersonajeBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255, description="Nombre del personaje")
    trasfondo: str = Field(..., min_length=10, description="Historia personal del personaje")
    objetivos: List[str] = Field(..., min_length=1, description="Metas del personaje")
    motivaciones: str = Field(..., min_length=10, description="Razones que impulsan al personaje")
    apodo: Optional[str] = Field(None, max_length=255, description="Apodo en la historia")
    edad: Optional[int] = Field(None, ge=0, le=150, description="Edad del personaje")
    genero: Optional[Genero] = Field(None, description="Género del personaje")
    conflictos_internos: Optional[str] = Field(None, description="Luchas psicológicas")
    conflictos_externos: Optional[str] = Field(None, description="Obstáculos físicos/sociales")
    relaciones: Optional[List[Relacion]] = Field(None, description="Relaciones con otros personajes")
    arquetipo: Optional[Arquetipo] = Field(None, description="Arquetipo del personaje")
    personalidad: Optional[str] = Field(None, description="Rasgos de carácter")
    evolucion: Optional[str] = Field(None, description="Cambios a lo largo de la historia")
    habilidades: Optional[List[str]] = Field(None, description="Capacidades del personaje")
    debilidades: Optional[List[str]] = Field(None, description="Puntos débiles")
    apariencia_fisica: Optional[str] = Field(None, description="Descripción física")
    notas_adicionales: Optional[str] = Field(None, description="Notas adicionales")


class PersonajeCreate(PersonajeBase):
    pass


class PersonajeUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=255)
    apodo: Optional[str] = Field(None, max_length=255)
    edad: Optional[int] = Field(None, ge=0, le=150)
    genero: Optional[Genero] = None
    trasfondo: Optional[str] = Field(None, min_length=10)
    objetivos: Optional[List[str]] = Field(None, min_length=1)
    motivaciones: Optional[str] = Field(None, min_length=10)
    conflictos_internos: Optional[str] = None
    conflictos_externos: Optional[str] = None
    relaciones: Optional[List[Relacion]] = None
    arquetipo: Optional[Arquetipo] = None
    personalidad: Optional[str] = None
    evolucion: Optional[str] = None
    habilidades: Optional[List[str]] = None
    debilidades: Optional[List[str]] = None
    apariencia_fisica: Optional[str] = None
    notas_adicionales: Optional[str] = None


class Personaje(PersonajeBase):
    id: str = Field(..., description="UUID del personaje")
    proyecto_id: str = Field(..., description="ID del proyecto al que pertenece")

    class Config:
        from_attributes = True


# --- Schemas for Narrativa ---
class NarrativaBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=255, description="Nombre de la narrativa")
    tipo_estructura: TipoEstructura = Field(..., description="Tipo de estructura narrativa")
    sinopsis: str = Field(..., min_length=10, description="Resumen de la narrativa")
    temas_asociados: Optional[List[str]] = Field(None, description="Temas asociados")
    tono: Optional[str] = Field(None, description="Tono emocional")
    personajes_involucrados: Optional[List[str]] = Field(None, description="IDs de personajes involucrados")
    conexiones_con_otras_narrativas: Optional[str] = Field(None, description="Conexiones con otras narrativas")
    estado: Optional[Estado] = Field(None, description="Estado de la narrativa")


class NarrativaCreate(NarrativaBase):
    pass


class NarrativaUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=1, max_length=255)
    tipo_estructura: Optional[TipoEstructura] = None
    sinopsis: Optional[str] = Field(None, min_length=10)
    temas_asociados: Optional[List[str]] = None
    tono: Optional[str] = None
    personajes_involucrados: Optional[List[str]] = None
    conexiones_con_otras_narrativas: Optional[str] = None
    estado: Optional[Estado] = None


class Narrativa(NarrativaBase):
    id: str = Field(..., description="UUID de la narrativa")
    proyecto_id: str = Field(..., description="ID del proyecto al que pertenece")

    class Config:
        from_attributes = True


# --- Schemas for Trama ---
class ElementoNarrativoSchema(BaseModel):
    tipo: ElementoNarrativo = Field(..., description="Tipo de elemento narrativo")
    descripcion: str = Field(..., min_length=5, description="Descripción del elemento")


class TramaBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=255, description="Nombre de la trama")
    arquetipo_narrativo: ArquetipoNarrativo = Field(..., description="Arquetipo de la trama")
    elementos_narrativos: List[ElementoNarrativoSchema] = Field(..., min_length=1, description="Elementos clave de la trama")
    personajes_involucrados: List[str] = Field(..., min_length=1, description="IDs de personajes involucrados")
    subtramas: Optional[List[str]] = Field(None, description="IDs de subtramas")
    obstaculos: Optional[List[str]] = Field(None, description="Obstáculos en la trama")
    estado: Optional[Estado] = Field(None, description="Estado de la trama")
    notas: Optional[str] = Field(None, description="Notas adicionales")


class TramaCreate(TramaBase):
    pass


class TramaUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=1, max_length=255)
    arquetipo_narrativo: Optional[ArquetipoNarrativo] = None
    elementos_narrativos: Optional[List[ElementoNarrativoSchema]] = None
    personajes_involucrados: Optional[List[str]] = None
    subtramas: Optional[List[str]] = None
    obstaculos: Optional[List[str]] = None
    estado: Optional[Estado] = None
    notas: Optional[str] = None


class Trama(TramaBase):
    id: str = Field(..., description="UUID de la trama")
    proyecto_id: str = Field(..., description="ID del proyecto al que pertenece")

    class Config:
        from_attributes = True


# --- Schemas for EstructuraNarrativa ---
class EstructuraNarrativaBase(BaseModel):
    tipo: TipoEstructuraNarrativa = Field(..., description="Tipo: Acto o Escena")
    titulo: str = Field(..., min_length=1, max_length=255, description="Nombre del acto/escena")
    numero_acto: Optional[int] = Field(None, ge=1, description="Número del acto (solo para Acto)")
    numero_escena: Optional[int] = Field(None, ge=1, description="Número de escena (solo para Escena)")
    elementos_narrativos: Optional[List[str]] = Field(None, description="IDs de tramas asociadas")
    personajes_involucrados: Optional[List[str]] = Field(None, description="IDs de personajes involucrados")
    ubicacion: Optional[str] = Field(None, description="Ubicación de la escena")
    texto_escena: Optional[str] = Field(None, description="Texto de la escena (solo para Escena)")
    duracion_estimada: Optional[str] = Field(None, description="Duración estimada")
    notas_direccion: Optional[str] = Field(None, description="Notas de dirección")
    estado: Optional[Estado] = Field(None, description="Estado")

    @field_validator('numero_acto', 'numero_escena')
    @classmethod
    def validate_numero(cls, v, info):
        if info.field_name == 'numero_escena' and info.data.get('tipo') == 'Acto' and v is not None:
            raise ValueError('numero_escena debe ser None para Acto')
        if info.field_name == 'numero_acto' and info.data.get('tipo') == 'Escena' and v is not None:
            raise ValueError('numero_acto debe ser None para Escena')
        return v


class EstructuraNarrativaCreate(EstructuraNarrativaBase):
    pass


class EstructuraNarrativaUpdate(BaseModel):
    tipo: Optional[TipoEstructuraNarrativa] = None
    titulo: Optional[str] = Field(None, min_length=1, max_length=255)
    numero_acto: Optional[int] = Field(None, ge=1)
    numero_escena: Optional[int] = Field(None, ge=1)
    elementos_narrativos: Optional[List[str]] = None
    personajes_involucrados: Optional[List[str]] = None
    ubicacion: Optional[str] = None
    texto_escena: Optional[str] = None
    duracion_estimada: Optional[str] = None
    notas_direccion: Optional[str] = None
    estado: Optional[Estado] = None


class EstructuraNarrativa(EstructuraNarrativaBase):
    id: str = Field(..., description="UUID de la estructura narrativa")
    proyecto_id: str = Field(..., description="ID del proyecto al que pertenece")

    class Config:
        from_attributes = True


# --- AI Generation Schemas ---
class AIRequest(BaseModel):
    """Request schema for AI generation."""
    context: Dict[str, Any] = Field(..., description="Contexto para generar el contenido")


class AIResponse(BaseModel):
    """Response schema for AI generation."""
    content: str = Field(..., description="Contenido generado por la IA")
    model: str = Field(..., description="Modelo de IA utilizado")
    prompt: Optional[str] = Field(None, description="Prompt utilizado")


# --- Message Schemas ---
class Message(BaseModel):
    """Base schema for success/error messages."""
    message: str


class ErrorMessage(Message):
    """Error message schema."""
    detail: Optional[str] = None
