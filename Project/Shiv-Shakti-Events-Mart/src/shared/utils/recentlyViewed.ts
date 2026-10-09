// =========================================================
// Recently Viewed Products Helper
// Caches non-sensitive public product summaries in localStorage
// =========================================================

export interface ViewedProductSummary {
  id: string;
  sku?: string | null;
  name: string;
  price: number;
  image: string;
  categoryId?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  timestamp: number;
}

const STORAGE_KEY = 'shiv_shakti_recently_viewed';
const MAX_RECENT_ITEMS = 8;

export function getRecentlyViewed(): ViewedProductSummary[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(product: {
  id: string;
  sku?: string | null;
  name: string;
  price?: number;
  image?: string;
  images?: any[];
  categoryId?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
}): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage || !product?.id) return;
    const current = getRecentlyViewed();

    // Extract first image
    let firstImage = product.image || '';
    if (!firstImage && Array.isArray(product.images) && product.images.length > 0) {
      firstImage = typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || '';
    }

    const newEntry: ViewedProductSummary = {
      id: product.id,
      sku: product.sku || null,
      name: product.name,
      price: product.price || 0,
      image: firstImage,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      subSubcategoryId: product.subSubcategoryId,
      timestamp: Date.now(),
    };

    // Filter out previous occurrence if present, place new entry at front
    const updated = [newEntry, ...current.filter((item) => item.id !== product.id)].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch a custom event so listener components can re-render immediately
    window.dispatchEvent(new Event('recently_viewed_updated'));
  } catch (err) {
    console.warn('Failed to save recently viewed product:', err);
  }
}

export function clearRecentlyViewed(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('recently_viewed_updated'));
    }
  } catch {
    // Ignore
  }
}
