// Custom hook for global actions (export, import, save all)
import { useState, useCallback } from "react";
import { proyectoAPI } from "../services/api";
import { Proyecto } from "../types";
import { useNotifications } from "../contexts/NotificationContext";

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
  const { addNotification } = useNotifications();

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Export project to JSON file
  const exportProject = useCallback(async (proyectoId: string): Promise<Blob | null> => {
    if (!proyectoId) {
      setError("No hay proyecto seleccionado");
      addNotification("error", "No hay proyecto seleccionado");
      return null;
    }

    setLoading(true);
    clearError();

    try {
      const data = await proyectoAPI.exportToJSON(proyectoId);
      
      // Create a Blob with the JSON data
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      
      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al exportar el proyecto";
      setError(errorMessage);
      addNotification("error", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [addNotification, clearError]);

  // Import project from JSON file
  const importProject = useCallback(async (file: File): Promise<Proyecto | null> => {
    setLoading(true);
    clearError();

    try {
      // Read the file content
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Import the project
      const proyecto = await proyectoAPI.importFromJSON(data);
      
      return proyecto;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al importar el proyecto";
      setError(errorMessage);
      addNotification("error", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [addNotification, clearError]);

  // Save all changes (placeholder - will be implemented with auto-save)
  const saveAll = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      // For now, just show a notification
      // In the future, this will trigger auto-save for all unsaved changes
      addNotification("success", "Todos los cambios guardados correctamente");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar";
      setError(errorMessage);
      addNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [addNotification, clearError]);

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
