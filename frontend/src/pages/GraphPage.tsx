// GraphPage component for visualizing project relationships
import { useProject } from "../hooks/useProject";
import { useCharacters } from "../hooks/useCharacters";
import { useNarratives } from "../hooks/useNarratives";
import { usePlots } from "../hooks/usePlots";
import { useStructure } from "../hooks/useStructure";
import { GraphView } from "../components/GraphView";

export const GraphPage = () => {
  const { proyectoActual } = useProject();
  const { personajes } = useCharacters(proyectoActual?.id || null);
  const { narrativas } = useNarratives(proyectoActual?.id || null);
  const { tramas } = usePlots(proyectoActual?.id || null);
  const { estructuras } = useStructure(proyectoActual?.id || null);

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Grafo de Relaciones</h1>
          <p className="text-gray-600">
            Visualización interactiva de las relaciones entre elementos del proyecto
          </p>
        </div>

        {/* No project selected */}
        {!proyectoActual && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
            <p>Selecciona un proyecto primero para visualizar el grafo.</p>
          </div>
        )}

        {/* Graph visualization */}
        {proyectoActual && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {proyectoActual.titulo}
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                  🔍 Acercar
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                  🔎 Alejar
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200">
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Leyenda:</h3>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Proyecto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                  <span>Personaje</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Narrativa</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Trama</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span>Escena</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-1 bg-gray-400"></span>
                  <span>Pertenece a</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-1 bg-teal-400"></span>
                  <span>Involucra a</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-1 bg-red-400"></span>
                  <span>Referencia a</span>
                </div>
              </div>
            </div>

            {/* Graph */}
            <div className="h-[600px] border border-gray-200 rounded">
              {proyectoActual && (
                <GraphView
                  proyecto={proyectoActual}
                  personajes={personajes}
                  narrativas={narrativas}
                  tramas={tramas}
                  estructuras={estructuras}
                />
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="font-medium text-gray-700">Personajes</p>
                  <p className="text-2xl font-bold text-teal-600">{personajes.length}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Narrativas</p>
                  <p className="text-2xl font-bold text-blue-600">{narrativas.length}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Tramas</p>
                  <p className="text-2xl font-bold text-green-600">{tramas.length}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Escenas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {estructuras.filter(e => e.tipo === "Escena").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphPage;
