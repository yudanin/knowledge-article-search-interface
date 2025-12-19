/**
 * Custom hooks for the Knowledge Search application
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService, searchHistoryService, HistoryItem } from '../services';
import { SearchParams, SortOption } from '../types';
import { config } from '../config';

/**
 * Debounce hook - delays value updates
 */
export function useDebounce<T>(value: T, delay: number = config.search.debounceMs): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Search parameters state management
 */
export function useSearchParams() {
  const [params, setParams] = useState<SearchParams>({
    query: '',
    category: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: 'relevance',
    page: 1,
    pageSize: config.search.pageSize,
  });

  const updateQuery = useCallback((query: string) => {
    setParams(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const updateCategory = useCallback((category: string | undefined) => {
    setParams(prev => ({ ...prev, category, page: 1 }));
  }, []);

  const updateDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    setParams(prev => ({ ...prev, dateFrom, dateTo, page: 1 }));
  }, []);

  const updateSortBy = useCallback((sortBy: SortOption) => {
    setParams(prev => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  const resetFilters = useCallback(() => {
    setParams(prev => ({
      ...prev,
      category: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: 'relevance',
      page: 1,
    }));
  }, []);

  return {
    params,
    updateQuery,
    updateCategory,
    updateDateRange,
    updateSortBy,
    updatePage,
    resetFilters,
  };
}

/**
 * Main search hook with TanStack Query
 */
export function useSearch(params: SearchParams) {
  const debouncedQuery = useDebounce(params.query);

  // Create stable search params with debounced query
  const searchParams = useMemo(() => ({
    ...params,
    query: debouncedQuery,
  }), [params, debouncedQuery]);

  const query = useQuery({
    queryKey: ['search', searchParams],
    queryFn: () => apiService.searchArticles(searchParams),
    enabled: true, // Always enabled, even for empty query (shows all results)
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });

  return {
    ...query,
    isSearching: params.query !== debouncedQuery, // True while debouncing
  };
}

/**
 * Single article fetch hook
 */
export function useArticle(id: string | null) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => id ? apiService.getArticleById(id) : null,
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Categories fetch hook
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Search suggestions hook with debouncing
 */
export function useSuggestions(query: string) {
  const debouncedQuery = useDebounce(query, 150); // Faster debounce for suggestions

  return useQuery({
    queryKey: ['suggestions', debouncedQuery],
    queryFn: () => apiService.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= config.search.minQueryLength,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Search history hook with state management
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(searchHistoryService.getHistory());
  }, []);

  const addToHistory = useCallback((query: string) => {
    searchHistoryService.addSearch(query);
    setHistory(searchHistoryService.getHistory());
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    searchHistoryService.removeItem(id);
    setHistory(searchHistoryService.getHistory());
  }, []);

  const clearHistory = useCallback(() => {
    searchHistoryService.clearHistory();
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

/**
 * Click outside hook for closing dropdowns
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, handler]);
}

/**
 * Keyboard navigation hook
 */
export function useKeyboardNavigation(
  items: any[],
  onSelect: (index: number) => void,
  isOpen: boolean
) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!isOpen) setActiveIndex(-1);
  }, [isOpen]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen || items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0) {
          onSelect(activeIndex);
        }
        break;
      case 'Escape':
        setActiveIndex(-1);
        break;
    }
  }, [isOpen, items.length, activeIndex, onSelect]);

  return { activeIndex, handleKeyDown, setActiveIndex };
}
