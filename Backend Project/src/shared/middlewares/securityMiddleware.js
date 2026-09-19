/**
 * Security & Rate-Limiting Middlewares
 * Zero-dependency, lightweight, production-grade hardening.
 */

// In-Memory store for Rate Limiting
const rateLimitStores = new Map();

/**
 * Clean up expired rate limit entries periodically (every 5 minutes)
 */
setInterval(() => {
  const now = Date.now();
  for (const [storeKey, store] of rateLimitStores.entries()) {
    for (const [ip, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(ip);
      }
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Standard OWASP HTTP Security Headers Middleware
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Clickjacking protection
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Legacy XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent information disclosure
  res.removeHeader('X-Powered-By');

  // Strict Transport Security (HSTS) in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  next();
};

/**
 * In-Memory Rate Limiter Factory
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 mins)
 * @param {number} options.max - Max requests per IP in window (default: 100)
 * @param {string} options.message - Custom error message
 * @param {string} options.key - Unique identifier for the rate limit bucket
 */
export const rateLimit = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP. Please try again later.',
  key = 'global',
} = {}) => {
  if (!rateLimitStores.has(key)) {
    rateLimitStores.set(key, new Map());
  }
  const store = rateLimitStores.get(key);

  return (req, res, next) => {
    // Determine client IP
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    let record = store.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      store.set(clientIp, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetSeconds);

    if (record.count > max) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: resetSeconds,
      });
    }

    next();
  };
};
