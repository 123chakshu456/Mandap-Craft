import prisma from '../../shared/config/prisma.js';

export const badgeRepository = {
  async findAll(where = {}) {
    return prisma.badge.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  },

  async findById(id) {
    return prisma.badge.findUnique({
      where: { id },
    });
  },

  async findBySlug(slug) {
    return prisma.badge.findUnique({
      where: { slug },
    });
  },

  async create(data) {
    return prisma.badge.create({ data });
  },

  async update(id, data) {
    return prisma.badge.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return prisma.badge.delete({
      where: { id },
    });
  },

  async countProductAssignments(badgeId) {
    return prisma.productBadge.count({
      where: { badgeId },
    });
  },
};
