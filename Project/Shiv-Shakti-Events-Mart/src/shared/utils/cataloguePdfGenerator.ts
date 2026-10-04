// =========================================================================
// CATALOGUE PDF BROCHURE GENERATOR
// Produces clean, print-ready A4 PDF specifications documents with NO PRICING.
// Ideal for B2B event managers, planners, and clients.
// =========================================================================

import type { Product } from '../types/models.types';

export interface GenerateCataloguePdfOptions {
  categoryTitle: string;
  categoryTagline?: string;
  categoryIcon?: string;
  products: Product[];
  companyDetails?: {
    name: string;
    tagline: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    website: string;
  };
}

const DEFAULT_COMPANY_DETAILS = {
  name: 'SHIV SHAKTI EVENTS MART',
  tagline: 'Bespoke Wedding Infrastructure, Luxury Furnishings & Commercial Catering Machinery',
  contactPerson: 'Mr. Chakshu Goyal (Founder & Chief Event Infrastructure Director)',
  phone: '+91 98765 43210',
  email: '123chakshu456@gmail.com',
  address: 'Shiv Shakti Events Mart Works, Industrial Area, Ring Road, Jaipur, Rajasthan 302013',
  website: 'https://shivshaktieventsmart.vercel.app',
};

/**
 * Builds the standalone, print-optimized HTML string for the catalogue brochure.
 * STRICT POLICY: NO PRICES OR RATES are included anywhere in this document.
 */
