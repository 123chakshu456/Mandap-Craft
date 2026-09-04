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

  async getAllQuotes({ page = 1, limit = 20, status }) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    const where = status && status !== 'all' ? { status } : {};

    const { quotes, total } = await quoteRepository.findAll({ where, skip, take: limitNum });
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
};
