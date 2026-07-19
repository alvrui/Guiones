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
  personajes: { id: string; nombre: string }[];
  onSubmit: (data: NarrativaCreate | NarrativaUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState({
    titulo: narrativa?.titulo || "",
    tipo_estructura: narrativa?.tipo_estructura || "Lineal",
    sinopsis: narrativa?.sinopsis || "",
    temas_asociados: narrativa?.temas_asociados || [],
    tono: narrativa?.tono || "",
    personajes_involucrados: narrativa?.personajes_involucrados || [],
    conexiones_con_otras_narrativas: narrativa?.conexiones_con_otras_narrativas || "",
    estado: narrativa?.estado || "Borrador",
  });

  const [temasInput, setTemasInput] = useState(
    narrativa?.temas_asociados?.join(", ") || ""
  );

  // Sync temas input
  const handleTemasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTemasInput(value);
    setFormData((prev) => ({
      ...prev,
      temas_asociados: value.split(",").map(t => t.trim()).filter(t => t),
    }));
  };

  // Handle character selection
  const handlePersonajeToggle = (personajeId: string) => {
    setFormData((prev) => {
      const current = prev.personajes_involucrados || [];
      if (current.includes(personajeId)) {
        return {
          ...prev,
          personajes_involucrados: current.filter(id => id !== personajeId),
        };
      } else {
        return {
          ...prev,
          personajes_involucrados: [...current, personajeId],
        };
      }
    });
  };

  // Generate fields with AI
  const handleGenerateField = (field: string, content: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: content,
    }));
  };

  // Prepare context for AI
  const getAIContext = () => ({
    titulo: formData.titulo,
    tipo_estructura: formData.tipo_estructura,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    personajes_involucrados: formData.personajes_involucrados,
    ...formData,
  });

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {narrativa ? "Editar Narrativa" : "Nueva Narrativa"}
        </h2>

        {/* Título */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título *
            </label>
            <AIButton
              field="titulo"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("titulo", content)}
            />
          </div>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: La Búsqueda de la Verdad"
            required
          />
        </div>

        {/* Tipo de Estructura */}
        <div>
          <label htmlFor="tipo_estructura" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Estructura *
          </label>
          <select
            id="tipo_estructura"
            name="tipo_estructura"
            value={formData.tipo_estructura}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Lineal">Lineal</option>
            <option value="Episódica">Episódica</option>
            <option value="Temática">Temática</option>
            <option value="Circular">Circular</option>
            <option value="Asociativa">Asociativa</option>
          </select>
        </div>

        {/* Sinopsis */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="sinopsis" className="block text-sm font-medium text-gray-700">
              Sinopsis *
            </label>
            <AIButton
              field="sinopsis"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("sinopsis", content)}
            />
          </div>
          <textarea
            id="sinopsis"
            name="sinopsis"
            value={formData.sinopsis}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Resumen de la narrativa"
            required
          />
        </div>

        {/* Temas Asociados */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="temas_asociados" className="block text-sm font-medium text-gray-700">
              Temas Asociados
            </label>
            <AIButton
              field="temas_asociados"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => {
                const temas = content.split("\n").map(t => t.trim()).filter(t => t);
                setFormData((prev) => ({
                  ...prev,
                  temas_asociados: temas,
                }));
                setTemasInput(temas.join(", "));
              }}
            />
          </div>
          <input
            type="text"
            id="temas_asociados"
            value={temasInput}
            onChange={handleTemasChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: Amor, Pérdida, Redención"
          />
        </div>

        {/* Tono */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="tono" className="block text-sm font-medium text-gray-700">
              Tono
            </label>
            <AIButton
              field="tono"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => {
                // Parse the response (format: "Tono: X\nJustificación: Y")
                const tono = content.split("Tono: ")[1]?.split("\n")[0]?.trim() || "Drama";
                handleGenerateField("tono", tono);
              }}
            />
          </div>
          <select
            id="tono"
            name="tono"
            value={formData.tono}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Seleccionar...</option>
            <option value="Drama">Drama</option>
            <option value="Comedia">Comedia</option>
            <option value="Terror">Terror</option>
            <option value="Aventura">Aventura</option>
            <option value="Suspense">Suspense</option>
            <option value="Melancólico">Melancólico</option>
            <option value="Esperanzador">Esperanzador</option>
            <option value="Irónico">Irónico</option>
          </select>
        </div>

        {/* Personajes Involucrados */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personajes Involucrados
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {personajes.map((p) => (
              <label
                key={p.id}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  formData.personajes_involucrados?.includes(p.id)
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.personajes_involucrados?.includes(p.id) || false}
                  onChange={() => handlePersonajeToggle(p.id)}
                  className="mr-2"
                />
                {p.nombre}
              </label>
            ))}
          </div>
        </div>

        {/* Conexiones con Otras Narrativas */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="conexiones_con_otras_narrativas" className="block text-sm font-medium text-gray-700">
              Conexiones con Otras Narrativas
            </label>
            <AIButton
              field="conexiones"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("conexiones_con_otras_narrativas", content)}
            />
          </div>
          <textarea
            id="conexiones_con_otras_narrativas"
            name="conexiones_con_otras_narrativas"
            value={formData.conexiones_con_otras_narrativas}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Cómo esta narrativa se relaciona con otras"
          />
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Borrador">Borrador</option>
            <option value="En Desarrollo">En Desarrollo</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
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
  );
};

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
    if (window.confirm("¿Estás seguro de que quieres borrar esta narrativa?")) {
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
    tono_general: proyectoActual?.tono_general || "Melancólico",
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
                  <p>No hay narrativas creadas aún.</p>
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
