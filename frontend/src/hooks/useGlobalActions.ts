// Custom hook for global actions (export, import, save all)
import { useState, useCallback } from "react";
import { proyectoAPI } from "../services/api";
import { Proyecto } from "../types";

interface UseGlobalActionsReturn {
  loading: boolean;
  error: string | null;
  exportProject: (proyectoId: string) => Promise<Blob | null>;
  importProject: (file: File) => Promise<Proyecto | null>;
  saveAll: () => Promise<void>;
  clearError: () => void;
}

export const useGlobalActions = (): UseGlobalActionsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Export project to JSON file
  const exportProject = useCallback(async (proyectoId: string): Promise<Blob | null> => {
    if (!proyectoId) {
      setError("No hay proyecto seleccionado");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await proyectoAPI.exportToJSON(proyectoId);
      
      // Create a Blob with the JSON data
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al exportar el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Import project from JSON file
  const importProject = useCallback(async (file: File): Promise<Proyecto | null> => {
    setLoading(true);
    setError(null);

    try {
      // Read the file content
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Import the project
      const proyecto = await proyectoAPI.importFromJSON(data);
      
      return proyecto;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al importar el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save all changes (placeholder - will be implemented with auto-save)
  const saveAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, just show a notification
      // In the future, this will trigger auto-save for all unsaved changes
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    exportProject,
    importProject,
    saveAll,
    clearError,
  };
};

export default useGlobalActions;
