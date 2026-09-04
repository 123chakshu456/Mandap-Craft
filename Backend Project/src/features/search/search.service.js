import prisma from '../../shared/config/prisma.js';

export const searchService = {
  async federatedSearch(query, user = null) {
    if (!query || query.trim() === '') {
      return { posts: [], orders: [], quotes: [], products: [] };
    }

    const q = query.trim();

    // 1. Search products
    const productPromise = prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tag: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
      include: {
        images: { where: { isPrimary: true } },
      },
    });

    // 2. Search Posts
    const postPromise = prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
    });

    // 3. Search Orders (if user is authenticated)
    let orderPromise = Promise.resolve([]);
    if (user) {
      const orderWhere = user.role === 'ADMIN'
        ? {
            OR: [
              { orderNumber: { contains: q, mode: 'insensitive' } },
              { customerName: { contains: q, mode: 'insensitive' } },
              { customerEmail: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {
            userId: user.id,
            OR: [
              { orderNumber: { contains: q, mode: 'insensitive' } },
              { customerName: { contains: q, mode: 'insensitive' } },
            ],
          };

      orderPromise = prisma.order.findMany({
        where: orderWhere,
        take: 5,
        include: { items: true },
      });
    }

    // 4. Search Quotes (if user is authenticated)
    let quotePromise = Promise.resolve([]);
    if (user) {
      const quoteWhere = user.role === 'ADMIN'
        ? {
            OR: [
              { email: { contains: q, mode: 'insensitive' } },
              { venue: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {
            userId: user.id,
            OR: [
              { venue: { contains: q, mode: 'insensitive' } },
            ],
          };

      quotePromise = prisma.quote.findMany({
        where: quoteWhere,
        take: 5,
      });
    }

    const [products, posts, orders, quotes] = await Promise.all([
      productPromise,
      postPromise,
      orderPromise,
      quotePromise,
    ]);

    return { products, posts, orders, quotes };
  },
};
