// Custom hook for AI generation
import { useState, useCallback } from "react";
import {
  aiCharacterAPI,
  aiPlotAPI,
  aiSceneAPI,
  aiNarrativeAPI,
} from "../services/api";
import { AIResponse } from "../types";

interface UseAIReturn {
  loading: boolean;
  error: string | null;
  generateCharacterField: (
    field: string,
    context: any
  ) => Promise<string | null>;
  generatePlotField: (
    field: string,
    context: any
  ) => Promise<string | null>;
  generateSceneField: (
    field: string,
    context: any
  ) => Promise<string | null>;
  generateNarrativeField: (
    field: string,
    context: any
  ) => Promise<string | null>;
  clearError: () => void;
}

// Map of field names to API functions for characters
const characterFieldMap: Record<string, (context: any) => Promise<AIResponse>> = {
  trasfondo: aiCharacterAPI.generateTrasfondo,
  personalidad: aiCharacterAPI.generatePersonalidad,
  objetivos: aiCharacterAPI.generateObjetivos,
  motivaciones: aiCharacterAPI.generateMotivaciones,
  conflictos_internos: aiCharacterAPI.generateConflictosInternos,
  conflictos_externos: aiCharacterAPI.generateConflictosExternos,
  relaciones: aiCharacterAPI.generateRelaciones,
  evolucion: aiCharacterAPI.generateEvolucion,
  apariencia_fisica: aiCharacterAPI.generateAparienciaFisica,
  habilidades: aiCharacterAPI.generateHabilidades,
  debilidades: aiCharacterAPI.generateDebilidades,
};

// Map of field names to API functions for plots
const plotFieldMap: Record<string, (context: any) => Promise<AIResponse>> = {
  elementos_narrativos: aiPlotAPI.generateElementosNarrativos,
  obstaculos: aiPlotAPI.generateObstaculos,
  sinopsis: aiPlotAPI.generateSinopsis,
  titulo: aiPlotAPI.generateTitulo,
  subtramas: aiPlotAPI.generateSubtramas,
  notas: aiPlotAPI.generateNotas,
};

// Map of field names to API functions for scenes
const sceneFieldMap: Record<string, (context: any) => Promise<AIResponse>> = {
  texto_escena: aiSceneAPI.generateTextoEscena,
  notas_direccion: aiSceneAPI.generateNotasDireccion,
  dialogos: aiSceneAPI.generateDialogos,
  ubicacion: aiSceneAPI.generateUbicacion,
  duracion_estimada: aiSceneAPI.generateDuracionEstimada,
};

// Map of field names to API functions for narratives
const narrativeFieldMap: Record<string, (context: any) => Promise<AIResponse>> = {
  sinopsis: aiNarrativeAPI.generateSinopsis,
  titulo: aiNarrativeAPI.generateTitulo,
  temas_asociados: aiNarrativeAPI.generateTemasAsociados,
  conexiones: aiNarrativeAPI.generateConexiones,
  tipo_estructura: aiNarrativeAPI.generateTipoEstructura,
  tono: aiNarrativeAPI.generateTono,
};

export const useAI = (): UseAIReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Generate a character field
  const generateCharacterField = useCallback(
    async (field: string, context: any): Promise<string | null> => {
      if (!(field in characterFieldMap)) {
        setError(`Campo '${field}' no soportado para personajes`);
        return null;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await characterFieldMap[field](context);
        return response.content;
      } catch (err) {
        setError(err instanceof Error ? err.message : `Error al generar ${field}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Generate a plot field
  const generatePlotField = useCallback(
    async (field: string, context: any): Promise<string | null> => {
      if (!(field in plotFieldMap)) {
        setError(`Campo '${field}' no soportado para tramas`);
        return null;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await plotFieldMap[field](context);
        return response.content;
      } catch (err) {
        setError(err instanceof Error ? err.message : `Error al generar ${field}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Generate a scene field
  const generateSceneField = useCallback(
    async (field: string, context: any): Promise<string | null> => {
      if (!(field in sceneFieldMap)) {
        setError(`Campo '${field}' no soportado para escenas`);
        return null;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await sceneFieldMap[field](context);
        return response.content;
      } catch (err) {
        setError(err instanceof Error ? err.message : `Error al generar ${field}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Generate a narrative field
  const generateNarrativeField = useCallback(
    async (field: string, context: any): Promise<string | null> => {
      if (!(field in narrativeFieldMap)) {
        setError(`Campo '${field}' no soportado para narrativas`);
        return null;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await narrativeFieldMap[field](context);
        return response.content;
      } catch (err) {
        setError(err instanceof Error ? err.message : `Error al generar ${field}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    generateCharacterField,
    generatePlotField,
    generateSceneField,
    generateNarrativeField,
    clearError,
  };
};

export default useAI;
