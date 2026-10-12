import prisma from '../../shared/config/prisma.js';

const DEFAULT_SLIDES = [
  {
    title: 'Royal Crimson & Champagne Gold Palace Pavilion Ceiling',
    subtitle: 'Grand scalloped velvet ruffles, multi-tier crystal chandeliers, and imperial banquet drapery for majestic royal weddings.',
    badge: 'Royal Wedding Architecture',
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791837978/shiv-shakti-carousel/carousel_royal_crimson_palace_canopy.jpg',
    ctaText: 'Explore Wedding Ceilings',
    ctaLink: '/?category=wedding&subcategory=ceilings',
    secondaryCtaText: 'Custom Staging Quote',
    secondaryCtaLink: '/#quote-builder',
    titleSize: 'display',
    alignment: 'left',
    overlayOpacity: 0.45,
    sortOrder: 0,
    isActive: true,
  },
  {
    title: 'Midnight Celestial Star-Lit Dome & Crystal Halo Ceiling',
    subtitle: 'Deep navy pleated velvet canopy with twinkling optical star-field and grand suspended crystal chandelier halo.',
    badge: 'Celestial Wedding Decor',
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791837979/shiv-shakti-carousel/carousel_midnight_navy_celestial_dome.jpg',
    ctaText: 'Explore Wedding Mandaps',
    ctaLink: '/?category=wedding&subcategory=mandaps',
    secondaryCtaText: 'Browse Full Catalog',
    secondaryCtaLink: '/',
    titleSize: 'display',
    alignment: 'center',
    overlayOpacity: 0.45,
    sortOrder: 1,
    isActive: true,
  },
  {
    title: 'Sapphire & Shimmering Silver Cascading Silk Canopy',
    subtitle: 'Opulent silk draping with cascading floral arrangements, crystal chandeliers, and ambient ballroom mood lighting.',
    badge: 'Luxury Banquet Staging',
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791837980/shiv-shakti-carousel/carousel_sapphire_silver_cascading_canopy.jpg',
    ctaText: 'Browse Ceilings Range',
    ctaLink: '/?category=wedding&subcategory=ceilings',
    secondaryCtaText: 'Instant Event Quote',
    secondaryCtaLink: '/#quote-builder',
    titleSize: 'large',
    alignment: 'left',
    overlayOpacity: 0.4,
    sortOrder: 2,
    isActive: true,
  },
  {
    title: 'Emerald Green & Imperial Gold Grand Marquee Ceiling',
    subtitle: 'Regal two-tone pleated silk canopy with carved gold cornices, suspended flower crowns, and brass crystal chandeliers.',
    badge: 'Heritage Palace Collection',
    image: 'https://res.cloudinary.com/owbjdijm/image/upload/v1791837981/shiv-shakti-carousel/carousel_emerald_gold_imperial_marquee.jpg',
    ctaText: 'View Turnkey Wedding Staging',
    ctaLink: '/?category=wedding',
    secondaryCtaText: 'Book Consultation',
    secondaryCtaLink: '/#quote-builder',
    titleSize: 'large',
    alignment: 'center',
    overlayOpacity: 0.45,
    sortOrder: 3,
    isActive: true,
  },
];

