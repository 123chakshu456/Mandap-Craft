import { carouselService } from './carousel.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getPublicSlides = async (req, res, next) => {
  try {
    const slides = await carouselService.getActiveSlides();
    successResponse(res, { slides });
  } catch (error) {
    next(error);
  }
};

export const getAdminSlides = async (req, res, next) => {
  try {
    const slides = await carouselService.getAllSlidesAdmin();
    successResponse(res, { slides });
  } catch (error) {
    next(error);
  }
};

export const getSlideById = async (req, res, next) => {
  try {
    const slide = await carouselService.getSlideById(req.params.id);
    successResponse(res, { slide });
  } catch (error) {
    next(error);
  }
};

export const createSlide = async (req, res, next) => {
  try {
    const slide = await carouselService.createSlide(req.body);
    successResponse(res, { slide }, 'Carousel slide created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateSlide = async (req, res, next) => {
  try {
    const slide = await carouselService.updateSlide(req.params.id, req.body);
    successResponse(res, { slide }, 'Carousel slide updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const deleteSlide = async (req, res, next) => {
  try {
    await carouselService.deleteSlide(req.params.id);
    successResponse(res, null, 'Carousel slide deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const toggleSlideActive = async (req, res, next) => {
  try {
    const slide = await carouselService.toggleSlideActive(req.params.id);
    successResponse(res, { slide }, `Slide ${slide.isActive ? 'activated' : 'deactivated'} successfully.`);
  } catch (error) {
    next(error);
  }
};

export const reorderSlides = async (req, res, next) => {
  try {
    const { items } = req.body;
    const slides = await carouselService.reorderSlides(items);
    successResponse(res, { slides }, 'Slides reordered successfully.');
  } catch (error) {
    next(error);
  }
};
