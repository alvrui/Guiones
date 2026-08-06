// PlotsPageNew v2 - Complete UX redesign
// Separates Library (discovery) from Builder (composition)
import { useState, useCallback, useMemo } from "react";
import { SectionWithAgent } from "../components/SectionWithAgent";
import { usePlots } from "../hooks/usePlots";
import { useProject } from "../hooks/useProject";
import { useCharacters } from "../hooks/useCharacters";
import { useStoryElements } from "../hooks/useStoryElements";
import { 
  Trama, 
  TramaCreate, 
  TramaUpdate, 
} from "../types";
import { Modal } from "../components/Modal";
import { AIButton } from "../components/AIButton";
import { StoryElementLibrary } from "../components/StoryElementLibrary";
import { PlotBuilder } from "../components/PlotBuilder";
import { usePlotBuilder } from "../hooks/usePlotBuilder";

// PlotForm component - NEW UX
const PlotFormNew = ({
  trama,
  proyecto,
  personajes,
  onSubmit,
  onCancel,
  isLoading,
}: {
  trama?: Trama | null;
  proyecto: { id: string; estilo: string; tono_general: string };
  personajes: { id: string; nombre: string }[];
  onSubmit: (data: TramaCreate | TramaUpdate) => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const { elements: allStoryElements, loading: storyElementsLoading } = useStoryElements();
  
  // Use the new plot builder hook
  const {
    // Library state
    searchQuery,
    selectedCategory,
    viewMode,
    showFavorites,
    showRecentlyUsed,
    showSuggestions,
    
    // Builder state
    plotElements,
    
    // Favorites and recently used
    favorites,
    recentlyUsed,
    
    // AI suggestions
    aiSuggestions,
    
    // Actions
    setSearchQuery,
    setSelectedCategory,
    setViewMode,
    toggleFavorites,
    toggleRecentlyUsed,
    toggleSuggestions,
    addElement,
    removeElement,
    updateElementOrder,
    updateElementNotes,
    updateElementCustomName,
    updateElementCustomDescription,
    toggleFavorite,
    convertToElementosNarrativos,
  } = usePlotBuilder(allStoryElements);

  // Form data
  const [formData, setFormData] = useState({
    titulo: trama?.titulo || "",
    arquetipo_narrativo: trama?.arquetipo_narrativo || "Viaje del Héroe",
    personajes_involucrados: trama?.personajes_involucrados || [],
    subtramas: trama?.subtramas || [],
    obstaculos: trama?.obstaculos || [],
    estado: trama?.estado || "Idea",
    notas: trama?.notas || "",
  });

  // Initialize with existing elements if editing
  useMemo(() => {
    if (trama?.elementos_narrativos && plotElements.length === 0) {
      // This would need mapping from old format to new, but for now we skip
      // as the user wants to start fresh with CSV elements only
    }
  }, [trama, plotElements.length]);

  // Handle form change
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle character selection
  const handlePersonajeToggle = useCallback((personajeId: string) => {
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
  }, []);

  // Generate fields with AI
  const handleGenerateField = useCallback((field: string, content: string) => {
    if (field === "obstaculos") {
      const obstaculos = content.split("\n").map(o => o.trim()).filter(o => o);
      setFormData((prev) => ({
        ...prev,
        obstaculos: obstaculos,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: content,
      }));
    }
  }, []);

  // Prepare context for AI
  const getAIContext = useCallback(() => ({
    titulo: formData.titulo,
    arquetipo_narrativo: formData.arquetipo_narrativo,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    personajes_involucrados: formData.personajes_involucrados,
    storyElements: plotElements.map(e => ({
      name: e.name,
      type: e.type,
      description: e.description,
    })),
    ...formData,
  }), [formData, proyecto, plotElements]);

  // Handle submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      elementos_narrativos: convertToElementosNarrativos(),
    });
  }, [formData, convertToElementosNarrativos, onSubmit]);

  // Prepare categories for library
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { name: string; count: number }>();
    
    allStoryElements.forEach(element => {
      if (element.category) {
        const existing = categoryMap.get(element.category);
        if (existing) {
          categoryMap.set(element.category, {
            ...existing,
            count: existing.count + 1
          });
        } else {
          categoryMap.set(element.category, { name: element.category, count: 1 });
        }
      }
    });
    
    return Array.from(categoryMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      count: data.count,
    }));
  }, [allStoryElements]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {trama ? "Editar Trama" : "Nueva Trama"}
        </h2>

        {/* Basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Título */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                Título *
              </label>
              <AIButton
                field="titulo"
                section="plot"
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
              placeholder="Ej: La Conspiración del Coronel"
              required
            />
          </div>

          {/* Arquetipo Narrativo */}
          <div>
            <label htmlFor="arquetipo_narrativo" className="block text-sm font-medium text-gray-700 mb-1">
              Arquetipo Narrativo *
            </label>
            <select
              id="arquetipo_narrativo"
              name="arquetipo_narrativo"
              value={formData.arquetipo_narrativo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Viaje del Héroe">Viaje del Héroe</option>
              <option value="Tragedia">Tragedia</option>
              <option value="Comedia">Comedia</option>
              <option value="Búsqueda">Búsqueda</option>
              <option value="Aventura">Aventura</option>
              <option value="Misterio">Misterio</option>
              <option value="Romance">Romance</option>
              <option value="Supervivencia">Supervivencia</option>
            </select>
          </div>
        </div>

        {/* NEW UX: Library + Builder */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Construye tu trama
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Library (Discovery) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Biblioteca de Story Elements</h4>
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => setViewMode("compact")}
                    className={`px-2 py-1 rounded ${viewMode === "compact" ? "bg-white text-blue-600" : "text-gray-500"}`}
                  >
                    Compacto
                  </button>
                  <button
                    onClick={() => setViewMode("detailed")}
                    className={`px-2 py-1 rounded ${viewMode === "detailed" ? "bg-white text-blue-600" : "text-gray-500"}`}
                  >
                    Detallado
                  </button>
                </div>
              </div>
              
              {storyElementsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="ml-4 text-gray-600">Cargando catálogo...</p>
                </div>
              ) : (
                <StoryElementLibrary
                  elements={allStoryElements}
                  favorites={favorites}
                  recentlyUsed={recentlyUsed}
                  aiSuggestions={aiSuggestions}
                  collections={[]}
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  viewMode={viewMode}
                  showFavorites={showFavorites}
                  showRecentlyUsed={showRecentlyUsed}
                  showSuggestions={showSuggestions}
                  onSearchChange={setSearchQuery}
                  onCategorySelect={setSelectedCategory}
                  onViewModeChange={setViewMode}
                  onToggleFavorites={toggleFavorites}
                  onToggleRecentlyUsed={toggleRecentlyUsed}
                  onToggleSuggestions={toggleSuggestions}
                  onAddElement={addElement}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </div>

            {/* RIGHT: Builder (Composition) */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">Constructor de Trama</h4>
                <span className="text-sm text-gray-500">
                  {plotElements.length} elementos
                </span>
              </div>
              
              <PlotBuilder
                elements={plotElements}
                onRemoveElement={removeElement}
                onUpdateOrder={updateElementOrder}
                onUpdateNotes={updateElementNotes}
                onUpdateCustomName={updateElementCustomName}
                onUpdateCustomDescription={updateElementCustomDescription}
                onSelectElement={(id) => {}}
              />
            </div>
          </div>
        </div>

        {/* Personajes Involucrados */}
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personajes Involucrados *
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
                  required={formData.personajes_involucrados.length === 0}
                />
                {p.nombre}
              </label>
            ))}
          </div>
        </div>

        {/* Obstáculos */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="obstaculos" className="block text-sm font-medium text-gray-700">
              Obstáculos
            </label>
            <AIButton
              field="obstaculos"
              section="plot"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("obstaculos", content)}
            />
          </div>
          <textarea
            id="obstaculos"
            name="obstaculos"
            value={formData.obstaculos.join("\n")}
            onChange={(e) => setFormData((prev) => ({
              ...prev,
              obstaculos: e.target.value.split("\n").map(o => o.trim()).filter(o => o),
            }))}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Barreras que los personajes deben superar"
          />
        </div>

        {/* Estado */}
        <div className="border-t border-gray-200 pt-6">
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
            <option value="Idea">Idea</option>
            <option value="En Desarrollo">En Desarrollo</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        {/* Notas */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700">
              Notas
            </label>
            <AIButton
              field="notas"
              section="plot"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("notas", content)}
            />
          </div>
          <textarea
            id="notas"
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Información adicional sobre la trama"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading || plotElements.length === 0}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading || plotElements.length === 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Guardando..." : trama ? "Actualizar Trama" : "Crear Trama"}
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

// PlotCard component (unchanged from original)
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
              <strong>Obstáculos:</strong>
            </p>
            <ul className="text-sm text-gray-800 mt-1 list-disc list-inside">
              {trama.obstaculos.slice(0, 3).map((obstaculo, index) => (
                <li key={index}>{obstaculo}</li>
              ))}
              {trama.obstaculos.length > 3 && (
                <li className="text-gray-500">+{trama.obstaculos.length - 3} más</li>
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

// Main PlotsPage component
export const PlotsPageNew_v2 = () => {
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
    if (window.confirm("¿Estás seguro de que quieres borrar esta trama? Esto afectará a las escenas que la referencian.")) {
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
    tono_general: proyectoActual?.tono_general || "Melancólico",
  };

  return (
    <SectionWithAgent seccion="tramas">
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
                    <p>No hay tramas creadas aún.</p>
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
                size="full"
              >
                <PlotFormNew
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
    </SectionWithAgent>
  );
};

export default PlotsPageNew_v2;