export const carouselService = {
  /**
   * Seed default slides if table is currently empty
   */
  async ensureSeedData() {
    try {
      const count = await prisma.carouselSlide.count();
      if (count === 0) {
        for (const slide of DEFAULT_SLIDES) {
          await prisma.carouselSlide.create({ data: slide });
        }
      } else {
        // Normalize any legacy #catalog links to clean root /
        await prisma.carouselSlide.updateMany({
          where: { ctaLink: { in: ['#catalog', '/#catalog'] } },
          data: { ctaLink: '/' },
        });
        await prisma.carouselSlide.updateMany({
          where: { secondaryCtaLink: { in: ['#catalog', '/#catalog'] } },
          data: { secondaryCtaLink: '/' },
        });
      }
    } catch (e) {
      console.warn('Carousel seed check warning:', e.message);
    }
  },

  /**
   * Get active slides for public storefront (sorted by sortOrder)
   */
  async getActiveSlides() {
    await this.ensureSeedData();
    return prisma.carouselSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  /**
   * Get all slides for admin cockpit (including inactive)
   */
  async getAllSlidesAdmin() {
    await this.ensureSeedData();
    return prisma.carouselSlide.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  },

  /**
   * Get single slide by id
   */
  async getSlideById(id) {
    const slide = await prisma.carouselSlide.findUnique({ where: { id } });
    if (!slide) {
      const err = new Error('Carousel slide not found.');
      err.statusCode = 404;
      throw err;
    }
    return slide;
  },

  /**
   * Create a new slide
   */
  async createSlide(payload) {
    const {
      title,
      subtitle,
      badge,
      image,
      ctaText,
      ctaLink,
      secondaryCtaText,
      secondaryCtaLink,
      titleSize = 'large',
      alignment = 'left',
      overlayOpacity = 0.5,
      sortOrder,
      isActive = true,
    } = payload;

    if (!title || !title.trim()) {
      const err = new Error('Slide title is required.');
      err.statusCode = 400;
      throw err;
    }

    if (!image || !image.trim()) {
      const err = new Error('Slide background image URL is required.');
      err.statusCode = 400;
      throw err;
    }

    // Determine default sort order if not provided
    let order = parseInt(sortOrder, 10);
    if (isNaN(order)) {
      const highest = await prisma.carouselSlide.findFirst({
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });
      order = highest ? highest.sortOrder + 1 : 0;
    }

    return prisma.carouselSlide.create({
      data: {
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        badge: badge ? badge.trim() : null,
        image: image.trim(),
        ctaText: ctaText ? ctaText.trim() : null,
        ctaLink: ctaLink ? ctaLink.trim() : null,
        secondaryCtaText: secondaryCtaText ? secondaryCtaText.trim() : null,
        secondaryCtaLink: secondaryCtaLink ? secondaryCtaLink.trim() : null,
        titleSize: ['compact', 'regular', 'large', 'display'].includes(titleSize)
          ? titleSize
          : 'large',
        alignment: ['left', 'center', 'right'].includes(alignment)
          ? alignment
          : 'left',
        overlayOpacity: typeof overlayOpacity === 'number' ? overlayOpacity : 0.5,
        sortOrder: order,
        isActive: Boolean(isActive),
      },
    });
  },

  /**
   * Update an existing slide
   */
  async updateSlide(id, payload) {
    await this.getSlideById(id);

    const updateData = {};
    if (payload.title !== undefined) updateData.title = payload.title.trim();
    if (payload.subtitle !== undefined) updateData.subtitle = payload.subtitle ? payload.subtitle.trim() : null;
    if (payload.badge !== undefined) updateData.badge = payload.badge ? payload.badge.trim() : null;
    if (payload.image !== undefined) updateData.image = payload.image.trim();
    if (payload.ctaText !== undefined) updateData.ctaText = payload.ctaText ? payload.ctaText.trim() : null;
    if (payload.ctaLink !== undefined) updateData.ctaLink = payload.ctaLink ? payload.ctaLink.trim() : null;
    if (payload.secondaryCtaText !== undefined) updateData.secondaryCtaText = payload.secondaryCtaText ? payload.secondaryCtaText.trim() : null;
    if (payload.secondaryCtaLink !== undefined) updateData.secondaryCtaLink = payload.secondaryCtaLink ? payload.secondaryCtaLink.trim() : null;
    if (payload.titleSize !== undefined) {
      updateData.titleSize = ['compact', 'regular', 'large', 'display'].includes(payload.titleSize)
        ? payload.titleSize
        : 'large';
    }
    if (payload.alignment !== undefined) {
      updateData.alignment = ['left', 'center', 'right'].includes(payload.alignment)
        ? payload.alignment
        : 'left';
    }
    if (payload.overlayOpacity !== undefined) {
      updateData.overlayOpacity = Number(payload.overlayOpacity);
    }
    if (payload.sortOrder !== undefined) {
      updateData.sortOrder = parseInt(payload.sortOrder, 10);
    }
    if (payload.isActive !== undefined) {
      updateData.isActive = Boolean(payload.isActive);
    }

    return prisma.carouselSlide.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Delete a slide
   */
  async deleteSlide(id) {
    await this.getSlideById(id);
    return prisma.carouselSlide.delete({ where: { id } });
  },

  /**
   * Toggle slide active state
   */
  async toggleSlideActive(id) {
    const slide = await this.getSlideById(id);
    return prisma.carouselSlide.update({
      where: { id },
      data: { isActive: !slide.isActive },
    });
  },

  /**
   * Bulk reorder slides: accepts array of { id, sortOrder }
   */
  async reorderSlides(items) {
    if (!Array.isArray(items)) {
      const err = new Error('Reorder items must be an array of { id, sortOrder }.');
      err.statusCode = 400;
      throw err;
    }

    const updates = items.map((item, index) =>
      prisma.carouselSlide.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder !== undefined ? item.sortOrder : index },
      })
    );

    await prisma.$transaction(updates);
    return this.getAllSlidesAdmin();
  },
};
