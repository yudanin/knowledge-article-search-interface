/**
 * Knowledge API - Express Server
 * Implements the OpenAPI specification for Knowledge Article Search
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Routes
const searchRoutes = require('./routes/search');
const articlesRoutes = require('./routes/articles');
const analyticsRoutes = require('./routes/analytics');
const categoriesRoutes = require('./routes/categories');

// Middleware
const { rateLimiter } = require('./middleware/rateLimit');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Add correlation ID to all requests
app.use((req, res, next) => {
  req.correlationId = uuidv4();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
});

// Apply rate limiting globally
app.use('/api/v1', rateLimiter);

// Apply auth middleware (mock implementation)
app.use('/api/v1', authMiddleware);

// Routes
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/articles', articlesRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/categories', categoriesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: `Endpoint ${req.method} ${req.path} not found`,
    correlationId: req.correlationId
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${req.correlationId}] Error:`, err);
  res.status(err.status || 500).json({
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred',
    correlationId: req.correlationId
  });
});

app.listen(PORT, () => {
  console.log(`Knowledge API server running on http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api/v1`);
});
