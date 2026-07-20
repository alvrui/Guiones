// NarrativesPage component for managing narratives
import { useState } from "react";
import { useNarratives } from "../hooks/useNarratives";
import { useProject } from "../hooks/useProject";
import { useCharacters } from "../hooks/useCharacters";
import { Narrativa, NarrativaCreate, NarrativaUpdate } from "../types";
import { Modal } from "../components/Modal";
import { NarrativeForm } from "../components/NarrativeForm";

// NarrativeCard component
const NarrativeCard = ({
  narrativa,
  onEdit,
  onDelete,
}: {
  narrativa: Narrativa;
  onEdit: (narrativa: Narrativa) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{narrativa.titulo}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {narrativa.tipo_estructura}
            </span>
            {narrativa.tono && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {narrativa.tono}
              </span>
            )}
            {narrativa.estado && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {narrativa.estado}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(narrativa)}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            title="Editar"
          >
            \u270f\ufe0f
          </button>
          <button
            onClick={() => onDelete(narrativa.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            title="Borrar"
          >
            \ud83d\uddd1\ufe0f
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Sinopsis:</strong>
        </p>
        <p className="text-sm text-gray-800">
          {narrativa.sinopsis.length > 150
            ? `${narrativa.sinopsis.substring(0, 150)}...`
            : narrativa.sinopsis}
        </p>

        {narrativa.temas_asociados && narrativa.temas_asociados.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>Temas:</strong>
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {narrativa.temas_asociados.map((tema) => (
                <span
                  key={tema}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tema}
                </span>
              ))}
            </div>
          </div>
        )}

        {narrativa.personajes_involucrados && narrativa.personajes_involucrados.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>Personajes:</strong> {narrativa.personajes_involucrados.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const NarrativesPage = () => {
  const { proyectoActual } = useProject();
  const {
    narrativas,
    loading,
    error,
    createNarrativa,
    updateNarrativa,
    deleteNarrativa,
  } = useNarratives(proyectoActual?.id || null);
  
  const { personajes } = useCharacters(proyectoActual?.id || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNarrativa, setEditingNarrativa] = useState<Narrativa | null>(null);

  // Prepare personajes for form
  const personajesForForm = personajes.map(p => ({
    id: p.id,
    nombre: p.nombre,
  }));

  // Handle new narrative
  const handleNewNarrative = () => {
    if (!proyectoActual) {
      alert("Selecciona un proyecto primero");
      return;
    }
    setEditingNarrativa(null);
    setIsModalOpen(true);
  };

  // Handle edit narrative
  const handleEditNarrative = (narrativa: Narrativa) => {
    setEditingNarrativa(narrativa);
    setIsModalOpen(true);
  };

  // Handle delete narrative
  const handleDeleteNarrative = async (id: string) => {
    if (window.confirm("\u00bfEst\u00e1s seguro de que quieres borrar esta narrativa?")) {
      await deleteNarrativa(id);
    }
  };

  // Handle form submit
  const handleSubmit = async (data: NarrativaCreate | NarrativaUpdate) => {
    if (!proyectoActual) return;

    if (editingNarrativa) {
      await updateNarrativa(editingNarrativa.id, data as NarrativaUpdate);
    } else {
      await createNarrativa(proyectoActual.id, data as NarrativaCreate);
    }
    setIsModalOpen(false);
    setEditingNarrativa(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingNarrativa(null);
  };

  // Prepare project data for form
  const proyectoData = {
    id: proyectoActual?.id || "",
    estilo: proyectoActual?.estilo || "Realista",
    tono_general: proyectoActual?.tono_general || "Melanc\u00f3lico",
  };

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Narrativas</h1>
            <p className="text-gray-600">
              {narrativas.length} narrativa{narrativas.length !== 1 ? "s" : ""} creada{narrativas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleNewNarrative}
            disabled={!proyectoActual}
            className={`px-4 py-2 rounded-md text-white ${!proyectoActual ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            + Nueva Narrativa
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* No project selected */}
        {!proyectoActual && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            <p>Selecciona un proyecto primero para crear narrativas.</p>
          </div>
        )}

        {/* Narratives grid */}
        {proyectoActual && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : narrativas.length === 0 ? (
                <div className="col-span-full text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <p>No hay narrativas creadas a\u00fan.</p>
                  <p className="mt-2">Haz clic en "Nueva Narrativa" para empezar.</p>
                </div>
              ) : (
                narrativas.map((narrativa) => (
                  <NarrativeCard
                    key={narrativa.id}
                    narrativa={narrativa}
                    onEdit={handleEditNarrative}
                    onDelete={handleDeleteNarrative}
                  />
                ))
              )}
            </div>

            {/* Modal for narrative form */}
            <Modal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              title={editingNarrativa ? "Editar Narrativa" : "Nueva Narrativa"}
              size="xl"
            >
              <NarrativeForm
                narrativa={editingNarrativa || null}
                proyecto={proyectoData}
                personajes={personajesForForm}
                onSubmit={handleSubmit}
                onCancel={handleModalClose}
                isLoading={loading}
              />
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default NarrativesPage;
