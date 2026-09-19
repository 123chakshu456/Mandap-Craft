import { productRepository } from './product.repository.js';
import { slugify } from '../../shared/utils/slugify.js';
import { auditService } from '../../shared/services/audit.service.js';

export const productService = {
  /**
   * Public Product Listing: Enforces status === 'PUBLISHED' and inStock === true
   */
  async getPublicProducts(query = {}) {
    const {
      category, subcategory, subSubcategory,
      style, search, featured, badge, filterValueIds,
      minPrice, maxPrice,
      sortBy = 'priority',
      page = 1, limit = 24,
    } = query;

    const where = {
      status: 'PUBLISHED',
      inStock: true,
    };

    if (category && category !== 'all') where.categoryId = category;
    if (subcategory && subcategory !== 'all') where.subcategoryId = subcategory;
    if (subSubcategory && subSubcategory !== 'all') where.subSubcategoryId = subSubcategory;
    if (style && style !== 'All') where.style = style;
    if (featured === 'true' || featured === true) where.isFeatured = true;

    // Price range filters
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Keyword search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tag: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Badge filter
    if (badge && badge !== 'all') {
      where.badges = {
        some: {
          badge: {
            OR: [
              { slug: badge },
              { name: { contains: badge, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    // Facet / Filter Values filter
    if (filterValueIds) {
      const ids = Array.isArray(filterValueIds) ? filterValueIds : String(filterValueIds).split(',');
      if (ids.length > 0) {
        where.filterValues = {
          some: {
            filterValueId: { in: ids },
          },
        };
      }
    }

    // Sorting
    let orderBy = [{ sortPriority: 'desc' }, { isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (sortBy === 'price_asc') orderBy = [{ price: 'asc' }];
    else if (sortBy === 'price_desc') orderBy = [{ price: 'desc' }];
    else if (sortBy === 'rating') orderBy = [{ rating: 'desc' }];
    else if (sortBy === 'newest') orderBy = [{ createdAt: 'desc' }];

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(3000, Math.max(1, parseInt(limit) || 24));
    const skip = (pageNum - 1) * limitNum;

    const { products, total } = await productRepository.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
    });

    return {
      products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },

  /**
   * Admin Product Listing: Allows viewing DRAFT, PUBLISHED, UNPUBLISHED with rich filtering
   */
  async getAdminProducts(query = {}) {
    const {
      category, subcategory, status, search, badge,
      page = 1, limit = 50,
      startDate, endDate, sortBy, sortOrder,
    } = query;

    const where = {};

    if (category && category !== 'all') where.categoryId = category;
    if (subcategory && subcategory !== 'all') where.subcategoryId = subcategory;
    if (status && status !== 'all') where.status = status;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) where.createdAt.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }
      if (Object.keys(where.createdAt).length === 0) {
        delete where.createdAt;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tag: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (badge && badge !== 'all') {
      where.badges = {
        some: {
          badge: {
            OR: [
              { slug: badge },
              { id: badge },
            ],
          },
        },
      };
    }

    let orderBy = [{ updatedAt: 'desc' }, { createdAt: 'desc' }];
    if (sortBy) {
      const order = sortOrder === 'asc' ? 'asc' : 'desc';
      if (['name', 'sku', 'price', 'status', 'createdAt', 'updatedAt'].includes(sortBy)) {
        orderBy = [{ [sortBy]: order }];
      }
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(3000, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const { products, total } = await productRepository.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
    });

    return {
      products,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },

  /**
   * Get single product by ID or Slug (Public details)
   */
  async getProductByIdOrSlug(idOrSlug, isAdmin = false) {
    let product = await productRepository.findById(idOrSlug);
    if (!product) {
      product = await productRepository.findBySlug(idOrSlug);
    }

    if (!product) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    // If not admin, check publication visibility
    if (!isAdmin && product.status !== 'PUBLISHED') {
      const err = new Error('Product is currently not available.');
      err.statusCode = 404;
      throw err;
    }

    return product;
  },

  /**
   * Create Product (Admin Only)
   */
  async createProduct(payload, req = null) {
    const {
      sku, name, slug, categoryId, subcategoryId, subSubcategoryId,
      style, price, compareAtPrice, rating, reviews,
      pricingUnit = 'FIXED', areaMode, presetSizes, minSqFt, maxSqFt, defaultSqFt,
      image, description, features, isFeatured, tag, inStock,
      status = 'PUBLISHED', sortPriority, seoTitle, seoDescription, seoKeywords,
      filterValueIds = [], badgeIds = [], images = [],
    } = payload;

    if (!name || !price) {
      const err = new Error('Product name and price are required.');
      err.statusCode = 400;
      throw err;
    }

    // SKU Generation & Uniqueness Check
    let finalSku = sku?.trim();
    if (!finalSku) {
      const prefix = categoryId ? categoryId.slice(0, 3).toUpperCase() : 'SKU';
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      finalSku = `SKU-${prefix}-${randomSuffix}`;
    }

    const existingSku = await productRepository.findBySku(finalSku);
    if (existingSku) {
      const err = new Error(`SKU '${finalSku}' is already registered. Please provide a unique SKU.`);
      err.statusCode = 400;
      throw err;
    }

    // Slug Generation & Uniqueness Check
    let baseSlug = slugify(slug || name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await productRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await productRepository.create({
      sku: finalSku,
      name,
      slug: finalSlug,
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      subSubcategoryId: subSubcategoryId || null,
      style: style || 'Traditional',
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      pricingUnit: pricingUnit || 'FIXED',
      areaMode: areaMode || null,
      presetSizes: Array.isArray(presetSizes) ? presetSizes : [],
      minSqFt: minSqFt ? parseFloat(minSqFt) : null,
      maxSqFt: maxSqFt ? parseFloat(maxSqFt) : null,
      defaultSqFt: defaultSqFt ? parseFloat(defaultSqFt) : null,
      rating: rating !== undefined ? parseFloat(rating) : 4.5,
      reviews: reviews !== undefined ? parseInt(reviews) : 0,
      image: image || '/placeholder.jpg',
      description: description || '',
      features: Array.isArray(features) ? features : [],
      isFeatured: Boolean(isFeatured),
      tag: tag || null,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      status: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'].includes(status) ? status : 'PUBLISHED',
      sortPriority: parseInt(sortPriority) || 0,
      seoTitle: seoTitle || `${name} | Shiv Shakti Events Mart`,
      seoDescription: seoDescription || description?.slice(0, 160) || null,
      seoKeywords: seoKeywords || null,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    });

    // Handle primary image in ProductImage table
    if (image) {
      await productRepository.update(product.id, {
        images: {
          create: {
            url: image,
            altText: name,
            isPrimary: true,
            type: 'primary',
            sortOrder: 0,
          },
        },
      });
    }

    // Handle additional gallery images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.url && img.url !== image) {
          await productRepository.update(product.id, {
            images: {
              create: {
                url: img.url,
                publicId: img.publicId || null,
                altText: img.altText || name,
                isPrimary: false,
                type: img.type || 'gallery',
                sortOrder: i + 1,
              },
            },
          });
        }
      }
    }

    // Handle filter values
    if (filterValueIds.length > 0) {
      await productRepository.setProductFilterValues(product.id, filterValueIds);
    }

    // Handle badges
    if (badgeIds.length > 0) {
      await productRepository.setProductBadges(product.id, badgeIds);
    }

    const createdProduct = await productRepository.findById(product.id);
    auditService.record({
      req,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: product.id,
      details: { name: product.name, sku: product.sku },
    });

    return createdProduct;
  },

  /**
   * Update Product (Admin Only)
   */
  async updateProduct(id, payload, req = null) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    const {
      sku, name, slug, categoryId, subcategoryId, subSubcategoryId,
      style, price, compareAtPrice, rating, reviews,
      pricingUnit, areaMode, presetSizes, minSqFt, maxSqFt, defaultSqFt,
      image, description, features, isFeatured, tag, inStock,
      status, sortPriority, seoTitle, seoDescription, seoKeywords,
      filterValueIds, badgeIds,
    } = payload;

    // Check SKU Uniqueness if changed
    if (sku && sku !== existing.sku) {
      const checkSku = await productRepository.findBySku(sku);
      if (checkSku && checkSku.id !== id) {
        const err = new Error(`SKU '${sku}' is already in use by another product.`);
        err.statusCode = 400;
        throw err;
      }
    }

    // Check Slug Uniqueness if changed
    let updatedSlug = existing.slug;
    if (slug && slug !== existing.slug) {
      updatedSlug = slugify(slug);
      const checkSlug = await productRepository.findBySlug(updatedSlug);
      if (checkSlug && checkSlug.id !== id) {
        const err = new Error(`Slug '${updatedSlug}' is already in use.`);
        err.statusCode = 400;
        throw err;
      }
    }

    // Status transition tracking
    let publishedAt = existing.publishedAt;
    let unpublishedAt = existing.unpublishedAt;
    if (status && status !== existing.status) {
      if (status === 'PUBLISHED') publishedAt = new Date();
      if (status === 'UNPUBLISHED') unpublishedAt = new Date();
    }

    await productRepository.update(id, {
      ...(sku !== undefined && { sku }),
      ...(name !== undefined && { name }),
      slug: updatedSlug,
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(subcategoryId !== undefined && { subcategoryId: subcategoryId || null }),
      ...(subSubcategoryId !== undefined && { subSubcategoryId: subSubcategoryId || null }),
      ...(style !== undefined && { style }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(compareAtPrice !== undefined && { compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null }),
      ...(pricingUnit !== undefined && { pricingUnit }),
      ...(areaMode !== undefined && { areaMode: areaMode || null }),
      ...(presetSizes !== undefined && { presetSizes: Array.isArray(presetSizes) ? presetSizes : [] }),
      ...(minSqFt !== undefined && { minSqFt: minSqFt ? parseFloat(minSqFt) : null }),
      ...(maxSqFt !== undefined && { maxSqFt: maxSqFt ? parseFloat(maxSqFt) : null }),
      ...(defaultSqFt !== undefined && { defaultSqFt: defaultSqFt ? parseFloat(defaultSqFt) : null }),
      ...(rating !== undefined && { rating: parseFloat(rating) }),
      ...(reviews !== undefined && { reviews: parseInt(reviews) }),
      ...(image !== undefined && { image }),
      ...(description !== undefined && { description }),
      ...(features !== undefined && { features }),
      ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      ...(tag !== undefined && { tag: tag || null }),
      ...(inStock !== undefined && { inStock: Boolean(inStock) }),
      ...(status !== undefined && { status }),
      ...(sortPriority !== undefined && { sortPriority: parseInt(sortPriority) }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
      ...(seoKeywords !== undefined && { seoKeywords }),
      publishedAt,
      unpublishedAt,
    });

    // Update filter value relations if explicitly provided
    if (Array.isArray(filterValueIds)) {
      await productRepository.setProductFilterValues(id, filterValueIds);
    }

    // Update badge relations if explicitly provided
    if (Array.isArray(badgeIds)) {
      await productRepository.setProductBadges(id, badgeIds);
    }

    const updated = await productRepository.findById(id);
    auditService.record({
      req,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: { name: updated.name, sku: updated.sku, status: updated.status },
    });

    return updated;
  },

  /**
   * Transition Product to PUBLISHED
   */
  async publishProduct(id, req = null) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    const updated = await productRepository.update(id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });

    auditService.record({
      req,
      action: 'PUBLISH_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: { name: existing.name },
    });

    return updated;
  },

  /**
   * Transition Product to UNPUBLISHED
   */
  async unpublishProduct(id, req = null) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    const updated = await productRepository.update(id, {
      status: 'UNPUBLISHED',
      unpublishedAt: new Date(),
    });

    auditService.record({
      req,
      action: 'UNPUBLISH_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: { name: existing.name },
    });

    return updated;
  },

  /**
   * Delete Product
   */
  async deleteProduct(id, req = null) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }
    const deleted = await productRepository.delete(id);

    auditService.record({
      req,
      action: 'DELETE_PRODUCT',
      entity: 'Product',
      entityId: id,
      details: { name: existing.name, sku: existing.sku },
    });

    return deleted;
  },

  /**
   * Bulk update status for multiple products
   */
  async bulkStatusUpdate(ids, status, req = null) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err = new Error('Product IDs array is required.');
      err.statusCode = 400;
      throw err;
    }
    if (!['DRAFT', 'PUBLISHED', 'UNPUBLISHED'].includes(status)) {
      const err = new Error('Valid status (DRAFT, PUBLISHED, UNPUBLISHED) is required.');
      err.statusCode = 400;
      throw err;
    }

    const result = await productRepository.bulkUpdateStatus(ids, status);

    auditService.record({
      req,
      action: 'BULK_UPDATE_STATUS',
      entity: 'Product',
      details: { count: result.count, status, ids },
    });

    return { count: result.count, status };
  },

  /**
   * Bulk update category for multiple products
   */
  async bulkCategoryUpdate(ids, { categoryId, subcategoryId, subSubcategoryId } = {}, req = null) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err = new Error('Product IDs array is required.');
      err.statusCode = 400;
      throw err;
    }

    const result = await productRepository.bulkUpdateCategory(ids, { categoryId, subcategoryId, subSubcategoryId });

    auditService.record({
      req,
      action: 'BULK_UPDATE_CATEGORY',
      entity: 'Product',
      details: { count: result.count, categoryId, subcategoryId, subSubcategoryId, ids },
    });

    return { count: result.count, categoryId, subcategoryId, subSubcategoryId };
  },

  /**
   * Bulk delete multiple products
   */
  async bulkDelete(ids, req = null) {
    if (!Array.isArray(ids) || ids.length === 0) {
      const err = new Error('Product IDs array is required.');
      err.statusCode = 400;
      throw err;
    }

    const result = await productRepository.bulkDelete(ids);

    auditService.record({
      req,
      action: 'BULK_DELETE',
      entity: 'Product',
      details: { count: result.count, ids },
    });

    return { count: result.count };
  },
};
