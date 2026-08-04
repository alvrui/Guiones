// StoryElementCard component - displays a single story element from the catalog
import { useCallback } from "react";
import { StoryElement } from "../types/storyElements";

interface StoryElementCardProps {
  element: StoryElement;
  isSelected: boolean;
  isFavorite: boolean;
  showCategory?: boolean;
  showType?: boolean;
  showTags?: boolean;
  compact?: boolean;
  onClick?: (element: StoryElement) => void;
  onToggleFavorite?: (elementId: string) => void;
  className?: string;
}

export const StoryElementCard = ({
  element,
  isSelected = false,
  isFavorite = false,
  showCategory = true,
  showType = true,
  showTags = true,
  compact = false,
  onClick,
  onToggleFavorite,
  className = "",
}: StoryElementCardProps) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(element);
    }
  }, [element, onClick]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(element.id);
    }
  }, [element.id, onToggleFavorite]);

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`p-2 rounded cursor-pointer transition-all text-sm ${className} ${
          isSelected
            ? "bg-blue-50 border border-blue-300"
            : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{element.name}</p>
            {showType && element.type && (
              <p className="text-xs text-gray-500 truncate">{element.type}</p>
            )}
          </div>
          {isFavorite && (
            <span className="text-yellow-500 ml-2">★</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`p-3 border rounded-lg cursor-pointer transition-all ${className} ${
        isSelected
          ? "bg-blue-50 border-blue-300 shadow-md"
          : "bg-white border-gray-200 hover:shadow-md hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-800 truncate">{element.name}</h4>
            {onToggleFavorite && (
              <button
                onClick={handleToggleFavorite}
                className={`p-1 rounded hover:bg-${isFavorite ? 'yellow' : 'gray'}-100 transition-colors`}
                title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <span className={`text-${isFavorite ? 'yellow' : 'gray'}-400`}>★</span>
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{element.description}</p>

          <div className="flex flex-wrap gap-1 text-xs">
            {showCategory && element.category && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {element.category}
              </span>
            )}
            {showType && element.type && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {element.type}
              </span>
            )}
            {showTags && element.tags && element.tags.length > 0 && (
              <>
                {element.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
                {element.tags.length > 2 && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    +{element.tags.length - 2}
                  </span>
                )}
              </>
            )}
            {element.archetype && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                {element.archetype}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

