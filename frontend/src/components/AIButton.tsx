// AIButton component for generating content with AI agents
import { useState, useRef, useCallback } from "react";
import { AgenteIA } from "../types";
import { agenteIAAPI } from "../services/api";
import { useAgenteContext } from "../contexts/AgenteContext";
import { useAgentesIA } from "../hooks/useAgentesIA";

interface AIButtonProps {
  field: string;
  seccion: string;
  context: Record<string, any>;
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
  documentos = [],
  onGenerate,
  className = "",
  disabled = false,
}: AIButtonProps) => {
  const { getAgenteSeleccionado } = useAgenteContext();
  const { agentes } = useAgentesIA();
  const agenteSeleccionadoId = getAgenteSeleccionado(seccion);
  
  // Get the selected agent details
  const agenteSeleccionado = agentes.find(a => a.id === agenteSeleccionadoId);
  
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Prepare enhanced context with documents
  const getEnhancedContext = useCallback(() => {
    const baseContext = { ...context };
    
    // Add documents content to context if available
    if (documentos && documentos.length > 0) {
      baseContext.documentos = documentos.map(doc => ({
        nombre: doc.nombre,
        tipo: doc.tipo,
        contenido: doc.contenido?.length > 2000 
          ? `${doc.contenido.substring(0, 2000)}...` 
          : doc.contenido
      }));
    }
    
    // Add section and field info
    baseContext.seccion = seccion;
    baseContext.field = field;
    
    return baseContext;
  }, [context, documentos, field, seccion]);

  // Build the final prompt to send to AI
  const buildFinalPrompt = useCallback((customPrompt?: string) => {
    const basePrompt = customPrompt || `Genera contenido para el campo '${field}'`;
    
    // If we have agent system prompt, include it
    if (agenteSeleccionado?.prompt_sistema) {
      return `${agenteSeleccionado.prompt_sistema}\n\n${basePrompt}`;
    }
    
    return basePrompt;
  }, [field, agenteSeleccionado]);

  // Generate content with AI
  const handleGenerate = useCallback(async (useCustomPrompt?: boolean) => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setLocalError(null);

    try {
      const enhancedContext = getEnhancedContext();
      const finalPrompt = buildFinalPrompt(useCustomPrompt ? customPrompt : undefined);
      
      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: finalPrompt,
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, userMessage]);
      setShowConversation(true);
      
      if (useCustomPrompt) {
        setCustomPrompt("");
      }

      // Call the unified AI endpoint
      const response = await agenteIAAPI.generate({
        field,
        seccion,
        context: enhancedContext,
        agent_id: agenteSeleccionadoId || undefined,
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
  }, [disabled, isLoading, field, seccion, getEnhancedContext, agenteSeleccionadoId, buildFinalPrompt, customPrompt]);

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
  const tooltipText = agenteSeleccionado
    ? `Generar ${field} con IA (${agenteSeleccionado.nombre})`
    : `Generar ${field} con IA (sin agente seleccionado)`;

  // Count unread messages
  const unreadCount = conversation.filter(
    m => m.role === "assistant" && m.accepted === undefined
  ).length;

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => handleGenerate()}
        disabled={disabled || isLoading}
        className={`p-1 rounded text-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          isLoading ? "animate-pulse" : ""
        }`}
        title={tooltipText}
        aria-label={tooltipText}
      >
        {isLoading ? "\u23f3" : "\ud83e\udd16"}
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
            <div>
              <h4 className="font-medium text-sm text-gray-700">
                Conversaci\u00f3n con IA
              </h4>
              {agenteSeleccionado && (
                <p className="text-xs text-gray-500">
                  Agente: {agenteSeleccionado.nombre} ({agenteSeleccionado.modelo_mistral})
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearConversation}
                className="text-xs text-gray-500 hover:text-gray-700"
                title="Limpiar conversaci\u00f3n"
              >
                \ud83d\uddd1\ufe0f
              </button>
              <button
                onClick={toggleConversation}
                className="text-xs text-gray-500 hover:text-gray-700"
                title="Cerrar"
              >
                \u2715
              </button>
            </div>
          </div>
          
          {/* Custom prompt input */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={`Escribe una petici\u00f3n espec\u00edfica para ${field}...`}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => handleGenerate(true)}
                disabled={isLoading || !customPrompt.trim()}
                className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                title="Enviar petici\u00f3n personalizada"
              >
                \u27a4
              </button>
            </div>
          </div>
          
          <div className="p-3 max-h-80 overflow-y-auto">
            {conversation.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No hay mensajes a\u00fan. Haz clic en \ud83e\udd16 para generar contenido.
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
                    <span className={`text-xs font-medium ${
                      message.role === "user" ? "text-gray-600" : "text-blue-600"
                    }`}>
                      {message.role === "user" ? "T\u00fa" : "Asistente IA"}
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
                        \u2705 Validar y Aplicar
                      </button>
                      <button
                        onClick={() => handleReject(message.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        \u274c Rechazar
                      </button>
                    </div>
                  )}
                  {message.role === "assistant" && message.accepted === true && (
                    <p className="text-xs text-green-600 mt-1">\u2713 Contenido validado y aplicado</p>
                  )}
                  {message.role === "assistant" && message.accepted === false && (
                    <p className="text-xs text-red-600 mt-1">\u2717 Contenido rechazado</p>
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
          \ud83d\udcac Ver conversaci\u00f3n ({conversation.length})
        </button>
      )}
    </div>
  );
};

export default AIButton;
