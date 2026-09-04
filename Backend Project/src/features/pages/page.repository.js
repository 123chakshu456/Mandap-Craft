import prisma from '../../shared/config/prisma.js';

export const pageRepository = {
  async findAll(where = {}) {
    return prisma.page.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async findById(id) {
    return prisma.page.findUnique({
      where: { id },
    });
  },

  async findBySlug(slug) {
    return prisma.page.findUnique({
      where: { slug },
    });
  },

  async create(data) {
    return prisma.page.create({ data });
  },

  async update(id, data) {
    return prisma.page.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return prisma.page.delete({
      where: { id },
    });
  },
};
