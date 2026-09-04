import { filterService } from './filter.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getPublicFilters = async (req, res, next) => {
  try {
    const filters = await filterService.getPublicFilters(req.query.category);
    successResponse(res, { filters });
  } catch (error) {
    next(error);
  }
};

export const getAdminFilters = async (req, res, next) => {
  try {
    const filters = await filterService.getAdminFilters();
    successResponse(res, { filters });
  } catch (error) {
    next(error);
  }
};

export const createFilter = async (req, res, next) => {
  try {
    const filter = await filterService.createFilter(req.body);
    successResponse(res, { filter }, 'Filter created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateFilter = async (req, res, next) => {
  try {
    const filter = await filterService.updateFilter(req.params.id, req.body);
    successResponse(res, { filter }, 'Filter updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteFilter = async (req, res, next) => {
  try {
    await filterService.deleteFilter(req.params.id);
    successResponse(res, null, 'Filter deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const addFilterValue = async (req, res, next) => {
  try {
    const value = await filterService.addFilterValue(req.params.id, req.body);
    successResponse(res, { value }, 'Filter value added successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateFilterValue = async (req, res, next) => {
  try {
    const value = await filterService.updateFilterValue(req.params.id, req.params.valueId, req.body);
    successResponse(res, { value }, 'Filter value updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteFilterValue = async (req, res, next) => {
  try {
    await filterService.deleteFilterValue(req.params.id, req.params.valueId);
    successResponse(res, null, 'Filter value removed successfully.');
  } catch (error) {
    next(error);
  }
};
