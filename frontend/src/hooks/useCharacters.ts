// Custom hook for managing character state
import { useState, useEffect, useCallback } from "react";
import { personajeAPI } from "../services/api";
import { Personaje, PersonajeCreate, PersonajeUpdate } from "../types";

interface UseCharactersReturn {
  personajes: Personaje[];
  loading: boolean;
  error: string | null;
  fetchPersonajes: (proyectoId: string) => Promise<void>;
  fetchPersonaje: (id: string) => Promise<Personaje | null>;
  createPersonaje: (proyectoId: string, data: PersonajeCreate) => Promise<Personaje | null>;
  updatePersonaje: (id: string, data: PersonajeUpdate) => Promise<Personaje | null>;
  deletePersonaje: (id: string) => Promise<Personaje | null>;
}

export const useCharacters = (proyectoId: string | null): UseCharactersReturn => {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all characters for a project
  const fetchPersonajes = useCallback(async (proyectoId: string) => {
    if (!proyectoId) {
      setPersonajes([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await personajeAPI.getAll(proyectoId);
      setPersonajes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar personajes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single character by ID
  const fetchPersonaje = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await personajeAPI.getById(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el personaje");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new character
  const createPersonaje = useCallback(async (proyectoId: string, data: PersonajeCreate) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoPersonaje = await personajeAPI.create(proyectoId, data);
      setPersonajes((prev) => [...prev, nuevoPersonaje]);
      return nuevoPersonaje;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el personaje");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a character
  const updatePersonaje = useCallback(async (id: string, data: PersonajeUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const personajeActualizado = await personajeAPI.update(id, data);
      setPersonajes((prev) =>
        prev.map((p) => (p.id === id ? personajeActualizado : p))
      );
      return personajeActualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el personaje");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a character
  const deletePersonaje = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const personajeBorrado = await personajeAPI.delete(id);
      setPersonajes((prev) => prev.filter((p) => p.id !== id));
      return personajeBorrado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al borrar el personaje");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load characters when proyectoId changes
  useEffect(() => {
    if (proyectoId) {
      fetchPersonajes(proyectoId);
    } else {
      setPersonajes([]);
    }
  }, [proyectoId, fetchPersonajes]);

  return {
    personajes,
    loading,
    error,
    fetchPersonajes,
    fetchPersonaje,
    createPersonaje,
    updatePersonaje,
    deletePersonaje,
  };
};

export default useCharacters;
