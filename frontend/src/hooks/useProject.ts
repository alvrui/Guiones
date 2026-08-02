// Custom hook for managing project state
import { useState, useEffect, useCallback } from "react";
import { proyectoAPI } from "../services/api";
import { Proyecto, ProyectoCreate, ProyectoUpdate } from "../types";
import { useProjectContext } from "../contexts/ProjectContext";

interface UseProjectReturn {
  proyectos: Proyecto[];
  proyectoActual: Proyecto | null;
  loading: boolean;
  error: string | null;
  fetchProyectos: () => Promise<void>;
  fetchProyecto: (id: string) => Promise<void>;
  createProyecto: (data: ProyectoCreate) => Promise<Proyecto | null>;
  updateProyecto: (id: string, data: ProyectoUpdate) => Promise<Proyecto | null>;
  deleteProyecto: (id: string) => Promise<Proyecto | null>;
  setProyectoActual: (proyecto: Proyecto | null) => void;
}

export const useProject = (): UseProjectReturn => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use project context for global state
  const { proyectoActual: contextProyectoActual, setProyectoActual: contextSetProyectoActual } = useProjectContext();

  // Fetch all projects
  const fetchProyectos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proyectoAPI.getAll();
      setProyectos(data);
      
      // If there's a project in context but not in the list, clear it
      if (contextProyectoActual && !data.some(p => p.id === contextProyectoActual.id)) {
        contextSetProyectoActual(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  }, [contextProyectoActual, contextSetProyectoActual]);

  // Fetch a single project by ID
  const fetchProyecto = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await proyectoAPI.getById(id);
      contextSetProyectoActual(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el proyecto");
    } finally {
      setLoading(false);
    }
  }, [contextSetProyectoActual]);

  // Create a new project
  const createProyecto = useCallback(async (data: ProyectoCreate) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoProyecto = await proyectoAPI.create(data);
      setProyectos((prev) => [...prev, nuevoProyecto]);
      contextSetProyectoActual(nuevoProyecto);
      return nuevoProyecto;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, [contextSetProyectoActual]);

  // Update a project
  const updateProyecto = useCallback(async (id: string, data: ProyectoUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const proyectoActualizado = await proyectoAPI.update(id, data);
      setProyectos((prev) =>
        prev.map((p) => (p.id === id ? proyectoActualizado : p))
      );
      if (contextProyectoActual && contextProyectoActual.id === id) {
        contextSetProyectoActual(proyectoActualizado);
      }
      return proyectoActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, [contextProyectoActual, contextSetProyectoActual]);

  // Delete a project
  const deleteProyecto = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const proyectoBorrado = await proyectoAPI.delete(id);
      setProyectos((prev) => prev.filter((p) => p.id !== id));
      if (contextProyectoActual && contextProyectoActual.id === id) {
        contextSetProyectoActual(null);
      }
      return proyectoBorrado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al borrar el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, [contextProyectoActual, contextSetProyectoActual]);

  // Load projects on mount
  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  // Set project from context if available
  useEffect(() => {
    if (contextProyectoActual && proyectos.length > 0) {
      // Verify the project still exists in the list
      const projectExists = proyectos.some(p => p.id === contextProyectoActual.id);
      if (!projectExists) {
        contextSetProyectoActual(null);
      }
    }
  }, [proyectos, contextProyectoActual, contextSetProyectoActual]);

  return {
    proyectos,
    proyectoActual: contextProyectoActual,
    loading,
    error,
    fetchProyectos,
    fetchProyecto,
    createProyecto,
    updateProyecto,
    deleteProyecto,
    setProyectoActual: contextSetProyectoActual,
  };
};

export default useProject;
