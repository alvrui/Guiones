// ProjectForm component for creating/editing projects
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Proyecto, ProyectoCreate, ProyectoUpdate, TipoNarracion, Estilo, TonoGeneral } from "../types";
import { AIButton } from "./AIButton";

// Validation schema
const projectSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio").max(255, "El título es demasiado largo"),
  tipo_narracion: z.nativeEnum({
    Lineal: "Lineal",
    "No lineal": "No lineal",
    "In media res": "In media res",
    Paralela: "Paralela",
    Episódica: "Episódica",
    Circular: "Circular",
    Asociativa: "Asociativa",
  } as Record<TipoNarracion, TipoNarracion>),
  estilo: z.nativeEnum({
    Realista: "Realista",
    Surrealista: "Surrealista",
    Épico: "Épico",
    Sátira: "Sátira",
    Fábula: "Fábula",
    Drama: "Drama",
    Comedia: "Comedia",
    Terror: "Terror",
    Aventura: "Aventura",
    "Ciencia ficción": "Ciencia ficción",
    Fantasía: "Fantasía",
  } as Record<Estilo, Estilo>),
  tono_general: z.nativeEnum({
    Oscuro: "Oscuro",
    Ligero: "Ligero",
    Melancólico: "Melancólico",
    Esperanzador: "Esperanzador",
    Irónico: "Irónico",
    Suspense: "Suspense",
    Tenso: "Tenso",
    Cómico: "Cómico",
  } as Record<TonoGeneral, TonoGeneral>),
  sinopsis: z.string().min(10, "La sinopsis debe tener al menos 10 caracteres"),
  contexto_historico: z.string().optional(),
  contexto_social: z.string().optional(),
  contexto_geografico: z.string().optional(),
  contexto_cultural: z.string().optional(),
  entorno_sensorial: z.string().optional(),
  temas_principales: z.array(z.string()).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  proyecto?: Proyecto | null;
  onSubmit: (data: ProyectoCreate | ProyectoUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ProjectForm = ({
  proyecto,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) => {
  const [temasInput, setTemasInput] = useState("");
  
  // Initialize form with default values or existing project
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    setValue, 
    watch 
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      titulo: proyecto?.titulo || "",
      tipo_narracion: proyecto?.tipo_narracion || "Lineal",
      estilo: proyecto?.estilo || "Realista",
      tono_general: proyecto?.tono_general || "Melancólico",
      sinopsis: proyecto?.sinopsis || "",
      contexto_historico: proyecto?.contexto_historico || "",
      contexto_social: proyecto?.contexto_social || "",
      contexto_geografico: proyecto?.contexto_geografico || "",
      contexto_cultural: proyecto?.contexto_cultural || "",
      entorno_sensorial: proyecto?.entorno_sensorial || "",
      temas_principales: proyecto?.temas_principales || [],
    },
  });

  // Watch form values
  const formValues = watch();

  // Sync temas input with form state
  useEffect(() => {
    if (formValues.temas_principales) {
      setTemasInput(formValues.temas_principales.join(", "));
    }
  }, [formValues.temas_principales]);

  // Handle temas input change
  const handleTemasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTemasInput(value);
    const temasArray = value.split(",").map(t => t.trim()).filter(t => t);
    setValue("temas_principales", temasArray, { shouldDirty: true });
  };

  // Generate sinopsis with AI
  const handleGenerateSinopsis = (content: string) => {
    setValue("sinopsis", content, { shouldDirty: true });
  };

  // Generate contexto with AI
  const handleGenerateContexto = (field: string, content: string) => {
    setValue(field as keyof ProjectFormData, content, { shouldDirty: true });
  };

  // Prepare context for AI
  const getAIContext = () => ({
    titulo: formValues.titulo,
    tipo_narracion: formValues.tipo_narracion,
    estilo: formValues.estilo,
    tono_general: formValues.tono_general,
  });

  const onSubmitHandler = (data: ProjectFormData) => {
    // If we're editing an existing project, don't include id
    const submitData: ProyectoCreate | ProyectoUpdate = proyecto
      ? { ...data }
      : { ...data };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {proyecto ? "Editar Proyecto" : "Nuevo Proyecto"}
        </h2>

        {/* Título */}
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="titulo"
                className={`w-full p-2 border rounded-md ${errors.titulo ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: El Último Viaje"
              />
            )}
          />
          {errors.titulo && (
            <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
          )}
        </div>

        {/* Tipo de Narración y Estilo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="tipo_narracion" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Narración *
            </label>
            <Controller
              name="tipo_narracion"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="tipo_narracion"
                  className={`w-full p-2 border rounded-md ${errors.tipo_narracion ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="Lineal">Lineal</option>
                  <option value="No lineal">No lineal</option>
                  <option value="In media res">In media res</option>
                  <option value="Paralela">Paralela</option>
                  <option value="Episódica">Episódica</option>
                  <option value="Circular">Circular</option>
                  <option value="Asociativa">Asociativa</option>
                </select>
              )}
            />
          </div>

          <div>
            <label htmlFor="estilo" className="block text-sm font-medium text-gray-700 mb-1">
              Estilo *
            </label>
            <Controller
              name="estilo"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="estilo"
                  className={`w-full p-2 border rounded-md ${errors.estilo ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="Realista">Realista</option>
                  <option value="Surrealista">Surrealista</option>
                  <option value="Épico">Épico</option>
                  <option value="Sátira">Sátira</option>
                  <option value="Fábula">Fábula</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedia">Comedia</option>
                  <option value="Terror">Terror</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Ciencia ficción">Ciencia ficción</option>
                  <option value="Fantasía">Fantasía</option>
                </select>
              )}
            />
          </div>
        </div>

        {/* Tono General */}
        <div className="mb-4">
          <label htmlFor="tono_general" className="block text-sm font-medium text-gray-700 mb-1">
            Tono General *
          </label>
          <Controller
            name="tono_general"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="tono_general"
                className={`w-full p-2 border rounded-md ${errors.tono_general ? "border-red-500" : "border-gray-300"}`}
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
            )}
          />
        </div>

        {/* Sinopsis */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="sinopsis" className="block text-sm font-medium text-gray-700">
              Sinopsis *
            </label>
            <AIButton
              field="sinopsis"
              section="narrative"
              context={getAIContext()}
              onGenerate={handleGenerateSinopsis}
            />
          </div>
          <Controller
            name="sinopsis"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="sinopsis"
                rows={4}
                className={`w-full p-2 border rounded-md ${errors.sinopsis ? "border-red-500" : "border-gray-300"}`}
                placeholder="Resumen breve de la historia (1-2 párrafos)"
              />
            )}
          />
          {errors.sinopsis && (
            <p className="text-red-500 text-xs mt-1">{errors.sinopsis.message}</p>
          )}
        </div>

        {/* Temas Principales */}
        <div className="mb-4">
          <label htmlFor="temas_principales" className="block text-sm font-medium text-gray-700 mb-1">
            Temas Principales
          </label>
          <input
            type="text"
            id="temas_principales"
            value={temasInput}
            onChange={handleTemasChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: Amor, Traición, Redención"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separa los temas con comas
          </p>
        </div>

        {/* Contexto Histórico */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="contexto_historico" className="block text-sm font-medium text-gray-700">
              Contexto Histórico
            </label>
            <AIButton
              field="contexto_historico"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateContexto("contexto_historico", content)}
            />
          </div>
          <Controller
            name="contexto_historico"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="contexto_historico"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Guerra Civil Española, 1936-1939"
              />
            )}
          />
        </div>

        {/* Contexto Social */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="contexto_social" className="block text-sm font-medium text-gray-700">
              Contexto Social
            </label>
            <AIButton
              field="contexto_social"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateContexto("contexto_social", content)}
            />
          </div>
          <Controller
            name="contexto_social"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="contexto_social"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Sociedad rural con fuertes jerarquías"
              />
            )}
          />
        </div>

        {/* Contexto Geográfico */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="contexto_geografico" className="block text-sm font-medium text-gray-700">
              Contexto Geográfico
            </label>
            <AIButton
              field="contexto_geografico"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateContexto("contexto_geografico", content)}
            />
          </div>
          <Controller
            name="contexto_geografico"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="contexto_geografico"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Andalucía, España. Clima mediterráneo"
              />
            )}
          />
        </div>

        {/* Contexto Cultural */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="contexto_cultural" className="block text-sm font-medium text-gray-700">
              Contexto Cultural
            </label>
            <AIButton
              field="contexto_cultural"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateContexto("contexto_cultural", content)}
            />
          </div>
          <Controller
            name="contexto_cultural"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="contexto_cultural"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Influencia gitana y flamenca"
              />
            )}
          />
        </div>

        {/* Entorno Sensorial */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="entorno_sensorial" className="block text-sm font-medium text-gray-700">
              Entorno Sensorial
            </label>
            <AIButton
              field="entorno_sensorial"
              section="scene"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateContexto("entorno_sensorial", content)}
            />
          </div>
          <Controller
            name="entorno_sensorial"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="entorno_sensorial"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Olor a salitre, sonidos de olas"
              />
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className={`px-4 py-2 rounded-md text-white ${isLoading || !isDirty ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isLoading ? "Guardando..." : proyecto ? "Actualizar Proyecto" : "Crear Proyecto"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProjectForm;
