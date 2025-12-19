/**
 * SearchBar Component
 * Features: debounced input, autocomplete suggestions, search history
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useSuggestions, useSearchHistory, useClickOutside, useKeyboardNavigation } from '../../hooks';
import { SearchSuggestion } from '../../types';
import { HistoryItem } from '../../services';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search knowledge articles...',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions and history
  const { data: suggestions = [], isLoading: suggestionsLoading } = useSuggestions(value);
  const { history, addToHistory, removeFromHistory } = useSearchHistory();

  // Close dropdown when clicking outside
  useClickOutside(containerRef, () => setShowDropdown(false));

  // Combine history and suggestions for dropdown
  const dropdownItems = useMemo(() => {
    const items: Array<SearchSuggestion | HistoryItem> = [];
    
    // Show history when input is empty or short
    if (value.length < 2 && history.length > 0) {
      items.push(...history.map(h => ({ ...h, type: 'recent' as const })));
    }
    
    // Show suggestions when typing
    if (suggestions.length > 0) {
      items.push(...suggestions);
    }
    
    return items;
  }, [value, history, suggestions]);

  // Keyboard navigation
  const handleSelect = useCallback((index: number) => {
    const item = dropdownItems[index];
    if (item) {
      const query = 'query' in item ? item.query : item.text;
      onChange(query);
      onSearch(query);
      addToHistory(query);
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  }, [dropdownItems, onChange, onSearch, addToHistory]);

  const { activeIndex, handleKeyDown, setActiveIndex } = useKeyboardNavigation(
    dropdownItems,
    handleSelect,
    showDropdown
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowDropdown(true);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      addToHistory(value.trim());
      setShowDropdown(false);
    }
  };

  // Handle suggestion click
  const handleItemClick = (item: SearchSuggestion | HistoryItem) => {
    const query = 'query' in item ? item.query : item.text;
    onChange(query);
    onSearch(query);
    addToHistory(query);
    setShowDropdown(false);
  };

  // Handle history item removal
  const handleRemoveHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromHistory(id);
  };

  // Clear input
  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''}`}>
          {/* Search Icon */}
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowDropdown(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.input}
            autoFocus={autoFocus}
            aria-label="Search articles"
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />

          {/* Loading indicator */}
          {suggestionsLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner} />
            </div>
          )}

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search button */}
          <button type="submit" className={styles.searchButton} aria-label="Search">
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && dropdownItems.length > 0 && (
        <div className={styles.dropdown} role="listbox">
          {dropdownItems.map((item, index) => {
            const isHistory = 'query' in item;
            const text = isHistory ? item.query : item.text;
            const isActive = index === activeIndex;

            return (
              <div
                key={item.id}
                className={`${styles.dropdownItem} ${isActive ? styles.active : ''}`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
                aria-selected={isActive}
              >
                {/* Icon */}
                <span className={styles.itemIcon}>
                  {isHistory ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  )}
                </span>

                {/* Text */}
                <span className={styles.itemText}>{text}</span>

                {/* Remove button for history items */}
                {isHistory && (
                  <button
                    className={styles.removeButton}
                    onClick={(e) => handleRemoveHistory(e, item.id)}
                    aria-label={`Remove "${text}" from history`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
