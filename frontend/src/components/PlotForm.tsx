// PlotForm component for creating/editing plots
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trama, TramaCreate, TramaUpdate, ArquetipoNarrativo, Estado, ElementoNarrativo, ElementoNarrativoSchema } from "../types";
import { AIButton } from "./AIButton";

// Validation schema
const plotSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio").max(255, "El título es demasiado largo"),
  arquetipo_narrativo: z.nativeEnum({
    "Viaje del Héroe": "Viaje del Héroe",
    Tragedia: "Tragedia",
    Comedia: "Comedia",
    Búsqueda: "Búsqueda",
    Aventura: "Aventura",
    Misterio: "Misterio",
    Romance: "Romance",
    Supervivencia: "Supervivencia",
  } as Record<ArquetipoNarrativo, ArquetipoNarrativo>),
  elementos_narrativos: z.array(z.object({
    tipo: z.nativeEnum({
      Conflicto: "Conflicto",
      Revelación: "Revelación",
      Clímax: "Clímax",
      "Giro Argumental": "Giro Argumental",
      Exposición: "Exposición",
      Desarrollo: "Desarrollo",
      Resolución: "Resolución",
    } as Record<ElementoNarrativo, ElementoNarrativo>),
    descripcion: z.string().min(1, "La descripción es obligatoria"),
  })).min(1, "Debe haber al menos un elemento narrativo"),
  personajes_involucrados: z.array(z.string()).min(1, "Debe seleccionar al menos un personaje"),
  subtramas: z.array(z.string()).optional(),
  obstaculos: z.array(z.string()).optional(),
  estado: z.nativeEnum({
    Idea: "Idea",
    "En Desarrollo": "En Desarrollo",
    Completada: "Completada",
  } as Record<Estado, Estado>).optional(),
  notas: z.string().optional(),
});

type PlotFormData = z.infer<typeof plotSchema>;

