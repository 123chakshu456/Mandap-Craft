import { quoteRepository } from './quote.repository.js';

export const quoteService = {
  async createQuote(payload, user = null) {
    const { email, scale, venue, drapes, estimated } = payload;

    if (!email || !scale || !venue || !drapes || estimated === undefined) {
      const err = new Error('Missing required quote fields.');
      err.statusCode = 400;
      throw err;
    }

    return quoteRepository.create({
      email,
      scale,
      venue,
      drapes,
      estimated: parseFloat(estimated),
      status: 'PENDING',
      userId: user?.id || null,
    });
  },

  async getAllQuotes({
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
        { email: { contains: q, mode: 'insensitive' } },
        { venue: { contains: q, mode: 'insensitive' } },
        { scale: { contains: q, mode: 'insensitive' } },
      ];
    }

    const validSortFields = ['createdAt', 'estimated', 'status', 'scale', 'venue'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const { quotes, total } = await quoteRepository.findAll({
      where,
      skip,
      take: limitNum,
      orderBy: { [field]: order },
    });

    return {
      quotes,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },

  async updateQuoteStatus(id, status) {
    const validStatuses = ['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    return quoteRepository.updateStatus(id, status);
  },

  async deleteQuote(id) {
    const existing = await quoteRepository.findById(id);
    if (!existing) {
      const err = new Error('Quote request not found');
      err.statusCode = 404;
      throw err;
    }
    return quoteRepository.delete(id);
  },
};
