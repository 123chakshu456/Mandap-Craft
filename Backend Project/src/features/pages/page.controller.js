import { pageService } from './page.service.js';
import { successResponse } from '../../shared/utils/response.js';

export const getPublicPages = async (req, res, next) => {
  try {
    const pages = await pageService.getPublicPages();
    successResponse(res, { pages });
  } catch (error) {
    next(error);
  }
};

export const getPublicPageBySlug = async (req, res, next) => {
  try {
    const page = await pageService.getPublicPageBySlug(req.params.slug);
    successResponse(res, { page });
  } catch (error) {
    next(error);
  }
};

export const getAdminPages = async (req, res, next) => {
  try {
    const pages = await pageService.getAdminPages(req.query.status);
    successResponse(res, { pages });
  } catch (error) {
    next(error);
  }
};

export const getAdminPageById = async (req, res, next) => {
  try {
    const page = await pageService.getAdminPageById(req.params.id);
    successResponse(res, { page });
  } catch (error) {
    next(error);
  }
};

export const createPage = async (req, res, next) => {
  try {
    const page = await pageService.createPage(req.body);
    successResponse(res, { page }, 'Page created successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  try {
    const page = await pageService.updatePage(req.params.id, req.body);
    successResponse(res, { page }, 'Page updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const publishPage = async (req, res, next) => {
  try {
    const page = await pageService.publishPage(req.params.id);
    successResponse(res, { page }, 'Page published successfully.');
  } catch (error) {
    next(error);
  }
};

export const unpublishPage = async (req, res, next) => {
  try {
    const page = await pageService.unpublishPage(req.params.id);
    successResponse(res, { page }, 'Page unpublished successfully.');
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req, res, next) => {
  try {
    await pageService.deletePage(req.params.id);
    successResponse(res, null, 'Page deleted successfully.');
  } catch (error) {
    next(error);
  }
};
