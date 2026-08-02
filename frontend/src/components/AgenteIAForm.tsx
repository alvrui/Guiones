// AgenteIAForm component for creating/editing AI agents
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgenteIA, AgenteIACreate, AgenteIAUpdate } from "../types";

// Validation schema
const agenteIASchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(255, "El nombre es demasiado largo"),
  seccion: z.string().min(1, "La sección es obligatoria"),
  modelo_mistral: z.string().optional(),
  temperatura: z.number().min(0, "La temperatura debe ser >= 0").max(2, "La temperatura debe ser <= 2").optional(),
  max_tokens: z.number().min(10, "Mínimo 10 tokens").max(4096, "Máximo 4096 tokens").optional(),
  prompt_sistema: z.string().optional(),
  prompt_especifico: z.string().optional(),
  configuracion_avanzada: z.record(z.any()).optional(),
  es_activo: z.boolean().optional(),
});

type AgenteIAFormData = z.infer<typeof agenteIASchema>;

interface AgenteIAFormProps {
  agente?: AgenteIA | null;
  onSubmit: (data: AgenteIACreate | AgenteIAUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Available sections
const SECCIONES = [
  "proyectos",
  "agentes",
  "personajes",
  "narrativas",
  "tramas",
  "estructura",
];

// Available Mistral models
const MODELOS_MISTRAL = [
  "mistral-tiny",
  "mistral-small",
  "mistral-medium",
];

export const AgenteIAForm = ({
  agente,
  onSubmit,
  onCancel,
  isLoading = false,
}: AgenteIAFormProps) => {
  const [configJson, setConfigJson] = useState("");

  // Initialize form with default values or existing agent
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<AgenteIAFormData>({
    resolver: zodResolver(agenteIASchema),
    defaultValues: {
      nombre: agente?.nombre || "",
      modelo_mistral: agente?.modelo_mistral || "mistral-tiny",
      temperatura: agente?.temperatura || 0.7,
      max_tokens: agente?.max_tokens || 500,
      prompt_sistema: agente?.prompt_sistema || "",
      prompt_especifico: agente?.prompt_especifico || "",
      configuracion_avanzada: agente?.configuracion_avanzada || {},
      es_activo: agente?.es_activo !== undefined ? agente.es_activo : true,
    },
  });

  // Watch form values
  const formValues = watch();

  // Sync config JSON with form state
  useEffect(() => {
    if (formValues.configuracion_avanzada) {
      setConfigJson(JSON.stringify(formValues.configuracion_avanzada, null, 2));
    }
  }, [formValues.configuracion_avanzada]);

  // Handle config JSON change
  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setConfigJson(value);
    try {
      const parsed = value ? JSON.parse(value) : {};
      setValue("configuracion_avanzada", parsed, { shouldDirty: true });
    } catch (err) {
      // Invalid JSON, don't update
    }
  };

  const onSubmitHandler = (data: AgenteIAFormData) => {
    // If we're editing an existing agent, don't include id
    const submitData: AgenteIACreate | AgenteIAUpdate = agente
      ? { ...data }
      : { ...data };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {agente ? "Editar Agente IA" : "Nuevo Agente IA"}
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
                className={`w-full p-2 border rounded-md ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Generador de Personajes"
              />
            )}
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Sección */}
        <div className="mb-4">
          <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-1">
            Sección *
          </label>
          <Controller
            name="seccion"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="seccion"
                className={`w-full p-2 border rounded-md ${
                  errors.seccion ? "border-red-500" : "border-gray-300"
                }`}
              >
                {SECCIONES.map((seccion) => (
                  <option key={seccion} value={seccion}>
                    {seccion}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.seccion && (
            <p className="text-red-500 text-xs mt-1">{errors.seccion.message}</p>
          )}
        </div>

        {/* Modelo Mistral y Temperatura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="modelo_mistral" className="block text-sm font-medium text-gray-700 mb-1">
              Modelo Mistral
            </label>
            <Controller
              name="modelo_mistral"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="modelo_mistral"
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {MODELOS_MISTRAL.map((modelo) => (
                    <option key={modelo} value={modelo}>
                      {modelo}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label htmlFor="temperatura" className="block text-sm font-medium text-gray-700 mb-1">
              Temperatura
            </label>
            <Controller
              name="temperatura"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="temperatura"
                  step="0.1"
                  min="0"
                  max="2"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              )}
            />
          </div>
        </div>

        {/* Max Tokens */}
        <div className="mb-4">
          <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-1">
            Máximo de Tokens
          </label>
          <Controller
            name="max_tokens"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="max_tokens"
                min="10"
                max="4096"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          />
        </div>

        {/* Prompt de Sistema */}
        <div className="mb-4">
          <label htmlFor="prompt_sistema" className="block text-sm font-medium text-gray-700 mb-1">
            Prompt de Sistema
          </label>
          <Controller
            name="prompt_sistema"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="prompt_sistema"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Eres un experto en creación de personajes literarios..."
              />
            )}
          />
        </div>

        {/* Prompt Específico */}
        <div className="mb-4">
          <label htmlFor="prompt_especifico" className="block text-sm font-medium text-gray-700 mb-1">
            Prompt Específico
          </label>
          <Controller
            name="prompt_especifico"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="prompt_especifico"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Genera un personaje basado en el siguiente contexto..."
              />
            )}
          />
        </div>

        {/* Configuración Avanzada */}
        <div className="mb-4">
          <label htmlFor="configuracion_avanzada" className="block text-sm font-medium text-gray-700 mb-1">
            Configuración Avanzada (JSON)
          </label>
          <textarea
            id="configuracion_avanzada"
            value={configJson}
            onChange={handleConfigChange}
            className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
            rows={4}
            placeholder='{"param1": "value1", "param2": "value2"}'
          />
          <p className="text-xs text-gray-500 mt-1">
            Configuración adicional en formato JSON (opcional)
          </p>
        </div>

        {/* Estado Activo */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Controller
              name="es_activo"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              )}
            />
            <span className="text-sm font-medium text-gray-700">Agente Activo</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading || !isDirty
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? "Guardando..."
              : agente
              ? "Actualizar Agente"
              : "Crear Agente"}
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

export default AgenteIAForm;
