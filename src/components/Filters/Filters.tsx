/**
 * Filters Component
 * Category filter, date range picker, and sort options
 */

import React, { memo } from 'react';
import { useCategories } from '../../hooks';
import { SortOption, Category } from '../../types';
import styles from './Filters.module.css';

interface FiltersProps {
  selectedCategory?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: SortOption;
  onCategoryChange: (category: string | undefined) => void;
  onDateRangeChange: (dateFrom?: string, dateTo?: string) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  totalResults: number;
}

export const Filters: React.FC<FiltersProps> = memo(({
  selectedCategory,
  dateFrom,
  dateTo,
  sortBy,
  onCategoryChange,
  onDateRangeChange,
  onSortChange,
  onReset,
  totalResults,
}) => {
  const { data: categories = [], isLoading } = useCategories();

  const hasActiveFilters = selectedCategory || dateFrom || dateTo || sortBy !== 'relevance';

  return (
    <div className={styles.container}>
      {/* Results count and sort */}
      <div className={styles.header}>
        <span className={styles.resultCount}>
          {totalResults} {totalResults === 1 ? 'result' : 'results'}
        </span>

        <div className={styles.sortWrapper}>
          <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className={styles.sortSelect}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Most Recent</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Filter controls */}
      <div className={styles.filters}>
        {/* Category filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="category" className={styles.filterLabel}>Category</label>
          <select
            id="category"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || undefined)}
            className={styles.filterSelect}
            disabled={isLoading}
          >
            <option value="">All Categories</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.name}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div className={styles.filterGroup}>
          <label htmlFor="dateFrom" className={styles.filterLabel}>From</label>
          <input
            id="dateFrom"
            type="date"
            value={dateFrom || ''}
            onChange={(e) => onDateRangeChange(e.target.value || undefined, dateTo)}
            className={styles.filterInput}
          />
        </div>

        {/* Date to */}
        <div className={styles.filterGroup}>
          <label htmlFor="dateTo" className={styles.filterLabel}>To</label>
          <input
            id="dateTo"
            type="date"
            value={dateTo || ''}
            onChange={(e) => onDateRangeChange(dateFrom, e.target.value || undefined)}
            className={styles.filterInput}
          />
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className={styles.resetButton}
            aria-label="Reset all filters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
});

Filters.displayName = 'Filters';
