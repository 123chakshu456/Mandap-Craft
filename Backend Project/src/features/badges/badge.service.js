import { badgeRepository } from './badge.repository.js';
import { slugify } from '../../shared/utils/slugify.js';

export const badgeService = {
  /**
   * Get public active badges
   */
  async getPublicBadges() {
    return badgeRepository.findAll({ isActive: true });
  },

  /**
   * Get all badges for admin with assignment counts
   */
  async getAdminBadges() {
    const badges = await badgeRepository.findAll();
    return Promise.all(
      badges.map(async (b) => {
        const productCount = await badgeRepository.countProductAssignments(b.id);
        return { ...b, productCount };
      })
    );
  },

  /**
   * Create badge
   */
  async createBadge(payload) {
    const { name, slug, label, color, bgColor, icon, sortOrder, isActive } = payload;

    if (!name) {
      const err = new Error('Badge name is required.');
      err.statusCode = 400;
      throw err;
    }

    const badgeSlug = slugify(slug || name);
    const existing = await badgeRepository.findBySlug(badgeSlug);
    if (existing) {
      const err = new Error(`Badge with slug '${badgeSlug}' already exists.`);
      err.statusCode = 400;
      throw err;
    }

    return badgeRepository.create({
      name,
      slug: badgeSlug,
      label: label || name,
      color: color || '#f59e0b',
      bgColor: bgColor || '#451a03',
      icon: icon || null,
      sortOrder: parseInt(sortOrder) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });
  },

  /**
   * Update badge
   */
  async updateBadge(id, payload) {
    const existing = await badgeRepository.findById(id);
    if (!existing) {
      const err = new Error('Badge not found.');
      err.statusCode = 404;
      throw err;
    }

    const { name, slug, label, color, bgColor, icon, sortOrder, isActive } = payload;

    let badgeSlug = existing.slug;
    if (slug && slug !== existing.slug) {
      badgeSlug = slugify(slug);
      const check = await badgeRepository.findBySlug(badgeSlug);
      if (check && check.id !== id) {
        const err = new Error(`Badge slug '${badgeSlug}' is already in use.`);
        err.statusCode = 400;
        throw err;
      }
    }

    return badgeRepository.update(id, {
      ...(name !== undefined && { name }),
      slug: badgeSlug,
      ...(label !== undefined && { label }),
      ...(color !== undefined && { color }),
      ...(bgColor !== undefined && { bgColor }),
      ...(icon !== undefined && { icon }),
      ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    });
  },

  /**
   * Delete badge
   */
  async deleteBadge(id) {
    const existing = await badgeRepository.findById(id);
    if (!existing) {
      const err = new Error('Badge not found.');
      err.statusCode = 404;
      throw err;
    }
    return badgeRepository.delete(id);
  },
};
