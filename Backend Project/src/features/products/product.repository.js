import prisma from '../../shared/config/prisma.js';

export const productRepository = {
  /**
   * Find many products with dynamic filtering, sorting, pagination, and relations
   */
  async findMany({ where = {}, orderBy = [{ sortPriority: 'desc' }, { isFeatured: 'desc' }, { createdAt: 'desc' }], skip = 0, take = 24, includeRelations = true }) {
    const include = includeRelations
      ? {
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
          badges: {
            include: { badge: true },
            orderBy: { badge: { sortOrder: 'asc' } },
          },
          filterValues: {
            include: { filterValue: { include: { filter: true } } },
          },
        }
      : undefined;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },

  async findById(id, includeRelations = true) {
    return prisma.product.findUnique({
      where: { id },
      include: includeRelations
        ? {
            images: {
              orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            },
            badges: {
              include: { badge: true },
            },
            filterValues: {
              include: { filterValue: { include: { filter: true } } },
            },
          }
        : undefined,
    });
  },

  async findBySku(sku) {
    return prisma.product.findUnique({
      where: { sku },
    });
  },

  async findBySlug(slug, includeRelations = true) {
    return prisma.product.findUnique({
      where: { slug },
      include: includeRelations
        ? {
            images: {
              orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            },
            badges: {
              include: { badge: true },
            },
            filterValues: {
              include: { filterValue: { include: { filter: true } } },
            },
          }
        : undefined,
    });
  },

  async create(data) {
    return prisma.product.create({
      data,
      include: {
        images: true,
        badges: { include: { badge: true } },
        filterValues: { include: { filterValue: true } },
      },
    });
  },

  async update(id, data) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        badges: { include: { badge: true } },
        filterValues: { include: { filterValue: true } },
      },
    });
  },

  async delete(id) {
    return prisma.product.delete({
      where: { id },
    });
  },

  async setProductFilterValues(productId, filterValueIds = []) {
    // Transactionally reset and link filter values
    return prisma.$transaction(async (tx) => {
      await tx.productFilterValue.deleteMany({ where: { productId } });
      if (filterValueIds.length > 0) {
        await tx.productFilterValue.createMany({
          data: filterValueIds.map((filterValueId) => ({
            productId,
            filterValueId,
          })),
        });
      }
    });
  },

  async setProductBadges(productId, badgeIds = []) {
    // Transactionally reset and link badges
    return prisma.$transaction(async (tx) => {
      await tx.productBadge.deleteMany({ where: { productId } });
      if (badgeIds.length > 0) {
        await tx.productBadge.createMany({
          data: badgeIds.map((badgeId) => ({
            productId,
            badgeId,
          })),
        });
      }
    });
  },
};
