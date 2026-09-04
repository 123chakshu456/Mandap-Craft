import { productRepository } from './product.repository.js';
import { slugify } from '../../shared/utils/slugify.js';

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
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 24));
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
    } = query;

    const where = {};

    if (category && category !== 'all') where.categoryId = category;
    if (subcategory && subcategory !== 'all') where.subcategoryId = subcategory;
    if (status && status !== 'all') where.status = status;

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

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(500, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const { products, total } = await productRepository.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
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
  async createProduct(payload) {
    const {
      sku, name, slug, categoryId, subcategoryId, subSubcategoryId,
      style, price, compareAtPrice, rating, reviews,
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

    return productRepository.findById(product.id);
  },

  /**
   * Update Product (Admin Only)
   */
  async updateProduct(id, payload) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    const {
      sku, name, slug, categoryId, subcategoryId, subSubcategoryId,
      style, price, compareAtPrice, rating, reviews,
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

    return productRepository.findById(id);
  },

  /**
   * Transition Product to PUBLISHED
   */
  async publishProduct(id) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    return productRepository.update(id, {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    });
  },

  /**
   * Transition Product to UNPUBLISHED
   */
  async unpublishProduct(id) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    return productRepository.update(id, {
      status: 'UNPUBLISHED',
      unpublishedAt: new Date(),
    });
  },

  /**
   * Delete Product
   */
  async deleteProduct(id) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }
    return productRepository.delete(id);
  },
};
