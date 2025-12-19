/**
 * Authentication Middleware
 * Mock implementation for development - validates Bearer token format
 * In production, replace with actual JWT validation:
 * - Verify signature with public key
 * - Check expiration
 * - Validate required claims (sub, scope, tenant_id)
 */

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // For development: allow requests without auth
  // Set AUTH_REQUIRED=true to enforce authentication
  if (process.env.AUTH_REQUIRED !== 'true') {
    req.user = {
      id: 'user_dev',
      scope: ['articles:read', 'articles:write', 'articles:delete', 'articles:publish', 'analytics:read'],
      tenantId: 'tenant_default'
    };
    return next();
  }

  // Check for Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required. Provide a Bearer token.',
      correlationId: req.correlationId
    });
  }

  const token = authHeader.slice(7);

  // Mock token validation
  // In production: verify JWT signature, expiration, claims
  if (token.length < 10) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Invalid token format',
      correlationId: req.correlationId
    });
  }

  // Mock user from token
  req.user = {
    id: 'user_123',
    scope: ['articles:read', 'articles:write', 'analytics:read'],
    tenantId: 'tenant_abc'
  };

  next();
};

/**
 * Scope validation middleware factory
 * Usage: requireScope('articles:write')
 */
const requireScope = (requiredScope) => {
  return (req, res, next) => {
    if (!req.user?.scope?.includes(requiredScope)) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions to access this resource',
        details: { requiredScope },
        correlationId: req.correlationId
      });
    }
    next();
  };
};

module.exports = { authMiddleware, requireScope };
