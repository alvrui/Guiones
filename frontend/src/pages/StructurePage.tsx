import { SectionWithAgent } from "../components/SectionWithAgent";
// StructurePage component for managing narrative structure (acts and scenes)
import { useState } from "react";
import { useStructure } from "../hooks/useStructure";
import { useProject } from "../hooks/useProject";
import { useCharacters } from "../hooks/useCharacters";
import { usePlots } from "../hooks/usePlots";
import { EstructuraNarrativa, EstructuraNarrativaCreate, EstructuraNarrativaUpdate, TipoEstructuraNarrativa, Estado } from "../types";
import { Modal } from "../components/Modal";
import { AIButton } from "../components/AIButton";

// StructureForm component
const StructureForm = ({
  estructura,
  proyecto,
  personajes,
  tramas,
  onSubmit,
  onCancel,
  isLoading,
}: {
  estructura?: EstructuraNarrativa | null;
  proyecto: { id: string; estilo: string; tono_general: string };
  personajes: { id: string; nombre: string }[];
  tramas: { id: string; titulo: string }[];
  onSubmit: (data: EstructuraNarrativaCreate | EstructuraNarrativaUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const isActo = estructura?.tipo === "Acto" || !estructura;
  
  const [formData, setFormData] = useState({
    tipo: estructura?.tipo || "Escena",
    titulo: estructura?.titulo || "",
    numero_acto: estructura?.numero_acto || (isActo ? 1 : undefined),
    numero_escena: estructura?.numero_escena || (isActo ? undefined : 1),
    elementos_narrativos: estructura?.elementos_narrativos || [],
    personajes_involucrados: estructura?.personajes_involucrados || [],
    ubicacion: estructura?.ubicacion || "",
    texto_escena: estructura?.texto_escena || "",
    duracion_estimada: estructura?.duracion_estimada || "",
    notas_direccion: estructura?.notas_direccion || "",
    estado: estructura?.estado || "Borrador",
  });

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as TipoEstructuraNarrativa;
    setFormData((prev) => ({
      ...prev,
      tipo,
      numero_acto: tipo === "Acto" ? prev.numero_acto || 1 : undefined,
      numero_escena: tipo === "Escena" ? prev.numero_escena || 1 : undefined,
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

  // Handle trama selection
  const handleTramaToggle = (tramaId: string) => {
    setFormData((prev) => {
      const current = prev.elementos_narrativos || [];
      if (current.includes(tramaId)) {
        return {
          ...prev,
          elementos_narrativos: current.filter(id => id !== tramaId),
        };
      } else {
        return {
          ...prev,
          elementos_narrativos: [...current, tramaId],
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
    tipo: formData.tipo,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    personajes_involucrados: formData.personajes_involucrados,
    elementos_narrativos: formData.elementos_narrativos,
    ...formData,
  });

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <SectionWithAgent seccion="estructura">
      
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {estructura ? `Editar ${formData.tipo}` : "Nueva Estructura Narrativa"}
        </h2>

        {/* Tipo */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo *
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleTypeChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Acto">Acto</option>
            <option value="Escena">Escena</option>
          </select>
        </div>

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={formData.tipo === "Acto" ? "Ej: Acto 1: El Llamado" : "Ej: Juan recibe una carta anónima"}
            required
          />
        </div>

        {/* Número de Acto (only for Acto) */}
        {formData.tipo === "Acto" && (
          <div>
            <label htmlFor="numero_acto" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Acto *
            </label>
            <input
              type="number"
              id="numero_acto"
              name="numero_acto"
              value={formData.numero_acto || ""}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        )}

        {/* Número de Escena (only for Escena) */}
        {formData.tipo === "Escena" && (
          <div>
            <label htmlFor="numero_escena" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Escena *
            </label>
            <input
              type="number"
              id="numero_escena"
              name="numero_escena"
              value={formData.numero_escena || ""}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        )}

        {/* Elementos Narrativos (only for Escena) */}
        {formData.tipo === "Escena" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elementos Narrativos (Tramas)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tramas.map((t) => (
                <label
                  key={t.id}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    formData.elementos_narrativos?.includes(t.id)
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.elementos_narrativos?.includes(t.id) || false}
                    onChange={() => handleTramaToggle(t.id)}
                    className="mr-2"
                  />
                  {t.titulo}
                </label>
              ))}
            </div>
          </div>
        )}

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

        {/* Ubicación (only for Escena) */}
        {formData.tipo === "Escena" && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">
                Ubicación
              </label>
              <AIButton
                field="ubicacion"
                section="scene"
                context={getAIContext()}
                onGenerate={(content) => handleGenerateField("ubicacion", content)}
              />
            </div>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: Playa al atardecer"
            />
          </div>
        )}

        {/* Texto de Escena (only for Escena) */}
        {formData.tipo === "Escena" && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="texto_escena" className="block text-sm font-medium text-gray-700">
                Texto de la Escena
              </label>
              <AIButton
                field="texto_escena"
                section="scene"
                context={getAIContext()}
                onGenerate={(content) => handleGenerateField("texto_escena", content)}
              />
            </div>
            <textarea
              id="texto_escena"
              name="texto_escena"
              value={formData.texto_escena}
              onChange={handleChange}
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Diálogos, acciones y descripciones narrativas"
            />
          </div>
        )}

        {/* Duración Estimada (only for Escena) */}
        {formData.tipo === "Escena" && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="duracion_estimada" className="block text-sm font-medium text-gray-700">
                Duración Estimada
              </label>
              <AIButton
                field="duracion_estimada"
                section="scene"
                context={getAIContext()}
                onGenerate={(content) => handleGenerateField("duracion_estimada", content)}
              />
            </div>
            <input
              type="text"
              id="duracion_estimada"
              name="duracion_estimada"
              value={formData.duracion_estimada}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: 5 minutos"
            />
          </div>
        )}

        {/* Notas de Dirección (only for Escena) */}
        {formData.tipo === "Escena" && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="notas_direccion" className="block text-sm font-medium text-gray-700">
                Notas de Dirección
              </label>
              <AIButton
                field="notas_direccion"
                section="scene"
                context={getAIContext()}
                onGenerate={(content) => handleGenerateField("notas_direccion", content)}
              />
            </div>
            <textarea
              id="notas_direccion"
              name="notas_direccion"
              value={formData.notas_direccion}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Movimientos de cámara, efectos, etc."
            />
          </div>
        )}

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
            <option value="Revisión">Revisión</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white ${isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isLoading ? "Guardando..." : estructura ? `Actualizar ${formData.tipo}` : "Crear Estructura"}
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

    </SectionWithAgent>
  );
};

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
    <SectionWithAgent seccion="estructura">
      
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
                <strong>Ubicación:</strong> {estructura.ubicacion}
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
                <strong>Duración:</strong> {estructura.duracion_estimada}
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

    </SectionWithAgent>

    </SectionWithAgent>
  );
};

export const StructurePage = () => {
  return (
    <SectionWithAgent seccion="estructura">
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
    if (window.confirm("¿Estás seguro de que quieres borrar esta estructura?")) {
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
    tono_general: proyectoActual?.tono_general || "Melancólico",
  };

  return (
    <SectionWithAgent seccion="estructura">
      
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
                <p>No hay estructura narrativa creada aún.</p>
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

    </SectionWithAgent>

    </SectionWithAgent>
  );
};

export default StructurePage;
