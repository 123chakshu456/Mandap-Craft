import prisma from '../config/prisma.js';

/**
 * Enterprise Audit Logging Service
 */
export const auditService = {
  /**
   * Safely record an administrative audit log event
   */
  async record({ req, action, entity, entityId, details = null }) {
    try {
      const userId = req?.user?.id || null;
      const userEmail = req?.user?.email || 'System / Anonymous';
      const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || null;

      return await prisma.auditLog.create({
        data: {
          userId,
          userEmail,
          action,
          entity,
          entityId: entityId ? String(entityId) : null,
          details: details ? details : undefined,
          ipAddress: ipAddress ? String(ipAddress) : null,
        },
      });
    } catch (err) {
      console.error('[AuditLog Error] Failed to record audit log:', err.message);
      return null;
    }
  },

  /**
   * Fetch recent audit logs with pagination & filtering
   */
  async getRecentLogs({ limit = 20, entity = null, action = null }) {
    const where = {};
    if (entity) where.entity = entity;
    if (action) where.action = action;

    return prisma.auditLog.findMany({
      where,
      take: Math.min(Number(limit) || 20, 100),
      orderBy: { createdAt: 'desc' },
    });
  },
};
