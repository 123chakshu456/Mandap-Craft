import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderInput,
  Eye,
  EyeOff,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { productApi } from '../../products/services/productApi';
import { categoryApi } from '../../categories/services/categoryApi';
import { badgeApi } from '../../badges/services/badgeApi';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import { Modal } from '../../../shared/components/Modal/Modal';
import { CommonLoader, CommonError } from '../../../shared/components/CommonLoader';
import type { Product, Category, Badge } from '../../../shared/types/models.types';

type SortField = 'name' | 'sku' | 'price' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const STORAGE_KEYS = {
  CATEGORY: 'admin_products_filter_category',
  SUBCATEGORY: 'admin_products_filter_subcategory',
  SUBSUBCATEGORY: 'admin_products_filter_subsubcategory',
  STATUS: 'admin_products_filter_status',
  BADGE: 'admin_products_filter_badge',
  DATE_PRESET: 'admin_products_filter_date_preset',
  SEARCH: 'admin_products_filter_search',
  PAGE: 'admin_products_filter_page',
  SORT_FIELD: 'admin_products_sort_field',
  SORT_DIRECTION: 'admin_products_sort_direction',
};

const getInitialFilter = (paramKey: string, storageKey: string, defaultValue: string) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(paramKey);
    if (fromUrl !== null && fromUrl !== '') {
      return fromUrl;
    }
    const fromStorage = localStorage.getItem(storageKey);
    if (fromStorage !== null && fromStorage !== '') {
      return fromStorage;
    }
  } catch (e) {
    console.error('Error reading filter persistence:', e);
  }
  return defaultValue;
};

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<number>(() => {
    const p = getInitialFilter('page', STORAGE_KEYS.PAGE, '1');
    const num = parseInt(p, 10);
    return isNaN(num) || num < 1 ? 1 : num;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters with persistence across page reloads & SKU edits
  const [searchInput, setSearchInput] = useState(() =>
    getInitialFilter('search', STORAGE_KEYS.SEARCH, '')
  );
  const [debouncedSearch, setDebouncedSearch] = useState(() =>
    getInitialFilter('search', STORAGE_KEYS.SEARCH, '')
  );
  const [selectedCategory, setSelectedCategory] = useState(() =>
    getInitialFilter('category', STORAGE_KEYS.CATEGORY, 'all')
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(() =>
    getInitialFilter('subcategory', STORAGE_KEYS.SUBCATEGORY, 'all')
  );
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(() =>
    getInitialFilter('subsubcategory', STORAGE_KEYS.SUBSUBCATEGORY, 'all')
  );
  const [selectedStatus, setSelectedStatus] = useState(() =>
    getInitialFilter('status', STORAGE_KEYS.STATUS, 'all')
  );
  const [selectedBadge, setSelectedBadge] = useState(() =>
    getInitialFilter('badge', STORAGE_KEYS.BADGE, 'all')
  );
  const [selectedDatePreset, setSelectedDatePreset] = useState<'all' | 'today' | '7d' | '30d' | 'month'>(() => {
    const val = getInitialFilter('date', STORAGE_KEYS.DATE_PRESET, 'all');
    return ['all', 'today', '7d', '30d', 'month'].includes(val) ? (val as any) : 'all';
  });

  // Sorting - default to newest uploaded SKUs
  const [sortField, setSortField] = useState<SortField>(() => {
    const sf = getInitialFilter('sortBy', STORAGE_KEYS.SORT_FIELD, 'createdAt');
    return ['name', 'sku', 'price', 'status', 'createdAt', 'updatedAt'].includes(sf) ? (sf as any) : 'createdAt';
  });
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    const sd = getInitialFilter('sortOrder', STORAGE_KEYS.SORT_DIRECTION, 'desc');
    return sd === 'asc' ? 'asc' : 'desc';
  });

  // Bulk Selection & Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkCategoryModal, setShowBulkCategoryModal] = useState(false);
  const [bulkTargetCategoryId, setBulkTargetCategoryId] = useState('');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Single Delete Target
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      if (searchInput !== debouncedSearch) {
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Synchronize state changes to URL query params and localStorage
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
      localStorage.setItem(STORAGE_KEYS.CATEGORY, selectedCategory);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CATEGORY);
    }

    if (selectedSubcategory !== 'all') {
      params.set('subcategory', selectedSubcategory);
      localStorage.setItem(STORAGE_KEYS.SUBCATEGORY, selectedSubcategory);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUBCATEGORY);
    }

    if (selectedSubSubcategory !== 'all') {
      params.set('subsubcategory', selectedSubSubcategory);
      localStorage.setItem(STORAGE_KEYS.SUBSUBCATEGORY, selectedSubSubcategory);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUBSUBCATEGORY);
    }

    if (selectedStatus !== 'all') {
      params.set('status', selectedStatus);
      localStorage.setItem(STORAGE_KEYS.STATUS, selectedStatus);
    } else {
      localStorage.removeItem(STORAGE_KEYS.STATUS);
    }

    if (selectedBadge !== 'all') {
      params.set('badge', selectedBadge);
      localStorage.setItem(STORAGE_KEYS.BADGE, selectedBadge);
    } else {
      localStorage.removeItem(STORAGE_KEYS.BADGE);
    }

    if (selectedDatePreset !== 'all') {
      params.set('date', selectedDatePreset);
      localStorage.setItem(STORAGE_KEYS.DATE_PRESET, selectedDatePreset);
    } else {
      localStorage.removeItem(STORAGE_KEYS.DATE_PRESET);
    }

    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
      localStorage.setItem(STORAGE_KEYS.SEARCH, debouncedSearch.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.SEARCH);
    }

    if (page > 1) {
      params.set('page', String(page));
      localStorage.setItem(STORAGE_KEYS.PAGE, String(page));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PAGE);
    }

    if (sortField !== 'createdAt') {
      params.set('sortBy', sortField);
      localStorage.setItem(STORAGE_KEYS.SORT_FIELD, sortField);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SORT_FIELD);
    }

    if (sortDirection !== 'desc') {
      params.set('sortOrder', sortDirection);
      localStorage.setItem(STORAGE_KEYS.SORT_DIRECTION, sortDirection);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SORT_DIRECTION);
    }

    const currentQuery = searchParams.toString();
    const newQuery = params.toString();
    if (currentQuery !== newQuery) {
      setSearchParams(params, { replace: true });
    }
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedSubSubcategory,
    selectedStatus,
    selectedBadge,
    selectedDatePreset,
    debouncedSearch,
    page,
    sortField,
    sortDirection,
  ]);

  // Handle browser Back / Forward history transitions
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'all';
    const urlSub = searchParams.get('subcategory') || 'all';
    const urlSubSub = searchParams.get('subsubcategory') || 'all';
    const urlStatus = searchParams.get('status') || 'all';
    const urlBadge = searchParams.get('badge') || 'all';
    const urlDate = searchParams.get('date') || 'all';
    const urlSearch = searchParams.get('search') || '';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlSortField = (searchParams.get('sortBy') as SortField) || 'createdAt';
    const urlSortDir = (searchParams.get('sortOrder') as SortDirection) || 'desc';

    if (urlCat !== selectedCategory) setSelectedCategory(urlCat);
    if (urlSub !== selectedSubcategory) setSelectedSubcategory(urlSub);
    if (urlSubSub !== selectedSubSubcategory) setSelectedSubSubcategory(urlSubSub);
    if (urlStatus !== selectedStatus) setSelectedStatus(urlStatus);
    if (urlBadge !== selectedBadge) setSelectedBadge(urlBadge);
    if (urlDate !== selectedDatePreset && ['all', 'today', '7d', '30d', 'month'].includes(urlDate)) {
      setSelectedDatePreset(urlDate as any);
    }
    if (urlSearch !== debouncedSearch) {
      setSearchInput(urlSearch);
      setDebouncedSearch(urlSearch);
    }
    if (!isNaN(urlPage) && urlPage !== page) setPage(urlPage);
    if (urlSortField !== sortField) setSortField(urlSortField);
    if (urlSortDir !== sortDirection) setSortDirection(urlSortDir);
  }, [searchParams]);

  // Load Categories & Badges
  useEffect(() => {
    categoryApi.getAdminTree()
      .then((tree) => {
        if (tree && tree.length > 0) {
          setCategories(tree);
        } else {
          categoryApi.getPublicTree().then(setCategories).catch(console.error);
        }
      })
      .catch(() => categoryApi.getPublicTree().then(setCategories).catch(console.error));
    badgeApi.getPublicBadges().then(setBadges).catch(console.error);
  }, []);

  // Available subcategories based on selected category (or all categories)
  const availableSubcategories = useMemo(() => {
    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
      return cat?.children || [];
    }
    const map = new Map<string, Category>();
    categories.forEach((c) => {
      if (c.children && c.children.length > 0) {
        c.children.forEach((sc) => {
          if (!map.has(sc.id)) {
            map.set(sc.id, sc);
          }
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, selectedCategory]);

  // Available sub-subcategories based on selected category & subcategory
  const availableSubSubcategories = useMemo(() => {
    if (selectedSubcategory !== 'all') {
      for (const cat of categories) {
        const sub = cat.children?.find((s) => s.id === selectedSubcategory || s.slug === selectedSubcategory);
        if (sub && sub.children && sub.children.length > 0) {
          return sub.children;
        }
      }
      return [];
    }

    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
      const list: Category[] = [];
      cat?.children?.forEach((sc) => {
        if (sc.children && sc.children.length > 0) {
          list.push(...sc.children);
        }
      });
      return list;
    }

    const map = new Map<string, Category>();
    categories.forEach((c) => {
      c.children?.forEach((sc) => {
        sc.children?.forEach((ssc) => {
          if (!map.has(ssc.id)) {
            map.set(ssc.id, ssc);
          }
        });
      });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, selectedCategory, selectedSubcategory]);

  // Validate that selected category, subcategory, and sub-subcategory exist once categories tree is loaded
  useEffect(() => {
    if (categories.length === 0) return;
    if (selectedCategory !== 'all') {
      const catExists = categories.some((c) => c.id === selectedCategory || c.slug === selectedCategory);
      if (!catExists) {
        setSelectedCategory('all');
        setSelectedSubcategory('all');
        setSelectedSubSubcategory('all');
        return;
      }
      if (selectedSubcategory !== 'all') {
        const subExists = availableSubcategories.some((sc) => sc.id === selectedSubcategory || sc.slug === selectedSubcategory);
        if (!subExists) {
          setSelectedSubcategory('all');
          setSelectedSubSubcategory('all');
          return;
        }
      }
    }
    if (selectedSubSubcategory !== 'all') {
      const subSubExists = availableSubSubcategories.some((ssc) => ssc.id === selectedSubSubcategory || ssc.slug === selectedSubSubcategory);
      if (!subSubExists) {
        setSelectedSubSubcategory('all');
      }
    }
  }, [categories, selectedCategory, selectedSubcategory, selectedSubSubcategory, availableSubcategories, availableSubSubcategories]);

  // Category, Subcategory & Sub-subcategory display label helpers
  const getCategoryLabel = (catId?: string | null) => {
    if (!catId) return '—';
    const cat = categories.find((c) => c.id === catId || c.slug === catId);
    return cat?.shortTitle || cat?.name || catId;
  };

  const getSubcategoryLabel = (catId?: string | null, subId?: string | null) => {
    if (!subId) return '';
    if (catId) {
      const cat = categories.find((c) => c.id === catId || c.slug === catId);
      const sub = cat?.children?.find((s) => s.id === subId || s.slug === subId);
      if (sub) return sub.name;
    }
    for (const cat of categories) {
      const sub = cat.children?.find((s) => s.id === subId || s.slug === subId);
      if (sub) return sub.name;
    }
    return subId;
  };

  const getSubSubcategoryLabel = (catId?: string | null, subId?: string | null, subSubId?: string | null) => {
    if (!subSubId) return '';
    for (const cat of categories) {
      if (!catId || cat.id === catId || cat.slug === catId) {
        for (const sub of cat.children || []) {
          if (!subId || sub.id === subId || sub.slug === subId) {
            const ssc = sub.children?.find((s) => s.id === subSubId || s.slug === subSubId);
            if (ssc) return ssc.shortTitle || ssc.name;
          }
        }
      }
    }
    for (const cat of categories) {
      for (const sub of cat.children || []) {
        const ssc = sub.children?.find((s) => s.id === subSubId || s.slug === subSubId);
        if (ssc) return ssc.shortTitle || ssc.name;
      }
    }
    return subSubId;
  };

  // Load Products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      let startDate: string | undefined = undefined;
      let endDate: string | undefined = undefined;
      const now = new Date();
      if (selectedDatePreset === 'today') {
        startDate = now.toISOString().split('T')[0];
        endDate = startDate;
      } else if (selectedDatePreset === '7d') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      } else if (selectedDatePreset === '30d') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        startDate = d.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      } else if (selectedDatePreset === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = startOfMonth.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
      }

      const res = await productApi.getAdminList({
        page,
        limit: 50,
        search: debouncedSearch || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
        subSubcategory: selectedSubSubcategory !== 'all' ? selectedSubSubcategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        badge: selectedBadge !== 'all' ? selectedBadge : undefined,
        startDate,
        endDate,
        sortBy: sortField,
        sortOrder: sortDirection,
      });
      setProducts(res.products || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      // If higher page index has no products but total count > 0, auto-clamp to page 1
      if (res.total > 0 && (res.products?.length === 0 || page > (res.totalPages || 1)) && page > 1) {
        setPage(1);
      }
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setActionError(err.message || 'Failed to load catalog inventory.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedCategory, selectedSubcategory, selectedSubSubcategory, selectedStatus, selectedBadge, selectedDatePreset, sortField, sortDirection]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Upload Timing Formatter with Relative Age and Full Precision
  const formatUploadTiming = (isoString?: string) => {
    if (!isoString) return { date: '—', time: '', relative: '', full: 'Not recorded' };
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { date: '—', time: '', relative: '', full: 'Invalid date' };

    const date = d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let relative = '';
    if (diffMins < 1) relative = 'Just now';
    else if (diffMins < 60) relative = `${diffMins}m ago`;
    else if (diffHours < 24) relative = `${diffHours}h ago`;
    else if (diffDays === 1) relative = 'Yesterday';
    else if (diffDays < 7) relative = `${diffDays}d ago`;
    else relative = `${Math.floor(diffDays / 7)}w ago`;

    return { date, time, relative, full: `${date} at ${time}` };
  };

  // Client-side Sort of Current Page
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'price') {
        aVal = Number(a.price) || 0;
        bVal = Number(b.price) || 0;
      } else if (sortField === 'createdAt') {
        aVal = new Date(a.createdAt || 0).getTime();
        bVal = new Date(b.createdAt || 0).getTime();
      } else if (sortField === 'updatedAt') {
        aVal = new Date(a.updatedAt || a.createdAt || 0).getTime();
        bVal = new Date(b.updatedAt || b.createdAt || 0).getTime();
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, sortField, sortDirection]);

  const handleHeaderSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Single Item Operations
  const handlePublish = async (id: string) => {
    try {
      await productApi.publish(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'PUBLISHED' } : p))
      );
      showToast('Product published successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to publish');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await productApi.unpublish(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'UNPUBLISHED' } : p))
      );
      showToast('Product unpublished successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to unpublish');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await productApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      showToast('Product deleted permanently.');
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkStatus = async (status: 'PUBLISHED' | 'UNPUBLISHED') => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const res = await productApi.bulkStatus(selectedIds, status);
      showToast(`Successfully updated ${res.count} product(s) to ${status}.`);
      setSelectedIds([]);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Bulk status update failed.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkCategorySubmit = async () => {
    if (selectedIds.length === 0 || !bulkTargetCategoryId) return;
    setBulkActionLoading(true);
    try {
      const res = await productApi.bulkCategory(selectedIds, {
        categoryId: bulkTargetCategoryId,
      });
      showToast(`Assigned ${res.count} product(s) to category.`);
      setShowBulkCategoryModal(false);
      setSelectedIds([]);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Bulk category reassignment failed.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDeleteSubmit = async () => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const res = await productApi.bulkDelete(selectedIds);
      showToast(`Permanently deleted ${res.count} product(s).`);
      setShowBulkDeleteConfirm(false);
      setSelectedIds([]);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Bulk delete failed.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0
      ? products.filter((p) => selectedIds.includes(p.id))
      : products;

    if (listToExport.length === 0) {
      alert('No products available to export.');
      return;
    }

    const headers = [
      'Product ID',
      'SKU',
      'Name',
      'Category',
      'Subcategory',
      'Style',
      'Price (INR)',
      'Compare At Price (INR)',
      'Status',
      'In Stock',
      'Rating',
      'Reviews',
      'Created At',
    ];

    const rows = listToExport.map((p) => [
      `"${p.id}"`,
      `"${p.sku || ''}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.categoryId || ''}"`,
      `"${p.subcategoryId || ''}"`,
      `"${p.style || ''}"`,
      p.price || 0,
      p.compareAtPrice || '',
      `"${p.status}"`,
      p.inStock ? 'YES' : 'NO',
      p.rating || 0,
      p.reviews || 0,
      `"${p.createdAt ? new Date(p.createdAt).toISOString() : ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shiv-shakti-products-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} product(s) to CSV.`);
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} style={{ color: '#475569', marginLeft: '4px' }} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={13} style={{ color: '#6366f1', marginLeft: '4px' }} />
    ) : (
      <ArrowDown size={13} style={{ color: '#6366f1', marginLeft: '4px' }} />
    );
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: selectedIds.length > 0 ? '90px' : '30px' }}>
      {/* Toast Feedback */}
      {actionSuccess && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 18px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            color: '#34d399',
            fontSize: '0.86rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 18px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '0.86rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            SKU & Product Catalog Management
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Manage {total} inventory items, lifecycle statuses, categories, and CSV data flows.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid #334155',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
            title="Download CSV report"
          >
            <Download size={15} />
            <span>Export CSV {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
          </button>

          <button
            onClick={() => navigate('/admin/backup')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
            title="Upload Excel spreadsheet to add new SKUs"
          >
            <FolderInput size={15} />
            <span>Import Excel</span>
          </button>

          <button
            onClick={() =>
              navigate('/admin/products/new', {
                state: {
                  returnUrl: location.pathname + location.search,
                  category: selectedCategory,
                  subcategory: selectedSubcategory,
                  subSubcategory: selectedSubSubcategory,
                },
              })
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Plus size={16} />
            <span>New SKU Item</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div
        style={{
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search input with live debounce */}
        <div style={{ flex: '1', minWidth: '240px', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            placeholder="Debounced search SKU, title, specs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              background: '#080d18',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#f1f5f9',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory('all');
            setSelectedSubSubcategory('all');
            setPage(1);
          }}
          style={{
            padding: '9px 12px',
            background: '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: selectedCategory !== 'all' ? '#818cf8' : '#cbd5e1',
            fontWeight: selectedCategory !== 'all' ? 600 : 400,
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.shortTitle || cat.name}
            </option>
          ))}
        </select>

        {/* Subcategory filter */}
        <select
          value={selectedSubcategory}
          onChange={(e) => {
            setSelectedSubcategory(e.target.value);
            setSelectedSubSubcategory('all');
            setPage(1);
          }}
          disabled={availableSubcategories.length === 0}
          style={{
            padding: '9px 12px',
            background: '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: selectedSubcategory !== 'all' ? '#818cf8' : '#cbd5e1',
            fontWeight: selectedSubcategory !== 'all' ? 600 : 400,
            fontSize: '0.82rem',
            outline: 'none',
            cursor: availableSubcategories.length === 0 ? 'not-allowed' : 'pointer',
            opacity: availableSubcategories.length === 0 ? 0.6 : 1,
          }}
        >
          <option value="all">
            {selectedCategory === 'all'
              ? 'All Subcategories'
              : `All ${categories.find((c) => c.id === selectedCategory)?.shortTitle || 'Subcategories'}`}
          </option>
          {availableSubcategories.map((sc) => (
            <option key={sc.id} value={sc.id}>
              {sc.name}
            </option>
          ))}
        </select>

        {/* Sub-subcategory filter */}
        <select
          value={selectedSubSubcategory}
          onChange={(e) => {
            setSelectedSubSubcategory(e.target.value);
            setPage(1);
          }}
          disabled={availableSubSubcategories.length === 0}
          style={{
            padding: '9px 12px',
            background: '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: selectedSubSubcategory !== 'all' ? '#818cf8' : '#cbd5e1',
            fontWeight: selectedSubSubcategory !== 'all' ? 600 : 400,
            fontSize: '0.82rem',
            outline: 'none',
            cursor: availableSubSubcategories.length === 0 ? 'not-allowed' : 'pointer',
            opacity: availableSubSubcategories.length === 0 ? 0.6 : 1,
          }}
        >
          <option value="all">
            {selectedSubcategory !== 'all'
              ? `All ${availableSubcategories.find((s) => s.id === selectedSubcategory)?.name || ''} Sub-subcategories`
              : selectedCategory !== 'all'
              ? `All ${categories.find((c) => c.id === selectedCategory)?.shortTitle || ''} Sub-subcategories`
              : 'All Sub-subcategories'}
          </option>
          {availableSubSubcategories.map((ssc) => (
            <option key={ssc.id} value={ssc.id}>
              {ssc.shortTitle || ssc.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '9px 12px',
            background: '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#cbd5e1',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="PUBLISHED">Published Only</option>
          <option value="DRAFT">Drafts Only</option>
          <option value="UNPUBLISHED">Unpublished Only</option>
        </select>

        {/* Badge filter */}
        <select
          value={selectedBadge}
          onChange={(e) => {
            setSelectedBadge(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '9px 12px',
            background: '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#cbd5e1',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Badges</option>
          {badges.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.label}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <select
          value={selectedDatePreset}
          onChange={(e) => {
            setSelectedDatePreset(e.target.value as any);
            setPage(1);
          }}
          style={{
            padding: '9px 12px',
            background: '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#cbd5e1',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="month">This Month</option>
        </select>

        <button
          onClick={() => loadProducts()}
          style={{
            padding: '9px 14px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
          }}
          title="Refresh List"
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>

        {/* Clear / Reset Filters */}
        {(selectedCategory !== 'all' ||
          selectedSubcategory !== 'all' ||
          selectedSubSubcategory !== 'all' ||
          selectedStatus !== 'all' ||
          selectedBadge !== 'all' ||
          selectedDatePreset !== 'all' ||
          searchInput.trim() !== '') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
              setSelectedSubSubcategory('all');
              setSelectedStatus('all');
              setSelectedBadge('all');
              setSelectedDatePreset('all');
              setSearchInput('');
              setDebouncedSearch('');
              setPage(1);
              Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
              setSearchParams({}, { replace: true });
            }}
            style={{
              padding: '9px 12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
            title="Reset All Filters"
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}

        {/* Live Filter Activity Indicator */}
        {loading && (
          <CommonLoader
            variant="inline"
            message="Filtering SKUs..."
            theme="dark"
          />
        )}
      </div>

      {/* ── PRODUCT TABLE ── */}
      <div
        style={{
          position: 'relative',
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
        }}
      >
        {/* Semi-transparent Overlay Loader during filter transitions */}
        {loading && sortedProducts.length > 0 && (
          <CommonLoader variant="overlay" message="Updating catalog..." theme="dark" />
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#080d18', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                <th style={{ padding: '12px 14px', width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={products.length > 0 && selectedIds.length === products.length}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '12px 14px', width: '70px' }}>Image</th>
                <th
                  onClick={() => handleHeaderSort('sku')}
                  style={{ padding: '12px 14px', width: '140px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>SKU Code</span>
                    {renderSortIndicator('sku')}
                  </div>
                </th>
                <th
                  onClick={() => handleHeaderSort('name')}
                  style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Product Details</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th style={{ padding: '12px 14px' }}>Category Hierarchy</th>
                <th
                  onClick={() => handleHeaderSort('price')}
                  style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Price</span>
                    {renderSortIndicator('price')}
                  </div>
                </th>
                <th
                  onClick={() => handleHeaderSort('status')}
                  style={{ padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Status</span>
                    {renderSortIndicator('status')}
                  </div>
                </th>
                <th
                  onClick={() => handleHeaderSort('createdAt')}
                  style={{ padding: '12px 14px', width: '165px', cursor: 'pointer', userSelect: 'none' }}
                  title="Click to sort by SKU upload timestamp"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} style={{ color: sortField === 'createdAt' ? '#818cf8' : '#64748b' }} />
                    <span style={{ color: sortField === 'createdAt' ? '#818cf8' : undefined }}>Uploaded At</span>
                    {renderSortIndicator('createdAt')}
                  </div>
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && sortedProducts.length === 0 ? (
                <CommonLoader
                  variant="table"
                  colSpan={9}
                  message="Filtering catalog items..."
                  theme="dark"
                />
              ) : actionError ? (
                <CommonError
                  variant="table"
                  colSpan={9}
                  title="Failed to load catalog inventory"
                  message={actionError}
                  onRetry={() => loadProducts()}
                  theme="dark"
                />
              ) : sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isPublished = product.status === 'PUBLISHED';
                  const isDraft = product.status === 'DRAFT';

                  return (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: '1px solid #1a2335',
                        background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <img
                          src={product.image || '/placeholder.jpg'}
                          alt={product.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #1e293b',
                            background: '#1e293b',
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/admin/products/${product.id}/edit`, {
                            state: { returnUrl: location.pathname + location.search },
                          })
                        }
                        style={{
                          padding: '12px 14px',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: '#818cf8',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                        title="Click to edit SKU"
                      >
                        {product.sku || 'SKU-PENDING'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div
                          onClick={() =>
                            navigate(`/admin/products/${product.id}/edit`, {
                              state: { returnUrl: location.pathname + location.search },
                            })
                          }
                          style={{
                            fontWeight: 600,
                            color: '#f1f5f9',
                            marginBottom: '2px',
                            lineHeight: 1.3,
                            cursor: 'pointer',
                          }}
                          title="Click to edit product"
                        >
                          {product.name}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Style: {product.style}</span>
                          {product.badges?.map((pb) => (
                            <span
                              key={pb.badgeId}
                              style={{
                                fontSize: '0.66rem',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: pb.badge.bgColor || '#1e293b',
                                color: pb.badge.color || '#fbbf24',
                                fontWeight: 600,
                              }}
                            >
                              {pb.badge.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 600, color: '#f1f5f9' }}>
                          {getCategoryLabel(product.categoryId)}
                        </span>
                        {product.subcategoryId && (
                          <span style={{ color: '#818cf8', marginLeft: '6px' }}>
                            › {getSubcategoryLabel(product.categoryId, product.subcategoryId)}
                          </span>
                        )}
                        {product.subSubcategoryId && (
                          <span style={{ color: '#38bdf8', marginLeft: '6px' }}>
                            › {getSubSubcategoryLabel(product.categoryId, product.subcategoryId, product.subSubcategoryId)}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{formatPrice(product.price)}</div>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <div style={{ fontSize: '0.7rem', color: '#64748b', textDecoration: 'line-through' }}>
                            {formatPrice(product.compareAtPrice)}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 8px',
                            borderRadius: '99px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: isPublished
                              ? 'rgba(16, 185, 129, 0.15)'
                              : isDraft
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(100, 116, 139, 0.15)',
                            color: isPublished ? '#34d399' : isDraft ? '#fbbf24' : '#94a3b8',
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: isPublished ? '#34d399' : isDraft ? '#fbbf24' : '#94a3b8',
                            }}
                          />
                          {product.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        {(() => {
                          const { date, time, relative, full } = formatUploadTiming(product.createdAt);
                          const isVeryRecent = relative === 'Just now' || relative.includes('m ago');
                          const isRecent = relative.includes('h ago') || relative === 'Yesterday';
                          return (
                            <div title={`Uploaded to platform on: ${full}`}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                                  {date}
                                </span>
                                {relative && (
                                  <span
                                    style={{
                                      fontSize: '0.66rem',
                                      fontWeight: 700,
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                      background: isVeryRecent
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : isRecent
                                        ? 'rgba(99, 102, 241, 0.18)'
                                        : 'rgba(30, 41, 59, 0.7)',
                                      color: isVeryRecent
                                        ? '#34d399'
                                        : isRecent
                                        ? '#a5b4fc'
                                        : '#94a3b8',
                                      border: isVeryRecent
                                        ? '1px solid rgba(16, 185, 129, 0.3)'
                                        : isRecent
                                        ? '1px solid rgba(99, 102, 241, 0.3)'
                                        : '1px solid rgba(51, 65, 85, 0.5)',
                                    }}
                                  >
                                    {relative}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={11} color="#64748b" />
                                <span>{time}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {isPublished ? (
                            <button
                              onClick={() => handleUnpublish(product.id)}
                              style={{
                                padding: '5px 8px',
                                background: '#1e293b',
                                border: '1px solid #334155',
                                borderRadius: '6px',
                                color: '#fbbf24',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                              }}
                              title="Unpublish (Hide from store)"
                            >
                              <EyeOff size={13} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublish(product.id)}
                              style={{
                                padding: '5px 8px',
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                borderRadius: '6px',
                                color: '#34d399',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                              title="Publish (Make visible on store)"
                            >
                              <Eye size={13} />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              navigate(`/admin/products/${product.id}/edit`, {
                                state: { returnUrl: location.pathname + location.search },
                              })
                            }
                            style={{
                              padding: '5px 8px',
                              background: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              color: '#94a3b8',
                              cursor: 'pointer',
                            }}
                            title="Edit Product"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(product)}
                            style={{
                              padding: '5px 8px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#f87171',
                              cursor: 'pointer',
                            }}
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0a1020',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            Showing Page <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{page}</span> of{' '}
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{totalPages}</span> ({total} Total SKUs)
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: page <= 1 ? '#475569' : '#cbd5e1',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: page >= totalPages ? '#475569' : '#cbd5e1',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            background: '#080d1a',
            border: '1px solid #334155',
            borderRadius: '14px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(99, 102, 241, 0.2)',
            animation: 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: '#6366f1',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '99px',
              }}
            >
              {selectedIds.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
              Products Selected
            </span>
          </div>

          <div style={{ height: '20px', width: '1px', background: '#334155' }} />

          {/* Bulk Publish */}
          <button
            type="button"
            disabled={bulkActionLoading}
            onClick={() => handleBulkStatus('PUBLISHED')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: bulkActionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <Eye size={14} />
            <span>Publish</span>
          </button>

          {/* Bulk Unpublish */}
          <button
            type="button"
            disabled={bulkActionLoading}
            onClick={() => handleBulkStatus('UNPUBLISHED')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: bulkActionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <EyeOff size={14} />
            <span>Unpublish</span>
          </button>

          {/* Bulk Category Reassignment */}
          <button
            type="button"
            disabled={bulkActionLoading}
            onClick={() => setShowBulkCategoryModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: bulkActionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <FolderInput size={14} />
            <span>Move Category</span>
          </button>

          {/* Bulk Delete */}
          <button
            type="button"
            disabled={bulkActionLoading}
            onClick={() => setShowBulkDeleteConfirm(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: bulkActionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <Trash2 size={14} />
            <span>Delete Selected</span>
          </button>

          {/* Clear selection */}
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
            title="Deselect all"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Bulk Category Modal */}
      {showBulkCategoryModal && (
        <Modal
          isOpen={showBulkCategoryModal}
          onClose={() => setShowBulkCategoryModal(false)}
          title={`Reassign Category for ${selectedIds.length} Products`}
          maxWidth="480px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowBulkCategoryModal(false)}
                style={{
                  padding: '8px 16px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!bulkTargetCategoryId || bulkActionLoading}
                onClick={handleBulkCategorySubmit}
                style={{
                  padding: '8px 20px',
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: !bulkTargetCategoryId || bulkActionLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {bulkActionLoading ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Select the new parent category for all {selectedIds.length} currently selected products.
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                Destination Category
              </label>
              <select
                value={bulkTargetCategoryId}
                onChange={(e) => setBulkTargetCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#080d18',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.86rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.shortTitle || cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {showBulkDeleteConfirm && (
        <ConfirmDialog
          isOpen={showBulkDeleteConfirm}
          onClose={() => setShowBulkDeleteConfirm(false)}
          onConfirm={handleBulkDeleteSubmit}
          title={`Permanently Delete ${selectedIds.length} Products?`}
          message={`Are you absolutely sure you want to delete ${selectedIds.length} selected items? This will remove images, badge associations, and filter links forever.`}
          confirmText={bulkActionLoading ? 'Deleting...' : 'Delete Selected Forever'}
        />
      )}

      {/* Single Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Catalog SKU"
          message={`Are you sure you want to delete "${deleteTarget.name}" (${deleteTarget.sku})? This action cannot be undone.`}
          confirmText="Delete Permanently"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default ProductListPage;
