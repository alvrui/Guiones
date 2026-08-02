// AgentesPage component for managing AI agents
import { useState } from "react";
import { useAgentesIA } from "../hooks/useAgentesIA";
import { AgenteIA, AgenteIACreate, AgenteIAUpdate } from "../types";
import { AgenteIAForm } from "../components/AgenteIAForm";
import { Modal } from "../components/Modal";

interface AgenteIACardProps {
  agente: AgenteIA;
  onEdit: (agente: AgenteIA) => void;
  onDelete: (id: string) => void;
}

const AgenteIACard = ({ agente, onEdit, onDelete }: AgenteIACardProps) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <h3 className="text-lg font-bold text-gray-800">{agente.nombre}</h3>
          </div>
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {agente.seccion}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {agente.modelo_mistral}
            </span>
            {agente.es_activo && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Activo
              </span>
            )}
            {!agente.es_activo && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                Inactivo
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Temp: {agente.temperatura} | Tokens: {agente.max_tokens}
          </p>
          {agente.prompt_sistema && (
            <p className="text-xs text-gray-500 mt-2 truncate">
              {agente.prompt_sistema.length > 100
                ? `${agente.prompt_sistema.substring(0, 100)}...`
                : agente.prompt_sistema}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(agente)}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(agente.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            title="Borrar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// Selector de Agente para otras secciones
export interface AgenteSelectorProps {
  seccion: string;
  agenteSeleccionadoId?: string;
  onSelect: (agenteId: string) => void;
}

export const AgenteSelector = ({
  seccion,
  agenteSeleccionadoId,
  onSelect,
}: AgenteSelectorProps) => {
  const { agentes, loading, error } = useAgentesIA();

  // Filter agents by section and active status
  const agentesFiltrados = agentes.filter(
    (a) => a.seccion === seccion && a.es_activo
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agente IA ({seccion})
        </label>
        <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
          Cargando...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agente IA ({seccion})
        </label>
        <div className="p-2 border border-red-300 rounded-md bg-red-50 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Agente IA ({seccion})
      </label>
      <select
        value={agenteSeleccionadoId || ""}
        onChange={handleSelectChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">Seleccionar agente...</option>
        {agentesFiltrados.map((agente) => (
          <option key={agente.id} value={agente.id}>
            {agente.nombre} ({agente.modelo_mistral})
          </option>
        ))}
      </select>
      {!agenteSeleccionadoId && agentesFiltrados.length > 0 && (
        <p className="text-xs text-yellow-600 mt-1">
          No hay agente seleccionado. Se usará el primero disponible.
        </p>
      )}
      {agentesFiltrados.length === 0 && (
        <p className="text-xs text-yellow-600 mt-1">
          No hay agentes configurados para esta sección. Ve a "Agentes" para crear uno.
        </p>
      )}
    </div>
  );
};

export const AgentesPage = () => {
  const {
    agentes,
    loading,
    error,
    createAgente,
    updateAgente,
    deleteAgente,
  } = useAgentesIA();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgente, setEditingAgente] = useState<AgenteIA | null>(null);

  // Handle edit agent
  const handleEditAgent = (agente: AgenteIA) => {
    setEditingAgente(agente);
    setIsModalOpen(true);
  };

  // Handle new agent
  const handleNewAgent = () => {
    setEditingAgente(null);
    setIsModalOpen(true);
  };

  // Handle delete agent
  const handleDeleteAgent = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar este agente IA? Esta acción no se puede deshacer."
      )
    ) {
      await deleteAgente(id);
    }
  };

  // Handle form submit
  const handleSubmit = async (data: AgenteIACreate | AgenteIAUpdate) => {
    if (editingAgente) {
      await updateAgente(editingAgente.id, data as AgenteIAUpdate);
    } else {
      await createAgente(data as AgenteIACreate);
    }
    setIsModalOpen(false);
    setEditingAgente(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAgente(null);
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Agentes IA</h1>
            <p className="text-gray-600">
              {agentes.length} agente{agentes.length !== 1 ? "s" : ""} configurado
              {agentes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleNewAgent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Nuevo Agente IA
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Agents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : agentes.length === 0 ? (
            <div className="col-span-full text-center p-8 text-gray-500">
              <p>No hay agentes IA configurados aún.</p>
              <p className="mt-2">Haz clic en "Nuevo Agente IA" para empezar.</p>
            </div>
          ) : (
            agentes.map((agente) => (
              <AgenteIACard
                key={agente.id}
                agente={agente}
                onEdit={handleEditAgent}
                onDelete={handleDeleteAgent}
              />
            ))
          )}
        </div>

        {/* Modal for agent form */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingAgente ? "Editar Agente IA" : "Nuevo Agente IA"}
          size="lg"
        >
          <AgenteIAForm
            agente={editingAgente || null}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            isLoading={loading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AgentesPage;
