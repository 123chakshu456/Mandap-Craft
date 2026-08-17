import prisma from '../config/prisma.js';

/**
 * @route   POST /api/orders
 * @desc    Create a new order with items
 * @access  Public / Authenticated
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      items,
      totalAmount,
      discountAmount = 0,
      grandTotal,
      paymentMethod = 'card',
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.',
      });
    }

    if (!customerEmail || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and email are required.',
      });
    }

    const orderNumber = `MC-${Math.floor(100000 + Math.random() * 900000)}`;
    const userId = req.user ? req.user.id : null;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        totalAmount: parseFloat(totalAmount) || 0,
        discountAmount: parseFloat(discountAmount) || 0,
        grandTotal: parseFloat(grandTotal) || 0,
        paymentMethod,
        userId,
        items: {
          create: items.map((item) => ({
            itemId: String(item.id),
            name: item.name,
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity, 10) || 1,
            itemType: item.type || 'events',
            image: item.image || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get current user orders
 * @access  Authenticated
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId },
          { customerEmail: req.user.email },
        ],
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Public / Admin
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};
