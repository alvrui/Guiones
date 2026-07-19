// CharacterForm component for creating/editing characters
import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Personaje, PersonajeCreate, PersonajeUpdate, Genero, Arquetipo } from "../types";
import { AIButton } from "./AIButton";

// Validation schema
const characterSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(255, "El nombre es demasiado largo"),
  trasfondo: z.string().min(10, "El trasfondo debe tener al menos 10 caracteres"),
  objetivos: z.array(z.string().min(1)).min(1, "Debe haber al menos un objetivo"),
  motivaciones: z.string().min(10, "Las motivaciones deben tener al menos 10 caracteres"),
  apodo: z.string().max(255).optional(),
  edad: z.number().int().min(0).max(150).optional(),
  genero: z.nativeEnum({
    Hombre: "Hombre",
    Mujer: "Mujer",
    "No binario": "No binario",
    Otro: "Otro",
  } as Record<Genero, Genero>).optional(),
  conflictos_internos: z.string().optional(),
  conflictos_externos: z.string().optional(),
  relaciones: z.array(z.object({
    nombre: z.string().min(1),
    relacion: z.string().min(1),
    id: z.string().min(1),
  })).optional(),
  arquetipo: z.nativeEnum({
    Héroe: "Héroe",
    Mentor: "Mentor",
    Antagonista: "Antagonista",
    Aliado: "Aliado",
    Víctima: "Víctima",
    Trickster: "Trickster",
    Guardian: "Guardian",
    Explorador: "Explorador",
  } as Record<Arquetipo, Arquetipo>).optional(),
  personalidad: z.string().optional(),
  evolucion: z.string().optional(),
  habilidades: z.array(z.string()).optional(),
  debilidades: z.array(z.string()).optional(),
  apariencia_fisica: z.string().optional(),
  notas_adicionales: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterSchema>;

