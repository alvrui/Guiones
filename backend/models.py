"""
SQLAlchemy models for the Guiones database.
Defines the tables: proyectos, personajes, narrativas, tramas, estructura_narrativa.
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, JSON, Enum
from .database import Base
import uuid


# Enums for SQLAlchemy (SQLite doesn't have native ENUM, so we use String with constraints)
class TipoNarracion:
    VALUES = [
        "Lineal",
        "No lineal",
        "Circular",
        "Episódica",
        "Modular",
        "In media res",
        "Frame narrative",
        "Interactiva",
    ]


class Estilo:
    VALUES = [
        "Realista",
        "Surrealista",
        "Fantástico",
        "Ciencia ficción",
        "Noir",
        "Satírico",
        "Poético",
        "Minimalista",
        "Experimental",
        "Magic realism",
        "Pulp",
        "Cyberpunk",
        "Steampunk",
        "Gótico",
        "Hardboiled",
    ]


class TonoGeneral:
    VALUES = [
        "Melancólico",
        "Irónico",
        "Trágico",
        "Cómico",
        "Satírico",
        "Esperanzador",
        "Oscuro",
        "Ligero",
        "Suspense",
        "Bildungsroman",
        "Absurdo",
        "Nostalógico",
        "Cínico",
        "Épico",
    ]


class GeneroPrincipal:
    VALUES = [
        "Drama",
        "Comedia",
        "Acción",
        "Terror",
        "Romance",
        "Aventura",
        "Misterio",
        "Ciencia ficción",
        "Fantasía",
        "Thriller",
        "Western",
        "Noir",
        "Docuficción",
        "Ficción histórica",
        "Distopía",
        "Utopía",
    ]


class EstructuraNarrativaBase:
    VALUES = [
        "Tres actos",
        "Viaje del héroe",
        "Save the Cat",
        "Seven-Point Story Structure",
        "Freytag's Pyramid",
        "In Medias Res",
        "Non-linear",
        "Circular",
        "Parallel Narratives",
    ]


class Genero:
    VALUES = ["Hombre", "Mujer", "No binario", "Otro"]


class Arquetipo:
    VALUES = [
        "Héroe",
        "Mentor",
        "Antagonista",
        "Aliado",
        "Víctima",
        "Trickster",
        "Guardian",
        "Explorador",
    ]


class ArquetipoNarrativo:
    VALUES = [
        "Viaje del Héroe",
        "Tragedia",
        "Comedia",
        "Búsqueda",
        "Aventura",
        "Misterio",
        "Romance",
        "Supervivencia",
    ]


class TipoEstructura:
    VALUES = ["Lineal", "Episódica", "Temática", "Circular", "Asociativa"]


class Estado:
    VALUES = ["Borrador", "En Desarrollo", "Completada", "Idea", "Revisión", "Finalizada"]


class TipoEstructuraNarrativa:
    VALUES = ["Acto", "Escena"]


# Models
class Proyecto(Base):
    """Model for the Proyecto table."""
    __tablename__ = "proyectos"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    titulo = Column(String(255), nullable=False)
    tipo_narracion = Column(String(50), nullable=False)
    estilo = Column(String(50), nullable=False)
    tono_general = Column(String(50), nullable=False)
    sinopsis = Column(Text, nullable=False)
    contexto_historico = Column(Text)
    contexto_social = Column(Text)
    contexto_geografico = Column(Text)
    contexto_ambiental = Column(Text)
    temas_principales = Column(JSON)  # List of strings
    genero_principal = Column(String(50))
    estructura_narrativa_base = Column(String(100))
    inspiraciones_referencias = Column(Text)
    restricciones_limitaciones = Column(Text)
    palabras_clave = Column(JSON)  # List of strings
    fecha_creacion = Column(Date)
    fecha_ultima_modificacion = Column(Date)

    def __repr__(self):
        return f"<Proyecto(id={self.id}, titulo='{self.titulo}')>"


class Personaje(Base):
    """Model for the Personajes table."""
    __tablename__ = "personajes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    proyecto_id = Column(String(36), ForeignKey("proyectos.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(255), nullable=False)
    apodo = Column(String(255))
    edad = Column(Integer)
    genero = Column(String(50))
    trasfondo = Column(Text, nullable=False)
    objetivos = Column(JSON)  # List of strings
    motivaciones = Column(Text, nullable=False)
    conflictos_internos = Column(Text)
    conflictos_externos = Column(Text)
    relaciones = Column(JSON)  # List of dicts: [{"nombre": str, "relacion": str, "id": str}]
    arquetipo = Column(String(50))
    personalidad = Column(Text)
    evolucion = Column(Text)
    habilidades = Column(JSON)  # List of strings
    debilidades = Column(JSON)  # List of strings
    apariencia_fisica = Column(Text)
    notas_adicionales = Column(Text)

    def __repr__(self):
        return f"<Personaje(id={self.id}, nombre='{self.nombre}')>"


class Narrativa(Base):
    """Model for the Narrativas table."""
    __tablename__ = "narrativas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    proyecto_id = Column(String(36), ForeignKey("proyectos.id", ondelete="CASCADE"), nullable=False)
    titulo = Column(String(255), nullable=False)
    tipo_estructura = Column(String(50), nullable=False)
    temas_asociados = Column(JSON)  # List of strings
    tono = Column(String(50))
    sinopsis = Column(Text, nullable=False)
    personajes_involucrados = Column(JSON)  # List of strings (IDs)
    conexiones_con_otras_narrativas = Column(Text)
    estado = Column(String(50))

    def __repr__(self):
        return f"<Narrativa(id={self.id}, titulo='{self.titulo}')>"


class Trama(Base):
    """Model for the Tramas table."""
    __tablename__ = "tramas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    proyecto_id = Column(String(36), ForeignKey("proyectos.id", ondelete="CASCADE"), nullable=False)
    titulo = Column(String(255), nullable=False)
    arquetipo_narrativo = Column(String(50), nullable=False)
    elementos_narrativos = Column(JSON)  # List of dicts: [{"tipo": str, "descripcion": str}]
    subtramas = Column(JSON)  # List of strings (IDs)
    personajes_involucrados = Column(JSON)  # List of strings (IDs)
    obstaculos = Column(JSON)  # List of strings
    estado = Column(String(50))
    notas = Column(Text)

    def __repr__(self):
        return f"<Trama(id={self.id}, titulo='{self.titulo}')>"


class EstructuraNarrativa(Base):
    """Model for the EstructuraNarrativa table (Actos y Escenas)."""
    __tablename__ = "estructura_narrativa"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    proyecto_id = Column(String(36), ForeignKey("proyectos.id", ondelete="CASCADE"), nullable=False)
    tipo = Column(String(50), nullable=False)  # "Acto" or "Escena"
    titulo = Column(String(255), nullable=False)
    numero_acto = Column(Integer)  # NULL if tipo == "Escena"
    numero_escena = Column(Integer)  # NULL if tipo == "Acto"
    elementos_narrativos = Column(JSON)  # List of strings (IDs of Tramas)
    personajes_involucrados = Column(JSON)  # List of strings (IDs of Personajes)
    ubicacion = Column(Text)
    texto_escena = Column(Text)  # Only for Escenas
    duracion_estimada = Column(String(50))  # e.g., "5 minutos"
    notas_direccion = Column(Text)
    estado = Column(String(50))

    def __repr__(self):
        return f"<EstructuraNarrativa(id={self.id}, tipo='{self.tipo}', titulo='{self.titulo}')>"


class Documento(Base):
    """Model for the Documentos table."""
    __tablename__ = "documentos"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    proyecto_id = Column(String(36), ForeignKey("proyectos.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(255), nullable=False)
    tipo = Column(String(50), nullable=False)  # pdf, txt, docx, md, otro
    contenido = Column(Text, nullable=False)
    tamano_bytes = Column(Integer)
    ruta_archivo = Column(String(500))
    fecha_subida = Column(Date, default=datetime.now)

    def __repr__(self):
        return f"<Documento(id={self.id}, nombre='{self.nombre}')>"
