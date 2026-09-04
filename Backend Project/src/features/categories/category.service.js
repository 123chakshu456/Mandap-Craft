import { categoryRepository } from './category.repository.js';
import { slugify } from '../../shared/utils/slugify.js';

export const categoryService = {
  /**
   * Get public category tree (Level 1 active categories with active children)
   */
  async getPublicCategoryTree() {
    const categories = await categoryRepository.findAll({
      level: 1,
      isActive: true,
    });
    return categories;
  },

  /**
   * Get full category hierarchy for admin panel
   */
  async getAdminCategoryTree() {
    const topLevelCategories = await categoryRepository.findAll({
      level: 1,
    });

    // Attach product counts for each category node
    const enrichWithCounts = async (cat) => {
      const productCount = await categoryRepository.countProducts(cat.id);
      const enrichedChildren = [];
      if (cat.children && cat.children.length > 0) {
        for (const child of cat.children) {
          const childEnriched = await enrichWithCounts(child);
          enrichedChildren.push(childEnriched);
        }
      }
      return {
        ...cat,
        productCount,
        children: enrichedChildren,
      };
    };

    const enrichedTree = [];
    for (const cat of topLevelCategories) {
      enrichedTree.push(await enrichWithCounts(cat));
    }

    return enrichedTree;
  },

  /**
   * Get single category by ID with full details
   */
  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const err = new Error('Category not found.');
      err.statusCode = 404;
      throw err;
    }
    const productCount = await categoryRepository.countProducts(id);
    return { ...category, productCount };
  },

  /**
   * Create a new category / subcategory / sub-subcategory
   */
  async createCategory(payload) {
    const {
      name, slug, shortTitle, tagline, description,
      image, icon, badge, promo, popularItems,
      parentId, sortOrder, isActive,
    } = payload;

    if (!name) {
      const err = new Error('Category name is required.');
      err.statusCode = 400;
      throw err;
    }

    const generatedSlug = slugify(slug || name);

    // Check slug uniqueness
    const existing = await categoryRepository.findBySlug(generatedSlug);
    if (existing) {
      const err = new Error(`A category with slug '${generatedSlug}' already exists.`);
      err.statusCode = 400;
      throw err;
    }

    // Determine level based on parent
    let level = 1;
    if (parentId) {
      const parent = await categoryRepository.findById(parentId);
      if (!parent) {
        const err = new Error('Specified parent category does not exist.');
        err.statusCode = 400;
        throw err;
      }
      level = parent.level + 1;
      if (level > 3) {
        const err = new Error('Maximum 3 levels of category hierarchy are allowed.');
        err.statusCode = 400;
        throw err;
      }
    }

    return categoryRepository.create({
      name,
      slug: generatedSlug,
      shortTitle: shortTitle || null,
      tagline: tagline || null,
      description: description || null,
      image: image || null,
      icon: icon || null,
      badge: badge || null,
      promo: promo || null,
      popularItems: popularItems || [],
      parentId: parentId || null,
      level,
      sortOrder: parseInt(sortOrder) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });
  },

  /**
   * Update category
   */
  async updateCategory(id, payload) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const err = new Error('Category not found.');
      err.statusCode = 404;
      throw err;
    }

    const {
      name, slug, shortTitle, tagline, description,
      image, icon, badge, promo, popularItems,
      parentId, sortOrder, isActive,
    } = payload;

    let updatedSlug = category.slug;
    if (slug && slug !== category.slug) {
      updatedSlug = slugify(slug);
      const existing = await categoryRepository.findBySlug(updatedSlug);
      if (existing && existing.id !== id) {
        const err = new Error(`A category with slug '${updatedSlug}' already exists.`);
        err.statusCode = 400;
        throw err;
      }
    }

    let level = category.level;
    if (parentId !== undefined && parentId !== category.parentId) {
      if (parentId) {
        const parent = await categoryRepository.findById(parentId);
        if (!parent) {
          const err = new Error('Specified parent category does not exist.');
          err.statusCode = 400;
          throw err;
        }
        level = parent.level + 1;
        if (level > 3) {
          const err = new Error('Maximum 3 levels of category hierarchy are allowed.');
          err.statusCode = 400;
          throw err;
        }
      } else {
        level = 1;
      }
    }

    return categoryRepository.update(id, {
      ...(name !== undefined && { name }),
      slug: updatedSlug,
      ...(shortTitle !== undefined && { shortTitle }),
      ...(tagline !== undefined && { tagline }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(icon !== undefined && { icon }),
      ...(badge !== undefined && { badge }),
      ...(promo !== undefined && { promo }),
      ...(popularItems !== undefined && { popularItems }),
      ...(parentId !== undefined && { parentId: parentId || null }),
      level,
      ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    });
  },

  /**
   * Toggle active/inactive status
   */
  async toggleStatus(id, isActive) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const err = new Error('Category not found.');
      err.statusCode = 404;
      throw err;
    }
    return categoryRepository.update(id, { isActive: Boolean(isActive) });
  },

  /**
   * Delete category with orphan check
   */
  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const err = new Error('Category not found.');
      err.statusCode = 404;
      throw err;
    }

    // Check if subcategories exist
    const childCount = await categoryRepository.countChildren(id);
    if (childCount > 0) {
      const err = new Error('Cannot delete category with active subcategories. Please reassign or delete subcategories first.');
      err.statusCode = 400;
      throw err;
    }

    // Check if products exist under this category
    const productCount = await categoryRepository.countProducts(id);
    if (productCount > 0) {
      const err = new Error(`Cannot delete category because ${productCount} product(s) are assigned to it. Please reassign products first.`);
      err.statusCode = 400;
      throw err;
    }

    return categoryRepository.delete(id);
  },
};
