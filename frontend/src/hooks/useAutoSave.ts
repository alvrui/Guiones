// Custom hook for auto-save functionality
import { useState, useCallback, useEffect } from "react";
import { useNotifications } from "../contexts/NotificationContext";

interface UseAutoSaveReturn {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  saveAll: () => Promise<void>;
  isSaving: boolean;
}

// This is a placeholder for auto-save functionality
// In a real implementation, this would track changes across all entities
// and automatically save them to the backend

export const useAutoSave = (): UseAutoSaveReturn => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { addNotification } = useNotifications();

  // Save all changes
  const saveAll = useCallback(async () => {
    if (!hasUnsavedChanges) {
      addNotification("info", "No hay cambios pendientes para guardar");
      return;
    }

    setIsSaving(true);
    
    try {
      // In a real implementation, this would:
      // 1. Collect all unsaved changes from all entities
      // 2. Send them to the backend in batch
      // 3. Update the local state
      
      // For now, just simulate the save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setHasUnsavedChanges(false);
      addNotification("success", "Todos los cambios guardados correctamente");
    } catch (err) {
      addNotification("error", "Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, addNotification]);

  // Auto-save on unmount (optional)
  useEffect(() => {
    return () => {
      if (hasUnsavedChanges) {
        // Optionally warn user about unsaved changes
        console.warn("Hay cambios sin guardar");
      }
    };
  }, [hasUnsavedChanges]);

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    saveAll,
    isSaving,
  };
};

export default useAutoSave;
