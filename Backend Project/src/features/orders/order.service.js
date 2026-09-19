import { orderRepository } from './order.repository.js';
import { notificationService } from '../../shared/services/notification.service.js';

export const orderService = {
  async createOrder(payload, user = null) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      transactionRef,
      items,
      totalAmount,
      discountAmount,
      grandTotal,
      paymentMethod,
    } = payload;

    const rawEmail = customerEmail ? String(customerEmail).trim() : '';
    const rawPhone = customerPhone ? String(customerPhone).trim() : '';

    if (!customerName || (!rawEmail && !rawPhone) || !items || !Array.isArray(items) || items.length === 0) {
      const err = new Error('Invalid order payload: customer name, contact info (email and/or phone number), and at least one item are required.');
      err.statusCode = 400;
      throw err;
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `MC-${randomSuffix}`;

    // Gracefully format customer phone and payment reference
    const finalCustomerName = rawPhone
      ? `${customerName} (📞 +91 ${rawPhone.replace(/\D/g, '')})`
      : customerName;

    const finalPaymentMethod = transactionRef
      ? `${paymentMethod || 'card'} (Ref: ${transactionRef})`
      : (paymentMethod || 'card');

    const finalEmail = rawEmail || `${rawPhone.replace(/\D/g, '') || 'guest'}@customer.shivshaktievents.com`;

    const order = await orderRepository.create(
      {
        orderNumber,
        customerName: finalCustomerName,
        customerEmail: finalEmail,
        customerPhone: rawPhone || null,
        totalAmount: parseFloat(totalAmount),
        discountAmount: discountAmount ? parseFloat(discountAmount) : 0,
        grandTotal: parseFloat(grandTotal),
        paymentMethod: finalPaymentMethod,
        status: 'CONFIRMED',
        userId: user?.id || null,
      },
      items
    );

    // Multi-channel dispatch: Send SMS, Email, or Both (if available)
    notificationService.sendOrderConfirmation({
      order,
      customerName,
      customerEmail: rawEmail || null,
      customerPhone: rawPhone || null,
      grandTotal: parseFloat(grandTotal),
      items,
    }).catch((err) => {
      console.error('[Order Notification Warning] Failed to dispatch order messages:', err.message);
    });

    return order;
  },

  async getUserOrders(userId) {
    return orderRepository.findByUserId(userId);
  },

  async getAllOrders({
    page = 1,
    limit = 20,
    status,
    startDate,
    endDate,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = {}) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) where.createdAt.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }
      if (Object.keys(where.createdAt).length === 0) {
        delete where.createdAt;
      }
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { customerName: { contains: q, mode: 'insensitive' } },
        { customerEmail: { contains: q, mode: 'insensitive' } },
      ];
    }

    const validSortFields = ['createdAt', 'grandTotal', 'customerName', 'orderNumber', 'status'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const { orders, total } = await orderRepository.findAll({
      where,
      skip,
      take: limitNum,
      orderBy: { [field]: order },
    });

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

  async deleteOrder(id) {
    const existing = await orderRepository.findById(id);
    if (!existing) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return orderRepository.delete(id);
  },
};
