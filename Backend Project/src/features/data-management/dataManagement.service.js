import prisma from '../../shared/config/prisma.js';
import * as xlsx from 'xlsx';
import { slugify } from '../../shared/utils/slugify.js';

export const dataManagementService = {
  /**
   * 1. FULL DATABASE JSON SNAPSHOT EXPORT
   */
  async generateFullBackup() {
    const [
      categories,
      filters,
      badges,
      pages,
      products,
    ] = await Promise.all([
      prisma.category.findMany({
        orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
      }),
      prisma.filter.findMany({
        include: { values: { orderBy: { sortOrder: 'asc' } } },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.badge.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.page.findMany({
        orderBy: { createdAt: 'asc' },
      }),
      prisma.product.findMany({
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          badges: true,
          filterValues: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return {
      version: '2.0.0',
      system: 'Shiv Shakti Events Mart CMS',
      exportedAt: new Date().toISOString(),
      counts: {
        categories: categories.length,
        filters: filters.length,
        badges: badges.length,
        pages: pages.length,
        products: products.length,
      },
      categories,
      filters,
      badges,
      pages,
      products,
    };
  },

  /**
   * 2. RESTORE FULL DATABASE FROM JSON SNAPSHOT
   */
  async restoreFullBackup(snapshotData, adminUser = null) {
    if (!snapshotData || (!snapshotData.products && !snapshotData.categories)) {
      throw new Error('Invalid backup file format: missing categories or products.');
    }

    const results = {
      categories: 0,
      filters: 0,
      badges: 0,
      pages: 0,
      products: 0,
    };

    // 1. Categories (Level 1, then Level 2, then Level 3)
    if (Array.isArray(snapshotData.categories)) {
      // Sort by level to ensure parents exist before children
      const sortedCategories = [...snapshotData.categories].sort((a, b) => (a.level || 1) - (b.level || 1));
      for (const cat of sortedCategories) {
        const { children, parent, ...catData } = cat;
        await prisma.category.upsert({
          where: { id: cat.id },
          update: {
            name: catData.name,
            slug: catData.slug || slugify(catData.name),
            shortTitle: catData.shortTitle,
            tagline: catData.tagline,
            description: catData.description,
            image: catData.image,
            icon: catData.icon,
            badge: catData.badge,
            promo: catData.promo || undefined,
            popularItems: catData.popularItems || undefined,
            parentId: catData.parentId || null,
            level: catData.level || 1,
            sortOrder: catData.sortOrder || 0,
            isActive: catData.isActive !== false,
          },
          create: {
            id: cat.id,
            name: catData.name,
            slug: catData.slug || slugify(catData.name),
            shortTitle: catData.shortTitle,
            tagline: catData.tagline,
            description: catData.description,
            image: catData.image,
            icon: catData.icon,
            badge: catData.badge,
            promo: catData.promo || undefined,
            popularItems: catData.popularItems || undefined,
            parentId: catData.parentId || null,
            level: catData.level || 1,
            sortOrder: catData.sortOrder || 0,
            isActive: catData.isActive !== false,
          },
        });
        results.categories++;
      }
    }

    // 2. Filters & Filter Values
    if (Array.isArray(snapshotData.filters)) {
      for (const f of snapshotData.filters) {
        const { values, ...filterData } = f;
        const upsertedFilter = await prisma.filter.upsert({
          where: { key: filterData.key },
          update: {
            name: filterData.name,
            label: filterData.label,
            type: filterData.type || 'select',
            sortOrder: filterData.sortOrder || 0,
            isActive: filterData.isActive !== false,
            applicableCategories: filterData.applicableCategories || [],
          },
          create: {
            id: filterData.id,
            name: filterData.name,
            label: filterData.label,
            key: filterData.key,
            type: filterData.type || 'select',
            sortOrder: filterData.sortOrder || 0,
            isActive: filterData.isActive !== false,
            applicableCategories: filterData.applicableCategories || [],
          },
        });
        results.filters++;

        if (Array.isArray(values)) {
          for (const val of values) {
            await prisma.filterValue.upsert({
              where: {
                filterId_value: {
                  filterId: upsertedFilter.id,
                  value: val.value,
                },
              },
              update: {
                label: val.label,
                sortOrder: val.sortOrder || 0,
              },
              create: {
                id: val.id,
                filterId: upsertedFilter.id,
                value: val.value,
                label: val.label,
                sortOrder: val.sortOrder || 0,
              },
            });
          }
        }
      }
    }

    // 3. Badges
    if (Array.isArray(snapshotData.badges)) {
      for (const b of snapshotData.badges) {
        await prisma.badge.upsert({
          where: { slug: b.slug },
          update: {
            name: b.name,
            label: b.label,
            color: b.color,
            bgColor: b.bgColor,
            icon: b.icon,
            isActive: b.isActive !== false,
            sortOrder: b.sortOrder || 0,
          },
          create: {
            id: b.id,
            name: b.name,
            slug: b.slug,
            label: b.label,
            color: b.color,
            bgColor: b.bgColor,
            icon: b.icon,
            isActive: b.isActive !== false,
            sortOrder: b.sortOrder || 0,
          },
        });
        results.badges++;
      }
    }

    // 4. Pages
    if (Array.isArray(snapshotData.pages)) {
      for (const p of snapshotData.pages) {
        await prisma.page.upsert({
          where: { slug: p.slug },
          update: {
            title: p.title,
            status: p.status || 'DRAFT',
            content: p.content,
            heroImage: p.heroImage,
            seoTitle: p.seoTitle,
            seoDescription: p.seoDescription,
            publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
          },
          create: {
            id: p.id,
            title: p.title,
            slug: p.slug,
            status: p.status || 'DRAFT',
            content: p.content,
            heroImage: p.heroImage,
            seoTitle: p.seoTitle,
            seoDescription: p.seoDescription,
            publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
          },
        });
        results.pages++;
      }
    }

    // 5. Products (in concurrent chunks of 20 for high performance)
    if (Array.isArray(snapshotData.products)) {
      const CHUNK_SIZE = 20;
      for (let i = 0; i < snapshotData.products.length; i += CHUNK_SIZE) {
        const chunk = snapshotData.products.slice(i, i + CHUNK_SIZE);
        await Promise.all(
          chunk.map(async (prod) => {
            const { images, badges: prodBadges, filterValues: prodFilterValues, ...prodFields } = prod;
            const sku = prodFields.sku || `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            const slug = prodFields.slug || slugify(prodFields.name);

            const upsertedProd = await prisma.product.upsert({
              where: { sku },
              update: {
                name: prodFields.name,
                slug,
                categoryId: prodFields.categoryId,
                subcategoryId: prodFields.subcategoryId,
                subSubcategoryId: prodFields.subSubcategoryId,
                style: prodFields.style || 'Traditional',
                price: parseFloat(prodFields.price) || 0,
                compareAtPrice: prodFields.compareAtPrice ? parseFloat(prodFields.compareAtPrice) : null,
                rating: parseFloat(prodFields.rating) || 4.5,
                reviews: parseInt(prodFields.reviews) || 0,
                image: prodFields.image || '',
                description: prodFields.description || '',
                features: prodFields.features || [],
                isFeatured: !!prodFields.isFeatured,
                tag: prodFields.tag || null,
                inStock: prodFields.inStock !== false,
                status: prodFields.status || 'PUBLISHED',
                sortPriority: parseInt(prodFields.sortPriority) || 0,
                seoTitle: prodFields.seoTitle,
                seoDescription: prodFields.seoDescription,
                seoKeywords: prodFields.seoKeywords,
              },
              create: {
                id: prod.id,
                sku,
                name: prodFields.name,
                slug,
                categoryId: prodFields.categoryId,
                subcategoryId: prodFields.subcategoryId,
                subSubcategoryId: prodFields.subSubcategoryId,
                style: prodFields.style || 'Traditional',
                price: parseFloat(prodFields.price) || 0,
                compareAtPrice: prodFields.compareAtPrice ? parseFloat(prodFields.compareAtPrice) : null,
                rating: parseFloat(prodFields.rating) || 4.5,
                reviews: parseInt(prodFields.reviews) || 0,
                image: prodFields.image || '',
                description: prodFields.description || '',
                features: prodFields.features || [],
                isFeatured: !!prodFields.isFeatured,
                tag: prodFields.tag || null,
                inStock: prodFields.inStock !== false,
                status: prodFields.status || 'PUBLISHED',
                sortPriority: parseInt(prodFields.sortPriority) || 0,
                seoTitle: prodFields.seoTitle,
                seoDescription: prodFields.seoDescription,
                seoKeywords: prodFields.seoKeywords,
              },
            });
            results.products++;

            // Restore images if provided
            if (Array.isArray(images) && images.length > 0) {
              for (const img of images) {
                await prisma.productImage.upsert({
                  where: { id: img.id },
                  update: {
                    url: img.url,
                    publicId: img.publicId,
                    altText: img.altText,
                    sortOrder: img.sortOrder || 0,
                    type: img.type || 'gallery',
                    isPrimary: !!img.isPrimary,
                  },
                  create: {
                    id: img.id,
                    productId: upsertedProd.id,
                    url: img.url,
                    publicId: img.publicId,
                    altText: img.altText,
                    sortOrder: img.sortOrder || 0,
                    type: img.type || 'gallery',
                    isPrimary: !!img.isPrimary,
                  },
                });
              }
            }
          })
        );
      }
    }

    // Record Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: adminUser?.id || null,
          userEmail: adminUser?.email || 'admin@shivshaktievents.com',
          action: 'RESTORE_DATABASE_SNAPSHOT',
          entity: 'SystemBackup',
          details: results,
        },
      });
    } catch {
      // Non-blocking
    }

    return results;
  },

  /**
   * 3. EXCEL / CSV BATCH PRODUCT IMPORTER WITH ROUTE SPECIFICATION
   */
  async parseAndImportExcel(fileBuffer, destinationRoute = {}, options = {}, adminUser = null) {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('No file data provided.');
    }

    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('Workbook contains no sheets.');
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

    if (rawRows.length === 0) {
      throw new Error('Excel file contains no product rows.');
    }

    const {
      categoryId: routeCategory,
      subcategoryId: routeSubcategory,
      subSubcategoryId: routeSubSubcategory,
    } = destinationRoute;

    const defaultStatus = options.defaultStatus || 'PUBLISHED';
    const defaultStyle = options.defaultStyle || 'Traditional';

    let importedCount = 0;
    let updatedCount = 0;
    const errors = [];

    // Helper to find column case-insensitively
    const getCol = (row, ...keys) => {
      const rowKeys = Object.keys(row);
      for (const k of keys) {
        const normalized = k.toLowerCase().replace(/[\s\-_]/g, '');
        const foundKey = rowKeys.find(
          (rk) => rk.toLowerCase().replace(/[\s\-_]/g, '') === normalized
        );
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
          return row[foundKey];
        }
      }
      return '';
    };

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowNum = i + 2; // Excel row numbering (1 is header)

      try {
        const name = String(getCol(row, 'name', 'product name', 'title', 'item name')).trim();
        if (!name) {
          errors.push({ row: rowNum, error: 'Product name is required. Row skipped.' });
          continue;
        }

        // Category & Subcategory resolution (Row overrides destination route; if row is empty, uses specified route)
        const rowCategory = String(getCol(row, 'category', 'categoryid', 'vertical')).trim();
        const rowSubcategory = String(getCol(row, 'subcategory', 'subcategoryid', 'sub category')).trim();
        const rowSubSubcategory = String(getCol(row, 'subsubcategory', 'subsubcategoryid')).trim();

        const categoryId = rowCategory || routeCategory || 'wedding';
        const subcategoryId = rowSubcategory || routeSubcategory || null;
        const subSubcategoryId = rowSubSubcategory || routeSubSubcategory || null;

        // Pricing
        const rawPrice = getCol(row, 'price', 'rate', 'cost', 'mrp', 'rental price');
        const price = parseFloat(String(rawPrice).replace(/[^\d.]/g, '')) || 0;

        const rawCompare = getCol(row, 'compareatprice', 'compare price', 'original price', 'regular price');
        const compareAtPrice = rawCompare ? parseFloat(String(rawCompare).replace(/[^\d.]/g, '')) : null;

        // SKU resolution
        let sku = String(getCol(row, 'sku', 'skucode', 'itemcode', 'productcode')).trim();
        if (!sku) {
          const catPrefix = categoryId.substring(0, 3).toUpperCase();
          sku = `SKU-${catPrefix}-${Date.now().toString().slice(-4)}${i}`;
        }

        // Slug resolution
        let slug = String(getCol(row, 'slug')).trim();
        if (!slug) {
          slug = `${slugify(name)}-${Date.now().toString().slice(-4)}${i}`;
        }

        const style = String(getCol(row, 'style', 'design style', 'theme')).trim() || defaultStyle;
        const description = String(getCol(row, 'description', 'desc', 'details', 'product description')).trim() || `${name} - Premium event staging rental crafted with excellence.`;
        const image = String(getCol(row, 'image', 'image url', 'photo', 'picture', 'thumbnail')).trim() || '/ceilings/traditional_ceiling_decor.jpg';
        const tag = String(getCol(row, 'tag', 'badge', 'label')).trim() || null;
        const status = String(getCol(row, 'status', 'product status')).trim().toUpperCase() || defaultStatus;

        // Features parsing (supports comma, pipe, semicolon, or newline separated)
        const rawFeatures = getCol(row, 'features', 'specifications', 'specs', 'highlights');
        let features = [];
        if (Array.isArray(rawFeatures)) {
          features = rawFeatures;
        } else if (typeof rawFeatures === 'string' && rawFeatures.trim()) {
          features = rawFeatures
            .split(/[|\n;]+/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (features.length === 0) {
            features = rawFeatures.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        if (features.length === 0) {
          features = ['Handcrafted luxury finish', 'Engineered for rapid event setup', 'High-grade durable event materials'];
        }

        // In Stock parsing
        const rawStock = String(getCol(row, 'instock', 'stock', 'available')).toLowerCase().trim();
        const inStock = rawStock === 'false' || rawStock === 'no' || rawStock === '0' ? false : true;

        // Check if SKU exists
        const existingProduct = await prisma.product.findUnique({
          where: { sku },
        });

        if (existingProduct) {
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name,
              categoryId,
              subcategoryId,
              subSubcategoryId,
              style,
              price,
              compareAtPrice,
              description,
              features,
              image,
              tag,
              status,
              inStock,
            },
          });
          updatedCount++;
        } else {
          // Check if slug is unique
          let finalSlug = slug;
          const slugExists = await prisma.product.findUnique({ where: { slug: finalSlug } });
          if (slugExists) {
            finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
          }

          const created = await prisma.product.create({
            data: {
              sku,
              name,
              slug: finalSlug,
              categoryId,
              subcategoryId,
              subSubcategoryId,
              style,
              price,
              compareAtPrice,
              description,
              features,
              image,
              tag,
              status,
              inStock,
              rating: 4.8,
              reviews: 12,
              images: {
                create: [
                  {
                    url: image,
                    isPrimary: true,
                    sortOrder: 0,
                    type: 'gallery',
                  },
                ],
              },
            },
          });
          importedCount++;
        }
      } catch (rowErr) {
        errors.push({ row: rowNum, error: rowErr.message });
      }
    }

    // Record Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: adminUser?.id || null,
          userEmail: adminUser?.email || 'admin@shivshaktievents.com',
          action: 'IMPORT_EXCEL_PRODUCTS',
          entity: 'Product',
          details: {
            totalRows: rawRows.length,
            importedCount,
            updatedCount,
            destinationRoute,
            errorsCount: errors.length,
          },
        },
      });
    } catch {
      // Non-blocking
    }

    return {
      totalRows: rawRows.length,
      importedCount,
      updatedCount,
      errors,
    };
  },

  /**
   * 4. EXPORT ALL PRODUCTS TO EXCEL
   */
  async exportProductsExcel(filters = {}) {
    const where = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.subcategoryId) where.subcategoryId = filters.subcategoryId;
    if (filters.status) where.status = filters.status;

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
    });

    const exportRows = products.map((p) => ({
      'SKU': p.sku,
      'Product Name': p.name,
      'Category': p.categoryId,
      'Subcategory': p.subcategoryId || '',
      'Sub-Subcategory': p.subSubcategoryId || '',
      'Style': p.style,
      'Price (₹)': p.price,
      'Compare Price (₹)': p.compareAtPrice || '',
      'Status': p.status,
      'In Stock': p.inStock ? 'YES' : 'NO',
      'Image URL': p.image,
      'Description': p.description,
      'Features': Array.isArray(p.features) ? p.features.join(' | ') : '',
      'Tag': p.tag || '',
      'Rating': p.rating,
      'Reviews': p.reviews,
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportRows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  },

  /**
   * 5. GENERATE SAMPLE EXCEL TEMPLATE
   */
  async generateExcelTemplate() {
    const sampleRows = [
      {
        'SKU': 'SKU-WED-SAMPLE01',
        'Product Name': 'Royal Golden Carved Mandap Pillar Set',
        'Category': 'wedding',
        'Subcategory': 'mandaps',
        'Sub-Subcategory': 'royal-carved-teak-mandaps',
        'Style': 'Royal',
        'Price (₹)': 45000,
        'Compare Price (₹)': 55000,
        'Status': 'PUBLISHED',
        'In Stock': 'YES',
        'Image URL': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80',
        'Description': 'Four-pillar intricately carved royal teakwood mandap with antique gold foil leaf finish.',
        'Features': 'Carved teakwood structure | Antique gold foil finish | Heavy-duty steel base plates | Rapid assembly',
        'Tag': 'Royal Collection',
      },
      {
        'SKU': 'SKU-WED-SAMPLE02',
        'Product Name': 'Triple-Tier Scalloped Velvet Mandap Ceiling',
        'Category': 'wedding',
        'Subcategory': 'ceilings',
        'Sub-Subcategory': 'scalloped-velvet-ceilings',
        'Style': 'Traditional',
        'Price (₹)': 75000,
        'Compare Price (₹)': 90000,
        'Status': 'PUBLISHED',
        'In Stock': 'YES',
        'Image URL': '/ceilings/traditional_ceiling_decor.jpg',
        'Description': 'Authentic scalloped concentric ruffled ceiling canopy with rich crimson and royal yellow silk layers.',
        'Features': 'Concentric scalloped ruffles | Heavy stain-resistant velvet | Tailored for all frame sizes',
        'Tag': 'Original Masterpiece',
      },
      {
        'SKU': 'SKU-FURN-SAMPLE03',
        'Product Name': 'Maharaja High-Back Gold Carved Throne Chair',
        'Category': 'furniture',
        'Subcategory': 'chairs',
        'Sub-Subcategory': '',
        'Style': 'Royal',
        'Price (₹)': 18000,
        'Compare Price (₹)': 22000,
        'Status': 'PUBLISHED',
        'In Stock': 'YES',
        'Image URL': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
        'Description': 'Hand-carved lion motif bride & groom throne chairs cushioned in crimson velvet.',
        'Features': 'Solid wood frame | High-density memory foam | Gold leaf gilding',
        'Tag': 'Bestseller',
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(sampleRows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Product Template');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  },

  /**
   * 6. RESTORE MASTER BASELINE CATALOG DIRECTLY FROM SEED SCRIPTS
   */
  async restoreMasterBaseline(adminUser = null) {
    const { readFileSync, existsSync } = await import('fs');
    const { join, dirname } = await import('path');
    const { fileURLToPath } = await import('url');

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const jsonPath = join(__dirname, '../../scripts/products_seed.json');

    if (!existsSync(jsonPath)) {
      throw new Error('Static master seed file (products_seed.json) has been removed from repository. Catalog products are managed dynamically via the Admin Dashboard or Excel Import.');
    }

    const CATALOG_PRODUCTS = JSON.parse(readFileSync(jsonPath, 'utf8'));

    let inserted = 0;
    let updated = 0;

    for (const p of CATALOG_PRODUCTS) {
      const sku = p.sku || `SKU-${slugify(p.name).substring(0, 15).toUpperCase()}`;
      const slug = p.slug || slugify(p.name);

      const exists = await prisma.product.findFirst({
        where: { OR: [{ sku }, { name: p.name }] },
      });

      if (exists) {
        await prisma.product.update({
          where: { id: exists.id },
          data: {
            name: p.name,
            categoryId: p.categoryId,
            subcategoryId: p.subcategoryId,
            style: p.style || 'Traditional',
            price: parseFloat(p.price) || 0,
            rating: parseFloat(p.rating) || 4.5,
            reviews: parseInt(p.reviews) || 0,
            image: p.image || '',
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features : [],
            isFeatured: !!p.isFeatured,
            tag: p.tag || null,
            inStock: true,
          },
        });
        updated++;
      } else {
        await prisma.product.create({
          data: {
            sku,
            name: p.name,
            slug,
            categoryId: p.categoryId,
            subcategoryId: p.subcategoryId,
            style: p.style || 'Traditional',
            price: parseFloat(p.price) || 0,
            rating: parseFloat(p.rating) || 4.5,
            reviews: parseInt(p.reviews) || 0,
            image: p.image || '',
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features : [],
            isFeatured: !!p.isFeatured,
            tag: p.tag || null,
            inStock: true,
            status: 'PUBLISHED',
            images: {
              create: [
                {
                  url: p.image || '',
                  isPrimary: true,
                  sortOrder: 0,
                  type: 'gallery',
                },
              ],
            },
          },
        });
        inserted++;
      }
    }

    // Record Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: adminUser?.id || null,
          userEmail: adminUser?.email || 'admin@shivshaktievents.com',
          action: 'RESTORE_MASTER_BASELINE',
          entity: 'Product',
          details: { inserted, updated, total: CATALOG_PRODUCTS.length },
        },
      });
    } catch {
      // Non-blocking
    }

    return { inserted, updated, total: CATALOG_PRODUCTS.length };
  },
};

export default dataManagementService;
