// Custom hook for managing plot state
import { useState, useEffect, useCallback } from "react";
import { tramaAPI } from "../services/api";
import { Trama, TramaCreate, TramaUpdate } from "../types";

interface UsePlotsReturn {
  tramas: Trama[];
  loading: boolean;
  error: string | null;
  fetchTramas: (proyectoId: string) => Promise<void>;
  fetchTrama: (id: string) => Promise<Trama | null>;
  createTrama: (proyectoId: string, data: TramaCreate) => Promise<Trama | null>;
  updateTrama: (id: string, data: TramaUpdate) => Promise<Trama | null>;
  deleteTrama: (id: string) => Promise<Trama | null>;
}

export const usePlots = (proyectoId: string | null): UsePlotsReturn => {
  const [tramas, setTramas] = useState<Trama[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all plots for a project
  const fetchTramas = useCallback(async (proyectoId: string) => {
    if (!proyectoId) {
      setTramas([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await tramaAPI.getAll(proyectoId);
      setTramas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar tramas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single plot by ID
  const fetchTrama = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tramaAPI.getById(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la trama");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new plot
  const createTrama = useCallback(async (proyectoId: string, data: TramaCreate) => {
    setLoading(true);
    setError(null);
    try {
      const nuevaTrama = await tramaAPI.create(proyectoId, data);
      setTramas((prev) => [...prev, nuevaTrama]);
      return nuevaTrama;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la trama");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a plot
  const updateTrama = useCallback(async (id: string, data: TramaUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const tramaActualizada = await tramaAPI.update(id, data);
      setTramas((prev) =>
        prev.map((t) => (t.id === id ? tramaActualizada : t))
      );
      return tramaActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la trama");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a plot
  const deleteTrama = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const tramaBorrada = await tramaAPI.delete(id);
      setTramas((prev) => prev.filter((t) => t.id !== id));
      return tramaBorrada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al borrar la trama");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load plots when proyectoId changes
  useEffect(() => {
    if (proyectoId) {
      fetchTramas(proyectoId);
    } else {
      setTramas([]);
    }
  }, [proyectoId, fetchTramas]);

  return {
    tramas,
    loading,
    error,
    fetchTramas,
    fetchTrama,
    createTrama,
    updateTrama,
    deleteTrama,
  };
};

export default usePlots;
