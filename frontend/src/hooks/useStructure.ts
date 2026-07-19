// Custom hook for managing narrative structure state
import { useState, useEffect, useCallback } from "react";
import { estructuraAPI } from "../services/api";
import { EstructuraNarrativa, EstructuraNarrativaCreate, EstructuraNarrativaUpdate } from "../types";

interface UseStructureReturn {
  estructuras: EstructuraNarrativa[];
  loading: boolean;
  error: string | null;
  fetchEstructuras: (proyectoId: string) => Promise<void>;
  fetchEstructura: (id: string) => Promise<EstructuraNarrativa | null>;
  fetchByActo: (proyectoId: string, numeroActo: number) => Promise<EstructuraNarrativa[]>;
  createEstructura: (proyectoId: string, data: EstructuraNarrativaCreate) => Promise<EstructuraNarrativa | null>;
  updateEstructura: (id: string, data: EstructuraNarrativaUpdate) => Promise<EstructuraNarrativa | null>;
  deleteEstructura: (id: string) => Promise<EstructuraNarrativa | null>;
}

export const useStructure = (proyectoId: string | null): UseStructureReturn => {
  const [estructuras, setEstructuras] = useState<EstructuraNarrativa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all narrative structure elements for a project
  const fetchEstructuras = useCallback(async (proyectoId: string) => {
    if (!proyectoId) {
      setEstructuras([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await estructuraAPI.getAll(proyectoId);
      setEstructuras(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar estructuras");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single narrative structure element by ID
  const fetchEstructura = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await estructuraAPI.getById(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la estructura");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch scenes for a specific act
  const fetchByActo = useCallback(async (proyectoId: string, numeroActo: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await estructuraAPI.getByActo(proyectoId, numeroActo);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar escenas del acto");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new narrative structure element
  const createEstructura = useCallback(async (proyectoId: string, data: EstructuraNarrativaCreate) => {
    setLoading(true);
    setError(null);
    try {
      const nuevaEstructura = await estructuraAPI.create(proyectoId, data);
      setEstructuras((prev) => [...prev, nuevaEstructura]);
      return nuevaEstructura;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la estructura");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a narrative structure element
  const updateEstructura = useCallback(async (id: string, data: EstructuraNarrativaUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const estructuraActualizada = await estructuraAPI.update(id, data);
      setEstructuras((prev) =>
        prev.map((e) => (e.id === id ? estructuraActualizada : e))
      );
      return estructuraActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la estructura");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a narrative structure element
  const deleteEstructura = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const estructuraBorrada = await estructuraAPI.delete(id);
      setEstructuras((prev) => prev.filter((e) => e.id !== id));
      return estructuraBorrada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al borrar la estructura");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load structures when proyectoId changes
  useEffect(() => {
    if (proyectoId) {
      fetchEstructuras(proyectoId);
    } else {
      setEstructuras([]);
    }
  }, [proyectoId, fetchEstructuras]);

  return {
    estructuras,
    loading,
    error,
    fetchEstructuras,
    fetchEstructura,
    fetchByActo,
    createEstructura,
    updateEstructura,
    deleteEstructura,
  };
};

export default useStructure;
