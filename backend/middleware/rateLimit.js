/**
 * Rate Limiting Middleware
 * Implements token bucket algorithm per user
 */

const rateLimit = require('express-rate-limit');

// Standard rate limiter: 100 requests per minute
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,
  standardHeaders: true,  // Return X-RateLimit-* headers
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID from auth token, fallback to IP
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      code: 'RATE_LIMITED',
      message: 'Rate limit exceeded. Please retry after 60 seconds.',
      details: {
        limit: 100,
        window: '1 minute',
        retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
      },
      correlationId: req.correlationId
    });
  }
});

// Higher limit for analytics events (batched): 1000 per minute
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip
});

module.exports = { rateLimiter, analyticsLimiter };