export function buildCatalogueHtml(options: GenerateCataloguePdfOptions): string {
  const {
    categoryTitle,
    categoryTagline = 'Official Equipment & Infrastructure Specification Catalogue',
    categoryIcon = '👑',
    products,
    companyDetails = DEFAULT_COMPANY_DETAILS,
  } = options;

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const productCardsHtml = products
    .map((product, index) => {
      const features = Array.isArray(product.features) ? product.features : [];
      const imageSrc = product.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80';
      const sku = product.sku || `SKU-${product.id.slice(0, 6).toUpperCase()}`;
      const style = product.style || 'Commercial Luxury';

      // Technical dimensions & specifications
      const specsList: string[] = [];
      if (product.minSqFt && product.maxSqFt) {
        specsList.push(`<strong>Staging Area:</strong> ${product.minSqFt} – ${product.maxSqFt} sq.ft (Default: ${product.defaultSqFt || product.minSqFt} sq.ft)`);
      } else if (product.presetSizes && product.presetSizes.length > 0) {
        specsList.push(`<strong>Available Preset Sizes:</strong> ${product.presetSizes.join(', ')} sq.ft`);
      }

      if (product.pricingUnit) {
        specsList.push(`<strong>Infrastructure Type:</strong> ${product.pricingUnit === 'PER_SQFT' ? 'Modular Scalable Rigging' : 'Standard Turnkey Unit'}`);
      }

      return `
        <div class="product-card">
          <div class="product-card-index">#${index + 1}</div>
          <div class="product-image-col">
            <img src="${imageSrc}" alt="${escapeHtml(product.name)}" loading="lazy" />
          </div>
          <div class="product-info-col">
            <div class="product-badge-row">
              <span class="sku-pill">${escapeHtml(sku)}</span>
              <span class="style-pill">${escapeHtml(style)}</span>
              ${product.subcategoryId ? `<span class="sub-pill">${escapeHtml(product.subcategoryId)}</span>` : ''}
            </div>

            <h3 class="product-name">${escapeHtml(product.name)}</h3>

            ${product.description ? `<p class="product-desc">${escapeHtml(product.description)}</p>` : ''}

            ${specsList.length > 0 ? `
              <div class="product-specs-box">
                ${specsList.map(s => `<div class="spec-row">${s}</div>`).join('')}
              </div>
            ` : ''}

            ${features.length > 0 ? `
              <div class="features-block">
                <span class="features-label">Key Specifications &amp; Build Highlights:</span>
                <ul class="features-list">
                  ${features.map(f => `<li>${escapeHtml(String(f))}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(categoryTitle)} Specification Catalogue — ${escapeHtml(companyDetails.name)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 14mm 16mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11pt;
      line-height: 1.45;
    }

    /* Print-Only Controls */
    .no-print-bar {
      position: sticky;
      top: 0;
      background: #0f2f2f;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      z-index: 9999;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .no-print-bar button {
      background: #d4af37;
      color: #0f2f2f;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }

    .no-print-bar button:hover {
      background: #e5c158;
    }

    @media print {
      .no-print-bar {
        display: none !important;
      }
    }

    .catalogue-wrapper {
      max-width: 820px;
      margin: 0 auto;
      padding: 16px 20px;
    }

    /* Cover / Letterhead */
    .catalogue-header {
      border-bottom: 2.5px solid #d4af37;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }

    .brand-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 8px;
    }

    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 21pt;
      font-weight: 800;
      color: #0f2f2f;
      letter-spacing: 0.05em;
      margin: 0;
      line-height: 1.1;
    }

    .brand-tagline {
      font-size: 9pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: 3px;
    }

    .confidential-badge {
      background: #fdf8ed;
      border: 1px solid #d4af37;
      color: #92400e;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      white-space: nowrap;
    }

    .contact-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 8.5pt;
      color: #334155;
      background: #f8fafc;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      margin-top: 8px;
    }

    .contact-item strong {
      color: #0f2f2f;
    }

    /* Category Title Banner */
    .category-banner {
      background: linear-gradient(135deg, #0f2f2f, #1b4b4b);
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-left: 5px solid #d4af37;
    }

    .category-banner-left h2 {
      margin: 0;
      font-family: 'Cinzel', serif;
      font-size: 15pt;
      font-weight: 700;
      letter-spacing: 0.03em;
      color: #fdf8ed;
    }

    .category-banner-left p {
      margin: 3px 0 0;
      font-size: 9pt;
      color: #cbd5e1;
    }

    .category-banner-right {
      text-align: right;
      font-size: 8.5pt;
      color: #cbd5e1;
    }

    .category-banner-right strong {
      font-size: 12pt;
      color: #d4af37;
      display: block;
    }

    /* Product Cards */
    .products-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .product-card {
      display: flex;
      gap: 16px;
      padding: 14px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      position: relative;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .product-card-index {
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 8.5pt;
      font-weight: 800;
      color: #94a3b8;
    }

    .product-image-col {
      width: 140px;
      height: 140px;
      flex-shrink: 0;
      border-radius: 6px;
      overflow: hidden;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
    }

    .product-image-col img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .product-info-col {
      flex: 1;
      min-width: 0;
    }

    .product-badge-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      flex-wrap: wrap;
    }

    .sku-pill {
      font-size: 7.5pt;
      font-weight: 800;
      background: #0f2f2f;
      color: #d4af37;
      padding: 1.5px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .style-pill {
      font-size: 7.5pt;
      font-weight: 700;
      background: #f1f5f9;
      color: #475569;
      padding: 1.5px 6px;
      border-radius: 3px;
      border: 1px solid #cbd5e1;
    }

    .sub-pill {
      font-size: 7.5pt;
      font-weight: 600;
      background: #eef2ff;
      color: #3730a3;
      padding: 1.5px 6px;
      border-radius: 3px;
    }

    .product-name {
      margin: 0 0 4px;
      font-family: 'Cinzel', serif;
      font-size: 12pt;
      font-weight: 700;
      color: #0f2f2f;
      line-height: 1.25;
    }

    .product-desc {
      margin: 0 0 6px;
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.35;
    }

    .product-specs-box {
      background: #f8fafc;
      border-left: 3px solid #d4af37;
      padding: 4px 8px;
      font-size: 8pt;
      color: #1e293b;
      margin-bottom: 6px;
      border-radius: 0 4px 4px 0;
    }

    .spec-row {
      margin-bottom: 2px;
    }

    .spec-row:last-child {
      margin-bottom: 0;
    }

    .features-block {
      margin-top: 4px;
    }

    .features-label {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      display: block;
      margin-bottom: 2px;
      letter-spacing: 0.04em;
    }

    .features-list {
      margin: 0;
      padding-left: 14px;
      font-size: 8pt;
      color: #334155;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 10px;
    }

    .features-list li {
      margin: 0;
      line-height: 1.3;
    }

    /* Notice & Footer */
    .catalogue-footer {
      margin-top: 24px;
      padding-top: 14px;
      border-top: 1.5px solid #cbd5e1;
      text-align: center;
      font-size: 8pt;
      color: #64748b;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .footer-booking-box {
      background: #fdf8ed;
      border: 1px dashed #d4af37;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 12px;
      color: #78350f;
      font-size: 8.5pt;
    }

    .footer-booking-box strong {
      color: #0f2f2f;
    }
  </style>
</head>
<body>

  <div class="no-print-bar">
    <div>
      <strong>Shiv Shakti Events Mart</strong> — ${escapeHtml(categoryTitle)} Specification Catalogue (${products.length} Products, Specs Only)
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.print()">🖨️ Save as PDF / Print</button>
      <button onclick="window.close()" style="background: rgba(255,255,255,0.2); color: #fff;">Close Window</button>
    </div>
  </div>

  <div class="catalogue-wrapper">

    <!-- HEADER / LETTERHEAD -->
    <header class="catalogue-header">
      <div class="brand-top-row">
        <div>
          <h1 class="brand-title">${escapeHtml(companyDetails.name)}</h1>
          <div class="brand-tagline">${escapeHtml(companyDetails.tagline)}</div>
        </div>
        <div class="confidential-badge">
          Specs Only • Client Presentation
        </div>
      </div>

      <div class="contact-strip">
        <div class="contact-item"><strong>Works &amp; Factory:</strong> ${escapeHtml(companyDetails.address)}</div>
        <div class="contact-item"><strong>Director:</strong> ${escapeHtml(companyDetails.contactPerson)}</div>
        <div class="contact-item"><strong>Date:</strong> ${escapeHtml(dateStr)}</div>
      </div>
    </header>

    <!-- CATEGORY BANNER -->
    <div class="category-banner">
      <div class="category-banner-left">
        <h2>${escapeHtml(categoryIcon)} ${escapeHtml(categoryTitle.toUpperCase())}</h2>
        <p>${escapeHtml(categoryTagline)}</p>
      </div>
      <div class="category-banner-right">
        Total Items Included:
        <strong>${products.length} Products</strong>
      </div>
    </div>

    <!-- PRODUCTS LIST -->
    <div class="products-container">
      ${productCardsHtml}
    </div>

    <!-- FOOTER & BOOKING INSTRUCTIONS -->
    <footer class="catalogue-footer">
      <div class="footer-booking-box">
        <strong>Direct Fabrication &amp; Staging Enquiries:</strong>
        To check availability, confirm event staging dates, or request custom modifications for any item in this catalogue, please quote the corresponding <strong>SKU code</strong> to <strong>${escapeHtml(companyDetails.contactPerson)}</strong> at <strong>${escapeHtml(companyDetails.phone)}</strong>.
      </div>
      <p>
        © ${new Date().getFullYear()} ${escapeHtml(companyDetails.name)} Pvt Ltd. All specifications, dimensions &amp; architectural designs are proprietary.
        <br>Official Portal: ${escapeHtml(companyDetails.website)}
      </p>
    </footer>

  </div>

  <script>
    // Automatically trigger print dialog on desktop if loaded directly
    window.addEventListener('DOMContentLoaded', () => {
      // Small timeout to allow images to settle
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
}

/**
 * Triggers the browser print-to-PDF flow in a new pop-up window with instant rendering.
 */
export function triggerCataloguePdfDownload(options: GenerateCataloguePdfOptions): void {
  const html = buildCatalogueHtml(options);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  // Open in a new tab/window for printing
  const printWindow = window.open(blobUrl, '_blank');
  if (!printWindow) {
    // If popup was blocked, fallback to creating an anchor download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `shiv-shakti-${slugify(options.categoryTitle)}-catalogue.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
