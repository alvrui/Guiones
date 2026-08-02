// Hook for managing AI agents
import { useState, useCallback, useEffect } from "react";
import { AgenteIA, AgenteIACreate, AgenteIAUpdate } from "../types";
import { agenteIAAPI } from "../services/api";

export const useAgentesIA = () => {
  const [agentes, setAgentes] = useState<AgenteIA[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all agents
  const fetchAgentes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agenteIAAPI.get("/agentes-ia");
      setAgentes(response.data || []);
    } catch (err) {
      setError("Error al cargar los agentes IA");
      console.error("Error fetching agents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch agents by section
  const fetchAgentesBySeccion = useCallback(async (seccion: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await agenteIAAPI.get(`/agentes-ia/seccion/${seccion}`);
      return response.data || [];
    } catch (err) {
      setError("Error al cargar los agentes IA por sección");
      console.error("Error fetching agents by section:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new agent
  const createAgente = useCallback(async (data: AgenteIACreate) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoAgente = await agenteIAAPI.create(data);
      setAgentes((prev) => [...prev, nuevoAgente]);
      return nuevoAgente;
    } catch (err) {
      setError("Error al crear el agente IA");
      console.error("Error creating agent:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an agent
  const updateAgente = useCallback(async (id: string, data: AgenteIAUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await agenteIAAPI.put(`/agentes-ia/${id}`, data);
      const agenteActualizado = response.data;
      setAgentes((prev) =>
        prev.map((a) => (a.id === id ? agenteActualizado : a))
      );
      return agenteActualizado;
    } catch (err) {
      setError("Error al actualizar el agente IA");
      console.error("Error updating agent:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an agent
  const deleteAgente = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await agenteIAAPI.delete(`/agentes-ia/${id}`);
      setAgentes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError("Error al eliminar el agente IA");
      console.error("Error deleting agent:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load agents on mount
  useEffect(() => {
    fetchAgentes();
  }, [fetchAgentes]);

  return {
    agentes,
    loading,
    error,
    fetchAgentes,
    fetchAgentesBySeccion,
    createAgente,
    updateAgente,
    deleteAgente,
  };
};
