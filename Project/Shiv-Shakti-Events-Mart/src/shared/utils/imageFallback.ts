import type React from 'react';

/**
 * High-definition luxury SVG placeholder for Shiv Shakti Events Mart products
 */
export const DEFAULT_PRODUCT_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" fill="none">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#bg)" />
  <rect x="20" y="20" width="560" height="410" rx="12" stroke="#334155" stroke-dasharray="8 8" stroke-width="2" />
  <g transform="translate(300, 200)">
    <!-- Palace / Mandap Arch Icon -->
    <path d="M-40,30 L-40,-10 C-40,-45 40,-45 40,-10 L40,30 Z" stroke="url(#gold)" stroke-width="4" fill="none" />
    <path d="M-25,30 L-25,0 C-25,-25 25,-25 25,0 L25,30 Z" stroke="url(#gold)" stroke-width="2" fill="none" opacity="0.6" />
    <circle cx="0" cy="-35" r="5" fill="url(#gold)" />
    <!-- Pillars -->
    <line x1="-50" y1="30" x2="50" y2="30" stroke="url(#gold)" stroke-width="4" stroke-linecap="round" />
  </g>
  <text x="300" y="275" font-family="'Inter', -apple-system, sans-serif" font-size="18" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="1">
    SHIV SHAKTI EVENTS MART
  </text>
  <text x="300" y="302" font-family="'Inter', -apple-system, sans-serif" font-size="13" font-weight="500" fill="#94a3b8" text-anchor="middle" letter-spacing="0.5">
    Luxury Event Staging &amp; Bespoke Infrastructure
  </text>
</svg>
`);

/**
 * Event handler that replaces broken image URLs with the luxury placeholder
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src !== DEFAULT_PRODUCT_IMAGE) {
    target.onerror = null; // Prevent loop
    target.src = DEFAULT_PRODUCT_IMAGE;
  }
};

export default handleImageError;
