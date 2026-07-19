// Custom hook for managing narrative state
import { useState, useEffect, useCallback } from "react";
import { narrativaAPI } from "../services/api";
import { Narrativa, NarrativaCreate, NarrativaUpdate } from "../types";

interface UseNarrativesReturn {
  narrativas: Narrativa[];
  loading: boolean;
  error: string | null;
  fetchNarrativas: (proyectoId: string) => Promise<void>;
  fetchNarrativa: (id: string) => Promise<Narrativa | null>;
  createNarrativa: (proyectoId: string, data: NarrativaCreate) => Promise<Narrativa | null>;
  updateNarrativa: (id: string, data: NarrativaUpdate) => Promise<Narrativa | null>;
  deleteNarrativa: (id: string) => Promise<Narrativa | null>;
}

export const useNarratives = (proyectoId: string | null): UseNarrativesReturn => {
  const [narrativas, setNarrativas] = useState<Narrativa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all narratives for a project
  const fetchNarrativas = useCallback(async (proyectoId: string) => {
    if (!proyectoId) {
      setNarrativas([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await narrativaAPI.getAll(proyectoId);
      setNarrativas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar narrativas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single narrative by ID
  const fetchNarrativa = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await narrativaAPI.getById(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la narrativa");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new narrative
  const createNarrativa = useCallback(async (proyectoId: string, data: NarrativaCreate) => {
    setLoading(true);
    setError(null);
    try {
      const nuevaNarrativa = await narrativaAPI.create(proyectoId, data);
      setNarrativas((prev) => [...prev, nuevaNarrativa]);
      return nuevaNarrativa;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la narrativa");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a narrative
  const updateNarrativa = useCallback(async (id: string, data: NarrativaUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const narrativaActualizada = await narrativaAPI.update(id, data);
      setNarrativas((prev) =>
        prev.map((n) => (n.id === id ? narrativaActualizada : n))
      );
      return narrativaActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la narrativa");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a narrative
  const deleteNarrativa = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const narrativaBorrada = await narrativaAPI.delete(id);
      setNarrativas((prev) => prev.filter((n) => n.id !== id));
      return narrativaBorrada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al borrar la narrativa");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load narratives when proyectoId changes
  useEffect(() => {
    if (proyectoId) {
      fetchNarrativas(proyectoId);
    } else {
      setNarrativas([]);
    }
  }, [proyectoId, fetchNarrativas]);

  return {
    narrativas,
    loading,
    error,
    fetchNarrativas,
    fetchNarrativa,
    createNarrativa,
    updateNarrativa,
    deleteNarrativa,
  };
};

export default useNarratives;
