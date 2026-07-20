// PlotsPage component for managing plots
import { useState } from "react";
import { usePlots } from "../hooks/usePlots";
import { useProject } from "../hooks/useProject";
import { useCharacters } from "../hooks/useCharacters";
import { Trama, TramaCreate, TramaUpdate } from "../types";
import { Modal } from "../components/Modal";
import { PlotForm } from "../components/PlotForm";

// PlotCard component
const PlotCard = ({
  trama,
  onEdit,
  onDelete,
}: {
  trama: Trama;
  onEdit: (trama: Trama) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{trama.titulo}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {trama.arquetipo_narrativo}
            </span>
            {trama.estado && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {trama.estado}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(trama)}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(trama.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            title="Borrar"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Arquetipo:</strong> {trama.arquetipo_narrativo}
        </p>

        <p className="text-sm text-gray-600">
          <strong>Elementos:</strong> {trama.elementos_narrativos.length}
        </p>

        {trama.personajes_involucrados && trama.personajes_involucrados.length > 0 && (
          <p className="text-sm text-gray-600">
            <strong>Personajes:</strong> {trama.personajes_involucrados.length}
          </p>
        )}

        {trama.obstaculos && trama.obstaculos.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>Obst\u00e1culos:</strong>
            </p>
            <ul className="text-sm text-gray-800 mt-1 list-disc list-inside">
              {trama.obstaculos.slice(0, 3).map((obstaculo, index) => (
                <li key={index}>{obstaculo}</li>
              ))}
              {trama.obstaculos.length > 3 && (
                <li className="text-gray-500">+{trama.obstaculos.length - 3} m\u00e1s</li>
              )}
            </ul>
          </div>
        )}

        {trama.notas && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>Notas:</strong>
            </p>
            <p className="text-sm text-gray-800 mt-1">
              {trama.notas.length > 100 
                ? `${trama.notas.substring(0, 100)}...` 
                : trama.notas}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const PlotsPage = () => {
  const { proyectoActual } = useProject();
  const {
    tramas,
    loading,
    error,
    createTrama,
    updateTrama,
    deleteTrama,
  } = usePlots(proyectoActual?.id || null);
  
  const { personajes } = useCharacters(proyectoActual?.id || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrama, setEditingTrama] = useState<Trama | null>(null);

  // Prepare personajes for form
  const personajesForForm = personajes.map(p => ({
    id: p.id,
    nombre: p.nombre,
  }));

  // Handle new plot
  const handleNewPlot = () => {
    if (!proyectoActual) {
      alert("Selecciona un proyecto primero");
      return;
    }
    setEditingTrama(null);
    setIsModalOpen(true);
  };

  // Handle edit plot
  const handleEditPlot = (trama: Trama) => {
    setEditingTrama(trama);
    setIsModalOpen(true);
  };

  // Handle delete plot
  const handleDeletePlot = async (id: string) => {
    if (window.confirm("\u00bfEst\u00e1s seguro de que quieres borrar esta trama? Esto afectar\u00e1 a las escenas que la referencian.")) {
      await deleteTrama(id);
    }
  };

  // Handle form submit
  const handleSubmit = async (data: TramaCreate | TramaUpdate) => {
    if (!proyectoActual) return;

    if (editingTrama) {
      await updateTrama(editingTrama.id, data as TramaUpdate);
    } else {
      await createTrama(proyectoActual.id, data as TramaCreate);
    }
    setIsModalOpen(false);
    setEditingTrama(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTrama(null);
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
            <h1 className="text-2xl font-bold text-gray-800">Tramas</h1>
            <p className="text-gray-600">
              {tramas.length} trama{tramas.length !== 1 ? "s" : ""} creada{tramas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleNewPlot}
            disabled={!proyectoActual}
            className={`px-4 py-2 rounded-md text-white ${!proyectoActual ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            + Nueva Trama
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
            <p>Selecciona un proyecto primero para crear tramas.</p>
          </div>
        )}

        {/* Plots grid */}
        {proyectoActual && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : tramas.length === 0 ? (
                <div className="col-span-full text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <p>No hay tramas creadas a\u00fan.</p>
                  <p className="mt-2">Haz clic en "Nueva Trama" para empezar.</p>
                </div>
              ) : (
                tramas.map((trama) => (
                  <PlotCard
                    key={trama.id}
                    trama={trama}
                    onEdit={handleEditPlot}
                    onDelete={handleDeletePlot}
                  />
                ))
              )}
            </div>

            {/* Modal for plot form */}
            <Modal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              title={editingTrama ? "Editar Trama" : "Nueva Trama"}
              size="xl"
            >
              <PlotForm
                trama={editingTrama || null}
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

export default PlotsPage;
