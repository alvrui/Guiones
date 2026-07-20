// NarrativeForm component for creating/editing narratives
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Narrativa, NarrativaCreate, NarrativaUpdate, TipoEstructura, Estado } from "../types";
import { AIButton } from "./AIButton";

// Validation schema
const narrativeSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio").max(255, "El título es demasiado largo"),
  tipo_estructura: z.nativeEnum({
    Lineal: "Lineal",
    Episódica: "Episódica",
    Temática: "Temática",
    Circular: "Circular",
    Asociativa: "Asociativa",
  } as Record<TipoEstructura, TipoEstructura>),
  sinopsis: z.string().min(10, "La sinopsis debe tener al menos 10 caracteres"),
  temas_asociados: z.array(z.string()).optional(),
  tono: z.string().optional(),
  personajes_involucrados: z.array(z.string()).optional(),
  conexiones_con_otras_narrativas: z.string().optional(),
  estado: z.nativeEnum({
    Borrador: "Borrador",
    "En Desarrollo": "En Desarrollo",
    Completada: "Completada",
  } as Record<Estado, Estado>).optional(),
});

type NarrativeFormData = z.infer<typeof narrativeSchema>;

interface NarrativeFormProps {
  narrativa?: Narrativa | null;
  proyecto: { id: string; estilo: string; tono_general: string };
  personajes: { id: string; nombre: string }[];
  onSubmit: (data: NarrativaCreate | NarrativaUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const NarrativeForm = ({
  narrativa,
  proyecto,
  personajes,
  onSubmit,
  onCancel,
  isLoading = false,
}: NarrativeFormProps) => {
  const [temasInput, setTemasInput] = useState("");

  // Initialize form
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    setValue, 
    watch 
  } = useForm<NarrativeFormData>({
    resolver: zodResolver(narrativeSchema),
    defaultValues: {
      titulo: narrativa?.titulo || "",
      tipo_estructura: narrativa?.tipo_estructura || "Lineal",
      sinopsis: narrativa?.sinopsis || "",
      temas_asociados: narrativa?.temas_asociados || [],
      tono: narrativa?.tono || "",
      personajes_involucrados: narrativa?.personajes_involucrados || [],
      conexiones_con_otras_narrativas: narrativa?.conexiones_con_otras_narrativas || "",
      estado: narrativa?.estado || "Borrador",
    },
  });

  // Watch form values
  const formValues = watch();

  // Sync temas input with form state
  useEffect(() => {
    if (formValues.temas_asociados) {
      setTemasInput(formValues.temas_asociados.join(", "));
    }
  }, [formValues.temas_asociados]);

  // Handle temas input change
  const handleTemasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTemasInput(value);
    const temasArray = value.split(",").map(t => t.trim()).filter(t => t);
    setValue("temas_asociados", temasArray, { shouldDirty: true });
  };

  // Handle character selection
  const handlePersonajeToggle = (personajeId: string) => {
    const current = formValues.personajes_involucrados || [];
    if (current.includes(personajeId)) {
      setValue("personajes_involucrados", current.filter(id => id !== personajeId), { shouldDirty: true });
    } else {
      setValue("personajes_involucrados", [...current, personajeId], { shouldDirty: true });
    }
  };

  // Generate fields with AI
  const handleGenerateField = (field: string, content: string) => {
    setValue(field as keyof NarrativeFormData, content, { shouldDirty: true });
  };

  // Prepare context for AI
  const getAIContext = () => ({
    titulo: formValues.titulo,
    tipo_estructura: formValues.tipo_estructura,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    personajes_involucrados: formValues.personajes_involucrados,
    ...formValues,
  });

  // Handle submit
  const onSubmitHandler = (data: NarrativeFormData) => {
    // Clean up empty optional fields
    const cleanData: any = { ...data };
    
    if (!cleanData.temas_asociados || cleanData.temas_asociados.length === 0) {
      delete cleanData.temas_asociados;
    }
    if (!cleanData.tono) delete cleanData.tono;
    if (!cleanData.personajes_involucrados || cleanData.personajes_involucrados.length === 0) {
      delete cleanData.personajes_involucrados;
    }
    if (!cleanData.conexiones_con_otras_narrativas) {
      delete cleanData.conexiones_con_otras_narrativas;
    }
    if (!cleanData.estado) delete cleanData.estado;

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {narrativa ? "Editar Narrativa" : "Nueva Narrativa"}
        </h2>

        {/* Título */}
        <div className="mb-4">
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
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="titulo"
                className={`w-full p-2 border rounded-md ${errors.titulo ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: La Búsqueda de la Verdad"
              />
            )}
          />
          {errors.titulo && (
            <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
          )}
        </div>

        {/* Tipo de Estructura */}
        <div className="mb-4">
          <label htmlFor="tipo_estructura" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Estructura *
          </label>
          <Controller
            name="tipo_estructura"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="tipo_estructura"
                className={`w-full p-2 border rounded-md ${errors.tipo_estructura ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="Lineal">Lineal</option>
                <option value="Episódica">Episódica</option>
                <option value="Temática">Temática</option>
                <option value="Circular">Circular</option>
                <option value="Asociativa">Asociativa</option>
              </select>
            )}
          />
          {errors.tipo_estructura && (
            <p className="text-red-500 text-xs mt-1">{errors.tipo_estructura.message}</p>
          )}
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
              onGenerate={(content) => handleGenerateField("sinopsis", content)}
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
                placeholder="Resumen de la narrativa"
              />
            )}
          />
          {errors.sinopsis && (
            <p className="text-red-500 text-xs mt-1">{errors.sinopsis.message}</p>
          )}
        </div>

        {/* Temas Asociados */}
        <div className="mb-4">
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
                setValue("temas_asociados", temas, { shouldDirty: true });
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
        <div className="mb-4">
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
          <Controller
            name="tono"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="tono"
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
            )}
          />
        </div>

        {/* Personajes Involucrados */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personajes Involucrados
          </label>
          {personajes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {personajes.map((p) => (
                <label
                  key={p.id}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    formValues.personajes_involucrados?.includes(p.id)
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formValues.personajes_involucrados?.includes(p.id) || false}
                    onChange={() => handlePersonajeToggle(p.id)}
                    className="mr-2"
                  />
                  {p.nombre}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay personajes creados. Crea personajes primero.</p>
          )}
        </div>

        {/* Conexiones con Otras Narrativas */}
        <div className="mb-4">
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
          <Controller
            name="conexiones_con_otras_narrativas"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="conexiones_con_otras_narrativas"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Cómo esta narrativa se relaciona con otras"
              />
            )}
          />
        </div>

        {/* Estado */}
        <div className="mb-4">
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="estado"
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Borrador">Borrador</option>
                <option value="En Desarrollo">En Desarrollo</option>
                <option value="Completada">Completada</option>
              </select>
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
            {isLoading ? "Guardando..." : narrativa ? "Actualizar Narrativa" : "Crear Narrativa"}
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

export default NarrativeForm;
