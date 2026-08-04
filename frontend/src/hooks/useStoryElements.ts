// Hook for managing Story Elements catalog
import { useState, useCallback, useMemo, useEffect } from "react";
import { 
  StoryElement, 
  StoryElementFilters, 
  StoryElementSortBy,
  StoryElementsCatalog 
} from "../types/storyElements";

// Default story elements catalog (fallback when CSV is not loaded)
// This is a minimal set to ensure the app works without CSV
const DEFAULT_CATALOG: StoryElement[] = [
  {
    id: "se-001",
    name: "Conflicto Central",
    description: "El conflicto principal que impulsa la historia",
    category: "Estructura",
    type: "Conflicto",
    tags: ["principal", "obligatorio"],
  },
  {
    id: "se-002",
    name: "Revelaci\u00f3n",
    description: "Momento en que se revela informaci\u00f3n crucial",
    category: "Estructura",
    type: "Revelaci\u00f3n",
    tags: ["clave", "sorpresa"],
  },
  {
    id: "se-003",
    name: "Cl\u00edmax",
    description: "El punto de mayor tensi\u00f3n en la historia",
    category: "Estructura",
    type: "Cl\u00edmax",
    tags: ["tensi\u00f3n", "cumulativo"],
  },
  {
    id: "se-004",
    name: "Giro Argumental",
    description: "Cambio inesperado en la direcci\u00f3n de la historia",
    category: "Estructura",
    type: "Giro Argumental",
    tags: ["sorpresa", "cambio"],
  },
  {
    id: "se-005",
    name: "Exposici\u00f3n",
    description: "Presentaci\u00f3n del contexto y personajes",
    category: "Estructura",
    type: "Exposici\u00f3n",
    tags: ["inicio", "contexto"],
  },
  {
    id: "se-006",
    name: "Desarrollo",
    description: "Desarrollo de la trama y evoluci\u00f3n de personajes",
    category: "Estructura",
    type: "Desarrollo",
    tags: ["progreso", "evoluci\u00f3n"],
  },
  {
    id: "se-007",
    name: "Resoluci\u00f3n",
    description: "Resoluci\u00f3n del conflicto central",
    category: "Estructura",
    type: "Resoluci\u00f3n",
    tags: ["final", "cierre"],
  },
];

// Helper function to parse a CSV line handling quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result.map(v => v.trim());
};

// CSV parsing utility - handles the specific Story Elements CSV format
const parseCSVToStoryElements = (csvContent: string): StoryElement[] => {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];

  // Get headers from first line
  const headers = parseCSVLine(lines[0]);
  
  const elements: StoryElement[] = [];
  
  // Process each data line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Use a proper CSV parser to handle quoted fields with commas
    const values = parseCSVLine(line);
    
    if (values.length === 0) continue;

    const element: StoryElement = {
      id: values[0] || `se-${i}`,
    };

    // Map specific CSV columns to StoryElement fields
    // Based on the actual CSV format: id,english_name,spanish_name,category,subtype,role_in_story,...
    for (let j = 0; j < Math.min(headers.length, values.length); j++) {
      const header = headers[j].toLowerCase();
      const value = values[j];

      if (!value) continue;

      switch (header) {
        case 'id':
          element.id = value;
          break;
        case 'english_name':
          element.name = value;
          break;
        case 'spanish_name':
          // Use spanish_name as the primary name for Spanish UI
          element.name = value;
          break;
        case 'category':
          element.category = value;
          break;
        case 'subtype':
          element.type = value;
          break;
        case 'role_in_story':
          // Could be used as archetype or type
          if (!element.type) element.type = value;
          if (!element.archetype) element.archetype = value;
          break;
        case 'dramatic_function':
          element.description = value;
          break;
        case 'logline_usage':
          // Additional description
          if (element.description) {
            element.description += ` ${value}`;
          } else {
            element.description = value;
          }
          break;
        case 'tags_engine':
          element.tags = value.split(';').map(t => t.trim()).filter(t => t);
          break;
        case 'primary_genres':
        case 'secondary_genres':
        case 'tone_seriousness':
        case 'tone_darkness':
        case 'tone_stylization':
        case 'emotional_core':
        case 'moral_axis':
          // Add as tags
          if (!element.tags) element.tags = [];
          element.tags.push(value.toLowerCase().replace(/_/g, ' '));
          break;
        default:
          // For any other field, try to match by partial name
          if (header.includes('name') || header.includes('nombre')) {
            element.name = value;
          } else if (header.includes('description') || header.includes('descripci\u00f3n')) {
            element.description = value;
          } else if (header.includes('archetype') || header.includes('arquetipo')) {
            element.archetype = value;
          }
          break;
      }
    }

    // Only add if it has at least a name and id
    if (element.id && element.name) {
      elements.push(element);
    }
  }

  return elements;
};

