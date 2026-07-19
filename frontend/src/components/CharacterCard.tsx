// CharacterCard component for displaying character information
import { Personaje } from "../types";

interface CharacterCardProps {
  personaje: Personaje;
  onEdit: (personaje: Personaje) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export const CharacterCard = ({
  personaje,
  onEdit,
  onDelete,
  className = "",
}: CharacterCardProps) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow border border-gray-200 ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">
            {personaje.nombre}
            {personaje.apodo && (
              <span className="text-gray-500 ml-2">("{personaje.apodo}")</span>
            )}
          </h3>
          <div className="flex gap-2 mt-1">
            {personaje.edad && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {personaje.edad} años
              </span>
            )}
            {personaje.arquetipo && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {personaje.arquetipo}
              </span>
            )}
            {personaje.genero && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {personaje.genero}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(personaje)}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(personaje.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
            title="Borrar"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Objetivos:</strong> {personaje.objetivos?.join(", ") || "No especificados"}
        </p>
        
        <p className="text-sm text-gray-700">
          <strong>Motivaciones:</strong> {personaje.motivaciones || "No especificadas"}
        </p>

        {personaje.trasfondo && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>Trasfondo:</strong>
            </p>
            <p className="text-sm text-gray-800 mt-1">
              {personaje.trasfondo.length > 150 
                ? `${personaje.trasfondo.substring(0, 150)}...` 
                : personaje.trasfondo}
            </p>
          </div>
        )}

        {(personaje.conflictos_internos || personaje.conflictos_externos) && (
          <div className="pt-2 border-t border-gray-100">
            {personaje.conflictos_internos && (
              <p className="text-sm text-gray-600">
                <strong>Conflictos Internos:</strong> {personaje.conflictos_internos}
              </p>
            )}
            {personaje.conflictos_externos && (
              <p className="text-sm text-gray-600">
                <strong>Conflictos Externos:</strong> {personaje.conflictos_externos}
              </p>
            )}
          </div>
        )}

        {personaje.personalidad && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>Personalidad:</strong> {personaje.personalidad}
            </p>
          </div>
        )}

        {(personaje.habilidades?.length || personaje.debilidades?.length) && (
          <div className="pt-2 border-t border-gray-100">
            {personaje.habilidades?.length > 0 && (
              <p className="text-sm text-gray-600">
                <strong>Habilidades:</strong> {personaje.habilidades.join(", ")}
              </p>
            )}
            {personaje.debilidades?.length > 0 && (
              <p className="text-sm text-gray-600">
                <strong>Debilidades:</strong> {personaje.debilidades.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
