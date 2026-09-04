import { quoteService } from './quote.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const createQuote = async (req, res, next) => {
  try {
    const quote = await quoteService.createQuote(req.body, req.user);
    successResponse(res, { quote }, 'Quote request submitted successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const getAllQuotes = async (req, res, next) => {
  try {
    const result = await quoteService.getAllQuotes(req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateQuoteStatus = async (req, res, next) => {
  try {
    const quote = await quoteService.updateQuoteStatus(req.params.id, req.body.status);
    successResponse(res, { quote }, 'Quote status updated successfully.');
  } catch (error) {
    next(error);
  }
};
