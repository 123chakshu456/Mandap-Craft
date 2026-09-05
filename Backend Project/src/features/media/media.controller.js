import { mediaService } from './media.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    const folder = req.body.folder || 'shiv-shakti-events';
    const originalName = req.file.originalname || '';
    const altText = req.body.altText || originalName;

    const result = await mediaService.uploadImage(req.file.buffer, folder, originalName, altText, req);

    successResponse(res, result, 'Image uploaded and saved to library successfully.');
  } catch (error) {
    next(error);
  }
};

export const getMediaAssets = async (req, res, next) => {
  try {
    const data = await mediaService.getMediaAssets(req.query);
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

export const deleteMediaAsset = async (req, res, next) => {
  try {
    await mediaService.deleteMediaAsset(req.params.id, req);
    successResponse(res, null, 'Media asset deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const addImageToProduct = async (req, res, next) => {
  try {
    const image = await mediaService.addImageToProduct(req.params.id, req.body);
    successResponse(res, { image }, 'Image added to product successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProductImage = async (req, res, next) => {
  try {
    const image = await mediaService.updateProductImage(req.params.id, req.params.imageId, req.body);
    successResponse(res, { image }, 'Product image updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteProductImage = async (req, res, next) => {
  try {
    await mediaService.deleteProductImage(req.params.id, req.params.imageId);
    successResponse(res, null, 'Product image removed successfully.');
  } catch (error) {
    next(error);
  }
};

export const reorderProductImages = async (req, res, next) => {
  try {
    await mediaService.reorderProductImages(req.params.id, req.body.imageIds);
    successResponse(res, null, 'Product images reordered successfully.');
  } catch (error) {
    next(error);
  }
};
