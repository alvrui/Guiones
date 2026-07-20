// StructurePage component for managing narrative structure (acts and scenes)
import { useState } from "react";
import { useStructure } from "../hooks/useStructure";
import { useProject } from "../hooks/useProject";
import { useCharacters } from "../hooks/useCharacters";
import { usePlots } from "../hooks/usePlots";
import { EstructuraNarrativa, EstructuraNarrativaCreate, EstructuraNarrativaUpdate } from "../types";
import { Modal } from "../components/Modal";
import { StructureForm } from "../components/StructureForm";

// StructureCard component
const StructureCard = ({
  estructura,
  onEdit,
  onDelete,
}: {
  estructura: EstructuraNarrativa;
  onEdit: (estructura: EstructuraNarrativa) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{estructura.titulo}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded ${
              estructura.tipo === "Acto" 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            }`}>
              {estructura.tipo}
            </span>
            {estructura.estado && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {estructura.estado}
              </span>
            )}
            {estructura.tipo === "Acto" && estructura.numero_acto && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Acto {estructura.numero_acto}
              </span>
            )}
            {estructura.tipo === "Escena" && estructura.numero_escena && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Escena {estructura.numero_escena}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(estructura)}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(estructura.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            title="Borrar"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {estructura.tipo === "Escena" && (
          <>
            {estructura.ubicacion && (
              <p className="text-sm text-gray-600">
                <strong>Ubicaci\u00f3n:</strong> {estructura.ubicacion}
              </p>
            )}
            
            {estructura.texto_escena && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <strong>Texto:</strong>
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {estructura.texto_escena.length > 100 
                    ? `${estructura.texto_escena.substring(0, 100)}...` 
                    : estructura.texto_escena}
                </p>
              </div>
            )}
            
            {estructura.duracion_estimada && (
              <p className="text-sm text-gray-600">
                <strong>Duraci\u00f3n:</strong> {estructura.duracion_estimada}
              </p>
            )}
            
            {estructura.personajes_involucrados && estructura.personajes_involucrados.length > 0 && (
              <p className="text-sm text-gray-600">
                <strong>Personajes:</strong> {estructura.personajes_involucrados.length}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const StructurePage = () => {
  const { proyectoActual } = useProject();
  const {
    estructuras,
    loading,
    error,
    createEstructura,
    updateEstructura,
    deleteEstructura,
  } = useStructure(proyectoActual?.id || null);
  
  const { personajes } = useCharacters(proyectoActual?.id || null);
  const { tramas } = usePlots(proyectoActual?.id || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEstructura, setEditingEstructura] = useState<EstructuraNarrativa | null>(null);

  // Prepare personajes and tramas for form
  const personajesForForm = personajes.map(p => ({
    id: p.id,
    nombre: p.nombre,
  }));

  const tramasForForm = tramas.map(t => ({
    id: t.id,
    titulo: t.titulo,
  }));

  // Group structures by type
  const actos = estructuras.filter(e => e.tipo === "Acto");
  const escenas = estructuras.filter(e => e.tipo === "Escena");

  // Handle new structure
  const handleNewStructure = () => {
    if (!proyectoActual) {
      alert("Selecciona un proyecto primero");
      return;
    }
    setEditingEstructura(null);
    setIsModalOpen(true);
  };

  // Handle edit structure
  const handleEditStructure = (estructura: EstructuraNarrativa) => {
    setEditingEstructura(estructura);
    setIsModalOpen(true);
  };

  // Handle delete structure
  const handleDeleteStructure = async (id: string) => {
    if (window.confirm("\u00bfEst\u00e1s seguro de que quieres borrar esta estructura?")) {
      await deleteEstructura(id);
    }
  };

  // Handle form submit
  const handleSubmit = async (data: EstructuraNarrativaCreate | EstructuraNarrativaUpdate) => {
    if (!proyectoActual) return;

    if (editingEstructura) {
      await updateEstructura(editingEstructura.id, data as EstructuraNarrativaUpdate);
    } else {
      await createEstructura(proyectoActual.id, data as EstructuraNarrativaCreate);
    }
    setIsModalOpen(false);
    setEditingEstructura(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEstructura(null);
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
            <h1 className="text-2xl font-bold text-gray-800">Estructura Narrativa</h1>
            <p className="text-gray-600">
              {actos.length} acto{actos.length !== 1 ? "s" : ""}, {escenas.length} escena{escenas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleNewStructure}
            disabled={!proyectoActual}
            className={`px-4 py-2 rounded-md text-white ${!proyectoActual ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            + Nueva Estructura
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
            <p>Selecciona un proyecto primero para crear estructura narrativa.</p>
          </div>
        )}

        {/* Structure grid */}
        {proyectoActual && (
          <>
            {/* Actos */}
            {actos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Actos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {actos.map((acto) => (
                    <StructureCard
                      key={acto.id}
                      estructura={acto}
                      onEdit={handleEditStructure}
                      onDelete={handleDeleteStructure}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Escenas */}
            {escenas.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Escenas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {escenas.map((escena) => (
                    <StructureCard
                      key={escena.id}
                      estructura={escena}
                      onEdit={handleEditStructure}
                      onDelete={handleDeleteStructure}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {actos.length === 0 && escenas.length === 0 && !loading && (
              <div className="text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                <p>No hay estructura narrativa creada a\u00fan.</p>
                <p className="mt-2">Haz clic en "Nueva Estructura" para empezar.</p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Modal for structure form */}
            <Modal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              title={editingEstructura ? `Editar ${editingEstructura.tipo}` : "Nueva Estructura Narrativa"}
              size="xl"
            >
              <StructureForm
                estructura={editingEstructura || null}
                proyecto={proyectoData}
                personajes={personajesForForm}
                tramas={tramasForForm}
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

export default StructurePage;
