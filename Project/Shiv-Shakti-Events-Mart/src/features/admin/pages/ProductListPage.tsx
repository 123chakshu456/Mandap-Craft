import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { productApi } from '../../products/services/productApi';
import { categoryApi } from '../../categories/services/categoryApi';
import { badgeApi } from '../../badges/services/badgeApi';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Product, Category, Badge } from '../../../shared/types/models.types';

export const ProductListPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState('all');

  // Bulk Selection & Delete Modal
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Load Categories & Badges
  useEffect(() => {
    categoryApi.getPublicTree().then(setCategories).catch(console.error);
    badgeApi.getPublicBadges().then(setBadges).catch(console.error);
  }, []);

  // Load Products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAdminList({
        page,
        limit: 25,
        search: search || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        badge: selectedBadge !== 'all' ? selectedBadge : undefined,
      });
      setProducts(res.products);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, selectedStatus, selectedBadge]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Actions
  const handlePublish = async (id: string) => {
    try {
      await productApi.publish(id);
      setActionSuccess('Product published successfully!');
      loadProducts();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to publish product');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await productApi.unpublish(id);
      setActionSuccess('Product unpublished successfully.');
      loadProducts();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to unpublish product');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await productApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      setActionSuccess('Product deleted successfully.');
      loadProducts();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

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

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Banner */}
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
            Manage {total} inventory items, publication lifecycle, filter assignments, and pricing.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
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
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          <Plus size={16} />
          <span>Add New SKU</span>
        </button>
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
        {/* Search input */}
        <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
          />
          <input
            type="text"
            placeholder="Search SKU, Product Name, Specs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '9px 12px',
            background: '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#94a3b8',
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

        {/* Status dropdown */}
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
            color: '#94a3b8',
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

        {/* Badge dropdown */}
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
            color: '#94a3b8',
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

        <button
          onClick={() => loadProducts()}
          style={{
            padding: '9px 12px',
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
      </div>

      {/* ── PRODUCT TABLE ── */}
      <div
        style={{
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
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
                <th style={{ padding: '12px 14px', width: '140px' }}>SKU Code</th>
                <th style={{ padding: '12px 14px' }}>Product Details</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Price</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ width: 24, height: 24, border: '3px solid #334155', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                    Loading catalog items...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    No products matched your search or filters.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isPublished = product.status === 'PUBLISHED';
                  const isDraft = product.status === 'DRAFT';

                  return (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: '1px solid #1a2335',
                        background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
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
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#818cf8', fontSize: '0.8rem' }}>
                        {product.sku || 'SKU-PENDING'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '2px', lineHeight: 1.3 }}>
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
                      <td style={{ padding: '12px 14px', color: '#94a3b8', textTransform: 'capitalize' }}>
                        {product.categoryId} {product.subcategoryId ? `› ${product.subcategoryId}` : ''}
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
                            gap: '4px',
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
                              title="Unpublish (Hide from public store)"
                            >
                              Unpublish
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
                              Publish
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
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

      {/* Delete Confirmation Modal */}
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
