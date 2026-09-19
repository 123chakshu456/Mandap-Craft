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
  async getRecentLogs({
    limit = 20,
    entity = null,
    action = null,
    startDate = null,
    endDate = null,
    search = null,
    sortOrder = 'desc',
  } = {}) {
    const where = {};
    if (entity && entity !== 'all') where.entity = entity;
    if (action && action !== 'all') where.action = action;

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
        { userEmail: { contains: q, mode: 'insensitive' } },
        { entity: { contains: q, mode: 'insensitive' } },
        { action: { contains: q, mode: 'insensitive' } },
      ];
    }

    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    return prisma.auditLog.findMany({
      where,
      take: Math.min(Number(limit) || 20, 100),
      orderBy: { createdAt: order },
    });
  },
};
