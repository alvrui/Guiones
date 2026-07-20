// StructureForm component for creating/editing narrative structure (acts and scenes)
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EstructuraNarrativa, EstructuraNarrativaCreate, EstructuraNarrativaUpdate, TipoEstructuraNarrativa, Estado } from "../types";
import { AIButton } from "./AIButton";

// Validation schema
const structureSchema = z.object({
  tipo: z.nativeEnum({
    Acto: "Acto",
    Escena: "Escena",
  } as Record<TipoEstructuraNarrativa, TipoEstructuraNarrativa>),
  titulo: z.string().min(1, "El título es obligatorio").max(255, "El título es demasiado largo"),
  numero_acto: z.number().int().min(1).optional(),
  numero_escena: z.number().int().min(1).optional(),
  elementos_narrativos: z.array(z.string()).optional(),
  personajes_involucrados: z.array(z.string()).optional(),
  ubicacion: z.string().optional(),
  texto_escena: z.string().optional(),
  duracion_estimada: z.string().optional(),
  notas_direccion: z.string().optional(),
  estado: z.nativeEnum({
    Borrador: "Borrador",
    Revisión: "Revisión",
    Finalizada: "Finalizada",
  } as Record<Estado, Estado>).optional(),
}).superRefine((data, ctx) => {
  // If it's an Acto, numero_acto is required
  if (data.tipo === "Acto" && !data.numero_acto) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El número de acto es obligatorio para Actos",
      path: ["numero_acto"],
    });
  }
  // If it's an Escena, numero_escena is required
  if (data.tipo === "Escena" && !data.numero_escena) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El número de escena es obligatorio para Escenas",
      path: ["numero_escena"],
    });
  }
});

type StructureFormData = z.infer<typeof structureSchema>;

