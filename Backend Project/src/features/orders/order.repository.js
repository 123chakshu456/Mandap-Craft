import prisma from '../../shared/config/prisma.js';

export const orderRepository = {
  async create(data, items = []) {
    return prisma.order.create({
      data: {
        ...data,
        items: {
          create: items.map((item) => ({
            itemId: item.id || item.itemId || 'custom',
            name: item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity) || 1,
            itemType: item.type || item.itemType || 'events',
            image: item.image || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  },

  async findByUserId(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findAll({ where = {}, skip = 0, take = 20 }) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  },

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  },
};
