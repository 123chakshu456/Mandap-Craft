import { adminService } from './admin.service.js';
import { auditService } from '../../shared/services/audit.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardStats();
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const data = await auditService.getRecentLogs(req.query);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};
