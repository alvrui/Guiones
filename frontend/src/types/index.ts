// Types for the Guiones application

// Enums for TypeScript
export type TipoNarracion = "Lineal" | "No lineal" | "In media res" | "Paralela" | "Episódica" | "Circular" | "Asociativa";
export type Estilo = "Realista" | "Surrealista" | "Épico" | "Sátira" | "Fábula" | "Drama" | "Comedia" | "Terror" | "Aventura" | "Ciencia ficción" | "Fantasía";
export type TonoGeneral = "Oscuro" | "Ligero" | "Melancólico" | "Esperanzador" | "Irónico" | "Suspense" | "Tenso" | "Cómico";
export type Genero = "Hombre" | "Mujer" | "No binario" | "Otro";
export type Arquetipo = "Héroe" | "Mentor" | "Antagonista" | "Aliado" | "Víctima" | "Trickster" | "Guardian" | "Explorador";
export type ArquetipoNarrativo = "Viaje del Héroe" | "Tragedia" | "Comedia" | "Búsqueda" | "Aventura" | "Misterio" | "Romance" | "Supervivencia";
export type TipoEstructura = "Lineal" | "Episódica" | "Temática" | "Circular" | "Asociativa";
export type Estado = "Borrador" | "En Desarrollo" | "Completada" | "Idea" | "Revisión" | "Finalizada";
export type TipoEstructuraNarrativa = "Acto" | "Escena";
export type ElementoNarrativo = "Conflicto" | "Revelación" | "Clímax" | "Giro Argumental" | "Exposición" | "Desarrollo" | "Resolución";

// Interfaces for Proyecto
export interface Proyecto {
  id: string;
  titulo: string;
  tipo_narracion: TipoNarracion;
  estilo: Estilo;
  contexto_historico?: string;
  contexto_social?: string;
  contexto_geografico?: string;
  contexto_cultural?: string;
  entorno_sensorial?: string;
  tono_general: TonoGeneral;
  temas_principales?: string[];
  sinopsis: string;
  fecha_creacion?: string;
  fecha_ultima_modificacion?: string;
}

export interface ProyectoCreate {
  titulo: string;
  tipo_narracion: TipoNarracion;
  estilo: Estilo;
  tono_general: TonoGeneral;
  sinopsis: string;
  contexto_historico?: string;
  contexto_social?: string;
  contexto_geografico?: string;
  contexto_cultural?: string;
  entorno_sensorial?: string;
  temas_principales?: string[];
}

export interface ProyectoUpdate {
  titulo?: string;
  tipo_narracion?: TipoNarracion;
  estilo?: Estilo;
  tono_general?: TonoGeneral;
  sinopsis?: string;
  contexto_historico?: string;
  contexto_social?: string;
  contexto_geografico?: string;
  contexto_cultural?: string;
  entorno_sensorial?: string;
  temas_principales?: string[];
}

// Interfaces for Personaje
export interface Relacion {
  nombre: string;
  relacion: string;
  id: string;
}

export interface Personaje {
  id: string;
  proyecto_id: string;
  nombre: string;
  apodo?: string;
  edad?: number;
  genero?: Genero;
  trasfondo: string;
  objetivos: string[];
  motivaciones: string;
  conflictos_internos?: string;
  conflictos_externos?: string;
  relaciones?: Relacion[];
  arquetipo?: Arquetipo;
  personalidad?: string;
  evolucion?: string;
  habilidades?: string[];
  debilidades?: string[];
  apariencia_fisica?: string;
  notas_adicionales?: string;
}

export interface PersonajeCreate {
  nombre: string;
  trasfondo: string;
  objetivos: string[];
  motivaciones: string;
  apodo?: string;
  edad?: number;
  genero?: Genero;
  conflictos_internos?: string;
  conflictos_externos?: string;
  relaciones?: Relacion[];
  arquetipo?: Arquetipo;
  personalidad?: string;
  evolucion?: string;
  habilidades?: string[];
  debilidades?: string[];
  apariencia_fisica?: string;
  notas_adicionales?: string;
}

export interface PersonajeUpdate {
  nombre?: string;
  apodo?: string;
  edad?: number;
  genero?: Genero;
  trasfondo?: string;
  objetivos?: string[];
  motivaciones?: string;
  conflictos_internos?: string;
  conflictos_externos?: string;
  relaciones?: Relacion[];
  arquetipo?: Arquetipo;
  personalidad?: string;
  evolucion?: string;
  habilidades?: string[];
  debilidades?: string[];
  apariencia_fisica?: string;
  notas_adicionales?: string;
}