interface StructureFormProps {
  estructura?: EstructuraNarrativa | null;
  proyecto: { id: string; estilo: string; tono_general: string };
  personajes: { id: string; nombre: string }[];
  tramas: { id: string; titulo: string }[];
  onSubmit: (data: EstructuraNarrativaCreate | EstructuraNarrativaUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const StructureForm = ({
  estructura,
  proyecto,
  personajes,
  tramas,
  onSubmit,
  onCancel,
  isLoading = false,
}: StructureFormProps) => {
  // Initialize form
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    setValue, 
    watch 
  } = useForm<StructureFormData>({
    resolver: zodResolver(structureSchema),
    defaultValues: {
      tipo: estructura?.tipo || "Escena",
      titulo: estructura?.titulo || "",
      numero_acto: estructura?.numero_acto,
      numero_escena: estructura?.numero_escena,
      elementos_narrativos: estructura?.elementos_narrativos || [],
      personajes_involucrados: estructura?.personajes_involucrados || [],
      ubicacion: estructura?.ubicacion || "",
      texto_escena: estructura?.texto_escena || "",
      duracion_estimada: estructura?.duracion_estimada || "",
      notas_direccion: estructura?.notas_direccion || "",
      estado: estructura?.estado || "Borrador",
    },
  });

  // Watch form values
  const formValues = watch();

  // Handle type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as TipoEstructuraNarrativa;
    setValue("tipo", tipo, { shouldDirty: true });
    
    // Set default numbers based on type
    if (tipo === "Acto") {
      if (!formValues.numero_acto) {
        setValue("numero_acto", 1, { shouldDirty: true });
      }
      setValue("numero_escena", undefined, { shouldDirty: true });
    } else {
      if (!formValues.numero_escena) {
        setValue("numero_escena", 1, { shouldDirty: true });
      }
      setValue("numero_acto", undefined, { shouldDirty: true });
    }
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

  // Handle trama selection
  const handleTramaToggle = (tramaId: string) => {
    const current = formValues.elementos_narrativos || [];
    if (current.includes(tramaId)) {
      setValue("elementos_narrativos", current.filter(id => id !== tramaId), { shouldDirty: true });
    } else {
      setValue("elementos_narrativos", [...current, tramaId], { shouldDirty: true });
    }
  };

  // Generate fields with AI
  const handleGenerateField = (field: string, content: string) => {
    setValue(field as keyof StructureFormData, content, { shouldDirty: true });
  };

  // Prepare context for AI
  const getAIContext = () => ({
    titulo: formValues.titulo,
    tipo: formValues.tipo,
    estilo: proyecto.estilo,
    tono_general: proyecto.tono_general,
    personajes_involucrados: formValues.personajes_involucrados,
    elementos_narrativos: formValues.elementos_narrativos,
    ...formValues,
  });

  // Handle submit
  const onSubmitHandler = (data: StructureFormData) => {
    // Clean up empty optional fields
    const cleanData: any = { ...data };
    
    if (!cleanData.elementos_narrativos || cleanData.elementos_narrativos.length === 0) {
      delete cleanData.elementos_narrativos;
    }
    if (!cleanData.personajes_involucrados || cleanData.personajes_involucrados.length === 0) {
      delete cleanData.personajes_involucrados;
    }
    if (!cleanData.ubicacion) delete cleanData.ubicacion;
    if (!cleanData.texto_escena) delete cleanData.texto_escena;
    if (!cleanData.duracion_estimada) delete cleanData.duracion_estimada;
    if (!cleanData.notas_direccion) delete cleanData.notas_direccion;
    if (!cleanData.estado) delete cleanData.estado;

    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {estructura ? `Editar ${formValues.tipo}` : "Nueva Estructura Narrativa"}
        </h2>

        {/* Tipo */}
        <div className="mb-4">
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo *
          </label>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="tipo"
                className={`w-full p-2 border rounded-md ${errors.tipo ? "border-red-500" : "border-gray-300"}`}
                onChange={handleTypeChange}
              >
                <option value="Acto">Acto</option>
                <option value="Escena">Escena</option>
              </select>
            )}
          />
          {errors.tipo && (
            <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>
          )}
        </div>

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
                placeholder={formValues.tipo === "Acto" ? "Ej: Acto 1: El Llamado" : "Ej: Juan recibe una carta anónima"}
              />
            )}
          />
          {errors.titulo && (
            <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
          )}
        </div>

        {/* Número de Acto (only for Acto) */}
        {formValues.tipo === "Acto" && (
          <div className="mb-4">
            <label htmlFor="numero_acto" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Acto *
            </label>
            <Controller
              name="numero_acto"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="numero_acto"
                  min="1"
                  className={`w-full p-2 border rounded-md ${errors.numero_acto ? "border-red-500" : "border-gray-300"}`}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              )}
            />
            {errors.numero_acto && (
              <p className="text-red-500 text-xs mt-1">{errors.numero_acto.message}</p>
            )}
          </div>
        )}

        {/* Número de Escena (only for Escena) */}
        {formValues.tipo === "Escena" && (
          <div className="mb-4">
            <label htmlFor="numero_escena" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Escena *
            </label>
            <Controller
              name="numero_escena"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="numero_escena"
                  min="1"
                  className={`w-full p-2 border rounded-md ${errors.numero_escena ? "border-red-500" : "border-gray-300"}`}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              )}
            />
            {errors.numero_escena && (
              <p className="text-red-500 text-xs mt-1">{errors.numero_escena.message}</p>
            )}
          </div>
        )}

        {/* Elementos Narrativos (only for Escena) */}
        {formValues.tipo === "Escena" && tramas.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elementos Narrativos (Tramas)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tramas.map((t) => (
                <label
                  key={t.id}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    formValues.elementos_narrativos?.includes(t.id)
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formValues.elementos_narrativos?.includes(t.id) || false}
                    onChange={() => handleTramaToggle(t.id)}
                    className="mr-2"
                  />
                  {t.titulo}
                </label>
              ))}
            </div>
          </div>
        )}

        {formValues.tipo === "Escena" && tramas.length === 0 && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            No hay tramas creadas. Crea tramas primero para asociarlas a escenas.
          </div>
        )}

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

        {/* Ubicación (only for Escena) */}
        {formValues.tipo === "Escena" && (
          <div className="mb-4">
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
            <Controller
              name="ubicacion"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="ubicacion"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Playa al atardecer"
                />
              )}
            />
          </div>
        )}

        {/* Texto de Escena (only for Escena) */}
        {formValues.tipo === "Escena" && (
          <div className="mb-4">
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
            <Controller
              name="texto_escena"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="texto_escena"
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Diálogos, acciones y descripciones narrativas"
                />
              )}
            />
          </div>
        )}

        {/* Duración Estimada (only for Escena) */}
        {formValues.tipo === "Escena" && (
          <div className="mb-4">
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
            <Controller
              name="duracion_estimada"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="duracion_estimada"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Ej: 5 minutos"
                />
              )}
            />
          </div>
        )}

        {/* Notas de Dirección (only for Escena) */}
        {formValues.tipo === "Escena" && (
          <div className="mb-4">
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
            <Controller
              name="notas_direccion"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="notas_direccion"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Movimientos de cámara, efectos, etc."
                />
              )}
            />
          </div>
        )}

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
                <option value="Revisión">Revisión</option>
                <option value="Finalizada">Finalizada</option>
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
            {isLoading ? "Guardando..." : estructura ? `Actualizar ${formValues.tipo}` : "Crear Estructura"}
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

export default StructureForm;
