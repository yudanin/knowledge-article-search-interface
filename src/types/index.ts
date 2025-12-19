/**
 * Core type definitions for the Knowledge Article Search application
 */

// Article entity - matches the mock data structure from requirements
export interface Article {
  id: string;
  title: string;
  content: string;
  snippet?: string;
  category: string;
  tags: string[];
  relevanceScore: number;
  createdDate: string;
  lastUpdated: string;
  viewCount: number;
}

// Search parameters for filtering and sorting
export interface SearchParams {
  query: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: SortOption;
  page: number;
  pageSize: number;
}

// Sort options
export type SortOption = 'relevance' | 'date' | 'popularity';

// Search response from API
export interface SearchResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Search suggestion for autocomplete
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'suggested';
}

// Category for filtering
export interface Category {
  id: string;
  name: string;
  count?: number;
  articleCount?: number;
  description?: string;
}

// API error response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Loading state for UI
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
