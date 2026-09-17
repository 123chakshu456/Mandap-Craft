/**
 * High-performance In-Memory Read-Cache with Cache-Control Headers
 * Designed to handle thousands of concurrent requests without overwhelming the database.
 */

const cacheStore = new Map();

/**
 * Express middleware for caching idempotent GET responses in RAM
 * @param {number} ttlSeconds - Time-to-live in seconds (default: 60)
 */
export const memoryCache = (ttlSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests without authorization headers
    if (req.method !== 'GET' || req.headers.authorization) {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cached = cacheStore.get(key);
    const now = Date.now();

    if (cached && cached.expiry > now) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=60`);
      return res.status(cached.status).json(cached.data);
    }

    // Capture res.json to store response in cache
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Cache only successful 200 responses
      if (res.statusCode === 200) {
        cacheStore.set(key, {
          data,
          status: res.statusCode,
          expiry: now + ttlSeconds * 1000,
        });
      }

      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=60`);
      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalidate cache keys matching a prefix or pattern (e.g. '/api/carousel', '/api/products')
 * @param {string} prefix
 */
export const invalidateCache = (prefix) => {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix) || key.includes(prefix)) {
      cacheStore.delete(key);
    }
  }
};
