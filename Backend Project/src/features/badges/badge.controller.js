import { badgeService } from './badge.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getPublicBadges = async (req, res, next) => {
  try {
    const badges = await badgeService.getPublicBadges();
    successResponse(res, { badges });
  } catch (error) {
    next(error);
  }
};

export const getAdminBadges = async (req, res, next) => {
  try {
    const badges = await badgeService.getAdminBadges();
    successResponse(res, { badges });
  } catch (error) {
    next(error);
  }
};

export const createBadge = async (req, res, next) => {
  try {
    const badge = await badgeService.createBadge(req.body);
    successResponse(res, { badge }, 'Badge created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBadge = async (req, res, next) => {
  try {
    const badge = await badgeService.updateBadge(req.params.id, req.body);
    successResponse(res, { badge }, 'Badge updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteBadge = async (req, res, next) => {
  try {
    await badgeService.deleteBadge(req.params.id);
    successResponse(res, null, 'Badge deleted successfully.');
  } catch (error) {
    next(error);
  }
};