// Function to load CSV from public folder or API
const loadStoryElementsFromCSV = async (): Promise<StoryElement[]> => {
  try {
    // Try to load from public folder
    const response = await fetch('/data/story-elements.csv');
    if (response.ok) {
      const csvContent = await response.text();
      return parseCSVToStoryElements(csvContent);
    }
  } catch (error) {
    console.warn("Could not load story elements from CSV:", error);
  }
  
  return DEFAULT_CATALOG;
};

// Function to load from API (if available)
const loadStoryElementsFromAPI = async (): Promise<StoryElement[]> => {
  try {
    const response = await fetch('/api/story-elements');
    if (response.ok) {
      const data = await response.json();
      return data.elements || DEFAULT_CATALOG;
    }
  } catch (error) {
    console.warn("Could not load story elements from API:", error);
  }
  
  return DEFAULT_CATALOG;
};

export interface UseStoryElementsReturn {
  catalog: StoryElementsCatalog;
  elements: StoryElement[];
  filteredElements: StoryElement[];
  loading: boolean;
  error: string | null;
  filters: StoryElementFilters;
  sortBy: StoryElementSortBy;
  favorites: Set<string>;
  recentlyUsed: string[];
  setFilters: (filters: StoryElementFilters) => void;
  setSortBy: (sortBy: StoryElementSortBy) => void;
  toggleFavorite: (elementId: string) => void;
  addToRecentlyUsed: (elementId: string) => void;
  refreshCatalog: () => Promise<void>;
  getElementById: (id: string) => StoryElement | undefined;
  getUniqueCategories: () => string[];
  getUniqueTypes: () => string[];
  getUniqueTags: () => string[];
  getUniqueArchetypes: () => string[];
}