interface PlotFormProps {
  trama?: Trama | null;
  proyecto: { id: string; estilo: string; tono_general: string };
  personajes: { id: string; nombre: string }[];
  onSubmit: (data: TramaCreate | TramaUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const PlotForm = ({
  trama,
  proyecto,
  personajes,
  onSubmit,
  onCancel,
  isLoading = false,
}: PlotFormProps) => {
  const [obstaculosInput, setObstaculosInput] = useState("");

  // Initialize form
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    setValue, 
    watch 
  } = useForm<PlotFormData>({
    resolver: zodResolver(plotSchema),
    defaultValues: {
      titulo: trama?.titulo || "",
      arquetipo_narrativo: trama?.arquetipo_narrativo || "Viaje del Héroe",
      elementos_narrativos: trama?.elementos_narrativos || [{ tipo: "Conflicto", descripcion: "" }],
      personajes_involucrados: trama?.personajes_involucrados || [],
      subtramas: trama?.subtramas || [],
      obstaculos: trama?.obstaculos || [],
      estado: trama?.estado || "Idea",
      notas: trama?.notas || "",
    },
  });

  // Watch form values
  const formValues = watch();

  // Sync obstaculos input with form state
  useEffect(() => {
    if (formValues.obstaculos) {
      setObstaculosInput(formValues.obstaculos.join("\n"));
    }
  }, [formValues.obstaculos]);

  // Handle obstaculos input change
  const handleObstaculosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setObstaculosInput(value);
    const obstaculosArray = value.split("\n").map(o => o.trim()).filter(o => o);
    setValue("obstaculos", obstaculosArray, { shouldDirty: true });
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

  // Handle elemento narrativo change
  const handleElementoChange = (index: number, field: keyof ElementoNarrativoSchema, value: string) => {
    const nuevosElementos = [...formValues.elementos_narrativos];
    nuevosElementos[index] = { ...nuevosElementos[index], [field]: value };
    setValue("elementos_narrativos", nuevosElementos, { shouldDirty: true });
  };

  // Add new elemento narrativo
  const addElemento = () => {
    const nuevosElementos = [...formValues.elementos_narrativos, { tipo: "Conflicto", descripcion: "" }];
    setValue("elementos_narrativos", nuevosElementos, { shouldDirty: true });
  };

  // Remove elemento narrativo
  const removeElemento = (index: number) => {
    const nuevosElementos = formValues.elementos_narrativos.filter((_, i) => i !== index);
    setValue("elementos_narrativos", nuevosElementos.length > 0 ? nuevosElementos : [{ tipo: "Conflicto", descripcion: "" }], { shouldDirty: true });
  };

  // Generate fields with AI
  const handleGenerateField = (field: string, content: string) => {
    if (field === "elementos_narrativos") {
      // Parse the content (format: "- Tipo: Descripción")
      const lines = content.split("\n").filter(l => l.trim());
      const elementos: ElementoNarrativoSchema[] = lines.map(line => {
        const match = line.match(/^-\s*([^:]+):\s*(.*)$/);
        if (match) {
          return {
            tipo: match[1].trim() as ElementoNarrativo,
            descripcion: match[2].trim(),
          };
        }
        return { tipo: "Conflicto", descripcion: line.trim() };
      });
      setValue("elementos_narrativos", elementos.length > 0 ? elementos : formValues.elementos_narrativos, { shouldDirty: true });
    } else if (field === "obstaculos") {
      const obstaculos = content.split("\n").map(o => o.trim()).filter(o => o);
      setValue("obstaculos", obstaculos, { shouldDirty: true });
      setObstaculosInput(obstaculos.join("\n"));
    } else {
      setValue(field as keyof PlotFormData, content, { shouldDirty: true });
    }
  };

  // Prepare context for AI
  const getAIContext = () => ({
    titulo: formValues.titulo,
    arquetipo_narrativo: formValues.arquetipo_narrativo,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    personajes_involucrados: formValues.personajes_involucrados,
    ...formValues,
  });

  // Handle submit
  const onSubmitHandler = (data: PlotFormData) => {
    // Clean up empty optional fields
    const cleanData: any = { ...data };
    
    if (!cleanData.subtramas || cleanData.subtramas.length === 0) {
      delete cleanData.subtramas;
    }
    if (!cleanData.obstaculos || cleanData.obstaculos.length === 0) {
      delete cleanData.obstaculos;
    }
    if (!cleanData.estado) delete cleanData.estado;
    if (!cleanData.notas) delete cleanData.notas;

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {trama ? "Editar Trama" : "Nueva Trama"}
        </h2>

        {/* Título */}
        <div className="mb-4">
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
          <Controller
            name="titulo"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="titulo"
                className={`w-full p-2 border rounded-md ${errors.titulo ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: La Conspiración del Coronel"
              />
            )}
          />
          {errors.titulo && (
            <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
          )}
        </div>

        {/* Arquetipo Narrativo */}
        <div className="mb-4">
          <label htmlFor="arquetipo_narrativo" className="block text-sm font-medium text-gray-700 mb-1">
            Arquetipo Narrativo *
          </label>
          <Controller
            name="arquetipo_narrativo"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="arquetipo_narrativo"
                className={`w-full p-2 border rounded-md ${errors.arquetipo_narrativo ? "border-red-500" : "border-gray-300"}`}
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
            )}
          />
          {errors.arquetipo_narrativo && (
            <p className="text-red-500 text-xs mt-1">{errors.arquetipo_narrativo.message}</p>
          )}
        </div>

        {/* Elementos Narrativos */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Elementos Narrativos *
            </label>
            <AIButton
              field="elementos_narrativos"
              section="plot"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("elementos_narrativos", content)}
            />
          </div>
          <div className="space-y-3">
            {formValues.elementos_narrativos.map((elemento, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                    <Controller
                      name={`elementos_narrativos.${index}.tipo`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="Conflicto">Conflicto</option>
                          <option value="Revelación">Revelación</option>
                          <option value="Clímax">Clímax</option>
                          <option value="Giro Argumental">Giro Argumental</option>
                          <option value="Exposición">Exposición</option>
                          <option value="Desarrollo">Desarrollo</option>
                          <option value="Resolución">Resolución</option>
                        </select>
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                    <Controller
                      name={`elementos_narrativos.${index}.descripcion`}
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                          placeholder="Descripción del elemento"
                        />
                      )}
                    />
                  </div>
                </div>
                {errors.elementos_narrativos?.[index]?.descripcion && (
                  <p className="text-red-500 text-xs mt-1">{errors.elementos_narrativos[index]?.descripcion?.message}</p>
                )}
                <button
                  type="button"
                  onClick={() => removeElemento(index)}
                  className="mt-2 text-red-500 text-sm hover:text-red-700"
                >
                  ❌ Eliminar elemento
                </button>
              </div>
            ))}
          </div>
          {errors.elementos_narrativos && (
            <p className="text-red-500 text-xs mt-1">{errors.elementos_narrativos.message}</p>
          )}
          <button
            type="button"
            onClick={addElemento}
            className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
          >
            + A\u00f1adir elemento narrativo
          </button>
        </div>

        {/* Personajes Involucrados */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personajes Involucrados *
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
          {errors.personajes_involucrados && (
            <p className="text-red-500 text-xs mt-1">{errors.personajes_involucrados.message}</p>
          )}
        </div>

        {/* Obst\u00e1culos */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="obstaculos" className="block text-sm font-medium text-gray-700">
              Obst\u00e1culos
            </label>
            <AIButton
              field="obstaculos"
              section="plot"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("obstaculos", content)}
            />
          </div>
          <Controller
            name="obstaculos"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="obstaculos"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Barreras que los personajes deben superar (una por l\u00ednea)"
                value={obstaculosInput}
                onChange={handleObstaculosChange}
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
                <option value="Idea">Idea</option>
                <option value="En Desarrollo">En Desarrollo</option>
                <option value="Completada">Completada</option>
              </select>
            )}
          />
        </div>

        {/* Notas */}
        <div className="mb-4">
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
          <Controller
            name="notas"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="notas"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Informaci\u00f3n adicional sobre la trama"
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
            {isLoading ? "Guardando..." : trama ? "Actualizar Trama" : "Crear Trama"}
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

export default PlotForm;
