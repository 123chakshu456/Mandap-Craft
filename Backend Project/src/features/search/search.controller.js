import { searchService } from './search.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const globalSearch = async (req, res, next) => {
  try {
    const results = await searchService.federatedSearch(req.query.q, req.user);
    successResponse(res, results);
  } catch (error) {
    next(error);
  }
};
