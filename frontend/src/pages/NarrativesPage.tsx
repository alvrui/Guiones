import { SectionWithAgent } from "../components/SectionWithAgent";
// NarrativesPage component for managing narratives
import { useState } from "react";
import { useNarratives } from "../hooks/useNarratives";
import { useProject } from "../hooks/useProject";
import { useCharacters } from "../hooks/useCharacters";
import { Narrativa, NarrativaCreate, NarrativaUpdate, TipoEstructura, Estado } from "../types";
import { Modal } from "../components/Modal";
import { AIButton } from "../components/AIButton";
// NarrativeForm component
const NarrativeForm = ({
  narrativa,
  proyecto,
  personajes,
  onSubmit,
  onCancel,
  isLoading,
}: {
  narrativa?: Narrativa | null;
  proyecto: { id: string; estilo: string; tono_general: string };
  personajes: Array<{ id: string; nombre: string }>;
  onSubmit: (data: NarrativaCreate | NarrativaUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    titulo: narrativa?.titulo || "",
    tipo_estructura: narrativa?.tipo_estructura || "Lineal",
    sinopsis: narrativa?.sinopsis || "",
    temas_asociados: narrativa?.temas_asociados?.join(", ") || "",
    tono: narrativa?.tono || proyecto.tono_general,
    personajes_involucrados: narrativa?.personajes_involucrados || [],
    conexiones_con_otras_narrativas: narrativa?.conexiones_con_otras_narrativas || "",
    estado: narrativa?.estado || "Idea",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonajesChange = (selectedIds: string[]) => {
    setFormData((prev) => ({ ...prev, personajes_involucrados: selectedIds }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      temas_asociados: formData.temas_asociados
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    });
  };

  // Get AI context for narrative generation
  const getAIContext = () => ({
    titulo: formData.titulo,
    tipo_estructura: formData.tipo_estructura,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    sinopsis: formData.sinopsis,
    temas_asociados: formData.temas_asociados,
    personajes_involucrados: formData.personajes_involucrados,
  });

  return (
    <SectionWithAgent seccion="narrativas">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {narrativa ? "Editar Narrativa" : "Nueva Narrativa"}
        </h2>

        {/* Título */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Tipo de Estructura y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Estructura *
            </label>
            <select
              name="tipo_estructura"
              value={formData.tipo_estructura}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Lineal">Lineal</option>
              <option value="Episódica">Episódica</option>
              <option value="Temática">Temática</option>
              <option value="Circular">Circular</option>
              <option value="Asociativa">Asociativa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Idea">Idea</option>
              <option value="Borrador">Borrador</option>
              <option value="En Desarrollo">En Desarrollo</option>
              <option value="Completada">Completada</option>
              <option value="Revisión">Revisión</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
        </div>

        {/* Sinopsis */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Sinopsis *
            </label>
            <AIButton
              field="sinopsis"
              seccion="narrativas"
              context={getAIContext()}
              onGenerate={(content) => {
                setFormData((prev) => ({ ...prev, sinopsis: prev.sinopsis + " " + content }));
              }}
            />
          </div>
          <textarea
            name="sinopsis"
            value={formData.sinopsis}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Temas Asociados */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temas Asociados
          </label>
          <input
            type="text"
            name="temas_asociados"
            value={formData.temas_asociados}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Separa los temas con comas"
          />
        </div>

        {/* Tono */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tono
          </label>
          <select
            name="tono"
            value={formData.tono}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Oscuro">Oscuro</option>
            <option value="Ligero">Ligero</option>
            <option value="Melancólico">Melancólico</option>
            <option value="Esperanzador">Esperanzador</option>
            <option value="Irónico">Irónico</option>
            <option value="Suspense">Suspense</option>
            <option value="Tenso">Tenso</option>
            <option value="Cómico">Cómico</option>
          </select>
        </div>

        {/* Personajes Involucrados */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personajes Involucrados
          </label>
          <div className="space-y-2">
            {personajes.map((personaje) => (
              <label
                key={personaje.id}
                className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.personajes_involucrados.includes(personaje.id)}
                  onChange={() => {
                    const newIds = formData.personajes_involucrados.includes(personaje.id)
                      ? formData.personajes_involucrados.filter((id) => id !== personaje.id)
                      : [...formData.personajes_involucrados, personaje.id];
                    handlePersonajesChange(newIds);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span>{personaje.nombre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Conexiones con Otras Narrativas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conexiones con Otras Narrativas
          </label>
          <textarea
            name="conexiones_con_otras_narrativas"
            value={formData.conexiones_con_otras_narrativas}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Describe cómo esta narrativa se conecta con otras"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Guardando..." : narrativa ? "Actualizar Narrativa" : "Crear Narrativa"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
    </SectionWithAgent>
  );
};

// NarrativeCard component
const NarrativeCard = ({
  narrativa,
  personajes,
  onEdit,
  onDelete,
}: {
  narrativa: Narrativa;
  personajes: Array<{ id: string; nombre: string }>;
  onEdit: (narrativa: Narrativa) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📜</span>
            <h3 className="text-lg font-bold text-gray-800">{narrativa.titulo}</h3>
          </div>
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {narrativa.tipo_estructura}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {narrativa.estado || "Idea"}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {narrativa.sinopsis.length > 100
              ? `${narrativa.sinopsis.substring(0, 100)}...`
              : narrativa.sinopsis}
          </p>
          {narrativa.personajes_involucrados && narrativa.personajes_involucrados.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Personajes:</p>
              <div className="flex flex-wrap gap-1">
                {narrativa.personajes_involucrados.map((id) => {
                  const personaje = personajes.find((p) => p.id === id);
                  return personaje ? (
                    <span
                      key={id}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {personaje.nombre}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(narrativa)}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(narrativa.id)}
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
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar esta narrativa? Esta acción no se puede deshacer."
      )
    ) {
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

  return (
    <SectionWithAgent seccion="narrativas">
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Narrativas</h1>
              <p className="text-gray-600">
                {narrativas.length} narrativa{narrativas.length !== 1 ? "s" : ""} creada
                {narrativas.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleNewNarrative}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!proyectoActual}
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

          {/* Narratives grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : narrativas.length === 0 ? (
              <div className="col-span-full text-center p-8 text-gray-500">
                <p>No hay narrativas creadas aún.</p>
                <p className="mt-2">
                  Selecciona un proyecto y haz clic en "Nueva Narrativa" para empezar.
                </p>
              </div>
            ) : (
              narrativas.map((narrativa) => (
                <NarrativeCard
                  key={narrativa.id}
                  narrativa={narrativa}
                  personajes={personajes}
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
            {proyectoActual && (
              <NarrativeForm
                narrativa={editingNarrativa || null}
                proyecto={{
                  id: proyectoActual.id,
                  estilo: proyectoActual.estilo,
                  tono_general: proyectoActual.tono_general,
                }}
                personajes={personajes}
                onSubmit={handleSubmit}
                onCancel={handleModalClose}
                isLoading={loading}
              />
            )}
          </Modal>
        </div>
      </div>
    </SectionWithAgent>
  );
};

export default NarrativesPage;
