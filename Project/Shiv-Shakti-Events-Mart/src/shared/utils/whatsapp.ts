// =========================================================
// WhatsApp Utilities: Direct Inquiry & Viral Website Sharing
// =========================================================

export { ENABLE_WHATSAPP_CHAT } from '../../constants/featureFlags';

export const WHATSAPP_PHONE = '919876543210';
export const SALES_DIRECTOR_NAME = 'Mr. Chakshu Goyal';

export interface WhatsAppProductInquiry {
  name: string;
  sku?: string | null;
  price?: number;
  activeModel?: string;
  selectedSize?: string | number;
  categoryTitle?: string;
}

/**
 * 1. Direct Inquiry URL to merchant sales director (controlled by ENABLE_WHATSAPP_CHAT flag)
 */
export function getProductWhatsAppUrl(product: WhatsAppProductInquiry): string {
  const lines = [
    `Namaste ${SALES_DIRECTOR_NAME}! 🙏`,
    `I am inquiring about this item from Shiv Shakti Events Mart:`,
    `• Product: *${product.name}*`,
    product.sku ? `• SKU Code: ${product.sku}` : null,
    product.categoryTitle ? `• Category: ${product.categoryTitle}` : null,
    product.activeModel ? `• Variant / Model: ${product.activeModel}` : null,
    product.selectedSize ? `• Size / Dimension: ${product.selectedSize}` : null,
    product.price ? `• Listed Price: ₹${product.price.toLocaleString('en-IN')}` : null,
    ``,
    `Please share the wholesale bulk pricing, availability, and dispatch timeline. Thank you!`,
  ].filter(Boolean);

  const text = lines.join('\n');
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export interface WhatsAppProductShareOptions {
  id: string;
  sku?: string | null;
  name: string;
  price?: number;
  pricingUnit?: string;
  categoryTitle?: string;
  activeModel?: string;
  dimensionsNote?: string;
}

/**
 * Helper to construct the direct deep-link web URL for a product
 */
export function getProductShareWebUrl(id: string): string {
  if (typeof window === 'undefined') {
    return `https://shivshaktieventsmart.vercel.app/?product=${encodeURIComponent(id)}`;
  }
  return `${window.location.origin}/?product=${encodeURIComponent(id)}`;
}

/**
 * 2. Viral Share URL for WhatsApp:
 * Allows user to share the product with any friend, client, or group on WhatsApp.
 * Includes direct website link so recipients can click and view that exact product!
 */
export function getProductWhatsAppShareUrl(product: WhatsAppProductShareOptions): string {
  const productWebUrl = getProductShareWebUrl(product.id);

  const lines = [
    `✨ *Check this out on Shiv Shakti Events Mart!*`,
    ``,
    `*${product.name}*`,
    product.sku ? `🏷️ SKU: ${product.sku}` : null,
    product.categoryTitle ? `📁 Category: ${product.categoryTitle}` : null,
    product.activeModel ? `⚙️ Variant / Model: ${product.activeModel}` : null,
    product.dimensionsNote ? `📐 Size / Dimensions: ${product.dimensionsNote}` : null,
    product.price
      ? `💰 Price: ₹${product.price.toLocaleString('en-IN')}${product.pricingUnit === 'PER_SQFT' ? ' / sq.ft' : ''}`
      : null,
    ``,
    `👉 *View complete photos, specs & details on website:*`,
    productWebUrl,
  ].filter(Boolean);

  const text = lines.join('\n');
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Opens WhatsApp sharing window directly
 */
export function shareProductToWhatsApp(product: WhatsAppProductShareOptions): void {
  const url = getProductWhatsAppShareUrl(product);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export interface WhatsAppCartItem {
  name: string;
  quantity: number;
  price: number;
  dimensionsNote?: string;
}

/**
 * Merchant quote inquiry with cart items
 */
export function getCartWhatsAppUrl(items: WhatsAppCartItem[], grandTotal: number): string {
  const lines = [
    `Namaste ${SALES_DIRECTOR_NAME}! 🙏`,
    `I would like to request an official wholesale booking quote for the following items:`,
    ``,
    ...items.map((item, idx) => {
      const dim = item.dimensionsNote ? ` (${item.dimensionsNote})` : '';
      return `${idx + 1}. *${item.name}*${dim} — Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}`;
    }),
    ``,
    `*Estimated Total: ₹${grandTotal.toLocaleString('en-IN')}*`,
    ``,
    `Please share the formal invoice / GST discount quote and freight delivery timeline. Thank you!`,
  ];

  const text = lines.join('\n');
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

/**
 * Share entire cart selection with friends / clients on WhatsApp
 */
export function getCartWhatsAppShareUrl(items: WhatsAppCartItem[], grandTotal: number): string {
  const webUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shivshaktieventsmart.vercel.app';
  const lines = [
    `✨ *Event Equipment Estimate from Shiv Shakti Events Mart*`,
    ``,
    ...items.map((item, idx) => {
      const dim = item.dimensionsNote ? ` (${item.dimensionsNote})` : '';
      return `${idx + 1}. *${item.name}*${dim} — Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}`;
    }),
    ``,
    `*Estimated Total: ₹${grandTotal.toLocaleString('en-IN')}*`,
    ``,
    `👉 Explore the live inventory catalog & book here:`,
    webUrl,
  ];

  const text = lines.join('\n');
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
