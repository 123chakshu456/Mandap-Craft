import prisma from '../../shared/config/prisma.js';

export const quoteRepository = {
  async create(data) {
    return prisma.quote.create({
      data,
    });
  },

  async findAll({ where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' } }) {
    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.quote.count({ where }),
    ]);

    return { quotes, total };
  },

  async findById(id) {
    return prisma.quote.findUnique({
      where: { id },
    });
  },

  async updateStatus(id, status) {
    return prisma.quote.update({
      where: { id },
      data: { status },
    });
  },

  async delete(id) {
    return prisma.quote.delete({
      where: { id },
    });
  },
};
