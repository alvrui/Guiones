// StoryElementBrowser component - browser for story elements catalog
import { useCallback, useState } from "react";
import { StoryElement, PlotStoryElementSelection } from "../types/storyElements";
import { StoryElementCard } from "./StoryElementCard";
import { StoryElementSearch } from "./StoryElementSearch";
import { StoryElementFiltersPanel } from "./StoryElementFiltersPanel";
import { useStoryElements } from "../hooks/useStoryElements";

interface StoryElementBrowserProps {
  selectedElements: PlotStoryElementSelection[];
  onSelect: (element: StoryElement) => void;
  onDeselect: (elementId: string) => void;
  className?: string;
}

export const StoryElementBrowser = ({
  selectedElements,
  onSelect,
  onDeselect,
  className = "",
}: StoryElementBrowserProps) => {
  const {
    filteredElements,
    loading,
    error,
    filters,
    sortBy,
    favorites,
    recentlyUsed,
    setFilters,
    setSortBy,
    toggleFavorite,
    addToRecentlyUsed,
    getUniqueCategories,
    getUniqueTypes,
    getUniqueTags,
    getUniqueArchetypes,
  } = useStoryElements();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Check if element is selected
  const isElementSelected = useCallback((elementId: string) => {
    return selectedElements.some(selection => selection.storyElementId === elementId);
  }, [selectedElements]);

  // Check if element is favorite
  const isElementFavorite = useCallback((elementId: string) => {
    return favorites.has(elementId);
  }, [favorites]);

  // Handle element click
  const handleElementClick = useCallback((element: StoryElement) => {
    const isSelected = isElementSelected(element.id);
    
    if (isSelected) {
      onDeselect(element.id);
    } else {
      onSelect(element);
      addToRecentlyUsed(element.id);
    }
  }, [isElementSelected, onSelect, onDeselect, addToRecentlyUsed]);

  // Handle toggle favorite
  const handleToggleFavorite = useCallback((elementId: string) => {
    toggleFavorite(elementId);
  }, [toggleFavorite]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  // Get counts
  const totalCount = filteredElements.length;
  const favoritesCount = Array.from(favorites).length;
  const recentlyUsedCount = recentlyUsed.length;

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 text-red-600 rounded-md ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header with search and view controls */}
      <div className="flex items-center gap-2 mb-4">
        <StoryElementSearch
          value={filters.searchQuery || ""}
          onSearch={(query) => setFilters({ ...filters, searchQuery: query })}
          placeholder="Buscar Story Elements..."
          className="flex-1"
        />
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            title="Vista en cuadrícula"
          >
            ☀
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            title="Vista en lista"
          >
            ↑↓
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {totalCount} Story Elements {filters.searchQuery && `para "${filters.searchQuery}"`}
      </p>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Filters sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto">
          <StoryElementFiltersPanel
            filters={filters}
            sortBy={sortBy}
            categories={getUniqueCategories()}
            types={getUniqueTypes()}
            tags={getUniqueTags()}
            archetypes={getUniqueArchetypes()}
            favoritesCount={favoritesCount}
            recentlyUsedCount={recentlyUsedCount}
            onFiltersChange={setFilters}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />
        </div>

        {/* Elements grid/list */}
        <div className="flex-1 overflow-y-auto">
          {totalCount === 0 ? (
            <div className="flex items-center justify-center p-8 text-gray-500">
              <p>No se encontraron Story Elements</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredElements.map((element) => (
                <StoryElementCard
                  key={element.id}
                  element={element}
                  isSelected={isElementSelected(element.id)}
                  isFavorite={isElementFavorite(element.id)}
                  onClick={handleElementClick}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredElements.map((element) => (
                <StoryElementCard
                  key={element.id}
                  element={element}
                  isSelected={isElementSelected(element.id)}
                  isFavorite={isElementFavorite(element.id)}
                  compact
                  onClick={handleElementClick}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

