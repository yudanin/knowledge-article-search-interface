/**
 * Search Routes
 * POST /api/v1/search - Search articles
 * GET /api/v1/search/suggestions - Get autocomplete suggestions
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { articles } = require('../data/articles');

/**
 * POST /search
 * Full-text and semantic search across articles
 */
router.post('/', (req, res) => {
  const startTime = Date.now();
  const {
    query = '',
    searchType = 'hybrid',
    category,
    tags,
    dateFrom,
    dateTo,
    sortBy = 'relevance',
    page = 1,
    pageSize = 10,
    includeAiSummary = false
  } = req.body;

  // Validate pageSize
  if (pageSize < 1 || pageSize > 100) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Invalid request parameters',
      details: { invalidParams: ['pageSize must be between 1 and 100'] },
      correlationId: req.correlationId
    });
  }

  let filtered = [...articles].filter(a => a.status === 'published');

  // Filter by search query
  if (query.trim()) {
    const queryLower = query.toLowerCase();
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(queryLower) ||
      article.content.toLowerCase().includes(queryLower) ||
      article.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );

    // Boost relevance scores based on match location
    filtered = filtered.map(article => {
      const titleMatch = article.title.toLowerCase().includes(queryLower);
      const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(queryLower));
      const boost = (titleMatch ? 0.2 : 0) + (tagMatch ? 0.1 : 0);
      return { ...article, relevanceScore: Math.min(1, article.relevanceScore + boost) };
    });
  }

  // Filter by category
  if (category) {
    filtered = filtered.filter(article =>
      article.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    filtered = filtered.filter(article =>
      tags.some(tag => article.tags.includes(tag.toLowerCase()))
    );
  }

  // Filter by date range
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    filtered = filtered.filter(article => new Date(article.createdDate) >= fromDate);
  }
  if (dateTo) {
    const toDate = new Date(dateTo);
    filtered = filtered.filter(article => new Date(article.createdDate) <= toDate);
  }

  // Sort
  switch (sortBy) {
    case 'relevance':
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
      break;
    case 'date':
      filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      break;
    case 'popularity':
      filtered.sort((a, b) => b.viewCount - a.viewCount);
      break;
  }

  // Paginate
  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedArticles = filtered.slice(startIndex, startIndex + pageSize);

  // Map to summary format with snippet
  const articleSummaries = paginatedArticles.map(article => ({
    id: article.id,
    title: article.title,
    snippet: article.content.substring(0, 200) + '...',
    category: article.category,
    tags: article.tags,
    relevanceScore: article.relevanceScore,
    lastUpdated: article.lastUpdated,
    viewCount: article.viewCount
  }));

  const response = {
    articles: articleSummaries,
    total,
    page,
    pageSize,
    hasMore: startIndex + pageSize < total,
    searchId: `srch_${uuidv4().slice(0, 8)}`,
    processingTimeMs: Date.now() - startTime
  };

  // Mock AI summary
  if (includeAiSummary && query && articleSummaries.length > 0) {
    response.aiSummary = `Based on your search for "${query}", the most relevant article is "${articleSummaries[0].title}". This article covers the key aspects of your query.`;
  }

  res.json(response);
});

/**
 * GET /search/suggestions
 * Autocomplete suggestions based on partial query
 */
router.get('/suggestions', (req, res) => {
  const { q, limit = 5 } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Query parameter "q" must be at least 2 characters',
      correlationId: req.correlationId
    });
  }

  const queryLower = q.toLowerCase();
  
  // Extract unique terms from article titles and tags
  const allTerms = new Set();
  articles.forEach(article => {
    // Add title words
    article.title.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 3) allTerms.add(word);
    });
    // Add tags
    article.tags.forEach(tag => allTerms.add(tag));
  });

  // Find matching suggestions
  const suggestions = Array.from(allTerms)
    .filter(term => term.includes(queryLower))
    .slice(0, parseInt(limit))
    .map((text, index) => ({
      text,
      type: index < 2 ? 'popular' : 'suggested',
      count: Math.floor(Math.random() * 1000) + 100
    }));

  res.json({ suggestions });
});

module.exports = router;
