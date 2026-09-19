import prisma from '../../shared/config/prisma.js';
import { uploadStreamToCloudinary, deleteFromCloudinary } from '../../shared/config/cloudinary.js';
import { auditService } from '../../shared/services/audit.service.js';

export const mediaService = {
  /**
   * Upload single image buffer to Cloudinary & persist in MediaAsset
   */
  async uploadImage(buffer, folder = 'shiv-shakti-events', originalName = '', altText = '', req = null) {
    const uploadResult = await uploadStreamToCloudinary(buffer, folder, originalName);

    // Persist in media_assets table
    const asset = await prisma.mediaAsset.create({
      data: {
        name: originalName || 'Event Infrastructure Asset',
        url: uploadResult.url,
        publicId: uploadResult.publicId || null,
        format: uploadResult.format || 'jpg',
        bytes: uploadResult.bytes || null,
        width: uploadResult.width || null,
        height: uploadResult.height || null,
        folder: folder || 'shiv-shakti-events',
        altText: altText || originalName || 'Event Asset',
      },
    });

    auditService.record({
      req,
      action: 'UPLOAD_MEDIA_ASSET',
      entity: 'MediaAsset',
      entityId: asset.id,
      details: { name: asset.name, url: asset.url, folder: asset.folder },
    });

    return {
      ...uploadResult,
      id: asset.id,
      asset,
    };
  },

  /**
   * Fetch paginated media assets from database
   */
  async getMediaAssets({
    page = 1,
    limit = 24,
    search = '',
    folder = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    startDate = null,
    endDate = null,
  } = {}) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 24));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { publicId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (folder && folder !== 'all') {
      where.folder = folder;
    }

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

    const validSortFields = ['createdAt', 'name', 'bytes'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const [total, assets] = await Promise.all([
      prisma.mediaAsset.count({ where }),
      prisma.mediaAsset.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [field]: order },
      }),
    ]);

    return {
      assets,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    };
  },

  /**
   * Delete media asset from DB and Cloudinary
   */
  async deleteMediaAsset(id, req = null) {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      const err = new Error('Media asset not found.');
      err.statusCode = 404;
      throw err;
    }

    if (asset.publicId) {
      await deleteFromCloudinary(asset.publicId);
    }

    const deleted = await prisma.mediaAsset.delete({ where: { id } });

    auditService.record({
      req,
      action: 'DELETE_MEDIA_ASSET',
      entity: 'MediaAsset',
      entityId: id,
      details: { name: asset.name, url: asset.url },
    });

    return deleted;
  },

  /**
   * Add image to product gallery
   */
  async addImageToProduct(productId, { url, publicId, altText, isPrimary = false, type = 'gallery' }) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      const err = new Error('Product not found.');
      err.statusCode = 404;
      throw err;
    }

    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
      await prisma.product.update({
        where: { id: productId },
        data: { image: url },
      });
    }

    const currentCount = await prisma.productImage.count({ where: { productId } });

    return prisma.productImage.create({
      data: {
        productId,
        url,
        publicId: publicId || null,
        altText: altText || product.name,
        isPrimary: Boolean(isPrimary),
        type,
        sortOrder: currentCount,
      },
    });
  },

  /**
   * Update product image metadata or set as primary
   */
  async updateProductImage(productId, imageId, { altText, isPrimary, sortOrder, type }) {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) {
      const err = new Error('Image not found for this product.');
      err.statusCode = 404;
      throw err;
    }

    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
      await prisma.product.update({
        where: { id: productId },
        data: { image: image.url },
      });
    }

    return prisma.productImage.update({
      where: { id: imageId },
      data: {
        ...(altText !== undefined && { altText }),
        ...(isPrimary !== undefined && { isPrimary: Boolean(isPrimary) }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
        ...(type !== undefined && { type }),
      },
    });
  },

  /**
   * Delete an image from product
   */
  async deleteProductImage(productId, imageId) {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image || image.productId !== productId) {
      const err = new Error('Image not found for this product.');
      err.statusCode = 404;
      throw err;
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    if (image.isPrimary) {
      const firstRemaining = await prisma.productImage.findFirst({
        where: { productId },
        orderBy: { sortOrder: 'asc' },
      });
      if (firstRemaining) {
        await prisma.productImage.update({
          where: { id: firstRemaining.id },
          data: { isPrimary: true },
        });
        await prisma.product.update({
          where: { id: productId },
          data: { image: firstRemaining.url },
        });
      }
    }
  },

  /**
   * Reorder gallery images
   */
  async reorderProductImages(productId, imageIds = []) {
    return prisma.$transaction(
      imageIds.map((id, index) =>
        prisma.productImage.updateMany({
          where: { id, productId },
          data: { sortOrder: index },
        })
      )
    );
  },
};
