// ProjectPage component for managing projects
import { useState } from "react";
import { useProject } from "../hooks/useProject";
import { useDocuments } from "../hooks/useDocuments";
import { Proyecto, ProyectoCreate, ProyectoUpdate } from "../types";
import { ProjectForm } from "../components/ProjectForm";
import { DocumentLibrary } from "../components/DocumentLibrary";
import { Modal } from "../components/Modal";
import { SectionWithAgent } from "../components/SectionWithAgent";

interface ProjectCardProps {
  proyecto: Proyecto;
  onEdit: (proyecto: Proyecto) => void;
  onSelect: (proyecto: Proyecto) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}

const ProjectCard = ({
  proyecto,
  onEdit,
  onSelect,
  onDelete,
  isSelected,
}: ProjectCardProps) => {
  return (
    <div
      onClick={() => onSelect(proyecto)}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-blue-50 border-blue-300 shadow-md"
          : "bg-white border-gray-200 hover:shadow-md hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{proyecto.titulo}</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {proyecto.tipo_narracion}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {proyecto.estilo}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {proyecto.tono_general}
            </span>
            {proyecto.genero_principal && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {proyecto.genero_principal}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {proyecto.sinopsis.length > 100
              ? `${proyecto.sinopsis.substring(0, 100)}...`
              : proyecto.sinopsis}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(proyecto);
            }}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(proyecto.id);
            }}
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

export const ProjectPage = () => {
  const {
    proyectos,
    proyectoActual,
    loading,
    error,
    createProyecto,
    updateProyecto,
    deleteProyecto,
    setProyectoActual,
  } = useProject();

  const {
    documentos,
    loading: documentosLoading,
    error: documentosError,
    uploadDocumento,
    deleteDocumento,
  } = useDocuments(proyectoActual?.id || null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null);

  // Handle project selection
  const handleSelectProject = (proyecto: Proyecto) => {
    setProyectoActual(proyecto);
  };

  // Handle edit project
  const handleEditProject = (proyecto: Proyecto) => {
    setEditingProyecto(proyecto);
    setIsModalOpen(true);
  };

  // Handle new project
  const handleNewProject = () => {
    setEditingProyecto(null);
    setIsModalOpen(true);
  };

  // Handle delete project
  const handleDeleteProject = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar este proyecto? Esta acción no se puede deshacer."
      )
    ) {
      await deleteProyecto(id);
      if (proyectoActual?.id === id) {
        setProyectoActual(null);
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (data: ProyectoCreate | ProyectoUpdate) => {
    if (editingProyecto) {
      await updateProyecto(editingProyecto.id, data as ProyectoUpdate);
    } else {
      await createProyecto(data as ProyectoCreate);
    }
    setIsModalOpen(false);
    setEditingProyecto(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProyecto(null);
  };

  return (
    <SectionWithAgent seccion="proyectos">
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Proyectos</h1>
              <p className="text-gray-600">
                {proyectos.length} proyecto{proyectos.length !== 1 ? "s" : ""} creado
                {proyectos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleNewProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              + Nuevo Proyecto
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : proyectos.length === 0 ? (
              <div className="col-span-full text-center p-8 text-gray-500">
                <p>No hay proyectos creados aún.</p>
                <p className="mt-2">Haz clic en "Nuevo Proyecto" para empezar.</p>
              </div>
            ) : (
              proyectos.map((proyecto) => (
                <ProjectCard
                  key={proyecto.id}
                  proyecto={proyecto}
                  onEdit={handleEditProject}
                  onSelect={handleSelectProject}
                  onDelete={handleDeleteProject}
                  isSelected={proyectoActual?.id === proyecto.id}
                />
              ))
            )}
          </div>

          {/* Project details and documents */}
          {proyectoActual && (
            <div className="space-y-6">
              {/* Project details */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Detalles del Proyecto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Título</p>
                    <p className="text-lg font-medium">{proyectoActual.titulo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tipo de Narración</p>
                    <p>{proyectoActual.tipo_narracion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estilo</p>
                    <p>{proyectoActual.estilo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tono General</p>
                    <p>{proyectoActual.tono_general}</p>
                  </div>
                  {proyectoActual.genero_principal && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Género Principal</p>
                      <p>{proyectoActual.genero_principal}</p>
                    </div>
                  )}
                  {proyectoActual.estructura_narrativa_base && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Estructura Narrativa Base
                      </p>
                      <p>{proyectoActual.estructura_narrativa_base}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Sinopsis</p>
                    <p>{proyectoActual.sinopsis}</p>
                  </div>
                  {proyectoActual.contexto_historico && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Contexto Histórico</p>
                      <p>{proyectoActual.contexto_historico}</p>
                    </div>
                  )}
                  {proyectoActual.contexto_social && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Contexto Social</p>
                      <p>{proyectoActual.contexto_social}</p>
                    </div>
                  )}
                  {proyectoActual.contexto_geografico && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Contexto Geográfico</p>
                      <p>{proyectoActual.contexto_geografico}</p>
                    </div>
                  )}
                  {proyectoActual.contexto_ambiental && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Contexto Ambiental</p>
                      <p>{proyectoActual.contexto_ambiental}</p>
                    </div>
                  )}
                  {proyectoActual.inspiraciones_referencias && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Inspiraciones o Referencias
                      </p>
                      <p>{proyectoActual.inspiraciones_referencias}</p>
                    </div>
                  )}
                  {proyectoActual.restricciones_limitaciones && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Restricciones o Limitaciones
                      </p>
                      <p>{proyectoActual.restricciones_limitaciones}</p>
                    </div>
                  )}
                  {proyectoActual.temas_principales &&
                    proyectoActual.temas_principales.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Temas Principales</p>
                        <div className="flex flex-wrap gap-2">
                          {proyectoActual.temas_principales.map((tema) => (
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
                  {proyectoActual.palabras_clave &&
                    proyectoActual.palabras_clave.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Palabras Clave</p>
                        <div className="flex flex-wrap gap-2">
                          {proyectoActual.palabras_clave.map((palabra) => (
                            <span
                              key={palabra}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {palabra}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Document Library */}
              <DocumentLibrary
                proyectoId={proyectoActual.id}
                documentos={documentos}
                onUpload={uploadDocumento}
                onDelete={deleteDocumento}
                isLoading={documentosLoading}
              />
            </div>
          )}

          {/* Modal for project form */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            title={editingProyecto ? "Editar Proyecto" : "Nuevo Proyecto"}
            size="lg"
          >
            <ProjectForm
              proyecto={editingProyecto || null}
              documentos={documentos}
              onSubmit={handleSubmit}
              onCancel={handleModalClose}
              isLoading={loading}
            />
          </Modal>
        </div>
      </div>
    </SectionWithAgent>
  );
};

export default ProjectPage;
