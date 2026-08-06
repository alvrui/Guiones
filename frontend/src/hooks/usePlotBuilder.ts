// Hook for managing plot builder state
import { useState, useCallback, useMemo } from "react";
import { StoryElement } from "../types/storyElements";
import { PlotElement, StoryElementCollection, AIStoryElementSuggestion, ViewMode } from "../types/plotBuilder";

// Default collections
const DEFAULT_COLLECTIONS: StoryElementCollection[] = [
  {
    id: "thriller",
    name: "Thriller",
    description: "Elementos comunes en thrillers",
    elementIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hero-journey",
    name: "Viaje del Héroe",
    description: "Elementos del viaje del héroe clásico",
    elementIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "romance",
    name: "Romance",
    description: "Elementos para historias románticas",
    elementIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Generate AI suggestions based on current elements
const generateAISuggestions = (
  selectedElements: PlotElement[],
  allElements: StoryElement[]
): AIStoryElementSuggestion[] => {
  // Simple suggestion logic based on categories and types
  const suggestions: AIStoryElementSuggestion[] = [];
  
  if (selectedElements.length === 0) return suggestions;
  
  // Get categories and types of selected elements
  const selectedCategories = new Set(selectedElements.map(e => e.category).filter(Boolean));
  const selectedTypes = new Set(selectedElements.map(e => e.type).filter(Boolean));
  
  // Find elements that match similar categories/types
  allElements.forEach(element => {
    if (selectedElements.some(se => se.id === element.id)) return; // Skip already selected
    
    // Check if element matches any selected category or type
    if (element.category && selectedCategories.has(element.category)) {
      suggestions.push({
        element,
        reason: `Complementa la categoría "${element.category}"`,
        confidence: 0.8,
      });
    } else if (element.type && selectedTypes.has(element.type)) {
      suggestions.push({
        element,
        reason: `Relacionado con el tipo "${element.type}"`,
        confidence: 0.7,
      });
    }
  });
  
  // Sort by confidence and limit
  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
};

export interface UsePlotBuilderReturn {
  // Library state
  searchQuery: string;
  selectedCategory: string | null;
  viewMode: ViewMode;
  showFavorites: boolean;
  showRecentlyUsed: boolean;
  showSuggestions: boolean;
  
  // Builder state
  plotElements: PlotElement[];
  
  // Collections
  collections: StoryElementCollection[];
  
  // Favorites and recently used
  favorites: Set<string>;
  recentlyUsed: string[];
  
  // AI suggestions
  aiSuggestions: AIStoryElementSuggestion[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleFavorites: () => void;
  toggleRecentlyUsed: () => void;
  toggleSuggestions: () => void;
  
  addElement: (element: StoryElement) => void;
  removeElement: (id: string) => void;
  updateElementOrder: (elements: PlotElement[]) => void;
  updateElementNotes: (id: string, notes: string) => void;
  updateElementCustomName: (id: string, name: string) => void;
  updateElementCustomDescription: (id: string, description: string) => void;
  
  toggleFavorite: (elementId: string) => void;
  
  // Collection actions
  addToCollection: (collectionId: string, elementId: string) => void;
  createCollection: (name: string, description?: string) => void;
  
  // Convert to old format for compatibility
  convertToElementosNarrativos: () => { tipo: string; descripcion: string }[];
}

export const usePlotBuilder = (
  allElements: StoryElement[]
): UsePlotBuilderReturn => {
  // Library state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [showFavorites, setShowFavorites] = useState(true);
  const [showRecentlyUsed, setShowRecentlyUsed] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  // Builder state
  const [plotElements, setPlotElements] = useState<PlotElement[]>([]);
  
  // Collections
  const [collections, setCollections] = useState<StoryElementCollection[]>(DEFAULT_COLLECTIONS);
  
  // Favorites and recently used (from localStorage)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(() => {
    const saved = localStorage.getItem('plotBuilderFavorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  }));
  
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    const saved = localStorage.getItem('plotBuilderRecentlyUsed');
    return saved ? JSON.parse(saved) : [];
  });
  
  // AI suggestions
  const aiSuggestions = useMemo(() => {
    return generateAISuggestions(plotElements, allElements);
  }, [plotElements, allElements]);
  
  // Save favorites to localStorage
  const saveFavorites = useCallback(() => {
    localStorage.setItem('plotBuilderFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);
  
  // Save recently used to localStorage
  const saveRecentlyUsed = useCallback(() => {
    localStorage.setItem('plotBuilderRecentlyUsed', JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);
  
  // Toggle favorites
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
  
  // Add element to plot
  const addElement = useCallback((element: StoryElement) => {
    setPlotElements(prev => {
      // Check if already added
      if (prev.some(e => e.id === element.id)) {
        return prev;
      }
      
      const newElement: PlotElement = {
        ...element,
        order: prev.length,
        notes: "",
        isFavorite: favorites.has(element.id),
        isRecentlyUsed: recentlyUsed.includes(element.id),
      };
      
      return [...prev, newElement];
    });
    
    // Add to recently used
    setRecentlyUsed(prev => {
      const newRecentlyUsed = prev.filter(id => id !== element.id);
      return [element.id, ...newRecentlyUsed].slice(0, 20);
    });
  }, [favorites, recentlyUsed]);
  
  // Remove element from plot
  const removeElement = useCallback((id: string) => {
    setPlotElements(prev => prev.filter(e => e.id !== id));
  }, []);
  
  // Update element order
  const updateElementOrder = useCallback((newElements: PlotElement[]) => {
    setPlotElements(newElements);
  }, []);
  
  // Update element notes
  const updateElementNotes = useCallback((id: string, notes: string) => {
    setPlotElements(prev => 
      prev.map(e => e.id === id ? { ...e, notes } : e)
    );
  }, []);
  
  // Update custom name
  const updateElementCustomName = useCallback((id: string, name: string) => {
    setPlotElements(prev => 
      prev.map(e => e.id === id ? { ...e, customName: name } : e)
    );
  }, []);
  
  // Update custom description
  const updateElementCustomDescription = useCallback((id: string, description: string) => {
    setPlotElements(prev => 
      prev.map(e => e.id === id ? { ...e, customDescription: description } : e)
    );
  }, []);
  
  // Toggle favorites
  const handleToggleFavorites = useCallback(() => {
    setShowFavorites(prev => !prev);
  }, []);
  
  // Toggle recently used
  const handleToggleRecentlyUsed = useCallback(() => {
    setShowRecentlyUsed(prev => !prev);
  }, []);
  
  // Toggle suggestions
  const handleToggleSuggestions = useCallback(() => {
    setShowSuggestions(prev => !prev);
  }, []);
  
  // Add to collection
  const addToCollection = useCallback((collectionId: string, elementId: string) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId
          ? {
              ...collection,
              elementIds: [...new Set([...collection.elementIds, elementId])],
              updatedAt: new Date().toISOString(),
            }
          : collection
      )
    );
  }, []);
  
  // Create collection
  const createCollection = useCallback((name: string, description?: string) => {
    const newCollection: StoryElementCollection = {
      id: `collection-${Date.now()}`,
      name,
      description,
      elementIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections(prev => [...prev, newCollection]);
  }, []);
  
  // Convert to old format for compatibility
  const convertToElementosNarrativos = useCallback(() => {
    return plotElements.map(element => ({
      tipo: element.customName || element.name || element.type || "Conflicto",
      descripcion: element.customDescription || element.notes || element.description || "",
    }));
  }, [plotElements]);
  
  // Save state when it changes
  useMemo(() => {
    saveFavorites();
  }, [favorites, saveFavorites]);
  
  useMemo(() => {
    saveRecentlyUsed();
  }, [recentlyUsed, saveRecentlyUsed]);
  
  return {
    // Library state
    searchQuery,
    selectedCategory,
    viewMode,
    showFavorites,
    showRecentlyUsed,
    showSuggestions,
    
    // Builder state
    plotElements,
    
    // Collections
    collections,
    
    // Favorites and recently used
    favorites,
    recentlyUsed,
    
    // AI suggestions
    aiSuggestions,
    
    // Actions
    setSearchQuery,
    setSelectedCategory,
    setViewMode,
    toggleFavorites: handleToggleFavorites,
    toggleRecentlyUsed: handleToggleRecentlyUsed,
    toggleSuggestions: handleToggleSuggestions,
    
    addElement,
    removeElement,
    updateElementOrder,
    updateElementNotes,
    updateElementCustomName,
    updateElementCustomDescription,
    
    toggleFavorite,
    
    addToCollection,
    createCollection,
    
    convertToElementosNarrativos,
  };
};

export default usePlotBuilder;
