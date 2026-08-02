// Types for the Guiones application

// Enums for TypeScript
export type TipoNarracion = "Lineal" | "No lineal" | "Circular" | "Episódica" | "Modular" | "In media res" | "Frame narrative" | "Interactiva";
export type Estilo = "Realista" | "Surrealista" | "Fantástico" | "Ciencia ficción" | "Noir" | "Satírico" | "Poético" | "Minimalista" | "Experimental" | "Magic realism" | "Pulp" | "Cyberpunk" | "Steampunk" | "Gótico" | "Hardboiled";
export type TonoGeneral = "Melancólico" | "Irónico" | "Trágico" | "Cómico" | "Satírico" | "Esperanzador" | "Oscuro" | "Ligero" | "Suspense" | "Bildungsroman" | "Absurdo" | "Nostalógico" | "Cínico" | "Épico";
export type GeneroPrincipal = "Drama" | "Comedia" | "Acción" | "Terror" | "Romance" | "Aventura" | "Misterio" | "Ciencia ficción" | "Fantasía" | "Thriller" | "Western" | "Noir" | "Docuficción" | "Ficción histórica" | "Distopía" | "Utopía";
export type EstructuraNarrativaBase = "Tres actos" | "Viaje del héroe" | "Save the Cat" | "Seven-Point Story Structure" | "Freytag's Pyramid" | "In Medias Res" | "Non-linear" | "Circular" | "Parallel Narratives";
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
  tono_general: TonoGeneral;
  sinopsis: string;
  contexto_historico?: string;
  contexto_social?: string;
  contexto_geografico?: string;
  contexto_ambiental?: string;
  temas_principales?: string[];
  genero_principal?: GeneroPrincipal;
  estructura_narrativa_base?: EstructuraNarrativaBase;
  inspiraciones_referencias?: string;
  restricciones_limitaciones?: string;
  palabras_clave?: string[];
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
  contexto_ambiental?: string;
  temas_principales?: string[];
  genero_principal?: GeneroPrincipal;
  estructura_narrativa_base?: EstructuraNarrativaBase;
  inspiraciones_referencias?: string;
  restricciones_limitaciones?: string;
  palabras_clave?: string[];
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
  contexto_ambiental?: string;
  temas_principales?: string[];
  genero_principal?: GeneroPrincipal;
  estructura_narrativa_base?: EstructuraNarrativaBase;
  inspiraciones_referencias?: string;
  restricciones_limitaciones?: string;
  palabras_clave?: string[];
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

// Document types
export interface Documento {
  id: string;
  proyecto_id: string;
  nombre: string;
  tipo: "pdf" | "txt" | "docx" | "md" | "otro";
  contenido: string;
  fecha_subida: string;
}
