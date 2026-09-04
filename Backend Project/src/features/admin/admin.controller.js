import { adminService } from './admin.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardStats();
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};
