// API service for communicating with the backend
import axios, { AxiosInstance, AxiosError } from "axios";
import {
  Proyecto,
  ProyectoCreate,
  ProyectoUpdate,
  Personaje,
  PersonajeCreate,
  PersonajeUpdate,
  Narrativa,
  NarrativaCreate,
  NarrativaUpdate,
  Trama,
  TramaCreate,
  TramaUpdate,
  EstructuraNarrativa,
  EstructuraNarrativaCreate,
  EstructuraNarrativaUpdate,
  AIResponse,
} from "../types";

// Create axios instance with base URL
// Use absolute URL to backend for local network access
const api: AxiosInstance = axios.create({
  baseURL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "/api"
    : "http://" + window.location.hostname + ":8002/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export axios instance for direct use
export { api };

// Error handling
class APIError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "APIError";
  }
}

// Helper function to handle errors
const handleError = (error: AxiosError): never => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    // Handle specific error cases
    if (status === 404) {
      throw new APIError("Recurso no encontrado", status, data);
    }
    if (status === 400) {
      throw new APIError("Datos inválidos", status, data);
    }
    if (status === 422) {
      throw new APIError("Error de validación", status, data);
    }
    if (status >= 500) {
      throw new APIError("Error del servidor", status, data);
    }
    
    throw new APIError("Error desconocido", status, data);
  } else if (error.request) {
    throw new APIError("No se recibió respuesta del servidor", 0);
  } else {
    throw new APIError("Error de configuración", 0, error.message);
  }
};

// ==================== Proyecto API ====================

