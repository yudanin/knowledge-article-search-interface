# Knowledge Article Search Interface

A React-based AI-powered knowledge search interface for customer service agents.

## Features

- **Search bar with real-time suggestions** - debounced search input with autocomplete
- **Search Results Display** - article title, relevance score, preview snippet, category tags
- **Filtering** by category and date range
- **Sort options** (by relevance, date, popularity)
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

## Tech Stack

- **React 19** with TypeScript
- **TanStack Query** for server state management
- **CSS Modules** for component styling
- **date-fns** for date formatting

## Backend API

The project includes an Express.js backend implementing the OpenAPI specification.

### Running the Backend
```bash
# Terminal 1 - Start backend
cd backend
npm install
npm start
# Runs on http://localhost:3001

# Terminal 2 - Start frontend
npm start
# Runs on http://localhost:3000
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/search` | POST | Search articles |
| `/api/v1/search/suggestions` | GET | Autocomplete |
| `/api/v1/articles` | GET | List articles |
| `/api/v1/articles/:id` | GET | Get article |
| `/api/v1/articles` | POST | Create article |
| `/api/v1/articles/:id` | PUT | Update article |
| `/api/v1/articles/:id` | DELETE | Delete article |
| `/api/v1/analytics/events` | POST | Track events |
| `/api/v1/categories` | GET | List categories |

### API Documentation

OpenAPI spec: `knowledge-api-openapi.yaml`


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

## Testing API

**Prerequisite:** Backend must be running (Terminal 1: `cd backend` and then `npm start`)

1. Open new Terminal window
2. Go to the /public folder where knowledge-api-openapi.yaml resides
```bash
cd public
```
3. Run prism (install components if asked)
```bash
npx @stoplight/prism-cli proxy knowledge-api-openapi.yaml http://localhost:3001 --port 4010
```

4. Run curl to test API points. 
For example, to search for articles with 'escalate':
```bash
curl -X POST http://127.0.0.1:4010/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "escalate"}'
```


## Author

Michael Yudanin, yudanin@gmail.com

