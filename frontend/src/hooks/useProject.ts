// Custom hook for managing project state
import { useState, useEffect, useCallback } from "react";
import { proyectoAPI } from "../services/api";
import { Proyecto, ProyectoCreate, ProyectoUpdate } from "../types";

const PROYECTO_ACTUAL_KEY = "guiones_proyecto_actual";

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

  // Load saved project from localStorage
  const [proyectoActual, setProyectoActualState] = useState<Proyecto | null>(() => {
    try {
      const saved = localStorage.getItem(PROYECTO_ACTUAL_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist project selection to localStorage
  const setProyectoActual = useCallback((proyecto: Proyecto | null) => {
    setProyectoActualState(proyecto);
    if (proyecto) {
      localStorage.setItem(PROYECTO_ACTUAL_KEY, JSON.stringify(proyecto));
    } else {
      localStorage.removeItem(PROYECTO_ACTUAL_KEY);
    }
  }, []);

  // Fetch all projects
  const fetchProyectos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proyectoAPI.getAll();
      setProyectos(data);
      
      // If we have a saved project but it's not in the list, clear it
      if (proyectoActual && !data.some(p => p.id === proyectoActual.id)) {
        setProyectoActual(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  }, [proyectoActual]);

  // Fetch a single project by ID
  const fetchProyecto = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await proyectoAPI.getById(id);
      setProyectoActual(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el proyecto");
    } finally {
      setLoading(false);
    }
  }, [setProyectoActual]);

  // Create a new project
  const createProyecto = useCallback(async (data: ProyectoCreate) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoProyecto = await proyectoAPI.create(data);
      setProyectos((prev) => [...prev, nuevoProyecto]);
      setProyectoActual(nuevoProyecto);
      return nuevoProyecto;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, [setProyectoActual]);

  // Update a project
  const updateProyecto = useCallback(async (id: string, data: ProyectoUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const proyectoActualizado = await proyectoAPI.update(id, data);
      setProyectos((prev) =>
        prev.map((p) => (p.id === id ? proyectoActualizado : p))
      );
      if (proyectoActual && proyectoActual.id === id) {
        setProyectoActual(proyectoActualizado);
      }
      return proyectoActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, [proyectoActual, setProyectoActual]);

  // Delete a project
  const deleteProyecto = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const proyectoBorrado = await proyectoAPI.delete(id);
      setProyectos((prev) => prev.filter((p) => p.id !== id));
      if (proyectoActual && proyectoActual.id === id) {
        setProyectoActual(null);
      }
      return proyectoBorrado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al borrar el proyecto");
      return null;
    } finally {
      setLoading(false);
    }
  }, [proyectoActual, setProyectoActual]);

  // Load projects on mount
  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  return {
    proyectos,
    proyectoActual,
    loading,
    error,
    fetchProyectos,
    fetchProyecto,
    createProyecto,
    updateProyecto,
    deleteProyecto,
    setProyectoActual,
  };
};

export default useProject;
