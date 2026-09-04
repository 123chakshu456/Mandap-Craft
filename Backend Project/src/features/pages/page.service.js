import { pageRepository } from './page.repository.js';
import { slugify } from '../../shared/utils/slugify.js';

export const pageService = {
  /**
   * Public: Get all published pages (for sitemap, navigation, etc.)
   */
  async getPublicPages() {
    return pageRepository.findAll({ status: 'PUBLISHED' });
  },

  /**
   * Public: Get single published page by slug
   */
  async getPublicPageBySlug(slug) {
    const page = await pageRepository.findBySlug(slug);
    if (!page || page.status !== 'PUBLISHED') {
      const err = new Error('Page not found or is currently not published.');
      err.statusCode = 404;
      throw err;
    }
    return page;
  },

  /**
   * Admin: Get all pages (including DRAFT and UNPUBLISHED)
   */
  async getAdminPages(status) {
    const where = status && status !== 'all' ? { status } : {};
    return pageRepository.findAll(where);
  },

  /**
   * Admin: Get single page by ID
   */
  async getAdminPageById(id) {
    const page = await pageRepository.findById(id);
    if (!page) {
      const err = new Error('Page not found.');
      err.statusCode = 404;
      throw err;
    }
    return page;
  },

  /**
   * Admin: Create Page
   */
  async createPage(payload) {
    const { title, slug, content, heroImage, seoTitle, seoDescription, status = 'DRAFT' } = payload;

    if (!title || !content) {
      const err = new Error('Page title and content are required.');
      err.statusCode = 400;
      throw err;
    }

    const pageSlug = slugify(slug || title);
    const existing = await pageRepository.findBySlug(pageSlug);
    if (existing) {
      const err = new Error(`A page with slug '${pageSlug}' already exists.`);
      err.statusCode = 400;
      throw err;
    }

    return pageRepository.create({
      title,
      slug: pageSlug,
      content,
      heroImage: heroImage || null,
      seoTitle: seoTitle || `${title} | Shiv Shakti Events Mart`,
      seoDescription: seoDescription || null,
      status: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'].includes(status) ? status : 'DRAFT',
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    });
  },

  /**
   * Admin: Update Page
   */
  async updatePage(id, payload) {
    const existing = await pageRepository.findById(id);
    if (!existing) {
      const err = new Error('Page not found.');
      err.statusCode = 404;
      throw err;
    }

    const { title, slug, content, heroImage, seoTitle, seoDescription, status } = payload;

    let pageSlug = existing.slug;
    if (slug && slug !== existing.slug) {
      pageSlug = slugify(slug);
      const check = await pageRepository.findBySlug(pageSlug);
      if (check && check.id !== id) {
        const err = new Error(`Page slug '${pageSlug}' is already in use.`);
        err.statusCode = 400;
        throw err;
      }
    }

    let publishedAt = existing.publishedAt;
    let unpublishedAt = existing.unpublishedAt;
    if (status && status !== existing.status) {
      if (status === 'PUBLISHED') publishedAt = new Date();
      if (status === 'UNPUBLISHED') unpublishedAt = new Date();
    }

    return pageRepository.update(id, {
      ...(title !== undefined && { title }),
      slug: pageSlug,
      ...(content !== undefined && { content }),
      ...(heroImage !== undefined && { heroImage }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
      ...(status !== undefined && { status }),
      publishedAt,
      unpublishedAt,
    });
  },

  /**
   * Admin: Publish Page
   */
  async publishPage(id) {
    const existing = await pageRepository.findById(id);
    if (!existing) {
      const err = new Error('Page not found.');
      err.statusCode = 404;
      throw err;
    }

    return pageRepository.update(id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });
  },

  /**
   * Admin: Unpublish Page
   */
  async unpublishPage(id) {
    const existing = await pageRepository.findById(id);
    if (!existing) {
      const err = new Error('Page not found.');
      err.statusCode = 404;
      throw err;
    }

    return pageRepository.update(id, {
      status: 'UNPUBLISHED',
      unpublishedAt: new Date(),
    });
  },

  /**
   * Admin: Delete Page
   */
  async deletePage(id) {
    const existing = await pageRepository.findById(id);
    if (!existing) {
      const err = new Error('Page not found.');
      err.statusCode = 404;
      throw err;
    }
    return pageRepository.delete(id);
  },
};