interface CharacterFormProps {
  personaje?: Personaje | null;
  proyecto: { id: string; estilo: string; tono_general: string; contexto_historico?: string; contexto_social?: string; contexto_geografico?: string };
  personajes: Personaje[]; // For relations
  onSubmit: (data: PersonajeCreate | PersonajeUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CharacterForm = ({
  personaje,
  proyecto,
  personajes,
  onSubmit,
  onCancel,
  isLoading = false,
}: CharacterFormProps) => {
  const [objetivosInput, setObjetivosInput] = useState("");
  const [habilidadesInput, setHabilidadesInput] = useState("");
  const [debilidadesInput, setDebilidadesInput] = useState("");

  // Initialize form
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    setValue, 
    watch 
  } = useForm<CharacterFormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      nombre: personaje?.nombre || "",
      apodo: personaje?.apodo || "",
      edad: personaje?.edad,
      genero: personaje?.genero,
      trasfondo: personaje?.trasfondo || "",
      objetivos: personaje?.objetivos || [""],
      motivaciones: personaje?.motivaciones || "",
      conflictos_internos: personaje?.conflictos_internos || "",
      conflictos_externos: personaje?.conflictos_externos || "",
      relaciones: personaje?.relaciones || [],
      arquetipo: personaje?.arquetipo,
      personalidad: personaje?.personalidad || "",
      evolucion: personaje?.evolucion || "",
      habilidades: personaje?.habilidades || [],
      debilidades: personaje?.debilidades || [],
      apariencia_fisica: personaje?.apariencia_fisica || "",
      notas_adicionales: personaje?.notas_adicionales || "",
    },
  });

  // Watch form values
  const formValues = watch();

  // Sync array inputs with form state
  useEffect(() => {
    if (formValues.objetivos) {
      setObjetivosInput(formValues.objetivos.join(", "));
    }
    if (formValues.habilidades) {
      setHabilidadesInput(formValues.habilidades.join(", "));
    }
    if (formValues.debilidades) {
      setDebilidadesInput(formValues.debilidades.join(", "));
    }
  }, [formValues.objetivos, formValues.habilidades, formValues.debilidades]);

  // Handle array input changes
  const handleObjetivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setObjetivosInput(value);
    const objetivosArray = value.split(",").map(o => o.trim()).filter(o => o);
    setValue("objetivos", objetivosArray.length > 0 ? objetivosArray : [""], { shouldDirty: true });
  };

  const handleHabilidadesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHabilidadesInput(value);
    const habilidadesArray = value.split(",").map(h => h.trim()).filter(h => h);
    setValue("habilidades", habilidadesArray, { shouldDirty: true });
  };

  const handleDebilidadesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDebilidadesInput(value);
    const debilidadesArray = value.split(",").map(d => d.trim()).filter(d => d);
    setValue("debilidades", debilidadesArray, { shouldDirty: true });
  };

  // Generate fields with AI
  const handleGenerateField = (field: string, content: string) => {
    setValue(field as keyof CharacterFormData, content, { shouldDirty: true });
  };

  // Prepare context for AI
  const getAIContext = () => ({
    nombre: formValues.nombre,
    edad: formValues.edad,
    arquetipo: formValues.arquetipo,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    titulo_proyecto: proyecto.id,
    contexto_historico: proyecto.contexto_historico,
    contexto_social: proyecto.contexto_social,
    contexto_geografico: proyecto.contexto_geografico,
    ...formValues,
  });

  // Handle relation change
  const handleRelacionChange = (index: number, field: keyof Relacion, value: string) => {
    const relaciones = formValues.relaciones || [];
    const nuevaRelacion = { ...relaciones[index], [field]: value };
    relaciones[index] = nuevaRelacion;
    setValue("relaciones", relaciones, { shouldDirty: true });
  };

  // Add new relation
  const addRelacion = () => {
    const relaciones = formValues.relaciones || [];
    setValue("relaciones", [...relaciones, { nombre: "", relacion: "", id: "" }], { shouldDirty: true });
  };

  // Remove relation
  const removeRelacion = (index: number) => {
    const relaciones = formValues.relaciones || [];
    const nuevasRelaciones = relaciones.filter((_, i) => i !== index);
    setValue("relaciones", nuevasRelaciones, { shouldDirty: true });
  };

  const onSubmitHandler = (data: CharacterFormData) => {
    // Clean up empty values
    const cleanData: any = { ...data };
    
    // Remove empty optional fields
    if (!cleanData.apodo) delete cleanData.apodo;
    if (cleanData.edad === undefined) delete cleanData.edad;
    if (!cleanData.genero) delete cleanData.genero;
    if (!cleanData.conflictos_internos) delete cleanData.conflictos_internos;
    if (!cleanData.conflictos_externos) delete cleanData.conflictos_externos;
    if (!cleanData.arquetipo) delete cleanData.arquetipo;
    if (!cleanData.personalidad) delete cleanData.personalidad;
    if (!cleanData.evolucion) delete cleanData.evolucion;
    if (!cleanData.apariencia_fisica) delete cleanData.apariencia_fisica;
    if (!cleanData.notas_adicionales) delete cleanData.notas_adicionales;
    if (!cleanData.relaciones || cleanData.relaciones.length === 0) delete cleanData.relaciones;
    if (!cleanData.habilidades || cleanData.habilidades.length === 0) delete cleanData.habilidades;
    if (!cleanData.debilidades || cleanData.debilidades.length === 0) delete cleanData.debilidades;

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {personaje ? "Editar Personaje" : "Nuevo Personaje"}
        </h2>

        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="nombre"
                className={`w-full p-2 border rounded-md ${errors.nombre ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ej: Juan Pérez"
              />
            )}
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Apodo y Edad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="apodo" className="block text-sm font-medium text-gray-700 mb-1">
              Apodo
            </label>
            <Controller
              name="apodo"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="apodo"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ej: El Lobo"
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">
              Edad
            </label>
            <Controller
              name="edad"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="edad"
                  min="0"
                  max="150"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ej: 35"
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              )}
            />
          </div>
        </div>

        {/* Género y Arquetipo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <Controller
              name="genero"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="genero"
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="No binario">No binario</option>
                  <option value="Otro">Otro</option>
                </select>
              )}
            />
          </div>

          <div>
            <label htmlFor="arquetipo" className="block text-sm font-medium text-gray-700 mb-1">
              Arquetipo
            </label>
            <Controller
              name="arquetipo"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="arquetipo"
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Héroe">Héroe</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Antagonista">Antagonista</option>
                  <option value="Aliado">Aliado</option>
                  <option value="Víctima">Víctima</option>
                  <option value="Trickster">Trickster</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Explorador">Explorador</option>
                </select>
              )}
            />
          </div>
        </div>

        {/* Trasfondo */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="trasfondo" className="block text-sm font-medium text-gray-700">
              Trasfondo *
            </label>
            <AIButton
              field="trasfondo"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("trasfondo", content)}
            />
          </div>
          <Controller
            name="trasfondo"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="trasfondo"
                rows={4}
                className={`w-full p-2 border rounded-md ${errors.trasfondo ? "border-red-500" : "border-gray-300"}`}
                placeholder="Historia personal, origen y experiencias pasadas que definen al personaje"
              />
            )}
          />
          {errors.trasfondo && (
            <p className="text-red-500 text-xs mt-1">{errors.trasfondo.message}</p>
          )}
        </div>

        {/* Objetivos */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700">
              Objetivos *
            </label>
            <AIButton
              field="objetivos"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => {
                // Parse the content (might be a list or comma-separated)
                const objetivos = content.split("\n").map(o => o.trim()).filter(o => o);
                setValue("objetivos", objetivos.length > 0 ? objetivos : [""], { shouldDirty: true });
              }}
            />
          </div>
          <input
            type="text"
            id="objetivos"
            value={objetivosInput}
            onChange={handleObjetivosChange}
            className={`w-full p-2 border rounded-md ${errors.objetivos ? "border-red-500" : "border-gray-300"}`}
            placeholder="Ej: Encontrar a su hermano, Vengarse del responsable"
          />
          {errors.objetivos && (
            <p className="text-red-500 text-xs mt-1">{errors.objetivos.message}</p>
          )}
        </div>

        {/* Motivaciones */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="motivaciones" className="block text-sm font-medium text-gray-700">
              Motivaciones *
            </label>
            <AIButton
              field="motivaciones"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("motivaciones", content)}
            />
          </div>
          <Controller
            name="motivaciones"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="motivaciones"
                rows={3}
                className={`w-full p-2 border rounded-md ${errors.motivaciones ? "border-red-500" : "border-gray-300"}`}
                placeholder="Razones profundas que impulsan al personaje (ej: amor, miedo, ambición)"
              />
            )}
          />
          {errors.motivaciones && (
            <p className="text-red-500 text-xs mt-1">{errors.motivaciones.message}</p>
          )}
        </div>

        {/* Personalidad */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="personalidad" className="block text-sm font-medium text-gray-700">
              Personalidad
            </label>
            <AIButton
              field="personalidad"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("personalidad", content)}
            />
          </div>
          <Controller
            name="personalidad"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="personalidad"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Rasgos de carácter (ej: valiente, tímido, astuto)"
              />
            )}
          />
        </div>

        {/* Conflictos Internos */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="conflictos_internos" className="block text-sm font-medium text-gray-700">
              Conflictos Internos
            </label>
            <AIButton
              field="conflictos_internos"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("conflictos_internos", content)}
            />
          </div>
          <Controller
            name="conflictos_internos"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="conflictos_internos"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Luchas psicológicas o emocionales del personaje"
              />
            )}
          />
        </div>

        {/* Conflictos Externos */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="conflictos_externos" className="block text-sm font-medium text-gray-700">
              Conflictos Externos
            </label>
            <AIButton
              field="conflictos_externos"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("conflictos_externos", content)}
            />
          </div>
          <Controller
            name="conflictos_externos"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="conflictos_externos"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Obstáculos físicos o sociales que enfrenta el personaje"
              />
            )}
          />
        </div>

        {/* Relaciones */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Relaciones
            </label>
            <AIButton
              field="relaciones"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => {
                // Parse the content (format: "- Nombre (Relación): Descripción")
                const lines = content.split("\n").filter(l => l.trim());
                const relaciones = lines.map(line => {
                  const match = line.match(/^-\s*([^\s]+)\s+\(([^)]+)\):\s*(.*)$/);
                  if (match) {
                    return {
                      nombre: match[1].trim(),
                      relacion: match[2].trim(),
                      id: "", // Will need to be set manually
                    };
                  }
                  return { nombre: line, relacion: "", id: "" };
                });
                setValue("relaciones", relaciones, { shouldDirty: true });
              }}
            />
          </div>
          
          {formValues.relaciones && formValues.relaciones.length > 0 && (
            <div className="space-y-3">
              {formValues.relaciones.map((relacion, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
                      <select
                        value={relacion.nombre}
                        onChange={(e) => handleRelacionChange(index, "nombre", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Seleccionar personaje...</option>
                        {personajes
                          .filter(p => p.id !== personaje?.id) // Exclude current character
                          .map(p => (
                            <option key={p.id} value={p.nombre}>{p.nombre}</option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Relación</label>
                      <input
                        type="text"
                        value={relacion.relacion}
                        onChange={(e) => handleRelacionChange(index, "relacion", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Ej: Esposa, Hermano"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">ID</label>
                      <select
                        value={relacion.id}
                        onChange={(e) => handleRelacionChange(index, "id", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Seleccionar ID...</option>
                        {personajes
                          .filter(p => p.id !== personaje?.id)
                          .map(p => (
                            <option key={p.id} value={p.id}>{p.id}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRelacion(index)}
                    className="mt-2 text-red-500 text-sm hover:text-red-700"
                  >
                    ❌ Eliminar relación
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <button
            type="button"
            onClick={addRelacion}
            className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
          >
            + Añadir relación
          </button>
        </div>

        {/* Evolución */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="evolucion" className="block text-sm font-medium text-gray-700">
              Evolución
            </label>
            <AIButton
              field="evolucion"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("evolucion", content)}
            />
          </div>
          <Controller
            name="evolucion"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="evolucion"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Cambios que experimenta el personaje a lo largo de la historia"
              />
            )}
          />
        </div>

        {/* Habilidades */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="habilidades" className="block text-sm font-medium text-gray-700">
              Habilidades
            </label>
            <AIButton
              field="habilidades"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => {
                const habilidades = content.split("\n").map(h => h.trim()).filter(h => h);
                setValue("habilidades", habilidades, { shouldDirty: true });
              }}
            />
          </div>
          <input
            type="text"
            id="habilidades"
            value={habilidadesInput}
            onChange={handleHabilidadesChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: Lucha, Persuasión, Música"
          />
        </div>

        {/* Debilidades */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="debilidades" className="block text-sm font-medium text-gray-700">
              Debilidades
            </label>
            <AIButton
              field="debilidades"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => {
                const debilidades = content.split("\n").map(d => d.trim()).filter(d => d);
                setValue("debilidades", debilidades, { shouldDirty: true });
              }}
            />
          </div>
          <input
            type="text"
            id="debilidades"
            value={debilidadesInput}
            onChange={handleDebilidadesChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: Miedo a la altura, Desconfiado"
          />
        </div>

        {/* Apariencia Física */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="apariencia_fisica" className="block text-sm font-medium text-gray-700">
              Apariencia Física
            </label>
            <AIButton
              field="apariencia_fisica"
              section="character"
              context={getAIContext()}
              onGenerate={(content) => handleGenerateField("apariencia_fisica", content)}
            />
          </div>
          <Controller
            name="apariencia_fisica"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="apariencia_fisica"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Descripción física (altura, complexión, rasgos distintivos)"
              />
            )}
          />
        </div>

        {/* Notas Adicionales */}
        <div className="mb-4">
          <label htmlFor="notas_adicionales" className="block text-sm font-medium text-gray-700 mb-1">
            Notas Adicionales
          </label>
          <Controller
            name="notas_adicionales"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="notas_adicionales"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Cualquier información extra relevante"
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
            {isLoading ? "Guardando..." : personaje ? "Actualizar Personaje" : "Crear Personaje"}
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

export default CharacterForm;
