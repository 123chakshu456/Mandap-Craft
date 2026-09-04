import prisma from '../../shared/config/prisma.js';

export const filterRepository = {
  async findAll(where = {}) {
    return prisma.filter.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        values: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  },

  async findById(id) {
    return prisma.filter.findUnique({
      where: { id },
      include: {
        values: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  },

  async findByKey(key) {
    return prisma.filter.findUnique({
      where: { key },
      include: {
        values: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  },

  async create(data) {
    return prisma.filter.create({
      data,
      include: { values: true },
    });
  },

  async update(id, data) {
    return prisma.filter.update({
      where: { id },
      data,
      include: { values: true },
    });
  },

  async delete(id) {
    return prisma.filter.delete({
      where: { id },
    });
  },

  // Filter Value operations
  async createValue(data) {
    return prisma.filterValue.create({
      data,
    });
  },

  async updateValue(id, data) {
    return prisma.filterValue.update({
      where: { id },
      data,
    });
  },

  async deleteValue(id) {
    return prisma.filterValue.delete({
      where: { id },
    });
  },
};
