import { useState, useEffect, useCallback, useRef } from 'react';
import { productApi } from '../services/productApi';
import type { Product } from '../../../shared/types/models.types';

// In-memory cache so the products list isn't re-fetched on every navigation
let cachedProducts: Product[] = [];
let cacheTime: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  totalCount: number;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(cachedProducts);
  const [isLoading, setIsLoading] = useState(cachedProducts.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(cachedProducts.length);
  const isMounted = useRef(true);

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    // Use cache if still fresh
    if (!forceRefresh && cachedProducts.length > 0 && Date.now() - cacheTime < CACHE_TTL_MS) {
      setProducts(cachedProducts);
      setTotalCount(cachedProducts.length);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all products (up to 2000)
      const result = await productApi.getAll({ limit: 2000 });
      if (isMounted.current) {
        cachedProducts = result.products;
        cacheTime = Date.now();
        setProducts(result.products);
        setTotalCount(result.total);
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.message || 'Failed to load products');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchProducts();
    return () => { isMounted.current = false; };
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    cacheTime = 0; // invalidate cache
    fetchProducts(true);
  }, [fetchProducts]);

  return { products, isLoading, error, refetch, totalCount };
}

// Utility to invalidate the product cache (call after admin adds/edits/deletes)
export function invalidateProductCache() {
  cachedProducts = [];
  cacheTime = 0;
}

export default useProducts;
