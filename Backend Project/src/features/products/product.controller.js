import { productService } from './product.service.js';
import { successResponse } from '../../shared/utils/response.js';

/**
 * Public: Get products with filters and pagination
 */
export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getPublicProducts(req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Get single product by ID or Slug
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductByIdOrSlug(req.params.id, false);
    successResponse(res, { product });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all products (all statuses)
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    const result = await productService.getAdminProducts(req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get single product details by ID
 */
export const getAdminProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductByIdOrSlug(req.params.id, true);
    successResponse(res, { product });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create Product
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    successResponse(res, { product }, 'Product created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update Product
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    successResponse(res, { product }, 'Product updated successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Publish Product
 */
export const publishProduct = async (req, res, next) => {
  try {
    const product = await productService.publishProduct(req.params.id);
    successResponse(res, { product }, 'Product published successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Unpublish Product
 */
export const unpublishProduct = async (req, res, next) => {
  try {
    const product = await productService.unpublishProduct(req.params.id);
    successResponse(res, { product }, 'Product unpublished successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete Product
 */
export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    successResponse(res, null, 'Product deleted successfully.');
  } catch (error) {
    next(error);
  }
};
