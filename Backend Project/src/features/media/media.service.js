import prisma from '../../shared/config/prisma.js';
import { uploadStreamToCloudinary } from '../../shared/config/cloudinary.js';

export const mediaService = {
  /**
   * Upload single image buffer to Cloudinary
   */
  async uploadImage(buffer, folder = 'shiv-shakti-events') {
    return uploadStreamToCloudinary(buffer, folder);
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
      // Unset any previous primary image
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
      // Also update product's main image column for backward compatibility
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

    // If deleted image was primary, pick the first remaining image as primary
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
