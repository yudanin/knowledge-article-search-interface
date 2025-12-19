/**
 * Analytics Routes
 * Track events and retrieve analytics data
 */

const express = require('express');
const router = express.Router();
const { analyticsLimiter } = require('../middleware/rateLimit');
const { requireScope } = require('../middleware/auth');

// In-memory analytics store (in production: Kafka + ClickHouse)
const analyticsEvents = [];
const searchMetrics = {
  totalSearches: 0,
  totalClicks: 0,
  queries: {}
};

/**
 * POST /analytics/events
 * Track analytics events (batched)
 * High-volume writes - returns 202 Accepted
 */
router.post('/events', analyticsLimiter, (req, res) => {
  const { events } = req.body;

  if (!events || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Events array is required and must not be empty',
      correlationId: req.correlationId
    });
  }

  if (events.length > 10) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Maximum 10 events per batch',
      correlationId: req.correlationId
    });
  }

  // Validate and store events
  const validEventTypes = [
    'search', 'search_result_click', 'article_view',
    'article_helpful', 'article_copy', 'session_start', 'session_end'
  ];

  let acceptedCount = 0;

  events.forEach(event => {
    if (!event.eventType || !validEventTypes.includes(event.eventType)) {
      return; // Skip invalid events
    }

    // Add metadata
    const enrichedEvent = {
      ...event,
      userId: req.user?.id,
      tenantId: req.user?.tenantId,
      receivedAt: new Date().toISOString()
    };

    // Store event (in production: send to Kafka)
    analyticsEvents.push(enrichedEvent);
    acceptedCount++;

    // Update real-time metrics
    if (event.eventType === 'search') {
      searchMetrics.totalSearches++;
      const query = event.data?.query?.toLowerCase();
      if (query) {
        searchMetrics.queries[query] = (searchMetrics.queries[query] || 0) + 1;
      }
    } else if (event.eventType === 'search_result_click') {
      searchMetrics.totalClicks++;
    }
  });

  res.status(202)
    .header('X-Events-Accepted', acceptedCount)
    .json({ accepted: acceptedCount });
});

/**
 * GET /analytics/search
 * Get search analytics
 */
router.get('/search', requireScope('analytics:read'), (req, res) => {
  const { startDate, endDate, granularity = 'day', metrics } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'startDate and endDate are required',
      correlationId: req.correlationId
    });
  }

  // Calculate metrics from stored events
  const searchEvents = analyticsEvents.filter(e => e.eventType === 'search');
  const clickEvents = analyticsEvents.filter(e => e.eventType === 'search_result_click');
  
  const uniqueUsers = new Set(searchEvents.map(e => e.userId)).size;
  const ctr = searchEvents.length > 0 ? clickEvents.length / searchEvents.length : 0;

  // Get top queries
  const topQueries = Object.entries(searchMetrics.queries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count, ctr: Math.random() * 0.5 + 0.5 }));

  // Mock time series data
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeSeries = [];
  const current = new Date(start);
  
  while (current <= end) {
    timeSeries.push({
      date: current.toISOString().split('T')[0],
      searches: Math.floor(Math.random() * 500) + 100,
      uniqueUsers: Math.floor(Math.random() * 100) + 20
    });
    current.setDate(current.getDate() + 1);
  }

  res.json({
    period: {
      start: startDate,
      end: endDate,
      granularity
    },
    summary: {
      totalSearches: searchMetrics.totalSearches || timeSeries.reduce((sum, d) => sum + d.searches, 0),
      uniqueUsers: uniqueUsers || timeSeries.reduce((sum, d) => sum + d.uniqueUsers, 0),
      avgResultsPerSearch: 8.5,
      zeroResultRate: 0.03,
      clickThroughRate: ctr || 0.72,
      avgLatencyMs: 85
    },
    timeSeries,
    topQueries: topQueries.length > 0 ? topQueries : [
      { query: 'refund', count: 1523, ctr: 0.85 },
      { query: 'password reset', count: 1201, ctr: 0.78 },
      { query: 'subscription', count: 987, ctr: 0.71 }
    ]
  });
});

/**
 * GET /analytics/agents
 * Get agent interaction metrics
 */
router.get('/agents', requireScope('analytics:read'), (req, res) => {
  const { startDate, endDate, agentId } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'startDate and endDate are required',
      correlationId: req.correlationId
    });
  }

  // Mock agent analytics
  res.json({
    period: {
      start: startDate,
      end: endDate
    },
    summary: {
      totalSessions: 1250,
      avgSessionDuration: 1800,  // 30 minutes in seconds
      avgSearchesPerSession: 4.2,
      avgArticlesPerSession: 2.8,
      helpfulnessRate: 0.89
    },
    topAgents: [
      { agentId: 'agent_001', searches: 523, articlesViewed: 312 },
      { agentId: 'agent_002', searches: 487, articlesViewed: 298 },
      { agentId: 'agent_003', searches: 445, articlesViewed: 267 }
    ]
  });
});

module.exports = router;
