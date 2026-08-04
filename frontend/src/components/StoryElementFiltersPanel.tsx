// StoryElementFiltersPanel component - filter controls for story elements catalog
import { useCallback } from "react";
import { StoryElementFilters, StoryElementSortBy } from "../types/storyElements";

interface StoryElementFiltersPanelProps {
  filters: StoryElementFilters;
  sortBy: StoryElementSortBy;
  categories: string[];
  types: string[];
  tags: string[];
  archetypes: string[];
  favoritesCount: number;
  recentlyUsedCount: number;
  onFiltersChange: (filters: StoryElementFilters) => void;
  onSortChange: (sortBy: StoryElementSortBy) => void;
  onReset: () => void;
  className?: string;
}

export const StoryElementFiltersPanel = ({
  filters,
  sortBy,
  categories,
  types,
  tags,
  archetypes,
  favoritesCount,
  recentlyUsedCount,
  onFiltersChange,
  onSortChange,
  onReset,
  className = "",
}: StoryElementFiltersPanelProps) => {
  // Handle search query change
  const handleSearchChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({ ...filters, searchQuery: e.target.value });
  }, [filters, onFiltersChange]);

  // Handle category filter change
  const handleCategoryChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const category = e.target.value;
    const currentCategories = filters.categories || [];
    
    if (e.target.checked) {
      onFiltersChange({
        ...filters,
        categories: [...currentCategories, category],
      });
    } else {
      onFiltersChange({
        ...filters,
        categories: currentCategories.filter(c => c !== category),
      });
    }
  }, [filters, onFiltersChange]);

  // Handle type filter change
  const handleTypeChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const type = e.target.value;
    const currentTypes = filters.types || [];
    
    if (e.target.checked) {
      onFiltersChange({
        ...filters,
        types: [...currentTypes, type],
      });
    } else {
      onFiltersChange({
        ...filters,
        types: currentTypes.filter(t => t !== type),
      });
    }
  }, [filters, onFiltersChange]);

  // Handle tag filter change
  const handleTagChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tag = e.target.value;
    const currentTags = filters.tags || [];
    
    if (e.target.checked) {
      onFiltersChange({
        ...filters,
        tags: [...currentTags, tag],
      });
    } else {
      onFiltersChange({
        ...filters,
        tags: currentTags.filter(t => t !== tag),
      });
    }
  }, [filters, onFiltersChange]);

  // Handle archetype filter change
  const handleArchetypeChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archetype = e.target.value;
    const currentArchetypes = filters.archetypes || [];
    
    if (e.target.checked) {
      onFiltersChange({
        ...filters,
        archetypes: [...currentArchetypes, archetype],
      });
    } else {
      onFiltersChange({
        ...filters,
        archetypes: currentArchetypes.filter(a => a !== archetype),
      });
    }
  }, [filters, onFiltersChange]);

  // Handle show favorites toggle
  const handleShowFavoritesChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      showFavorites: e.target.checked,
      // Clear other filters when showing favorites
      showRecentlyUsed: false,
      categories: [],
      types: [],
      tags: [],
      archetypes: [],
    });
  }, [filters, onFiltersChange]);

  // Handle show recently used toggle
  const handleShowRecentlyUsedChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      showRecentlyUsed: e.target.checked,
      // Clear other filters when showing recently used
      showFavorites: false,
      categories: [],
      types: [],
      tags: [],
      archetypes: [],
    });
  }, [filters, onFiltersChange]);

  // Handle sort change
  const handleSortChange = useCallback((
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onSortChange(e.target.value as StoryElementSortBy);
  }, [onSortChange]);

  // Check if any filter is active
  const hasActiveFilters = (
    filters.searchQuery ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.types && filters.types.length > 0) ||
    (filters.tags && filters.tags.length > 0) ||
    (filters.archetypes && filters.archetypes.length > 0) ||
    filters.showFavorites ||
    filters.showRecentlyUsed
  );

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
      <h3 className="font-bold text-gray-800 mb-4">Filtros</h3>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar
        </label>
        <input
          type="text"
          value={filters.searchQuery || ""}
          onChange={handleSearchChange}
          placeholder="Nombre, descripci\u00f3n, tags..."
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      {/* Quick filters */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">R\u00e1pido</p>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.showFavorites || false}
              onChange={handleShowFavoritesChange}
              className="rounded"
            />
            <span className="text-sm text-gray-600">
              Favoritos ({favoritesCount})
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.showRecentlyUsed || false}
              onChange={handleShowRecentlyUsedChange}
              className="rounded"
            />
            <span className="text-sm text-gray-600">
              Usados recientemente ({recentlyUsedCount})
            </span>
          </label>
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-4">
          <details className="border border-gray-200 rounded-md p-2">
            <summary className="font-medium text-gray-700 cursor-pointer flex justify-between items-center">
              Categor\u00eda
              {filters.categories && filters.categories.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                  {filters.categories.length}
                </span>
              )}
            </summary>
            <div className="mt-2 space-y-1">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 ml-2">
                  <input
                    type="checkbox"
                    value={category}
                    checked={(filters.categories || []).includes(category)}
                    onChange={handleCategoryChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Type filter */}
      {types.length > 0 && (
        <div className="mb-4">
          <details className="border border-gray-200 rounded-md p-2">
            <summary className="font-medium text-gray-700 cursor-pointer flex justify-between items-center">
              Tipo
              {filters.types && filters.types.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                  {filters.types.length}
                </span>
              )}
            </summary>
            <div className="mt-2 space-y-1">
              {types.map((type) => (
                <label key={type} className="flex items-center gap-2 ml-2">
                  <input
                    type="checkbox"
                    value={type}
                    checked={(filters.types || []).includes(type)}
                    onChange={handleTypeChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">{type}</span>
                </label>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="mb-4">
          <details className="border border-gray-200 rounded-md p-2">
            <summary className="font-medium text-gray-700 cursor-pointer flex justify-between items-center">
              Tags
              {filters.tags && filters.tags.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                  {filters.tags.length}
                </span>
              )}
            </summary>
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {tags.slice(0, 20).map((tag) => (
                <label key={tag} className="flex items-center gap-2 ml-2">
                  <input
                    type="checkbox"
                    value={tag}
                    checked={(filters.tags || []).includes(tag)}
                    onChange={handleTagChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">{tag}</span>
                </label>
              ))}
              {tags.length > 20 && (
                <p className="text-xs text-gray-500 mt-1 ml-2">
                  +{tags.length - 20} m\u00e1s
                </p>
              )}
            </div>
          </details>
        </div>
      )}

      {/* Archetype filter */}
      {archetypes.length > 0 && (
        <div className="mb-4">
          <details className="border border-gray-200 rounded-md p-2">
            <summary className="font-medium text-gray-700 cursor-pointer flex justify-between items-center">
              Arquetipo
              {filters.archetypes && filters.archetypes.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                  {filters.archetypes.length}
                </span>
              )}
            </summary>
            <div className="mt-2 space-y-1">
              {archetypes.map((archetype) => (
                <label key={archetype} className="flex items-center gap-2 ml-2">
                  <input
                    type="checkbox"
                    value={archetype}
                    checked={(filters.archetypes || []).includes(archetype)}
                    onChange={handleArchetypeChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">{archetype}</span>
                </label>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Sort */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ordenar por
        </label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="name-asc">Nombre (A-Z)</option>
          <option value="name-desc">Nombre (Z-A)</option>
          <option value="category-asc">Categor\u00eda (A-Z)</option>
          <option value="type-asc">Tipo (A-Z)</option>
          <option value="last-used">Usados recientemente</option>
        </select>
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};

