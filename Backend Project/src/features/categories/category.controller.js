import { categoryService } from './category.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getPublicCategoryTree();
    successResponse(res, { categories });
  } catch (error) {
    next(error);
  }
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAdminCategoryTree();
    successResponse(res, { categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    successResponse(res, { category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    successResponse(res, { category }, 'Category created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    successResponse(res, { category }, 'Category updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await categoryService.toggleStatus(req.params.id, req.body.isActive);
    successResponse(res, { category }, 'Category status updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    successResponse(res, null, 'Category deleted successfully.');
  } catch (error) {
    next(error);
  }
};
