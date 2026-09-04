import { useState, useEffect, useCallback, useRef } from 'react';
import { categoryApi } from '../services/categoryApi';
import { CATEGORIES as FALLBACK_CATEGORIES } from '../../../constants';
import type { Category } from '../../../shared/types/models.types';

export interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchCategories = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await categoryApi.getPublicTree(forceRefresh);
      if (isMounted.current) {
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(FALLBACK_CATEGORIES as any);
        }
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.message || 'Failed to load categories');
        setCategories(FALLBACK_CATEGORIES as any);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchCategories();
    return () => {
      isMounted.current = false;
    };
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch };
}

export default useCategories;
