import prisma from '../../shared/config/prisma.js';

export const adminService = {
  async getDashboardStats() {
    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      totalOrders,
      totalQuotes,
      pendingQuotes,
      totalUsers,
      totalCategories,
      recentOrders,
      recentQuotes,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: 'PUBLISHED' } }),
      prisma.product.count({ where: { status: 'DRAFT' } }),
      prisma.order.count(),
      prisma.quote.count(),
      prisma.quote.count({ where: { status: 'PENDING' } }),
      prisma.user.count(),
      prisma.category.count(),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerEmail: true,
          grandTotal: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.quote.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          scale: true,
          venue: true,
          estimated: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const revenueData = await prisma.order.aggregate({
      _sum: { grandTotal: true },
    });

    return {
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        totalOrders,
        totalQuotes,
        pendingQuotes,
        totalUsers,
        totalCategories,
        totalRevenue: revenueData._sum.grandTotal || 0,
      },
      recentOrders,
      recentQuotes,
    };
  },
};
