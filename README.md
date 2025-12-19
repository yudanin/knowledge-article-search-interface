# Knowledge Article Search Interface

A React-based AI-powered knowledge search interface for customer service agents.

## Features

- **Search bar with real-time suggestions** - debounced search input with autocomplete
- **Search Results Display** - article title, relevance score, preview snippet, category tags
- **Filtering** by category and date range
- **Sort options** (by )relevance, date, popularity)
- **Article detail view** (side panel modal with full article content)
- **Search history** - last 5 searches
- **Loading states** - skeleton loaders and spinners
- **Error handling** - user-friendly error messages with retry
- **Responsive design** (mobile-friendly)




## Project Structure

```
src/
├── components/          # React components
│   ├── SearchBar/       # Search input with autocomplete
│   ├── ArticleCard/     # Search result card
│   ├── ArticleModal/    # Article detail side panel
│   ├── Filters/         # Category, date, sort filters
│   └── StateComponents/ # Loading, error, empty states
├── hooks/               # Custom React hooks
├── services/            # API and data services
│   ├── api.ts           # API interface (mock implementation)
│   ├── mockData.ts      # Mock article data
│   └── searchHistory.ts # Search history localStorage
├── types/               # TypeScript type definitions
├── config/              # App configuration (debounce timing, etc.)
├── utils/               # Utility functions
└── styles/              # Global CSS styles
```

## Configuration

Edit `src/config/index.ts` to adjust:

```typescript
export const config = {
  search: {
    debounceMs: 300,        // Debounce timing (configurable)
    minQueryLength: 2,       // Min chars before search
    maxSuggestions: 5,       // Max autocomplete items
    pageSize: 10,            // Results per page
  },
  // ...
};
```

## API Integration

The app uses a pluggable API service pattern. To switch from mock to real API:

1. Open `src/services/api.ts`
2. Implement `RealApiService` class (commented template provided)
3. Export the real service instead of mock:
   ```typescript
   export const apiService: IApiService = new RealApiService();
   ```

## Technology Stack

- **React 19** with TypeScript
- **TanStack Query** for server state management
- **CSS Modules** for component styling
- **date-fns** for date formatting

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yudanin/knowledge-article-search-interface.git
cd knowledge-article-search-interface

# Install dependencies
npm install

# Start development server
npm start
```

## Development

### Running Locally (PyCharm)

1. Open project in PyCharm
2. Configure Node.js interpreter
3. Run `npm start` from terminal
4. App runs at http://localhost:3000

## Author

Michael Yudanin, yudanin@gmail.com

