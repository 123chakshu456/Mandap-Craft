import { orderRepository } from './order.repository.js';

export const orderService = {
  async createOrder(payload, user = null) {
    const { customerName, customerEmail, items, totalAmount, discountAmount, grandTotal, paymentMethod } = payload;

    if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      const err = new Error('Invalid order payload: customer details and at least one item are required.');
      err.statusCode = 400;
      throw err;
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `MC-${randomSuffix}`;

    return orderRepository.create(
      {
        orderNumber,
        customerName,
        customerEmail,
        totalAmount: parseFloat(totalAmount),
        discountAmount: discountAmount ? parseFloat(discountAmount) : 0,
        grandTotal: parseFloat(grandTotal),
        paymentMethod: paymentMethod || 'card',
        status: 'CONFIRMED',
        userId: user?.id || null,
      },
      items
    );
  },

  async getUserOrders(userId) {
    return orderRepository.findByUserId(userId);
  },

  async getAllOrders({ page = 1, limit = 20, status }) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    const where = status && status !== 'all' ? { status } : {};

    const { orders, total } = await orderRepository.findAll({ where, skip, take: limitNum });
    return {
      orders,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },

  async updateOrderStatus(id, status) {
    const validStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    return orderRepository.updateStatus(id, status);
  },
};
