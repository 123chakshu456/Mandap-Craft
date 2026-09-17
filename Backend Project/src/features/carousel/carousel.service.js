import prisma from '../../shared/config/prisma.js';

const DEFAULT_SLIDES = [
  {
    title: 'Complete Infrastructure For Royal Weddings & Grand Celebrations',
    subtitle: 'Direct source for bespoke Mandaps, German Hangar Tents, Luxury Banqueting, and Turnkey Fabrication across India.',
    badge: "India's Premier Wedding Infrastructure",
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=85',
    ctaText: 'Explore What We Offer',
    ctaLink: '#categories-showcase',
    secondaryCtaText: 'Browse Full Catalog',
    secondaryCtaLink: '#catalog',
    titleSize: 'display',
    alignment: 'left',
    overlayOpacity: 0.55,
    sortOrder: 0,
    isActive: true,
  },
  {
    title: 'Architectural German Hangars & All-Weather Superstructures',
    subtitle: 'Spanning up to 50m clear span with climate control, industrial rigging, and fire-retardant fabrication.',
    badge: 'Industrial Scale & Engineering',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1920&q=85',
    ctaText: 'View German Hangars',
    ctaLink: '#catalog',
    secondaryCtaText: 'Instant Quote',
    secondaryCtaLink: '#quote-builder',
    titleSize: 'large',
    alignment: 'center',
    overlayOpacity: 0.5,
    sortOrder: 1,
    isActive: true,
  },
  {
    title: 'Handcrafted Carved Teakwood & Royal Banquet Furniture',
    subtitle: 'Majestic Maharaja Thrones, Chiavari Suites with artisanal brass inlay, and premium velvet upholstery.',
    badge: 'Artisanal Luxury Collection',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1920&q=85',
    ctaText: 'Browse Furniture Range',
    ctaLink: '#catalog',
    secondaryCtaText: 'Custom Fabrication',
    secondaryCtaLink: '#quote-builder',
    titleSize: 'large',
    alignment: 'right',
    overlayOpacity: 0.5,
    sortOrder: 2,
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
