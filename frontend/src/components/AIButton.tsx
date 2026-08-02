// AIButton component for generating content with AI agents
import { useState, useRef, useEffect, useCallback } from "react";
import { AgenteIA } from "../types";
import { agenteIAAPI } from "../services/api";

interface AIButtonProps {
  field: string;
  seccion: string;
  context: Record<string, any>;
  agenteSeleccionadoId?: string;
  documentos?: any[];
  onGenerate: (content: string) => void;
  className?: string;
  disabled?: boolean;
}

// Conversation message type
interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  accepted?: boolean;
}

export const AIButton = ({
  field,
  seccion,
  context,
  agenteSeleccionadoId,
  documentos = [],
  onGenerate,
  className = "",
  disabled = false,
}: AIButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Prepare enhanced context with documents
  const getEnhancedContext = useCallback(() => {
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
    
    // Add section and field info
    baseContext.seccion = seccion;
    baseContext.field = field;
    
    return baseContext;
  }, [context, documentos, field, seccion]);

  // Generate content with AI
  const handleGenerate = useCallback(async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setLocalError(null);

    try {
      const enhancedContext = getEnhancedContext();
      
      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: `Generar ${field}`,
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, userMessage]);
      setShowConversation(true);

      // Call the API
      const response = await agenteIAAPI.generate({
        field,
        seccion,
        context: enhancedContext,
        agent_id: agenteSeleccionadoId,
      });

      const content = response.content;

      if (content) {
        // Add assistant message to conversation
        const assistantMessage: ConversationMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content,
          timestamp: new Date(),
        };
        setConversation((prev) => [...prev, assistantMessage]);
      } else {
        setLocalError("No se pudo generar contenido");
      }
    } catch (err) {
      setLocalError("Error al generar contenido con IA");
      console.error("Error generating with AI:", err);
    } finally {
      setIsLoading(false);
    }
  }, [disabled, isLoading, field, seccion, getEnhancedContext, agenteSeleccionadoId]);

  // Handle accept - append to field
  const handleAccept = useCallback((messageId: string) => {
    const message = conversation.find(m => m.id === messageId);
    if (message && message.role === "assistant") {
      onGenerate(message.content);
      // Mark as accepted
      setConversation((prev) =>
        prev.map(m => m.id === messageId ? { ...m, accepted: true } : m)
      );
    }
  }, [conversation, onGenerate]);

  // Handle reject
  const handleReject = useCallback((messageId: string) => {
    setConversation((prev) =>
      prev.map(m => m.id === messageId ? { ...m, accepted: false } : m)
    );
  }, []);

  // Toggle conversation visibility
  const toggleConversation = useCallback(() => {
    setShowConversation((prev) => !prev);
  }, []);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setConversation([]);
    setShowConversation(false);
    setLocalError(null);
  }, []);

  // Show tooltip with agent info
  const tooltipText = agenteSeleccionadoId
    ? `Generar con IA (Agente seleccionado)`
    : `Generar ${field} con IA`;

  // Count unread messages
  const unreadCount = conversation.filter(
    m => m.role === "assistant" && m.accepted === undefined
  ).length;

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
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
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Conversation area */}
      {showConversation && (
        <div className="mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-medium text-sm text-gray-700">
              Conversación con IA
            </h4>
            <div className="flex gap-2">
              <button
                onClick={clearConversation}
                className="text-xs text-gray-500 hover:text-gray-700"
                title="Limpiar conversación"
              >
                🗑️
              </button>
              <button
                onClick={toggleConversation}
                className="text-xs text-gray-500 hover:text-gray-700"
                title="Cerrar"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-3 max-h-80 overflow-y-auto">
            {conversation.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No hay mensajes aún. Haz clic en 🤖 para generar contenido.
              </p>
            ) : (
              conversation.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium {
                      message.role === "user" ? "text-gray-600" : "text-blue-600"
                    }">
                      {message.role === "user" ? "Tú" : "Asistente IA"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.role === "assistant" && message.accepted === undefined && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAccept(message.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                      >
                        ✅ Añadir
                      </button>
                      <button
                        onClick={() => handleReject(message.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  )}
                  {message.role === "assistant" && message.accepted === true && (
                    <p className="text-xs text-green-600 mt-1">✓ Añadido al campo</p>
                  )}
                  {message.role === "assistant" && message.accepted === false && (
                    <p className="text-xs text-red-600 mt-1">✗ Rechazado</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Error message */}
          {localError && (
            <div className="p-2 text-red-600 text-xs bg-red-50 border-t border-red-200">
              {localError}
            </div>
          )}
        </div>
      )}

      {/* Show conversation button when there are messages but it's hidden */}
      {!showConversation && conversation.length > 0 && (
        <button
          onClick={toggleConversation}
          className="mt-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
        >
          💬 Ver conversación ({conversation.length})
        </button>
      )}
    </div>
  );
};

export default AIButton;
