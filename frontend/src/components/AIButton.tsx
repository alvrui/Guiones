// AIButton component for generating content with AI
import { useState, useRef, useEffect } from "react";
import { useAI } from "../hooks/useAI";
import { Personaje, Proyecto, Trama, Narrativa, EstructuraNarrativa, Documento } from "../types";

interface AIButtonProps {
  field: string;
  section: "character" | "plot" | "scene" | "narrative";
  context: Record<string, any>;
  documentos?: Documento[];
  onGenerate: (content: string) => void;
  className?: string;
  disabled?: boolean;
}

export const AIButton = ({
  field,
  section,
  context,
  documentos = [],
  onGenerate,
  className = "",
  disabled = false,
}: AIButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { generateCharacterField, generatePlotField, generateSceneField, generateNarrativeField, error: aiError, clearError } = useAI();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Clear AI error when component mounts or unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Prepare enhanced context with documents
  const getEnhancedContext = () => {
    const baseContext = { ...context };
    
    // Add documents content to context if available
    if (documentos && documentos.length > 0) {
      baseContext.documentos = documentos.map(doc => ({
        nombre: doc.nombre,
        tipo: doc.tipo,
        contenido: doc.contenido.length > 2000 
          ? `${doc.contenido.substring(0, 2000)}...` 
          : doc.contenido
      }));
    }
    
    return baseContext;
  };

  // Generate content based on section
  const handleGenerate = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setLocalError(null);
    setGeneratedContent(null);
    setIsValidated(false);

    try {
      const enhancedContext = getEnhancedContext();
      let content: string | null = null;

      switch (section) {
        case "character":
          content = await generateCharacterField(field, enhancedContext);
          break;
        case "plot":
          content = await generatePlotField(field, enhancedContext);
          break;
        case "scene":
          content = await generateSceneField(field, enhancedContext);
          break;
        case "narrative":
          content = await generateNarrativeField(field, enhancedContext);
          break;
      }

      if (content) {
        setGeneratedContent(content);
      } else {
        setLocalError("No se pudo generar contenido");
      }
    } catch (err) {
      setLocalError("Error al generar contenido con IA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    if (generatedContent) {
      onGenerate(generatedContent);
      setIsValidated(true);
      setGeneratedContent(null);
    }
  };

  const handleReject = () => {
    setGeneratedContent(null);
    setLocalError(null);
  };

  // Show error from AI hook
  const displayError = aiError || localError;

  // Show tooltip with document count
  const tooltipText = documentos && documentos.length > 0
    ? `Generar con IA (${documentos.length} documento${documentos.length > 1 ? 's' : ''} como referencia)`
    : `Generar ${field} con IA`;

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleGenerate}
        disabled={disabled || isLoading}
        className={`p-1 rounded text-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          isLoading ? "animate-pulse" : ""
        }`}
        title={tooltipText}
        aria-label={tooltipText}
      >
        {isLoading ? "⏳" : "🤖"}
      </button>

      {/* Generated content preview */}
      {generatedContent && !isValidated && (
        <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-sm text-gray-700">
              Contenido generado por IA:
            </h4>
          </div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {generatedContent}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAccept}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
            >
              ✅ Aceptar
            </button>
            <button
              onClick={handleReject}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            >
              ❌ Rechazar
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {displayError && !generatedContent && (
        <div className="mt-2 p-2 text-red-600 text-xs bg-red-50 rounded">
          {displayError}
        </div>
      )}
    </div>
  );
};

export default AIButton;
