import prisma from '../../shared/config/prisma.js';

export const quoteRepository = {
  async create(data) {
    return prisma.quote.create({
      data,
    });
  },

  async findAll({ where = {}, skip = 0, take = 20 }) {
    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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

  async updateStatus(id, status) {
    return prisma.quote.update({
      where: { id },
      data: { status },
    });
  },
};
