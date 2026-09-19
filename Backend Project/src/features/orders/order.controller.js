import { orderService } from './order.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body, req.user);
    successResponse(res, { order }, 'Order placed successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    successResponse(res, { orders });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    successResponse(res, { order }, 'Order status updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await orderService.deleteOrder(req.params.id);
    successResponse(res, null, 'Order deleted successfully.');
  } catch (error) {
    next(error);
  }
};
