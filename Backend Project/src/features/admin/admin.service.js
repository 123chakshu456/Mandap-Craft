import prisma from '../../shared/config/prisma.js';

export const adminService = {
  async getDashboardStats({ startDate, endDate } = {}) {
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          dateFilter.createdAt.gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          dateFilter.createdAt.lte = end;
        }
      }
      if (Object.keys(dateFilter.createdAt).length === 0) {
        delete dateFilter.createdAt;
      }
    }

    const orderWhere = Object.keys(dateFilter).length ? { ...dateFilter } : {};
    const quoteWhere = Object.keys(dateFilter).length ? { ...dateFilter } : {};
    const pendingQuoteWhere = Object.keys(dateFilter).length ? { status: 'PENDING', ...dateFilter } : { status: 'PENDING' };

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
      prisma.order.count({ where: orderWhere }),
      prisma.quote.count({ where: quoteWhere }),
      prisma.quote.count({ where: pendingQuoteWhere }),
      prisma.user.count(),
      prisma.category.count(),
      prisma.order.findMany({
        where: orderWhere,
        take: 10,
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
        where: quoteWhere,
        take: 10,
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
      where: orderWhere,
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
        isFiltered: Object.keys(dateFilter).length > 0,
      },
      recentOrders,
      recentQuotes,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
    };
  },
};
