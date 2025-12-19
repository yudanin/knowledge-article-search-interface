/**
 * Articles Routes
 * CRUD operations for knowledge articles
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { requireScope } = require('../middleware/auth');
let { articles } = require('../data/articles');

/**
 * GET /articles
 * List all articles with pagination and filtering
 */
router.get('/', (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    category,
    status,
    sortBy = 'lastUpdated',
    sortOrder = 'desc'
  } = req.query;

  let filtered = [...articles];

  // Filter by category
  if (category) {
    filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by status
  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'createdDate' || sortBy === 'lastUpdated') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });

  // Paginate
  const total = filtered.length;
  const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
  const paginatedArticles = filtered.slice(startIndex, startIndex + parseInt(pageSize));

  res.json({
    articles: paginatedArticles,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    hasMore: startIndex + parseInt(pageSize) < total
  });
});

/**
 * GET /articles/:articleId
 * Get single article by ID
 */
router.get('/:articleId', (req, res) => {
  const { articleId } = req.params;
  const { includeHistory = false } = req.query;

  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Article not found',
      details: { articleId },
      correlationId: req.correlationId
    });
  }

  // Increment view count (in production, debounce per user)
  article.viewCount += 1;

  const response = { ...article };
  
  if (includeHistory === 'true') {
    response.versionHistory = [
      { version: 1, updatedAt: article.createdDate, updatedBy: article.author }
    ];
  }

  res.json(response);
});

/**
 * POST /articles
 * Create new article
 */
router.post('/', requireScope('articles:write'), (req, res) => {
  const { title, content, category, tags = [], status = 'draft' } = req.body;

  // Validation
  const errors = [];
  if (!title || title.length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters', code: 'MIN_LENGTH' });
  }
  if (!content || content.length < 50) {
    errors.push({ field: 'content', message: 'Content must be at least 50 characters', code: 'MIN_LENGTH' });
  }
  if (!category) {
    errors.push({ field: 'category', message: 'Category is required', code: 'REQUIRED' });
  }

  if (errors.length > 0) {
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fieldErrors: errors,
      correlationId: req.correlationId
    });
  }

  const now = new Date().toISOString();
  const newArticle = {
    id: `art_${uuidv4().slice(0, 8)}`,
    title,
    content,
    category,
    tags,
    status,
    relevanceScore: 0.5,
    createdDate: now,
    lastUpdated: now,
    viewCount: 0,
    author: req.user?.id || 'unknown',
    version: 1
  };

  articles.push(newArticle);

  res.status(201)
    .header('Location', `/api/v1/articles/${newArticle.id}`)
    .json(newArticle);
});

/**
 * PUT /articles/:articleId
 * Update existing article
 */
router.put('/:articleId', requireScope('articles:write'), (req, res) => {
  const { articleId } = req.params;
  const { title, content, category, tags, status } = req.body;

  const articleIndex = articles.findIndex(a => a.id === articleId);

  if (articleIndex === -1) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Article not found',
      details: { articleId },
      correlationId: req.correlationId
    });
  }

  // Validation
  const errors = [];
  if (title !== undefined && title.length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters', code: 'MIN_LENGTH' });
  }
  if (content !== undefined && content.length < 50) {
    errors.push({ field: 'content', message: 'Content must be at least 50 characters', code: 'MIN_LENGTH' });
  }

  if (errors.length > 0) {
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fieldErrors: errors,
      correlationId: req.correlationId
    });
  }

  // Update article
  const article = articles[articleIndex];
  if (title !== undefined) article.title = title;
  if (content !== undefined) article.content = content;
  if (category !== undefined) article.category = category;
  if (tags !== undefined) article.tags = tags;
  if (status !== undefined) article.status = status;
  article.lastUpdated = new Date().toISOString();
  article.version += 1;

  res.json(article);
});

/**
 * DELETE /articles/:articleId
 * Soft-delete article (archive)
 */
router.delete('/:articleId', requireScope('articles:delete'), (req, res) => {
  const { articleId } = req.params;

  const articleIndex = articles.findIndex(a => a.id === articleId);

  if (articleIndex === -1) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Article not found',
      details: { articleId },
      correlationId: req.correlationId
    });
  }

  // Soft delete - set status to archived
  articles[articleIndex].status = 'archived';
  articles[articleIndex].lastUpdated = new Date().toISOString();

  res.status(204).send();
});

/**
 * POST /articles/:articleId/publish
 * Publish a draft article
 */
router.post('/:articleId/publish', requireScope('articles:publish'), (req, res) => {
  const { articleId } = req.params;

  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Article not found',
      details: { articleId },
      correlationId: req.correlationId
    });
  }

  if (article.status === 'published') {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Article is already published',
      correlationId: req.correlationId
    });
  }

  article.status = 'published';
  article.lastUpdated = new Date().toISOString();

  res.json(article);
});

module.exports = router;
