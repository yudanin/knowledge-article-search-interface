/**
 * Main App Component
 * Knowledge Article Search Interface
 */

import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  SearchBar,
  ArticleCard,
  ArticleModal,
  Filters,
  LoadingResults,
  ErrorMessage,
  EmptyState,
} from './components';
import { useSearchParams, useSearch } from './hooks';
import { Article } from './types';
import './styles/globals.css';
import styles from './App.module.css';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Main App Content (wrapped in QueryClientProvider)
const AppContent: React.FC = () => {
  // Search state management
  const {
    params,
    updateQuery,
    updateCategory,
    updateDateRange,
    updateSortBy,
    updatePage,
    resetFilters,
  } = useSearchParams();

  // Search results
  const { data, isLoading, isError, error, refetch, isSearching } = useSearch(params);

  // Selected article for modal
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle search submission
  const handleSearch = useCallback((query: string) => {
    updateQuery(query);
  }, [updateQuery]);

  // Handle article click
  const handleArticleClick = useCallback((article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing article for exit animation
    setTimeout(() => setSelectedArticle(null), 200);
  }, []);

  // Calculate pagination
  const totalPages = data ? Math.ceil(data.total / params.pageSize) : 0;

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <img src="/logo.png" alt="" className={styles.logoImage} />
            <span className={styles.logoText}>Knowledge</span>
            <span className={styles.logoAccent}>Gain</span>
            <span className={styles.logoSub}>Search Interface</span>
          </div>

          {/* Search Bar */}
          <div className={styles.searchWrapper}>
            <SearchBar
              value={params.query}
              onChange={updateQuery}
              onSearch={handleSearch}
              autoFocus
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Filters */}
          <Filters
            selectedCategory={params.category}
            dateFrom={params.dateFrom}
            dateTo={params.dateTo}
            sortBy={params.sortBy}
            onCategoryChange={updateCategory}
            onDateRangeChange={updateDateRange}
            onSortChange={updateSortBy}
            onReset={resetFilters}
            totalResults={data?.total || 0}
          />

          {/* Results */}
          <div className={styles.results}>
            <div className={styles.watermark} aria-hidden="true">
                <img src="/logo.png" alt="" />
            </div>
            {/* Loading state */}
            {(isLoading || isSearching) && <LoadingResults count={3} />}

            {/* Error state */}
            {isError && !isLoading && (
              <ErrorMessage
                title="Failed to load results"
                message={error instanceof Error ? error.message : 'An error occurred'}
                onRetry={() => refetch()}
              />
            )}

            {/* Empty state */}
            {!isLoading && !isError && data?.articles.length === 0 && (
              <EmptyState
                title="No articles found"
                message={
                  params.query
                    ? `No results for "${params.query}". Try different keywords or filters.`
                    : 'No articles match your current filters.'
                }
              />
            )}

            {/* Article list */}
            {!isLoading && !isSearching && !isError && data && data.articles.length > 0 && (
              <>
                <div className={styles.articleList}>
                  {data.articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onClick={handleArticleClick}
                      searchQuery={params.query}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageButton}
                      onClick={() => updatePage(params.page - 1)}
                      disabled={params.page === 1}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Previous
                    </button>

                    <span className={styles.pageInfo}>
                      Page {params.page} of {totalPages}
                    </span>

                    <button
                      className={styles.pageButton}
                      onClick={() => updatePage(params.page + 1)}
                      disabled={!data.hasMore}
                    >
                      Next
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

// App with Providers
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
