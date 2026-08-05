// Types for Story Elements catalog

// Story Element from the catalog
export interface StoryElement {
  id: string; // Unique identifier (generated from CSV or UUID)
  name: string; // Name of the story element
  description: string; // Description of what this element represents
  category?: string; // Category or group it belongs to
  type?: string; // Type of element (e.g., "Conflicto", "Revelación", etc.)
  tags?: string[]; // Tags for filtering
  archetype?: string; // Related archetype if applicable
  example?: string; // Example of usage
  notes?: string; // Additional notes
  // Metadata for UI
  isFavorite?: boolean; // User favorite flag
  lastUsed?: string; // ISO date string for last used
}

// Filter options for story elements
export interface StoryElementFilters {
  searchQuery?: string;
  categories?: string[];
  types?: string[];
  tags?: string[];
  archetypes?: string[];
  showFavorites?: boolean;
  showRecentlyUsed?: boolean;
}

// Sort options
export type StoryElementSortBy = 
  | "name-asc"
  | "name-desc"
  | "category-asc"
  | "type-asc"
  | "last-used";

// Selection state for plot
export interface PlotStoryElementSelection {
  storyElementId: string;
  order: number; // Position in the plot
  customDescription?: string; // Optional custom description override
  customName?: string; // Optional custom name override
}

// Extended plot data with story element references
export interface PlotWithStoryElements extends PlotStoryElementSelection {
  storyElement: StoryElement;
}

// Catalog metadata
export interface StoryElementsCatalog {
  elements: StoryElement[];
  categories: string[];
  types: string[];
  tags: string[];
  archetypes: string[];
  version: string;
  lastUpdated: string;
}
