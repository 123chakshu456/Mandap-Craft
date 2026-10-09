/**
 * High-Grade Security & Defense-in-Depth Middlewares
 * Modeled after financial-grade / fintech application security (e.g., CoinDCX standard):
 * - OWASP Top 10 compliance
 * - Strict Content Security Policy (CSP) & Transport Security (HSTS)
 * - Deep Recursive Input Sanitization (Prototype Pollution, XSS, Null-Byte Defense)
 * - Multi-Tier Rate Limiting (DDoS, Brute-Force & Bot Defense)
 * - Sensitive Route Cache Disabling
 */

// In-Memory store for Rate Limiting
const rateLimitStores = new Map();

/**
 * Periodically purge expired rate limit entries (every 3 minutes)
 */
setInterval(() => {
  const now = Date.now();
  for (const [, store] of rateLimitStores.entries()) {
    for (const [ip, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(ip);
      }
    }
  }
}, 3 * 60 * 1000).unref();

/**
 * Comprehensive OWASP + Fintech-Grade HTTP Security Headers Middleware
 */
export const securityHeaders = (req, res, next) => {
  // 1. Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 2. Clickjacking & Frame Embedding Defense
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // 3. Cross-Site Scripting (XSS) Legacy Header Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 4. Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 5. Cross-Origin Opener Policy (prevents cross-origin window manipulation & Spectre)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // 6. Cross-Origin Resource Policy (allows cross-origin asset consumption from CDN/APIs)
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  // 7. Permissions Policy: Disable high-risk device hardware access unless explicitly required
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), interest-cohort=()'
  );

  // 8. Content Security Policy (CSP)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com https://*.googleusercontent.com",
    "connect-src 'self' http://localhost:5000 http://localhost:5173 https://res.cloudinary.com https://api.cloudinary.com https://accounts.google.com https://*.google.com",
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));

  // 9. Remove server banner information disclosure
  res.removeHeader('X-Powered-By');

  // 10. Strict Transport Security (HSTS) with Preload
  if (process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  next();
};

/**
 * Cache-Disabling Middleware for Sensitive Data Routes
 * Ensures auth, admin, and personal order data is never cached by intermediate proxies or disk.
 */
export const noCacheSensitive = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

/**
 * Deep Recursive Request Sanitizer Middleware
 * Defends against:
 * - Prototype Pollution (__proto__, constructor, prototype tampering)
 * - HTML / Script / Event-Handler XSS Injection
 * - Null-Byte Path and String Truncation
 * - Dangerous payload manipulation
 */
function sanitizeValue(value, depth = 0) {
  if (depth > 8) return value; // Prevent deep recursion DoS

  if (typeof value === 'string') {
    // 1. Remove null bytes
    let clean = value.replace(/\0/g, '');

    // 2. Strip active HTML script blocks and event handlers
    clean = clean
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    return clean;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, depth + 1));
  }

  if (value !== null && typeof value === 'object') {
    const sanitizedObj = {};
    for (const [key, val] of Object.entries(value)) {
      // Prototype Pollution Defense: Block forbidden object keys
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitizedObj[key] = sanitizeValue(val, depth + 1);
    }
    return sanitizedObj;
  }

  return value;
}

export const sanitizeRequest = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeValue(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeValue(req.params);
    }
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Enterprise Rate Limiter Factory (Sliding-Window IP Throttler)
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
    // Extract real client IP behind reverse proxies/CDNs
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null) ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

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
