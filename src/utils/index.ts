/**
 * Utility functions for the application
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    // Show relative time for recent dates
    if (diffDays < 7) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    // Show formatted date for older dates
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

/**
 * Get relevance label based on score
 */
export function getRelevanceLabel(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 0.8) return 'High';
  if (score >= 0.5) return 'Medium';
  return 'Low';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? singular : pluralForm;
}

/**
 * Check if a string contains a search query (case-insensitive)
 */
export function containsQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Escape special regex characters in a string
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Class name utility (simple cn function)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
