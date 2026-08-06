// Types for the new Plot Builder interface

import { StoryElement } from "./storyElements";

// View modes for story elements
export type ViewMode = "compact" | "detailed";

// Tab categories for navigation
export interface CategoryTab {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

// Selected story element with additional metadata
export interface PlotElement extends StoryElement {
  order: number;
  customDescription?: string;
  customName?: string;
  notes?: string;
  isFavorite: boolean;
  isRecentlyUsed: boolean;
  relatedElements?: string[]; // IDs of related elements
}

// Collection of story elements
export interface StoryElementCollection {
  id: string;
  name: string;
  description?: string;
  elementIds: string[];
  createdAt: string;
  updatedAt: string;
}

// AI suggestion
export interface AIStoryElementSuggestion {
  element: StoryElement;
  reason: string; // Why this element is suggested
  confidence: number; // 0-1
}

// Relationship between elements
export interface ElementRelationship {
  fromId: string;
  toId: string;
  type: "related" | "requires" | "conflicts" | "enhances";
  description?: string;
}

// State for the library
export interface LibraryState {
  searchQuery: string;
  selectedCategory: string | null;
  viewMode: ViewMode;
  showFavorites: boolean;
  showRecentlyUsed: boolean;
  showSuggestions: boolean;
}

// State for the plot builder
export interface PlotBuilderState {
  elements: PlotElement[];
  selectedElementId: string | null;
  relationships: ElementRelationship[];
}

// Combined state
export interface PlotPageState {
  library: LibraryState;
  builder: PlotBuilderState;
  collections: StoryElementCollection[];
}

// Actions
export type LibraryAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORY"; payload: string | null }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "TOGGLE_FAVORITES" }
  | { type: "TOGGLE_RECENTLY_USED" }
  | { type: "TOGGLE_SUGGESTIONS" };

export type BuilderAction =
  | { type: "ADD_ELEMENT"; payload: PlotElement }
  | { type: "REMOVE_ELEMENT"; payload: string }
  | { type: "UPDATE_ELEMENT_ORDER"; payload: { id: string; newOrder: number } }
  | { type: "UPDATE_ELEMENT_NOTES"; payload: { id: string; notes: string } }
  | { type: "SELECT_ELEMENT"; payload: string | null }
  | { type: "ADD_RELATIONSHIP"; payload: ElementRelationship }
  | { type: "REMOVE_RELATIONSHIP"; payload: { fromId: string; toId: string } };

// Props for components
export interface StoryElementLibraryProps {
  elements: StoryElement[];
  categories: CategoryTab[];
  favorites: Set<string>;
  recentlyUsed: string[];
  aiSuggestions: AIStoryElementSuggestion[];
  collections: StoryElementCollection[];
  
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

export interface PlotBuilderProps {
  elements: PlotElement[];
  onRemoveElement: (id: string) => void;
  onUpdateOrder: (id: string, newOrder: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSelectElement: (id: string | null) => void;
}

// Constants for categories
export const CATEGORY_GROUPS = [
  { id: "all", name: "Todos", icon: "🌐" },
  { id: "PROTAGONIST", name: "Protagonistas", icon: "👑" },
  { id: "ANTAGONIST", name: "Antagonistas", icon: "😈" },
  { id: "character_type", name: "Tipos de Personaje", icon: "👥" },
  { id: "professional_lead", name: "Profesionales", icon: "💼" },
  { id: "heroic_archetype", name: "Arquetipos Heroicos", icon: "⚔️" },
  { id: "antihero", name: "Antihéroes", icon: "🎭" },
  { id: "tragic_hero", name: "Héroes Trágicos", icon: "😢" },
  { id: "comic_lead", name: "Cómicos", icon: "😂" },
  { id: "investigator", name: "Investigadores", icon: "🔍" },
];
