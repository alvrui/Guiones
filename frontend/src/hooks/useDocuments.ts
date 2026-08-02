// Hook for managing project documents
import { useState, useCallback, useEffect } from "react";
import { Documento } from "../types";
import { api } from "../services/api";

export const useDocuments = (proyectoId: string | null) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents for a project
  const fetchDocumentos = useCallback(async () => {
    if (!proyectoId) {
      setDocumentos([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/proyectos/${proyectoId}/documentos`);
      setDocumentos(response.data || []);
    } catch (err) {
      setError("Error al cargar los documentos");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  }, [proyectoId]);

  // Upload a document
  const uploadDocumento = useCallback(
    async (file: File, proyectoId: string) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post(
          `/proyectos/${proyectoId}/documentos`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Refresh documents list
        await fetchDocumentos();
        return response.data;
      } catch (err) {
        console.error("Error uploading document:", err);
        throw err;
      }
    },
    [fetchDocumentos]
  );

  // Delete a document
  const deleteDocumento = useCallback(
    async (documentoId: string) => {
      try {
        await api.delete(`/documentos/${documentoId}`);
        // Refresh documents list
        await fetchDocumentos();
      } catch (err) {
        console.error("Error deleting document:", err);
        throw err;
      }
    },
    [fetchDocumentos]
  );

  // Auto-fetch when proyectoId changes
  useEffect(() => {
    if (proyectoId) {
      fetchDocumentos();
    }
  }, [proyectoId, fetchDocumentos]);

  return {
    documentos,
    loading,
    error,
    uploadDocumento,
    deleteDocumento,
    fetchDocumentos,
  };
};
