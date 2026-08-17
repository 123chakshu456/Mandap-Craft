import prisma from '../config/prisma.js';

/**
 * @route   GET /api/search
 * @desc    Global search across Orders, Quotes, and Posts
 * @access  Public / Authenticated (Scoped by role)
 */
export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({
        success: true,
        data: { orders: [], quotes: [], posts: [] }
      });
    }

    const query = q.trim();
    const user = req.user; // Set by optionalAuth or authenticate middleware
    const searchPromises = {};

    // 1. PUBLIC CONTENT: Posts
    searchPromises.posts = prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query } },
          { content: { contains: query } }
        ]
      },
      take: 5
    });

    // 2. PRIVATE SECURE CONTENT: Orders & Quotes
    if (user) {
      const isAdmin = user.role === 'ADMIN';

      // Orders Query
      searchPromises.orders = prisma.order.findMany({
        where: {
          AND: [
            // If not admin, restrict to user's orders (by ID or Email match)
            isAdmin ? {} : {
              OR: [
                { userId: user.id },
                { customerEmail: user.email }
              ]
            },
            {
              OR: [
                { orderNumber: { contains: query } },
                { customerName: { contains: query } },
                { customerEmail: { contains: query } }
              ]
            }
          ]
        },
        include: {
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      });

      // Quotes Query
      searchPromises.quotes = prisma.quote.findMany({
        where: {
          AND: [
            // If not admin, restrict to user's quotes (by ID or Email match)
            isAdmin ? {} : {
              OR: [
                { userId: user.id },
                { email: user.email }
              ]
            },
            {
              OR: [
                { email: { contains: query } },
                { venue: { contains: query } },
                { scale: { contains: query } }
              ]
            }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      });
    } else {
      // Guests don't get order/quote details for privacy
      searchPromises.orders = Promise.resolve([]);
      searchPromises.quotes = Promise.resolve([]);
    }

    // Resolve all promises concurrently
    const keys = Object.keys(searchPromises);
    const resolvedValues = await Promise.all(Object.values(searchPromises));

    const data = {};
    keys.forEach((key, idx) => {
      data[key] = resolvedValues[idx];
    });

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
