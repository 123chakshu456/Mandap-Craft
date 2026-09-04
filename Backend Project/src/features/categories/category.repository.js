import prisma from '../../shared/config/prisma.js';

export const categoryRepository = {
  async findAll(where = {}, orderBy = [{ level: 'asc' }, { sortOrder: 'asc' }]) {
    return prisma.category.findMany({
      where,
      orderBy,
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  },

  async findById(id) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  },

  async findBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        parent: true,
      },
    });
  },

  async create(data) {
    return prisma.category.create({ data });
  },

  async update(id, data) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return prisma.category.delete({
      where: { id },
    });
  },

  async countProducts(categoryId) {
    return prisma.product.count({
      where: {
        OR: [
          { categoryId },
          { subcategoryId: categoryId },
          { subSubcategoryId: categoryId },
        ],
      },
    });
  },

  async countChildren(parentId) {
    return prisma.category.count({
      where: { parentId },
    });
  },
};