// Interfaces for Narrativa
export interface Narrativa {
  id: string;
  proyecto_id: string;
  titulo: string;
  tipo_estructura: TipoEstructura;
  temas_asociados?: string[];
  tono?: string;
  sinopsis: string;
  personajes_involucrados?: string[];
  conexiones_con_otras_narrativas?: string;
  estado?: Estado;
}

export interface NarrativaCreate {
  titulo: string;
  tipo_estructura: TipoEstructura;
  sinopsis: string;
  temas_asociados?: string[];
  tono?: string;
  personajes_involucrados?: string[];
  conexiones_con_otras_narrativas?: string;
  estado?: Estado;
}

export interface NarrativaUpdate {
  titulo?: string;
  tipo_estructura?: TipoEstructura;
  sinopsis?: string;
  temas_asociados?: string[];
  tono?: string;
  personajes_involucrados?: string[];
  conexiones_con_otras_narrativas?: string;
  estado?: Estado;
}

// Interfaces for Trama
export interface ElementoNarrativoSchema {
  tipo: ElementoNarrativo;
  descripcion: string;
}

export interface Trama {
  id: string;
  proyecto_id: string;
  titulo: string;
  arquetipo_narrativo: ArquetipoNarrativo;
  elementos_narrativos: ElementoNarrativoSchema[];
  subtramas?: string[];
  personajes_involucrados: string[];
  obstaculos?: string[];
  estado?: Estado;
  notas?: string;
}

export interface TramaCreate {
  titulo: string;
  arquetipo_narrativo: ArquetipoNarrativo;
  elementos_narrativos: ElementoNarrativoSchema[];
  personajes_involucrados: string[];
  subtramas?: string[];
  obstaculos?: string[];
  estado?: Estado;
  notas?: string;
}

export interface TramaUpdate {
  titulo?: string;
  arquetipo_narrativo?: ArquetipoNarrativo;
  elementos_narrativos?: ElementoNarrativoSchema[];
  personajes_involucrados?: string[];
  subtramas?: string[];
  obstaculos?: string[];
  estado?: Estado;
  notas?: string;
}

// Interfaces for EstructuraNarrativa
export interface EstructuraNarrativa {
  id: string;
  proyecto_id: string;
  tipo: TipoEstructuraNarrativa;
  titulo: string;
  numero_acto?: number;
  numero_escena?: number;
  elementos_narrativos?: string[];
  personajes_involucrados?: string[];
  ubicacion?: string;
  texto_escena?: string;
  duracion_estimada?: string;
  notas_direccion?: string;
  estado?: Estado;
}

export interface EstructuraNarrativaCreate {
  tipo: TipoEstructuraNarrativa;
  titulo: string;
  numero_acto?: number;
  numero_escena?: number;
  elementos_narrativos?: string[];
  personajes_involucrados?: string[];
  ubicacion?: string;
  texto_escena?: string;
  duracion_estimada?: string;
  notas_direccion?: string;
  estado?: Estado;
}

export interface EstructuraNarrativaUpdate {
  tipo?: TipoEstructuraNarrativa;
  titulo?: string;
  numero_acto?: number;
  numero_escena?: number;
  elementos_narrativos?: string[];
  personajes_involucrados?: string[];
  ubicacion?: string;
  texto_escena?: string;
  duracion_estimada?: string;
  notas_direccion?: string;
  estado?: Estado;
}

// AI Response
export interface AIResponse {
  content: string;
  model: string;
  prompt?: string;
}

// API Response
export interface APIResponse<T> {
  data: T;
  message?: string;
}

// Graph Types
export type NodeType = "proyecto" | "personaje" | "narrativa" | "trama" | "escena";

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
}

export interface GraphLink {
  source: string;
  target: string;
  type: "pertenece_a" | "involucra_a" | "referencia_a";
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Complete Project
export interface ProyectoCompleto {
  proyecto: Proyecto;
  personajes: Personaje[];
  narrativas: Narrativa[];
  tramas: Trama[];
  estructura_narrativa: EstructuraNarrativa[];
}

// Form Types
export interface FormErrors {
  [key: string]: string[];
}

// Notification Types
export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}