export const useStoryElements = (): UseStoryElementsReturn => {
  const [catalog, setCatalog] = useState<StoryElementsCatalog>({
    elements: [],
    categories: [],
    types: [],
    tags: [],
    archetypes: [],
    version: "1.0",
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StoryElementFilters>({});
  const [sortBy, setSortBy] = useState<StoryElementSortBy>("name-asc");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);

  // Load catalog on mount
  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try API first, then CSV, then fallback to default
        let elements: StoryElement[] = [];
        
        elements = await loadStoryElementsFromAPI();
        if (elements.length === 0) {
          elements = await loadStoryElementsFromCSV();
        }
        
        // If we got elements but they look like the default, try CSV again
        // This handles the case where API returns empty array
        if (elements.length <= DEFAULT_CATALOG.length) {
          const csvElements = await loadStoryElementsFromCSV();
          if (csvElements.length > elements.length) {
            elements = csvElements;
          }
        }

        // Extract metadata
        const categories = [...new Set(elements.map(e => e.category).filter(Boolean))];
        const types = [...new Set(elements.map(e => e.type).filter(Boolean))];
        const tags = [...new Set(elements.flatMap(e => e.tags || []).filter(Boolean))];
        const archetypes = [...new Set(elements.map(e => e.archetype).filter(Boolean))];

        setCatalog({
          elements,
          categories,
          types,
          tags,
          archetypes,
          version: "1.0",
          lastUpdated: new Date().toISOString(),
        });

        // Load user preferences from localStorage
        const savedFavorites = localStorage.getItem('storyElementsFavorites');
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }

        const savedRecentlyUsed = localStorage.getItem('storyElementsRecentlyUsed');
        if (savedRecentlyUsed) {
          setRecentlyUsed(JSON.parse(savedRecentlyUsed));
        }

      } catch (err) {
        setError("Error al cargar el cat\u00e1logo de Story Elements");
        console.error("Error loading story elements:", err);
        
        // Fallback to default catalog
        const categories = [...new Set(DEFAULT_CATALOG.map(e => e.category).filter(Boolean))];
        const types = [...new Set(DEFAULT_CATALOG.map(e => e.type).filter(Boolean))];
        const tags = [...new Set(DEFAULT_CATALOG.flatMap(e => e.tags || []).filter(Boolean))];
        const archetypes = [...new Set(DEFAULT_CATALOG.map(e => e.archetype).filter(Boolean))];

        setCatalog({
          elements: DEFAULT_CATALOG,
          categories,
          types,
          tags,
          archetypes,
          version: "1.0",
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  // Save favorites and recently used to localStorage
  useEffect(() => {
    localStorage.setItem('storyElementsFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('storyElementsRecentlyUsed', JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);

  // Filter and sort elements
  const filteredElements = useMemo(() => {
    let result = [...catalog.elements];

    // Apply filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(element => 
        element.name.toLowerCase().includes(query) ||
        element.description.toLowerCase().includes(query) ||
        (element.tags && element.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (element.category && element.category.toLowerCase().includes(query)) ||
        (element.type && element.type.toLowerCase().includes(query))
      );
    }

    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(element => 
        element.category && filters.categories!.includes(element.category)
      );
    }

    if (filters.types && filters.types.length > 0) {
      result = result.filter(element => 
        element.type && filters.types!.includes(element.type)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(element => 
        element.tags && element.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    if (filters.archetypes && filters.archetypes.length > 0) {
      result = result.filter(element => 
        element.archetype && filters.archetypes!.includes(element.archetype)
      );
    }

    if (filters.showFavorites) {
      result = result.filter(element => favorites.has(element.id));
    }

    if (filters.showRecentlyUsed) {
      result = result.filter(element => recentlyUsed.includes(element.id));
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "category-asc":
        result.sort((a, b) => (a.category || "").localeCompare(b.category || "")));
        break;
      case "type-asc":
        result.sort((a, b) => (a.type || "").localeCompare(b.type || "")));
        break;
      case "last-used":
        result.sort((a, b) => {
          const aIndex = recentlyUsed.indexOf(a.id);
          const bIndex = recentlyUsed.indexOf(b.id);
          // Elements not in recently used go to the end
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
        break;
    }

    return result;
  }, [catalog.elements, filters, sortBy, favorites, recentlyUsed]);

  // Toggle favorite status
  const toggleFavorite = useCallback((elementId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(elementId)) {
        newFavorites.delete(elementId);
      } else {
        newFavorites.add(elementId);
      }
      return newFavorites;
    });
  }, []);

  // Add to recently used
  const addToRecentlyUsed = useCallback((elementId: string) => {
    setRecentlyUsed(prev => {
      // Remove if already exists
      const newRecentlyUsed = prev.filter(id => id !== elementId);
      // Add to beginning
      return [elementId, ...newRecentlyUsed].slice(0, 20); // Keep only last 20
    });
  }, []);

  // Refresh catalog
  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let elements: StoryElement[] = [];
      
      elements = await loadStoryElementsFromAPI();
      if (elements.length === 0) {
        elements = await loadStoryElementsFromCSV();
      }

      const categories = [...new Set(elements.map(e => e.category).filter(Boolean))];
      const types = [...new Set(elements.map(e => e.type).filter(Boolean))];
      const tags = [...new Set(elements.flatMap(e => e.tags || []).filter(Boolean))];
      const archetypes = [...new Set(elements.map(e => e.archetype).filter(Boolean))];

      setCatalog({
        elements,
        categories,
        types,
        tags,
        archetypes,
        version: "1.0",
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      setError("Error al refrescar el cat\u00e1logo");
      console.error("Error refreshing catalog:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get element by ID
  const getElementById = useCallback((id: string) => {
    return catalog.elements.find(element => element.id === id);
  }, [catalog.elements]);

  // Get unique values for filters
  const getUniqueCategories = useCallback(() => {
    return catalog.categories;
  }, [catalog.categories]);

  const getUniqueTypes = useCallback(() => {
    return catalog.types;
  }, [catalog.types]);

  const getUniqueTags = useCallback(() => {
    return catalog.tags;
  }, [catalog.tags]);

  const getUniqueArchetypes = useCallback(() => {
    return catalog.archetypes;
  }, [catalog.archetypes]);

  return {
    catalog,
    elements: catalog.elements,
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
    refreshCatalog,
    getElementById,
    getUniqueCategories,
    getUniqueTypes,
    getUniqueTags,
    getUniqueArchetypes,
  };
};

export default useStoryElements;
