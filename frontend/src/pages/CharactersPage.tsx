import { SectionWithAgent } from "../components/SectionWithAgent";
// CharactersPage component for managing characters
import { useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import { useProject } from "../hooks/useProject";
import { Personaje, PersonajeCreate, PersonajeUpdate } from "../types";
import { CharacterForm } from "../components/CharacterForm";
import { CharacterCard } from "../components/CharacterCard";
import { Modal } from "../components/Modal";

export const CharactersPage = () => {
  const { proyectoActual } = useProject();
  const {
    personajes,
    loading,
    error,
    createPersonaje,
    updatePersonaje,
    deletePersonaje,
  } = useCharacters(proyectoActual?.id || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonaje, setEditingPersonaje] = useState<Personaje | null>(null);

  // Handle new character
  const handleNewCharacter = () => {
    if (!proyectoActual) {
      alert("Selecciona un proyecto primero");
      return;
    }
    setEditingPersonaje(null);
    setIsModalOpen(true);
  };

  // Handle edit character
  const handleEditCharacter = (personaje: Personaje) => {
    setEditingPersonaje(personaje);
    setIsModalOpen(true);
  };

  // Handle delete character
  const handleDeleteCharacter = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres borrar este personaje? Esto afectará a las tramas y escenas que lo referencian.")) {
      await deletePersonaje(id);
    }
  };

  // Handle form submit
  const handleSubmit = async (data: PersonajeCreate | PersonajeUpdate) => {
    if (!proyectoActual) return;

    if (editingPersonaje) {
      await updatePersonaje(editingPersonaje.id, data as PersonajeUpdate);
    } else {
      await createPersonaje(proyectoActual.id, data as PersonajeCreate);
    }
    setIsModalOpen(false);
    setEditingPersonaje(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPersonaje(null);
  };

  // Prepare project data for form
  const proyectoData = {
    id: proyectoActual?.id || "",
    estilo: proyectoActual?.estilo || "Realista",
    tono_general: proyectoActual?.tono_general || "Melancólico",
    contexto_historico: proyectoActual?.contexto_historico,
    contexto_social: proyectoActual?.contexto_social,
    contexto_geografico: proyectoActual?.contexto_geografico,
  };

  return (
    <SectionWithAgent seccion="personajes">
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Personajes</h1>
            <p className="text-gray-600">
              {personajes.length} personaje{personajes.length !== 1 ? "s" : ""} creado{personajes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleNewCharacter}
            disabled={!proyectoActual}
            className={`px-4 py-2 rounded-md text-white ${!proyectoActual ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            + Nuevo Personaje
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
            <p>Selecciona un proyecto primero para crear personajes.</p>
          </div>
        )}

        {/* Characters grid */}
        {proyectoActual && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {loading ? (
                <div className="col-span-full flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : personajes.length === 0 ? (
                <div className="col-span-full text-center p-8 text-gray-500 bg-white rounded-lg border border-gray-200">
                  <p>No hay personajes creados aún.</p>
                  <p className="mt-2">Haz clic en "Nuevo Personaje" para empezar.</p>
                </div>
              ) : (
                personajes.map((personaje) => (
                  <CharacterCard
                    key={personaje.id}
                    personaje={personaje}
                    onEdit={handleEditCharacter}
                    onDelete={handleDeleteCharacter}
                  />
                ))
              )}
            </div>

            {/* Modal for character form */}
            <Modal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              title={editingPersonaje ? "Editar Personaje" : "Nuevo Personaje"}
              size="xl"
            >
              <CharacterForm
                personaje={editingPersonaje || null}
                proyecto={proyectoData}
                personajes={personajes}
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

export default CharactersPage;