export const proyectoAPI = {
  // Get all projects
  getAll: async (skip: number = 0, limit: number = 100): Promise<Proyecto[]> => {
    try {
      const response = await api.get<Proyecto[]>("/proyectos/", {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Get a project by ID
  getById: async (id: string): Promise<Proyecto> => {
    try {
      const response = await api.get<Proyecto>(`/proyectos/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Create a new project
  create: async (data: ProyectoCreate): Promise<Proyecto> => {
    try {
      const response = await api.post<Proyecto>("/proyectos/", data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Update a project
  update: async (id: string, data: ProyectoUpdate): Promise<Proyecto> => {
    try {
      const response = await api.put<Proyecto>(`/proyectos/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Delete a project
  delete: async (id: string): Promise<Proyecto> => {
    try {
      const response = await api.delete<Proyecto>(`/proyectos/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Get complete project with all related data
  getComplete: async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/proyectos/${id}/completo`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Export project to JSON
  exportToJSON: async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/proyectos/${id}/export`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== Personaje API ====================

export const personajeAPI = {
  // Get all characters for a project
  getAll: async (proyectoId: string, skip: number = 0, limit: number = 100): Promise<Personaje[]> => {
    try {
      const response = await api.get<Personaje[]>(`/personajes/proyecto/${proyectoId}`, {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Get a character by ID
  getById: async (id: string): Promise<Personaje> => {
    try {
      const response = await api.get<Personaje>(`/personajes/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Create a new character
  create: async (proyectoId: string, data: PersonajeCreate): Promise<Personaje> => {
    try {
      const response = await api.post<Personaje>(`/personajes/proyecto/${proyectoId}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Update a character
  update: async (id: string, data: PersonajeUpdate): Promise<Personaje> => {
    try {
      const response = await api.put<Personaje>(`/personajes/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Delete a character
  delete: async (id: string): Promise<Personaje> => {
    try {
      const response = await api.delete<Personaje>(`/personajes/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== Narrativa API ====================

export const narrativaAPI = {
  // Get all narratives for a project
  getAll: async (proyectoId: string, skip: number = 0, limit: number = 100): Promise<Narrativa[]> => {
    try {
      const response = await api.get<Narrativa[]>(`/narrativas/proyecto/${proyectoId}`, {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Get a narrative by ID
  getById: async (id: string): Promise<Narrativa> => {
    try {
      const response = await api.get<Narrativa>(`/narrativas/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Create a new narrative
  create: async (proyectoId: string, data: NarrativaCreate): Promise<Narrativa> => {
    try {
      const response = await api.post<Narrativa>(`/narrativas/proyecto/${proyectoId}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Update a narrative
  update: async (id: string, data: NarrativaUpdate): Promise<Narrativa> => {
    try {
      const response = await api.put<Narrativa>(`/narrativas/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Delete a narrative
  delete: async (id: string): Promise<Narrativa> => {
    try {
      const response = await api.delete<Narrativa>(`/narrativas/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== Trama API ====================

export const tramaAPI = {
  // Get all plots for a project
  getAll: async (proyectoId: string, skip: number = 0, limit: number = 100): Promise<Trama[]> => {
    try {
      const response = await api.get<Trama[]>(`/tramas/proyecto/${proyectoId}`, {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Get a plot by ID
  getById: async (id: string): Promise<Trama> => {
    try {
      const response = await api.get<Trama>(`/tramas/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Create a new plot
  create: async (proyectoId: string, data: TramaCreate): Promise<Trama> => {
    try {
      const response = await api.post<Trama>(`/tramas/proyecto/${proyectoId}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Update a plot
  update: async (id: string, data: TramaUpdate): Promise<Trama> => {
    try {
      const response = await api.put<Trama>(`/tramas/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Delete a plot
  delete: async (id: string): Promise<Trama> => {
    try {
      const response = await api.delete<Trama>(`/tramas/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== Estructura Narrativa API ====================

export const estructuraAPI = {
  // Get all narrative structure elements for a project
  getAll: async (proyectoId: string, skip: number = 0, limit: number = 100): Promise<EstructuraNarrativa[]> => {
    try {
      const response = await api.get<EstructuraNarrativa[]>(`/estructura/proyecto/${proyectoId}`, {
        params: { skip, limit },
      });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Get scenes for a specific act
  getByActo: async (proyectoId: string, numeroActo: number): Promise<EstructuraNarrativa[]> => {
    try {
      const response = await api.get<EstructuraNarrativa[]>(`/estructura/proyecto/${proyectoId}/acto/${numeroActo}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Get a narrative structure element by ID
  getById: async (id: string): Promise<EstructuraNarrativa> => {
    try {
      const response = await api.get<EstructuraNarrativa>(`/estructura/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Create a new narrative structure element
  create: async (proyectoId: string, data: EstructuraNarrativaCreate): Promise<EstructuraNarrativa> => {
    try {
      const response = await api.post<EstructuraNarrativa>(`/estructura/proyecto/${proyectoId}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Update a narrative structure element
  update: async (id: string, data: EstructuraNarrativaUpdate): Promise<EstructuraNarrativa> => {
    try {
      const response = await api.put<EstructuraNarrativa>(`/estructura/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Delete a narrative structure element
  delete: async (id: string): Promise<EstructuraNarrativa> => {
    try {
      const response = await api.delete<EstructuraNarrativa>(`/estructura/${id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== AI Character API ====================

export const aiCharacterAPI = {
  // Generate backstory
  generateTrasfondo: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/trasfondo", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate personality
  generatePersonalidad: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/personalidad", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate objectives
  generateObjetivos: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/objetivos", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate motivations
  generateMotivaciones: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/motivaciones", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate internal conflicts
  generateConflictosInternos: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/conflictos_internos", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate external conflicts
  generateConflictosExternos: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/conflictos_externos", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate relationships
  generateRelaciones: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/relaciones", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate evolution
  generateEvolucion: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/evolucion", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate physical appearance
  generateAparienciaFisica: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/apariencia_fisica", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate skills
  generateHabilidades: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/habilidades", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate weaknesses
  generateDebilidades: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/character/debilidades", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== AI Plot API ====================

export const aiPlotAPI = {
  // Generate narrative elements
  generateElementosNarrativos: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/plot/elementos_narrativos", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate obstacles
  generateObstaculos: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/plot/obstaculos", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate synopsis
  generateSinopsis: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/plot/sinopsis", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate title options
  generateTitulo: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/plot/titulo", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate subplots
  generateSubtramas: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/plot/subtramas", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate notes
  generateNotas: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/plot/notas", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== AI Scene API ====================

export const aiSceneAPI = {
  // Generate scene text
  generateTextoEscena: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/scene/texto_escena", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate direction notes
  generateNotasDireccion: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/scene/notas_direccion", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate dialogues
  generateDialogos: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/scene/dialogos", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate location description
  generateUbicacion: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/scene/ubicacion", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate estimated duration
  generateDuracionEstimada: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/scene/duracion_estimada", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// ==================== AI Narrative API ====================

export const aiNarrativeAPI = {
  // Generate synopsis
  generateSinopsis: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/narrative/sinopsis", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate title options
  generateTitulo: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/narrative/titulo", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate associated themes
  generateTemasAsociados: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/narrative/temas_asociados", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate connections
  generateConexiones: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/narrative/conexiones", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate structure type
  generateTipoEstructura: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/narrative/tipo_estructura", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },

  // Generate tone
  generateTono: async (context: any): Promise<AIResponse> => {
    try {
      const response = await api.post<AIResponse>("/ai/narrative/tono", { context });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  },
};

// Export all APIs
export default {
  proyecto: proyectoAPI,
  personaje: personajeAPI,
  narrativa: narrativaAPI,
  trama: tramaAPI,
  estructura: estructuraAPI,
  aiCharacter: aiCharacterAPI,
  aiPlot: aiPlotAPI,
  aiScene: aiSceneAPI,
  aiNarrative: aiNarrativeAPI,
};
