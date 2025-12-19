/**
 * API Service Interface
 * 
 * This module defines the API interface and provides a mock implementation.
 * To switch to a real API, simply replace MockApiService with a RealApiService
 * that implements the same interface.
 */

import { Article, SearchParams, SearchResponse, Category, SearchSuggestion } from '../types';
import { mockArticles, mockCategories, mockSuggestions } from './mockData';
import { config } from '../config';

/**
 * API Service Interface
 * Any API implementation (mock or real) must implement these methods
 */
export interface IApiService {
  searchArticles(params: SearchParams): Promise<SearchResponse>;
  getArticleById(id: string): Promise<Article | null>;
  getCategories(): Promise<Category[]>;
  getSuggestions(query: string): Promise<SearchSuggestion[]>;
}

/**
 * Mock API Service
 * Simulates network latency and provides mock data for development
 */
class MockApiService implements IApiService {
  // Simulate network delay
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simulate random failures for testing error handling (disabled by default)
  private shouldFail(): boolean {
    return false; // Set to Math.random() < 0.1 to test error handling
  }

  /**
   * Search articles with filtering and sorting
   */
  async searchArticles(params: SearchParams): Promise<SearchResponse> {
    await this.delay(Math.random() * 500 + 200); // 200-700ms delay

    if (this.shouldFail()) {
      throw new Error('Network error: Unable to fetch search results');
    }

    let filtered = [...mockArticles];

    // Filter by search query
    if (params.query.trim()) {
      const queryLower = params.query.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(queryLower) ||
        article.content.toLowerCase().includes(queryLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(queryLower))
      );

      // Update relevance scores based on query match
      filtered = filtered.map(article => {
        const titleMatch = article.title.toLowerCase().includes(queryLower);
        const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(queryLower));
        const boost = (titleMatch ? 0.2 : 0) + (tagMatch ? 0.1 : 0);
        return { ...article, relevanceScore: Math.min(1, article.relevanceScore + boost) };
      });
    }

    // Filter by category
    if (params.category) {
      filtered = filtered.filter(article =>
        article.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    // Filter by date range
    if (params.dateFrom) {
      const fromDate = new Date(params.dateFrom);
      filtered = filtered.filter(article =>
        new Date(article.createdDate) >= fromDate
      );
    }
    if (params.dateTo) {
      const toDate = new Date(params.dateTo);
      filtered = filtered.filter(article =>
        new Date(article.createdDate) <= toDate
      );
    }

    // Sort results
    switch (params.sortBy) {
      case 'relevance':
        filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
      case 'date':
        filtered.sort((a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        break;
      case 'popularity':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }

    // Paginate
    const startIndex = (params.page - 1) * params.pageSize;
    const paginatedArticles = filtered.slice(startIndex, startIndex + params.pageSize);

    return {
      articles: paginatedArticles,
      total: filtered.length,
      page: params.page,
      pageSize: params.pageSize,
      hasMore: startIndex + params.pageSize < filtered.length,
    };
  }

  /**
   * Get a single article by ID
   */
  async getArticleById(id: string): Promise<Article | null> {
    await this.delay(200);

    if (this.shouldFail()) {
      throw new Error('Network error: Unable to fetch article');
    }

    const article = mockArticles.find(a => a.id === id);
    
    // Simulate incrementing view count
    if (article) {
      return { ...article, viewCount: article.viewCount + 1 };
    }
    
    return null;
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<Category[]> {
    await this.delay(150);

    if (this.shouldFail()) {
      throw new Error('Network error: Unable to fetch categories');
    }

    return mockCategories;
  }

  /**
   * Get search suggestions based on partial query
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    await this.delay(100);

    if (this.shouldFail()) {
      throw new Error('Network error: Unable to fetch suggestions');
    }

    if (query.length < config.search.minQueryLength) {
      return [];
    }

    const queryLower = query.toLowerCase();
    
    // Filter suggestions that match the query
    const matchingSuggestions = mockSuggestions
      .filter(s => s.toLowerCase().includes(queryLower))
      .slice(0, config.search.maxSuggestions)
      .map((text, index) => ({
        id: `suggestion-${index}`,
        text,
        type: 'suggested' as const,
      }));

    return matchingSuggestions;
  }
}

/**
 * Real API Service (placeholder for future implementation)
 * Uncomment and implement when connecting to actual backend
 */
// class RealApiService implements IApiService {
//   private baseUrl = config.api.baseUrl;
//
//   async searchArticles(params: SearchParams): Promise<SearchResponse> {
//     const response = await fetch(`${this.baseUrl}/search`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(params),
//     });
//     if (!response.ok) throw new Error('Search failed');
//     return response.json();
//   }
//
//   // ... implement other methods
// }

// Export the active API service instance
// To switch to real API: export const apiService: IApiService = new RealApiService();
export const apiService: IApiService = new MockApiService();
