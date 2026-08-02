// ProjectForm component for creating/editing projects
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Proyecto,
  ProyectoCreate,
  ProyectoUpdate,
  TipoNarracion,
  Estilo,
  TonoGeneral,
  GeneroPrincipal,
  EstructuraNarrativaBase,
  Documento,
} from "../types";
import { AIButton } from "./AIButton";

// Validation schema
const projectSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio").max(255, "El título es demasiado largo"),
  tipo_narracion: z.nativeEnum({
    Lineal: "Lineal",
    "No lineal": "No lineal",
    Circular: "Circular",
    "Episódica": "Episódica",
    Modular: "Modular",
    "In media res": "In media res",
    "Frame narrative": "Frame narrative",
    Interactiva: "Interactiva",
  } as Record<TipoNarracion, TipoNarracion>),
  estilo: z.nativeEnum({
    Realista: "Realista",
    Surrealista: "Surrealista",
    Fantástico: "Fantástico",
    "Ciencia ficción": "Ciencia ficción",
    Noir: "Noir",
    Satírico: "Satírico",
    Poético: "Poético",
    Minimalista: "Minimalista",
    Experimental: "Experimental",
    "Magic realism": "Magic realism",
    Pulp: "Pulp",
    Cyberpunk: "Cyberpunk",
    Steampunk: "Steampunk",
    Gótico: "Gótico",
    Hardboiled: "Hardboiled",
  } as Record<Estilo, Estilo>),
  tono_general: z.nativeEnum({
    Melancólico: "Melancólico",
    Irónico: "Irónico",
    Trágico: "Trágico",
    Cómico: "Cómico",
    Satírico: "Satírico",
    Esperanzador: "Esperanzador",
    Oscuro: "Oscuro",
    Ligero: "Ligero",
    Suspense: "Suspense",
    Bildungsroman: "Bildungsroman",
    Absurdo: "Absurdo",
    Nostalógico: "Nostalógico",
    Cínico: "Cínico",
    Épico: "Épico",
  } as Record<TonoGeneral, TonoGeneral>),
  genero_principal: z.nativeEnum({
    Drama: "Drama",
    Comedia: "Comedia",
    Acción: "Acción",
    Terror: "Terror",
    Romance: "Romance",
    Aventura: "Aventura",
    Misterio: "Misterio",
    "Ciencia ficción": "Ciencia ficción",
    Fantasía: "Fantasía",
    Thriller: "Thriller",
    Western: "Western",
    Noir: "Noir",
    Docuficción: "Docuficción",
    "Ficción histórica": "Ficción histórica",
    Distopía: "Distopía",
    Utopía: "Utopía",
  } as Record<GeneroPrincipal, GeneroPrincipal>).optional(),
  estructura_narrativa_base: z.nativeEnum({
    "Tres actos": "Tres actos",
    "Viaje del héroe": "Viaje del héroe",
    "Save the Cat": "Save the Cat",
    "Seven-Point Story Structure": "Seven-Point Story Structure",
    "Freytag's Pyramid": "Freytag's Pyramid",
    "In Medias Res": "In Medias Res",
    "Non-linear": "Non-linear",
    Circular: "Circular",
    "Parallel Narratives": "Parallel Narratives",
  } as Record<EstructuraNarrativaBase, EstructuraNarrativaBase>).optional(),
  sinopsis: z.string().min(10, "La sinopsis debe tener al menos 10 caracteres"),
  contexto_historico: z.string().optional(),
  contexto_social: z.string().optional(),
  contexto_geografico: z.string().optional(),
  contexto_ambiental: z.string().optional(),
  inspiraciones_referencias: z.string().optional(),
  restricciones_limitaciones: z.string().optional(),
  temas_principales: z.array(z.string()).optional(),
  palabras_clave: z.array(z.string()).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  proyecto?: Proyecto | null;
  documentos?: Documento[];
  onSubmit: (data: ProyectoCreate | ProyectoUpdate) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ProjectForm = ({
  proyecto,
  documentos = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: ProjectFormProps) => {
  const [temasInput, setTemasInput] = useState("");
  const [palabrasClaveInput, setPalabrasClaveInput] = useState("");

  // Initialize form with default values or existing project
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      titulo: proyecto?.titulo || "",
      tipo_narracion: proyecto?.tipo_narracion || "Lineal",
      estilo: proyecto?.estilo || "Realista",
      tono_general: proyecto?.tono_general || "Melancólico",
      genero_principal: proyecto?.genero_principal,
      estructura_narrativa_base: proyecto?.estructura_narrativa_base,
      sinopsis: proyecto?.sinopsis || "",
      contexto_historico: proyecto?.contexto_historico || "",
      contexto_social: proyecto?.contexto_social || "",
      contexto_geografico: proyecto?.contexto_geografico || "",
      contexto_ambiental: proyecto?.contexto_ambiental || "",
      inspiraciones_referencias: proyecto?.inspiraciones_referencias || "",
      restricciones_limitaciones: proyecto?.restricciones_limitaciones || "",
      temas_principales: proyecto?.temas_principales || [],
      palabras_clave: proyecto?.palabras_clave || [],
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

  // Sync palabras clave input with form state
  useEffect(() => {
    if (formValues.palabras_clave) {
      setPalabrasClaveInput(formValues.palabras_clave.join(", "));
    }
  }, [formValues.palabras_clave]);

  // Handle temas input change
  const handleTemasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTemasInput(value);
    const temasArray = value.split(",").map((t) => t.trim()).filter((t) => t);
    setValue("temas_principales", temasArray, { shouldDirty: true });
  };

  // Handle palabras clave input change
  const handlePalabrasClaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPalabrasClaveInput(value);
    const palabrasArray = value.split(",").map((p) => p.trim()).filter((p) => p);
    setValue("palabras_clave", palabrasArray, { shouldDirty: true });
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
    genero_principal: formValues.genero_principal,
    estructura_narrativa_base: formValues.estructura_narrativa_base,
  });

  const onSubmitHandler = (data: ProjectFormData) => {
    // If we're editing an existing project, don't include id
    const submitData: ProyectoCreate | ProyectoUpdate = proyecto
      ? { ...data }
      : { ...data };
    onSubmit(submitData);
  };

  // Options for select dropdowns
  const tipoNarracionOptions = [
    "Lineal",
    "No lineal",
    "Circular",
    "Episódica",
    "Modular",
    "In media res",
    "Frame narrative",
    "Interactiva",
  ];

  const estiloOptions = [
    "Realista",
    "Surrealista",
    "Fantástico",
    "Ciencia ficción",
    "Noir",
    "Satírico",
    "Poético",
    "Minimalista",
    "Experimental",
    "Magic realism",
    "Pulp",
    "Cyberpunk",
    "Steampunk",
    "Gótico",
    "Hardboiled",
  ];

  const tonoGeneralOptions = [
    "Melancólico",
    "Irónico",
    "Trágico",
    "Cómico",
    "Satírico",
    "Esperanzador",
    "Oscuro",
    "Ligero",
    "Suspense",
    "Bildungsroman",
    "Absurdo",
    "Nostalógico",
    "Cínico",
    "Épico",
  ];

  const generoPrincipalOptions = [
    "Drama",
    "Comedia",
    "Acción",
    "Terror",
    "Romance",
    "Aventura",
    "Misterio",
    "Ciencia ficción",
    "Fantasía",
    "Thriller",
    "Western",
    "Noir",
    "Docuficción",
    "Ficción histórica",
    "Distopía",
    "Utopía",
  ];

  const estructuraNarrativaOptions = [
    "Tres actos",
    "Viaje del héroe",
    "Save the Cat",
    "Seven-Point Story Structure",
    "Freytag's Pyramid",
    "In Medias Res",
    "Non-linear",
    "Circular",
    "Parallel Narratives",
  ];

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
                className={`w-full p-2 border rounded-md ${
                  errors.titulo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: El último Viaje"
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
            <label
              htmlFor="tipo_narracion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de Narración *
            </label>
            <Controller
              name="tipo_narracion"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="tipo_narracion"
                  className={`w-full p-2 border rounded-md ${
                    errors.tipo_narracion ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {tipoNarracionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
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
                  className={`w-full p-2 border rounded-md ${
                    errors.estilo ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {estiloOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Tono General y Género Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="tono_general"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tono General *
            </label>
            <Controller
              name="tono_general"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="tono_general"
                  className={`w-full p-2 border rounded-md ${
                    errors.tono_general ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {tonoGeneralOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label
              htmlFor="genero_principal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Género Principal
            </label>
            <Controller
              name="genero_principal"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="genero_principal"
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar género...</option>
                  {generoPrincipalOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Estructura Narrativa Base */}
        <div className="mb-4">
          <label
            htmlFor="estructura_narrativa_base"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Estructura Narrativa Base
          </label>
          <Controller
            name="estructura_narrativa_base"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="estructura_narrativa_base"
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar estructura...</option>
                {estructuraNarrativaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
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
            $<AIButton
              documentos={documentos}
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
                className={`w-full p-2 border rounded-md ${
                  errors.sinopsis ? "border-red-500" : "border-gray-300"
                }`}
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
          <label
            htmlFor="temas_principales"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
          <p className="text-xs text-gray-500 mt-1">Separa los temas con comas</p>
        </div>

        {/* Palabras Clave */}
        <div className="mb-4">
          <label
            htmlFor="palabras_clave"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Palabras Clave
          </label>
          <input
            type="text"
            id="palabras_clave"
            value={palabrasClaveInput}
            onChange={handlePalabrasClaveChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Ej: guerra, amor prohibido, redención, 1940"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separa las palabras clave con comas (opcional)
          </p>
        </div>

        {/* Contexto Histórico */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="contexto_historico"
              className="block text-sm font-medium text-gray-700"
            >
              Contexto Histórico
            </label>
            $<AIButton
              documentos={documentos}
              field="contexto_historico"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) =>
                handleGenerateContexto("contexto_historico", content)
              }
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
            <label
              htmlFor="contexto_social"
              className="block text-sm font-medium text-gray-700"
            >
              Contexto Social
            </label>
            $<AIButton
              documentos={documentos}
              field="contexto_social"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) =>
                handleGenerateContexto("contexto_social", content)
              }
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
            <label
              htmlFor="contexto_geografico"
              className="block text-sm font-medium text-gray-700"
            >
              Contexto Geográfico
            </label>
            $<AIButton
              documentos={documentos}
              field="contexto_geografico"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) =>
                handleGenerateContexto("contexto_geografico", content)
              }
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

        {/* Contexto Ambiental */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="contexto_ambiental"
              className="block text-sm font-medium text-gray-700"
            >
              Contexto Ambiental
            </label>
            $<AIButton
              documentos={documentos}
              field="contexto_ambiental"
              section="narrative"
              context={getAIContext()}
              onGenerate={(content) =>
                handleGenerateContexto("contexto_ambiental", content)
              }
            />
          </div>
          <Controller
            name="contexto_ambiental"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="contexto_ambiental"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Influencia gitana y flamenca; olor a salitre, sonidos de olas, texturas de madera envejecida"
              />
            )}
          />
        </div>

        {/* Inspiraciones o Referencias */}
        <div className="mb-4">
          <label
            htmlFor="inspiraciones_referencias"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Inspiraciones o Referencias
          </label>
          <Controller
            name="inspiraciones_referencias"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="inspiraciones_referencias"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Obra inspirada en Cien años de soledad, Blade Runner"
              />
            )}
          />
        </div>

        {/* Restricciones o Limitaciones */}
        <div className="mb-4">
          <label
            htmlFor="restricciones_limitaciones"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Restricciones o Limitaciones
          </label>
          <Controller
            name="restricciones_limitaciones"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="restricciones_limitaciones"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ej: Evitar escenas de violencia gráfica, lenguaje apto para menores de 12 años"
              />
            )}
          />
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
              : proyecto
              ? "Actualizar Proyecto"
              : "Crear Proyecto"}
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
