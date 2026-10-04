import prisma from '../../shared/config/prisma.js';
import * as xlsx from 'xlsx';
import { slugify } from '../../shared/utils/slugify.js';

// Helper to sanitize sheet names for Excel (max 31 chars, no invalid chars, unique)
function sanitizeSheetName(name, existingNames = new Set()) {
  let clean = String(name || 'Sheet')
    .replace(/[\\/?*[\]:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) clean = 'Sheet';
  if (clean.length > 31) clean = clean.substring(0, 31).trim();

  let uniqueName = clean;
  let counter = 1;
  while (existingNames.has(uniqueName.toLowerCase())) {
    const suffix = ` (${counter})`;
    const maxBaseLen = 31 - suffix.length;
    uniqueName = `${clean.substring(0, maxBaseLen).trim()}${suffix}`;
    counter++;
  }
  existingNames.add(uniqueName.toLowerCase());
  return uniqueName;
}

// Helper to auto-fit column widths
function autoFitColumns(rows) {
  if (!rows || rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys.map((key) => {
    let maxLen = key.length;
    for (const r of rows.slice(0, 60)) {
      const val = r[key];
      if (val !== null && val !== undefined) {
        const str = String(val);
        if (str.length > maxLen) maxLen = Math.min(str.length, 50);
      }
    }
    return { wch: Math.max(maxLen + 3, 10) };
  });
}

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
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Workbook contains no sheets.');
    }

    // Helper to find column case-insensitively & stripping symbols like (₹)
    const getCol = (row, ...keys) => {
      const rowKeys = Object.keys(row);
      for (const k of keys) {
        const normalized = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        const foundKey = rowKeys.find(
          (rk) => rk.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
        );
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
          return row[foundKey];
        }
      }
      return '';
    };

    // Extract product rows across sheets (skipping metadata/summary sheets)
    const rawRows = [];
    const skuRowMap = new Map();

    for (const sheetName of workbook.SheetNames) {
      if (sheetName.toLowerCase().includes('summary')) continue;
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;
      const sheetRows = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

      for (const row of sheetRows) {
        const skuVal = String(getCol(row, 'sku', 'skucode', 'itemcode', 'productcode')).trim();
        const nameVal = String(getCol(row, 'name', 'productname', 'title', 'itemname')).trim();

        if (skuVal || nameVal) {
          if (skuVal) {
            // Later category sheets override master sheet rows if duplicated
            skuRowMap.set(skuVal, { ...row, _sheetName: sheetName });
          } else {
            rawRows.push({ ...row, _sheetName: sheetName });
          }
        }
      }
    }

    const allProductRows = [...skuRowMap.values(), ...rawRows];
    if (allProductRows.length === 0) {
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const fallbackRows = firstSheet ? xlsx.utils.sheet_to_json(firstSheet, { defval: '' }) : [];
      if (fallbackRows.length === 0) {
        throw new Error('Excel file contains no product rows.');
      }
      allProductRows.push(...fallbackRows);
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

    for (let i = 0; i < allProductRows.length; i++) {
      const row = allProductRows[i];
      const rowNum = i + 2; // Excel row numbering (1 is header)

      try {
        const name = String(getCol(row, 'name', 'product name', 'title', 'item name')).trim();
        let sku = String(getCol(row, 'sku', 'skucode', 'itemcode', 'productcode')).trim();
        const rowId = String(getCol(row, 'id', 'productid')).trim();

        // 1. Look up existing product by SKU or by ID
        let existingProduct = null;
        if (sku) {
          existingProduct = await prisma.product.findUnique({
            where: { sku },
          });
        }
        if (!existingProduct && rowId) {
          existingProduct = await prisma.product.findUnique({
            where: { id: rowId },
          });
        }

        if (!name && !existingProduct) {
          errors.push({ row: rowNum, error: 'Product name is required for new items. Row skipped.' });
          continue;
        }

        const finalName = name || existingProduct.name;

        // 2. Category & Subcategory resolution
        const rowCategory = String(getCol(row, 'category', 'categoryid', 'vertical')).trim();
        const rowSubcategory = String(getCol(row, 'subcategory', 'subcategoryid', 'sub category')).trim();
        const rowSubSubcategory = String(getCol(row, 'subsubcategory', 'subsubcategoryid')).trim();

        // 3. Pricing resolution (accurately parses 'Price (₹)' and 'Compare Price (₹)')
        const rawPrice = getCol(row, 'price', 'rate', 'cost', 'mrp', 'rental price');
        let price;
        if (rawPrice !== '' && rawPrice !== null && rawPrice !== undefined) {
          price = parseFloat(String(rawPrice).replace(/[^\d.]/g, ''));
          if (isNaN(price)) price = existingProduct ? existingProduct.price : 0;
        } else if (existingProduct) {
          price = existingProduct.price;
        } else {
          price = 0;
        }

        const rawCompare = getCol(row, 'compareatprice', 'compare price', 'original price', 'regular price');
        let compareAtPrice = null;
        if (rawCompare !== '' && rawCompare !== null && rawCompare !== undefined) {
          compareAtPrice = parseFloat(String(rawCompare).replace(/[^\d.]/g, ''));
          if (isNaN(compareAtPrice)) compareAtPrice = null;
        } else if (existingProduct) {
          compareAtPrice = existingProduct.compareAtPrice;
        }

        // 4. SKU resolution
        if (!sku) {
          if (existingProduct?.sku) {
            sku = existingProduct.sku;
          } else {
            const catPrefix = (rowCategory || routeCategory || 'SKU').substring(0, 3).toUpperCase();
            sku = `SKU-${catPrefix}-${Date.now().toString().slice(-4)}${i}`;
          }
        }

        // 5. Slug resolution
        let slug = String(getCol(row, 'slug')).trim();
        if (!slug) {
          slug = existingProduct ? existingProduct.slug : `${slugify(finalName)}-${Date.now().toString().slice(-4)}${i}`;
        }

        // 6. Attributes & Descriptions
        const rowStyle = String(getCol(row, 'style', 'design style', 'theme')).trim();
        const style = rowStyle || (existingProduct ? existingProduct.style : defaultStyle);

        const rowDesc = String(getCol(row, 'description', 'desc', 'details', 'product description')).trim();
        const description = rowDesc || (existingProduct ? existingProduct.description : `${finalName} - Premium event staging rental crafted with excellence.`);

        const rowImage = String(getCol(row, 'image', 'image url', 'photo', 'picture', 'thumbnail')).trim();
        const image = rowImage || (existingProduct ? existingProduct.image : '/ceilings/traditional_ceiling_decor.jpg');

        const rowTag = String(getCol(row, 'tag', 'badge', 'label')).trim();
        const tag = rowTag !== '' ? rowTag : (existingProduct ? existingProduct.tag : null);

        const rowStatus = String(getCol(row, 'status', 'product status')).trim().toUpperCase();
        const status = rowStatus || (existingProduct ? existingProduct.status : defaultStatus);

        // 7. Features parsing
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
        const finalFeatures = features.length > 0 ? features : (existingProduct ? existingProduct.features : ['Handcrafted luxury finish', 'Engineered for rapid event setup', 'High-grade durable event materials']);

        // 8. In Stock parsing
        const rawStock = getCol(row, 'instock', 'stock', 'available');
        let inStock = existingProduct ? existingProduct.inStock : true;
        if (rawStock !== '' && rawStock !== null && rawStock !== undefined) {
          const s = String(rawStock).toLowerCase().trim();
          inStock = !(s === 'false' || s === 'no' || s === '0' || s === 'out' || s === 'outofstock');
        }

        // 9. Execute Update or Create
        if (existingProduct) {
          const categoryId = rowCategory || existingProduct.categoryId || routeCategory || 'wedding';
          const subcategoryId = rowSubcategory || (rowCategory ? null : existingProduct.subcategoryId) || routeSubcategory || null;
          const subSubcategoryId = rowSubSubcategory || (rowSubcategory ? null : existingProduct.subSubcategoryId) || routeSubSubcategory || null;

          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name: finalName,
              categoryId,
              subcategoryId,
              subSubcategoryId,
              style,
              price,
              compareAtPrice,
              description,
              features: finalFeatures,
              image,
              tag,
              status,
              inStock,
            },
          });
          updatedCount++;
        } else {
          const categoryId = rowCategory || routeCategory || 'wedding';
          const subcategoryId = rowSubcategory || routeSubcategory || null;
          const subSubcategoryId = rowSubSubcategory || routeSubSubcategory || null;

          let finalSlug = slug;
          const slugExists = await prisma.product.findUnique({ where: { slug: finalSlug } });
          if (slugExists) {
            finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
          }

          await prisma.product.create({
            data: {
              sku,
              name: finalName,
              slug: finalSlug,
              categoryId,
              subcategoryId,
              subSubcategoryId,
              style,
              price,
              compareAtPrice,
              description,
              features: finalFeatures,
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
            totalRows: allProductRows.length,
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
      totalRows: allProductRows.length,
      importedCount,
      updatedCount,
      errors,
    };
  },

  /**
   * 4. EXPORT PRODUCTS TO EXCEL (Categorized Multi-Sheet & Filtered)
   */
  async exportProductsExcel(filters = {}) {
    const where = {};

    const resolveCategoryMatch = async (value) => {
      if (!value || value === 'all') return null;
      const cats = await prisma.category.findMany({
        where: {
          OR: [{ id: value }, { slug: value }],
        },
        select: { id: true, slug: true },
      });
      if (cats.length > 0) {
        const set = new Set();
        cats.forEach((c) => {
          if (c.id) set.add(c.id);
          if (c.slug) set.add(c.slug);
        });
        return Array.from(set);
      }
      return [value];
    };

    if (filters.categoryId && filters.categoryId !== 'all') {
      const matches = await resolveCategoryMatch(filters.categoryId);
      where.categoryId = matches.length === 1 ? matches[0] : { in: matches };
    }
    if (filters.subcategoryId && filters.subcategoryId !== 'all') {
      const matches = await resolveCategoryMatch(filters.subcategoryId);
      where.subcategoryId = matches.length === 1 ? matches[0] : { in: matches };
    }
    if (filters.subSubcategoryId && filters.subSubcategoryId !== 'all') {
      const matches = await resolveCategoryMatch(filters.subSubcategoryId);
      where.subSubcategoryId = matches.length === 1 ? matches[0] : { in: matches };
    }
    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    // Load category lookup map for human-friendly names
    const allCategories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, shortTitle: true, level: true, parentId: true },
    });
    const catLookup = {};
    for (const c of allCategories) {
      const label = c.name || c.shortTitle || c.slug;
      catLookup[c.id] = label;
      catLookup[c.slug] = label;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { categoryId: 'asc' },
        { subcategoryId: 'asc' },
        { subSubcategoryId: 'asc' },
        { name: 'asc' },
      ],
    });

    const formatRows = (items) =>
      items.map((p) => {
        const catName = catLookup[p.categoryId] || p.categoryId || 'Uncategorized';
        const subName = catLookup[p.subcategoryId] || p.subcategoryId || '';
        const subSubName = catLookup[p.subSubcategoryId] || p.subSubcategoryId || '';

        return {
          'SKU': p.sku || '',
          'Product Name': p.name || '',
          'Category Name': catName,
          'Category': p.categoryId || '',
          'Subcategory Name': subName,
          'Subcategory': p.subcategoryId || '',
          'Sub-Subcategory Name': subSubName,
          'Sub-Subcategory': p.subSubcategoryId || '',
          'Style': p.style || '',
          'Price (₹)': p.price ?? 0,
          'Compare Price (₹)': p.compareAtPrice || '',
          'Status': p.status || 'PUBLISHED',
          'In Stock': p.inStock ? 'YES' : 'NO',
          'Image URL': p.image || '',
          'Description': p.description || '',
          'Features': Array.isArray(p.features) ? p.features.join(' | ') : '',
          'Tag': p.tag || '',
          'Rating': p.rating ?? 4.5,
          'Reviews': p.reviews ?? 0,
        };
      });

    const workbook = xlsx.utils.book_new();
    const sheetNames = new Set();

    const isSubcategoryExport = Boolean(filters.subcategoryId && filters.subcategoryId !== 'all');
    const isCategoryExport = Boolean(filters.categoryId && filters.categoryId !== 'all');

    if (isSubcategoryExport) {
      // Subcategory-specific export
      const subName = catLookup[filters.subcategoryId] || filters.subcategoryId;
      const subRows = formatRows(products);
      const mainSheet = xlsx.utils.json_to_sheet(subRows);
      mainSheet['!cols'] = autoFitColumns(subRows);
      xlsx.utils.book_append_sheet(workbook, mainSheet, sanitizeSheetName(`${subName} - All`, sheetNames));

      // Separate sheets by sub-subcategory if multiple exist
      const subSubGroups = {};
      for (const p of products) {
        const subSubKey = p.subSubcategoryId || 'General';
        if (!subSubGroups[subSubKey]) subSubGroups[subSubKey] = [];
        subSubGroups[subSubKey].push(p);
      }
      if (Object.keys(subSubGroups).length > 1) {
        for (const [subSubKey, items] of Object.entries(subSubGroups)) {
          const subSubName = catLookup[subSubKey] || subSubKey;
          const groupRows = formatRows(items);
          const groupSheet = xlsx.utils.json_to_sheet(groupRows);
          groupSheet['!cols'] = autoFitColumns(groupRows);
          xlsx.utils.book_append_sheet(workbook, groupSheet, sanitizeSheetName(subSubName, sheetNames));
        }
      }
    } else if (isCategoryExport) {
      // Category-specific export
      const catName = catLookup[filters.categoryId] || filters.categoryId;
      const catRows = formatRows(products);
      const mainSheet = xlsx.utils.json_to_sheet(catRows);
      mainSheet['!cols'] = autoFitColumns(catRows);
      xlsx.utils.book_append_sheet(workbook, mainSheet, sanitizeSheetName(`${catName} - All`, sheetNames));

      // Separate sheets by Subcategory
      const subGroups = {};
      for (const p of products) {
        const subKey = p.subcategoryId || 'Uncategorized';
        if (!subGroups[subKey]) subGroups[subKey] = [];
        subGroups[subKey].push(p);
      }
      if (Object.keys(subGroups).length > 1) {
        for (const [subKey, items] of Object.entries(subGroups)) {
          const subName = catLookup[subKey] || subKey;
          const groupRows = formatRows(items);
          const groupSheet = xlsx.utils.json_to_sheet(groupRows);
          groupSheet['!cols'] = autoFitColumns(groupRows);
          xlsx.utils.book_append_sheet(workbook, groupSheet, sanitizeSheetName(subName, sheetNames));
        }
      }
    } else {
      // All Categories export: Multi-Sheet Workbook
      // 1. Master sheet: All Products
      const allRows = formatRows(products);
      const masterSheet = xlsx.utils.json_to_sheet(allRows);
      masterSheet['!cols'] = autoFitColumns(allRows);
      xlsx.utils.book_append_sheet(workbook, masterSheet, sanitizeSheetName('All Products', sheetNames));

      // 2. Summary Sheet
      const catGroups = {};
      for (const p of products) {
        const cat = p.categoryId || 'Uncategorized';
        if (!catGroups[cat]) catGroups[cat] = [];
        catGroups[cat].push(p);
      }

      const summaryRows = Object.entries(catGroups).map(([catKey, items]) => {
        const catName = catLookup[catKey] || catKey;
        const subcatSet = new Set(items.map((i) => i.subcategoryId).filter(Boolean));
        const inStockCount = items.filter((i) => i.inStock).length;
        return {
          'Category Name': catName,
          'Category Code': catKey,
          'Total Products': items.length,
          'In Stock': inStockCount,
          'Out of Stock': items.length - inStockCount,
          'Total Subcategories': subcatSet.size,
        };
      });
      const summarySheet = xlsx.utils.json_to_sheet(summaryRows);
      summarySheet['!cols'] = autoFitColumns(summaryRows);
      xlsx.utils.book_append_sheet(workbook, summarySheet, sanitizeSheetName('Category Summary', sheetNames));

      // 3. Dedicated Sheet for each Category
      for (const [catKey, items] of Object.entries(catGroups)) {
        const catName = catLookup[catKey] || catKey;
        const catRows = formatRows(items);
        const catSheet = xlsx.utils.json_to_sheet(catRows);
        catSheet['!cols'] = autoFitColumns(catRows);
        const sheetName = sanitizeSheetName(catName, sheetNames);
        xlsx.utils.book_append_sheet(workbook, catSheet, sheetName);
      }
    }

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
