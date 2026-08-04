// PlotStoryElementsPanel component - panel for selected story elements in a plot
import { useCallback } from "react";
import { StoryElement, PlotStoryElementSelection } from "../types/storyElements";
import { StoryElementCard } from "./StoryElementCard";
import { useStoryElements } from "../hooks/useStoryElements";

interface PlotStoryElementsPanelProps {
  selections: PlotStoryElementSelection[];
  onRemove: (selectionIndex: number) => void;
  onMoveUp: (selectionIndex: number) => void;
  onMoveDown: (selectionIndex: number) => void;
  onUpdateDescription: (selectionIndex: number, description: string) => void;
  className?: string;
}

export const PlotStoryElementsPanel = ({
  selections,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateDescription,
  className = "",
}: PlotStoryElementsPanelProps) => {
  const { getElementById } = useStoryElements();

  // Get full story element for a selection
  const getStoryElementForSelection = useCallback((
    selection: PlotStoryElementSelection
  ) => {
    return getElementById(selection.storyElementId);
  }, [getElementById]);

  // Handle remove
  const handleRemove = useCallback((index: number) => {
    onRemove(index);
  }, [onRemove]);

  // Handle move up
  const handleMoveUp = useCallback((index: number) => {
    onMoveUp(index);
  }, [onMoveUp]);

  // Handle move down
  const handleMoveDown = useCallback((index: number) => {
    onMoveDown(index);
  }, [onMoveDown]);

  // Handle description change
  const handleDescriptionChange = useCallback((
    index: number,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdateDescription(index, e.target.value);
  }, [onUpdateDescription]);

  if (selections.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <p className="text-sm text-gray-500 text-center">
          No hay Story Elements seleccionados
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">
          Selecciona del cat\u00e1logo para a\u00f1adir
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
      <h3 className="font-bold text-gray-800 mb-4">
        Story Elements seleccionados ({selections.length})
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {selections.map((selection, index) => {
          const storyElement = getStoryElementForSelection(selection);
          
          if (!storyElement) {
            return (
              <div key={index} className="p-3 border border-red-200 rounded bg-red-50">
                <p className="text-sm text-red-600">
                  Elemento no encontrado: {selection.storyElementId}
                </p>
                <button
                  onClick={() => handleRemove(index)}
                  className="mt-1 text-xs text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{storyElement.name}</h4>
                  <p className="text-xs text-gray-500">{storyElement.type}</p>
                </div>
                <span className="text-sm text-gray-400">#{index + 1}</span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{storyElement.description}</p>

              {/* Custom description */}
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descripci\u00f3n personalizada (opcional)
                </label>
                <textarea
                  value={selection.customDescription || ""}
                  onChange={(e) => handleDescriptionChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  rows={2}
                  placeholder="Personaliza la descripci\u00f3n para esta trama..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  title="Subir"
                >
                  \u2191
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === selections.length - 1}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  title="Bajar"
                >
                  \u2193
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                  title="Eliminar"
                >
                  \u2715
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>{selections.length}</strong> Story Elements seleccionados
        </p>
      </div>
    </div>
  );
};

export default PlotStoryElementsPanel;
