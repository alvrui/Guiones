// PlotBuilder - Constructor de trama con drag & drop
// Inspired by Trello
import { useState, useCallback } from "react";
import { PlotElement } from "../types/plotBuilder";
import { StoryElement } from "../types/storyElements";

interface PlotBuilderProps {
  elements: PlotElement[];
  onRemoveElement: (id: string) => void;
  onUpdateOrder: (elements: PlotElement[]) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateCustomName: (id: string, name: string) => void;
  onUpdateCustomDescription: (id: string, description: string) => void;
}

export const PlotBuilder = ({
  elements,
  onRemoveElement,
  onUpdateOrder,
  onUpdateNotes,
  onUpdateCustomName,
  onUpdateCustomDescription,
}: PlotBuilderProps) => {
  const [expandedElementId, setExpandedElementId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Handle drag start
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    
    const newElements = [...elements];
    const [removed] = newElements.splice(draggedIndex, 1);
    newElements.splice(dropIndex, 0, removed);
    
    // Update order
    newElements.forEach((element, index) => {
      element.order = index;
    });
    
    onUpdateOrder(newElements);
    setDraggedIndex(null);
  }, [draggedIndex, elements, onUpdateOrder]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  // Toggle expand element
  const toggleExpand = useCallback((id: string) => {
    setExpandedElementId(prev => prev === id ? null : id);
  }, []);

  // Get element style during drag
  const getElementStyle = useCallback((index: number) => {
    if (draggedIndex === index) {
      return "opacity-50 bg-blue-100";
    }
    return "";
  }, [draggedIndex]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Elementos de esta trama ({elements.length})
        </h3>
        <div className="text-sm text-gray-500">
          Arrastra y suelta para reordenar
        </div>
      </div>

      {/* Elements list */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <p className="text-lg mb-2">No hay elementos añadidos aún</p>
            <p className="text-sm">Busca y añade Story Elements desde la biblioteca</p>
          </div>
        ) : (
          elements.map((element, index) => {
            const isExpanded = expandedElementId === element.id;
            
            return (
              <div
                key={element.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`border rounded-lg p-4 transition-colors cursor-grab active:cursor-grabbing ${getElementStyle(index)} ${isExpanded ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex items-start gap-3">
                  {/* Drag handle */}
                  <div className="flex-shrink-0 text-gray-400">
                    ≡
                  </div>
                  
                  {/* Order number */}
                  <div className="flex-shrink-0 text-sm text-gray-500 w-6">
                    {index + 1}.
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">
                        {element.customName || element.name}
                      </h4>
                      {element.type && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {element.type}
                        </span>
                      )}
                    </div>
                    
                    {/* Description */}
                    {isExpanded && (
                      <>
                        <p className="text-sm text-gray-600 mb-3">
                          {element.customDescription || element.description}
                        </p>
                        
                        {/* Notes */}
                        <div className="mb-3">
                          <textarea
                            value={element.notes || ""}
                            onChange={(e) => onUpdateNotes(element.id, e.target.value)}
                            placeholder="Añade notas sobre este elemento en la trama..."
                            className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            rows={3}
                          />
                        </div>
                        
                        {/* Custom fields */}
                        <div className="flex gap-2 text-xs">
                          <button
                            onClick={() => onUpdateCustomName(element.id, prompt("Nuevo nombre:", element.customName || element.name) || element.customName || element.name)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            ✏️ Renombrar
                          </button>
                          <button
                            onClick={() => onUpdateCustomDescription(element.id, prompt("Nueva descripción:", element.customDescription || element.description) || element.customDescription || element.description)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            📝 Editar descripción
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => toggleExpand(element.id)}
                      className="text-sm text-gray-500 hover:text-blue-600"
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                    <button
                      onClick={() => onRemoveElement(element.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlotBuilder;
