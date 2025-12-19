/**
 * Search History Service
 * Manages the last N searches with localStorage persistence
 */

import { config } from '../config';

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

class SearchHistoryService {
  private storageKey = config.history.storageKey;
  private maxItems = config.history.maxItems;

  /**
   * Get all history items, most recent first
   */
  getHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const items = JSON.parse(stored) as HistoryItem[];
      return items.sort((a, b) => b.timestamp - a.timestamp);
    } catch {
      console.warn('Failed to read search history from localStorage');
      return [];
    }
  }

  /**
   * Add a new search to history
   * Avoids duplicates and maintains max items limit
   */
  addSearch(query: string): void {
    if (!query.trim()) return;

    try {
      const history = this.getHistory();
      
      // Remove existing entry with same query (case-insensitive)
      const filtered = history.filter(
        item => item.query.toLowerCase() !== query.toLowerCase()
      );

      // Add new entry at the beginning
      const newItem: HistoryItem = {
        id: `history-${Date.now()}`,
        query: query.trim(),
        timestamp: Date.now(),
      };

      // Keep only max items
      const updated = [newItem, ...filtered].slice(0, this.maxItems);

      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch {
      console.warn('Failed to save search history to localStorage');
    }
  }

  /**
   * Remove a specific item from history
   */
  removeItem(id: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    } catch {
      console.warn('Failed to remove search history item');
    }
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      console.warn('Failed to clear search history');
    }
  }
}

// Export singleton instance
export const searchHistoryService = new SearchHistoryService();
