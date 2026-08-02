// DocumentLibrary component for managing project documents
import { useState, useRef, useCallback } from "react";
import { Documento } from "../types";

interface DocumentLibraryProps {
  proyectoId: string;
  documentos: Documento[];
  onUpload: (file: File, proyectoId: string) => Promise<void>;
  onDelete: (documentoId: string) => Promise<void>;
  isLoading?: boolean;
}

export const DocumentLibrary = ({
  proyectoId,
  documentos,
  onUpload,
  onDelete,
  isLoading = false,
}: DocumentLibraryProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["text/plain", "text/markdown", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|md|pdf|docx)$/i)) {
        setError("Tipo de archivo no soportado. Usa: .txt, .md, .pdf, .docx");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (file.size > maxSize) {
        setError("El archivo es demasiado grande. Máximo 5MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        await onUpload(file, proyectoId);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        setError("Error al subir el archivo. Inténtalo de nuevo.");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, proyectoId]
  );

  const handleDelete = useCallback(
    async (documentoId: string) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar este documento?")) {
        try {
          await onDelete(documentoId);
        } catch (err) {
          setError("Error al eliminar el documento. Inténtalo de nuevo.");
        }
      }
    },
    [onDelete]
  );

  const toggleExpand = useCallback((docId: string) => {
    setExpandedDoc((prev) => (prev === docId ? null : docId));
  }, []);

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case "pdf":
        return "📄";
      case "txt":
        return "📝";
      case "docx":
        return "📑";
      case "md":
        return "📋";
      default:
        return "📁";
    }
  };

  const getFileExtension = (nombre: string) => {
    const parts = nombre.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "otro";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Biblioteca de Documentos</h2>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.md,.pdf,.docx"
            className="hidden"
            disabled={isLoading || isUploading}
          />
          {isUploading ? "Subiendo..." : "+ Añadir Documento"}
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md mb-4">{error}</div>
      )}

      {documentos.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          <p>No hay documentos subidos aún.</p>
          <p className="mt-2 text-sm">
            Sube archivos de texto (.txt, .md), PDF o Word (.docx) para usar como
            referencia en la generación de contenido con IA.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documentos.map((doc) => {
            const ext = getFileExtension(doc.nombre);
            const displayType = ext as "pdf" | "txt" | "docx" | "md" | "otro";
            return (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getFileIcon(displayType)}</span>
                      <span className="font-medium text-gray-800">{doc.nombre}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {displayType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Subido: {new Date(doc.fecha_subida).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleExpand(doc.id)}
                      className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                      title="Ver contenido"
                    >
                      {expandedDoc === doc.id ? "🔝" : "👁️"}
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {expandedDoc === doc.id && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                      {doc.contenido.length > 1000
                        ? `${doc.contenido.substring(0, 1000)}...`
                        : doc.contenido}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isUploading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
