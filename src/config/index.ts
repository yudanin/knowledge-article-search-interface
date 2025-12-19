/**
 * Configurable values
 */

export const config = {
  // Search settings
  search: {
    debounceMs: 500,           // Debounce timing for search input
    minQueryLength: 5,          // Minimum characters before search triggers
    maxSuggestions: 5,          // Maximum autocomplete suggestions
    pageSize: 10,               // Default results per page
  },

  // Search history
  history: {
    maxItems: 5,                // Maximum search history items to store
    storageKey: 'search-history', // localStorage key for persistence
  },

  // API settings (for future real API integration)
  api: {
    baseUrl: process.env.REACT_APP_API_URL || '/api',
    timeout: 10000,             // Request timeout in ms
  },

  // UI settings
  ui: {
    animationDuration: 200,     // Default animation duration in ms
    toastDuration: 3000,        // Toast notification duration in ms
  },

  // Feature flags (for gradual rollout)
  features: {
    enableAiSuggestions: true,
    enableOfflineMode: false,
  },
} as const;

// Type for config access
export type AppConfig = typeof config;
