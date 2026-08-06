// StoryElementLibrary - New UX for discovering and adding story elements
// Inspired by Notion/Obsidian/VSCode
import { useState, useMemo, useCallback } from "react";
import { StoryElement } from "../types/storyElements";
import { ViewMode, CategoryTab, CATEGORY_GROUPS } from "../types/plotBuilder";

interface StoryElementLibraryProps {
  elements: StoryElement[];
  favorites: Set<string>;
  recentlyUsed: string[];
  aiSuggestions: { element: StoryElement; reason: string }[];
  collections: { id: string; name: string; elementIds: string[] }[];
  
  searchQuery: string;
  selectedCategory: string | null;
  viewMode: ViewMode;
  showFavorites: boolean;
  showRecentlyUsed: boolean;
  showSuggestions: boolean;
  
  onSearchChange: (query: string) => void;
  onCategorySelect: (category: string | null) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleFavorites: () => void;
  onToggleRecentlyUsed: () => void;
  onToggleSuggestions: () => void;
  onAddElement: (element: StoryElement) => void;
  onToggleFavorite: (elementId: string) => void;
}

export const StoryElementLibrary = ({
  elements,
  favorites,
  recentlyUsed,
  aiSuggestions,
  collections,
  searchQuery,
  selectedCategory,
  viewMode,
  showFavorites,
  showRecentlyUsed,
  showSuggestions,
  onSearchChange,
  onCategorySelect,
  onViewModeChange,
  onToggleFavorites,
  onToggleRecentlyUsed,
  onToggleSuggestions,
  onAddElement,
  onToggleFavorite,
}: StoryElementLibraryProps) => {
  const [expandedElementId, setExpandedElementId] = useState<string | null>(null);

  // Get unique categories from elements
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { name: string; count: number }>();
    
    // Add predefined groups
    CATEGORY_GROUPS.forEach(group => {
      categoryMap.set(group.id, { name: group.name, count: 0 });
    });
    
    // Count elements in each category
    elements.forEach(element => {
      if (element.category) {
        const existing = categoryMap.get(element.category);
        if (existing) {
          categoryMap.set(element.category, {
            ...existing,
            count: existing.count + 1
          });
        } else {
          categoryMap.set(element.category, { name: element.category, count: 1 });
        }
      }
    });
    
    return Array.from(categoryMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      count: data.count,
    }));
  }, [elements]);

  // Filter elements based on search and category
  const filteredElements = useMemo(() => {
    let result = [...elements];
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(el => el.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(el => 
        el.name.toLowerCase().includes(query) ||
        el.description.toLowerCase().includes(query) ||
        (el.tags && el.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (el.type && el.type.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [elements, selectedCategory, searchQuery]);

  // Get elements to display (based on filters)
  const displayElements = useMemo(() => {
    const displayed: StoryElement[] = [];
    
    // Add favorites if enabled
    if (showFavorites) {
      const favElements = filteredElements.filter(el => favorites.has(el.id));
      displayed.push(...favElements);
    }
    
    // Add recently used if enabled
    if (showRecentlyUsed) {
      const recentElements = filteredElements.filter(el => 
        recentlyUsed.includes(el.id) && !favorites.has(el.id)
      );
      displayed.push(...recentElements);
    }
    
    // Add AI suggestions if enabled
    if (showSuggestions) {
      const suggestionElements = aiSuggestions
        .map(s => s.element)
        .filter(el => 
          !favorites.has(el.id) && 
          !recentlyUsed.includes(el.id) &&
          filteredElements.some(fel => fel.id === el.id)
        );
      displayed.push(...suggestionElements);
    }
    
    // If no specific filters, show all
    if (!showFavorites && !showRecentlyUsed && !showSuggestions) {
      return filteredElements;
    }
    
    // Remove duplicates
    const seenIds = new Set<string>();
    return displayed.filter(el => {
      if (seenIds.has(el.id)) return false;
      seenIds.add(el.id);
      return true;
    });
  }, [filteredElements, favorites, recentlyUsed, aiSuggestions, showFavorites, showRecentlyUsed, showSuggestions]);

  // Handle element click
  const handleElementClick = useCallback((element: StoryElement) => {
    onAddElement(element);
    setExpandedElementId(null);
  }, [onAddElement]);

  // Handle key down for search
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && displayElements.length > 0) {
      // Select first element on Enter
      handleElementClick(displayElements[0]);
    }
  }, [displayElements, handleElementClick]);

  // Check if element is favorite
  const isFavorite = useCallback((elementId: string) => {
    return favorites.has(elementId);
  }, [favorites]);

  // Check if element is recently used
  const isRecentlyUsed = useCallback((elementId: string) => {
    return recentlyUsed.includes(elementId);
  }, [recentlyUsed]);

  // Get AI suggestion reason
  const getSuggestionReason = useCallback((elementId: string) => {
    const suggestion = aiSuggestions.find(s => s.element.id === elementId);
    return suggestion?.reason || "";
  }, [aiSuggestions]);

  return (
    <div className="flex flex-col h-full">
      {/* Nivel 1: Descubrir - Buscador enorme */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar Story Element... (Ej: Mentor, Traición, Giro)"
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => onToggleFavorites()}
            className={`px-3 py-1 text-sm rounded-full ${showFavorites ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
          >
            ⭐ Favoritos ({favorites.size})
          </button>
          <button
            onClick={() => onToggleRecentlyUsed()}
            className={`px-3 py-1 text-sm rounded-full ${showRecentlyUsed ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
          >
            🕒 Recientes ({recentlyUsed.length})
          </button>
          <button
            onClick={() => onToggleSuggestions()}
            className={`px-3 py-1 text-sm rounded-full ${showSuggestions ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
          >
            💡 Sugerencias ({aiSuggestions.length})
          </button>
          <button
            onClick={() => {
              onSearchChange("");
              onCategorySelect(null);
              onToggleFavorites();
              onToggleRecentlyUsed();
              onToggleSuggestions();
            }}
            className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            🔄 Mostrar todos
          </button>
        </div>
      </div>

      {/* Nivel 2: Navegar - Pestañas por categoría */}
      <div className="mb-4">
        <div className="flex gap-1 overflow-x-auto pb-2 -mb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id === "all" ? null : category.id)}
              className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id || (selectedCategory === null && category.id === "all")
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name} <span className="text-xs opacity-60">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nivel 3: Tarjetas de elementos */}
      <div className="flex-1 overflow-y-auto">
        {displayElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <p className="text-lg mb-2">No se encontraron Story Elements</p>
            <p className="text-sm">Prueba con otro término de búsqueda o categoría</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayElements.map((element) => {
              const isFav = isFavorite(element.id);
              const isRecent = isRecentlyUsed(element.id);
              const suggestionReason = getSuggestionReason(element.id);
              
              return (
                <div
                  key={element.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    isFav 
                      ? "border-yellow-300 bg-yellow-50"
                      : isRecent
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon/emoji */}
                    <div className="text-xl flex-shrink-0">
                      {isFav ? "⭐" : isRecent ? "🕒" : getCategoryIcon(element.category)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">{element.name}</h4>
                        {element.type && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {element.type}
                          </span>
                        )}
                      </div>
                      
                      {viewMode === "detailed" && element.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {element.description}
                        </p>
                      )}
                      
                      {suggestionReason && (
                        <p className="text-xs text-blue-600 mb-2">
                          💡 {suggestionReason}
                        </p>
                      )}
                      
                      {element.tags && element.tags.length > 0 && viewMode === "detailed" && (
                        <div className="flex flex-wrap gap-1 text-xs">
                          {element.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {element.tags.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              +{element.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Add button */}
                    <button
                      onClick={() => handleElementClick(element)}
                      className="flex-shrink-0 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      + Añadir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get icon for category
function getCategoryIcon(category: string | undefined): string {
  if (!category) return "📝";
  
  const icons: Record<string, string> = {
    PROTAGONIST: "👑",
    ANTAGONIST: "😈",
    character_type: "👥",
    professional_lead: "💼",
    heroic_archetype: "⚔️",
    antihero: "🎭",
    tragic_hero: "😢",
    comic_lead: "😂",
    investigator: "🔍",
    Structure: "🏗️",
    Estructura: "🏗️",
  };
  
  return icons[category] || "📝";
}

export default StoryElementLibrary;
