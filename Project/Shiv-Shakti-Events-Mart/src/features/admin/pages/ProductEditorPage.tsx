import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  FolderOpen,
} from 'lucide-react';
import { productApi } from '../../products/services/productApi';
import { categoryApi } from '../../categories/services/categoryApi';
import { filterApi } from '../../filters/services/filterApi';
import { badgeApi } from '../../badges/services/badgeApi';
import { mediaApi } from '../../media/services/mediaApi';
import { MediaPickerModal } from '../../../shared/components/MediaPickerModal/MediaPickerModal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Product, Category, Filter, Badge } from '../../../shared/types/models.types';

type EditorTab = 'basic' | 'category' | 'pricing' | 'description' | 'media' | 'filters' | 'badges' | 'seo';

export const ProductEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id && id !== 'new');

  // Active Tab
  const [activeTab, setActiveTab] = useState<EditorTab>('basic');

  // Metadata Lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Form State
  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    sku: '',
    slug: '',
    categoryId: 'wedding',
    subcategoryId: 'mandaps',
    subSubcategoryId: '',
    style: 'Traditional',
    price: 0,
    compareAtPrice: 0,
    rating: 4.8,
    reviews: 0,
    image: '',
    description: '',
    features: ['Handcrafted precision', 'Commercial heavy-duty frame', 'Turnkey deployment included'],
    isFeatured: false,
    tag: '',
    inStock: true,
    status: 'PUBLISHED',
    sortPriority: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  const [selectedFilterValues, setSelectedFilterValues] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<{ url: string; publicId?: string; isPrimary?: boolean }[]>([]);

  // Dirty State Guard & Unsaved Changes
  const [isDirty, setIsDirty] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Media Picker Modal
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'primary' | 'gallery'>('primary');

  // Helpers
  const [newFeatureText, setNewFeatureText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mark dirty on changes
  const updateForm = (updates: Partial<Product>) => {
    setForm((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  // Browser BeforeUnload Guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Global Keyboard Shortcut: Ctrl+S / Cmd+S to Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Load Reference Data
  useEffect(() => {
    categoryApi.getPublicTree().then(setCategories).catch(console.error);
    filterApi.getAdminFilters().then(setFilters).catch(console.error);
    badgeApi.getPublicBadges().then(setBadges).catch(console.error);
  }, []);

  // Load Existing Product if Editing
  useEffect(() => {
    if (isEditing && id) {
      productApi
        .getAdminById(id)
        .then((p) => {
          if (p) {
            setForm({
              ...p,
              features: Array.isArray(p.features) ? p.features : [],
            });
            if (p.filterValues) {
              setSelectedFilterValues(p.filterValues.map((pfv) => pfv.filterValueId));
            }
            if (p.badges) {
              setSelectedBadges(p.badges.map((pb) => pb.badgeId));
            }
            if (p.images) {
              setGalleryImages(
                p.images.map((img) => ({
                  url: img.url,
                  publicId: img.publicId || undefined,
                  isPrimary: img.isPrimary,
                }))
              );
            }
            setIsDirty(false);
          }
        })
        .catch(() => {
          setErrorMsg('Failed to load product details.');
        });
    }
  }, [id, isEditing]);

  // Derived subcategories & sub-subcategories based on selection
  const currentCategory = categories.find((c) => c.id === form.categoryId);
  const subcategories = currentCategory?.children || [];
  const currentSubcategory = subcategories.find((s) => s.id === form.subcategoryId);
  const subSubcategories = currentSubcategory?.children || [];

  // Handlers
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    updateForm({
      features: [...(form.features || []), newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    updateForm({
      features: (form.features || []).filter((_, i) => i !== idx),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const file = files[0];
      const result = await mediaApi.uploadImage(file, 'shiv-shakti-events/products');

      if (!form.image) {
        updateForm({ image: result.url });
      }

      setGalleryImages((prev) => [
        ...prev,
        { url: result.url, publicId: result.publicId, isPrimary: prev.length === 0 },
      ]);
      setIsDirty(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMediaPickerSelect = (asset: { url: string; altText?: string; publicId?: string; name?: string }) => {
    if (mediaPickerTarget === 'primary') {
      updateForm({ image: asset.url });
      setGalleryImages((prev) => {
        const exists = prev.find((img) => img.url === asset.url);
        if (exists) {
          return prev.map((img) => ({ ...img, isPrimary: img.url === asset.url }));
        }
        return [{ url: asset.url, publicId: asset.publicId, isPrimary: true }, ...prev];
      });
    } else {
      setGalleryImages((prev) => {
        if (prev.find((img) => img.url === asset.url)) return prev;
        return [...prev, { url: asset.url, publicId: asset.publicId, isPrimary: prev.length === 0 }];
      });
      if (!form.image) {
        updateForm({ image: asset.url });
      }
    }
    setIsDirty(true);
  };

  const handleSetPrimaryImage = (url: string) => {
    updateForm({ image: url });
    setGalleryImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.url === url }))
    );
    setIsDirty(true);
  };

  const handleRemoveImage = (url: string) => {
    setGalleryImages((prev) => prev.filter((img) => img.url !== url));
    if (form.image === url) {
      const remaining = galleryImages.filter((img) => img.url !== url);
      updateForm({ image: remaining[0]?.url || '' });
    }
    setIsDirty(true);
  };

  const handleToggleFilterValue = (valId: string) => {
    setSelectedFilterValues((prev) =>
      prev.includes(valId) ? prev.filter((v) => v !== valId) : [...prev, valId]
    );
    setIsDirty(true);
  };

  const handleToggleBadge = (badgeId: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeId) ? prev.filter((b) => b !== badgeId) : [...prev, badgeId]
    );
    setIsDirty(true);
  };

  const handleSave = async (targetStatus?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED') => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.name?.trim()) {
      setErrorMsg('Product name is required before saving.');
      setActiveTab('basic');
      return;
    }
    if (!form.price || form.price <= 0) {
      setErrorMsg('Please specify a valid price greater than 0.');
      setActiveTab('pricing');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        status: targetStatus || form.status || 'PUBLISHED',
        filterValueIds: selectedFilterValues,
        badgeIds: selectedBadges,
        images: galleryImages,
      };

      if (isEditing && id) {
        await productApi.update(id, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        const created = await productApi.create(payload);
        setSuccessMsg('Product created successfully!');
        setTimeout(() => navigate(`/admin/products/${created.id}/edit`), 1200);
      }
      setIsDirty(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackClick = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      navigate('/admin/products');
    }
  };

  const handleDeleteProduct = async () => {
    if (!id || !isEditing) return;
    setIsDeletingProduct(true);
    try {
      await productApi.delete(id);
      setIsDirty(false);
      setShowDeleteConfirm(false);
      navigate('/admin/products', { replace: true });
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Multi-tab validation indicator check
  const tabHasError = (tab: EditorTab): boolean => {
    if (tab === 'basic') return !form.name?.trim();
    if (tab === 'pricing') return !form.price || form.price <= 0;
    return false;
  };

  const tabButtonStyle = (tab: EditorTab) => {
    const isActive = activeTab === tab;

    return {
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      background: isActive ? '#1e293b' : 'transparent',
      color: isActive ? '#a5b4fc' : '#94a3b8',
      fontWeight: isActive ? 700 : 500,
      fontSize: '0.84rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative' as const,
      transition: 'all 0.15s',
    };
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── TOP HEADER / ACTION BAR ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={handleBackClick}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Return to Catalog"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {isEditing ? `Edit SKU: ${form.sku || form.name}` : 'Create New Product SKU'}
              </h1>
              {isDirty && (
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#fbbf24',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '99px',
                  }}
                >
                  Unsaved Edits (Ctrl+S)
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
              Status:{' '}
              <span
                style={{
                  color: form.status === 'PUBLISHED' ? '#34d399' : '#fbbf24',
                  fontWeight: 600,
                }}
              >
                {form.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving || isDeletingProduct}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: isSaving || isDeletingProduct ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
              title="Permanently delete this product SKU"
            >
              <Trash2 size={15} />
              <span>Delete SKU</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving || isDeletingProduct}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: isSaving || isDeletingProduct ? 'not-allowed' : 'pointer',
            }}
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(form.status === 'DRAFT' ? 'PUBLISHED' : undefined)}
            disabled={isSaving || isDeletingProduct}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: isSaving || isDeletingProduct ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
            title="Save changes (Ctrl+S)"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : form.status === 'PUBLISHED' ? 'Save Changes' : 'Publish SKU'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div
          style={{
            padding: '12px 18px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '0.86rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: '12px 18px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            color: '#34d399',
            fontSize: '0.86rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── MULTI-TAB NAVIGATION BAR WITH ERROR INDICATORS ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '6px',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        <button type="button" style={tabButtonStyle('basic')} onClick={() => setActiveTab('basic')}>
          <span>Basic Info</span>
          {tabHasError('basic') && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 6px #ef4444',
              }}
              title="Required fields incomplete"
            />
          )}
        </button>

        <button type="button" style={tabButtonStyle('category')} onClick={() => setActiveTab('category')}>
          <span>Category Hierarchy</span>
        </button>

        <button type="button" style={tabButtonStyle('pricing')} onClick={() => setActiveTab('pricing')}>
          <span>Pricing & Stock</span>
          {tabHasError('pricing') && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 6px #ef4444',
              }}
              title="Pricing invalid"
            />
          )}
        </button>

        <button type="button" style={tabButtonStyle('description')} onClick={() => setActiveTab('description')}>
          <span>Description & Specs</span>
        </button>

        <button type="button" style={tabButtonStyle('media')} onClick={() => setActiveTab('media')}>
          <span>Media & Gallery ({galleryImages.length})</span>
        </button>

        <button type="button" style={tabButtonStyle('filters')} onClick={() => setActiveTab('filters')}>
          <span>Filters ({selectedFilterValues.length})</span>
        </button>

        <button type="button" style={tabButtonStyle('badges')} onClick={() => setActiveTab('badges')}>
          <span>Badges ({selectedBadges.length})</span>
        </button>

        <button type="button" style={tabButtonStyle('seo')} onClick={() => setActiveTab('seo')}>
          <span>SEO</span>
        </button>
      </div>

      {/* ── TAB PANELS ── */}
      <div style={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: '14px', padding: '28px' }}>
        {/* 1. BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Basic Product Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Product / SKU Name *
                </label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  placeholder="e.g. Royal Marigold Wedding Mandap"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: tabHasError('basic') ? '1px solid #ef4444' : '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  SKU Code (Inventory Identifier)
                </label>
                <input
                  type="text"
                  value={form.sku || ''}
                  onChange={(e) => updateForm({ sku: e.target.value })}
                  placeholder="e.g. SKU-WED-0001 (leave empty for auto-generate)"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#818cf8',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Custom URL Slug
                </label>
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={(e) => updateForm({ slug: e.target.value })}
                  placeholder="e.g. royal-marigold-wedding-mandap"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Publication Lifecycle Status
                </label>
                <select
                  value={form.status || 'PUBLISHED'}
                  onChange={(e) => updateForm({ status: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="PUBLISHED">Published (Visible on Live Store)</option>
                  <option value="DRAFT">Draft (Internal Only)</option>
                  <option value="UNPUBLISHED">Unpublished (Archived/Hidden)</option>
                </select>
              </div>
            </div>

            {/* Primary Image Preview & Selection */}
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                Primary Cover Photo
              </label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '10px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {form.image ? (
                    <img src={form.image} alt="Primary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={28} color="#475569" />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '220px' }}>
                  <input
                    type="text"
                    value={form.image || ''}
                    onChange={(e) => updateForm({ image: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#080d18',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget('primary');
                        setMediaPickerOpen(true);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: '#a5b4fc',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <FolderOpen size={14} />
                      <span>Choose from Media Library</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CATEGORY HIERARCHY */}
        {activeTab === 'category' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Hierarchical Category Assignment
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Assign this SKU to the exact tier within the 3-level catalog taxonomy.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {/* Level 1: Category */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Level 1: Main Category *
                </label>
                <select
                  value={form.categoryId || ''}
                  onChange={(e) => {
                    const nextCatId = e.target.value;
                    const nextCat = categories.find((c) => c.id === nextCatId);
                    updateForm({
                      categoryId: nextCatId,
                      subcategoryId: nextCat?.children?.[0]?.id || '',
                      subSubcategoryId: '',
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.shortTitle || c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 2: Subcategory */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Level 2: Subcategory
                </label>
                <select
                  value={form.subcategoryId || ''}
                  onChange={(e) => {
                    updateForm({
                      subcategoryId: e.target.value,
                      subSubcategoryId: '',
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">None / Unassigned</option>
                  {subcategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level 3: Sub-Subcategory */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Level 3: Micro Subcategory
                </label>
                <select
                  value={form.subSubcategoryId || ''}
                  onChange={(e) => updateForm({ subSubcategoryId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">None / Unassigned</option>
                  {subSubcategories.map((ss) => (
                    <option key={ss.id} value={ss.id}>
                      {ss.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRICING & STOCK */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Pricing, Inventory & Priority
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Sale / Rental Price (₹) *
                </label>
                <input
                  type="number"
                  value={form.price || 0}
                  onChange={(e) => updateForm({ price: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: tabHasError('pricing') ? '1px solid #ef4444' : '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#34d399',
                    fontWeight: 700,
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Compare-At Price (₹)
                </label>
                <input
                  type="number"
                  value={form.compareAtPrice || 0}
                  onChange={(e) => updateForm({ compareAtPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="Original catalog price before discount"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Sort / Display Priority
                </label>
                <input
                  type="number"
                  value={form.sortPriority || 0}
                  onChange={(e) => updateForm({ sortPriority: parseInt(e.target.value) || 0 })}
                  placeholder="Higher number appears first"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#f1f5f9' }}>
                <input
                  type="checkbox"
                  checked={form.inStock !== false}
                  onChange={(e) => updateForm({ inStock: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                <span>In Stock & Available for Dispatch</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#fbbf24' }}>
                <input
                  type="checkbox"
                  checked={Boolean(form.isFeatured)}
                  onChange={(e) => updateForm({ isFeatured: e.target.checked })}
                  style={{ width: 16, height: 16 }}
                />
                <span>Mark as Featured Product</span>
              </label>
            </div>
          </div>
        )}

        {/* 4. DESCRIPTION & SPECS */}
        {activeTab === 'description' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Product Narrative & Technical Features
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                Rich Product Description
              </label>
              <textarea
                rows={5}
                value={form.description || ''}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Detailed luxury description of materials, finishes, craftsmanship, and ceremonial staging..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#080d18',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Dynamic Features List */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                Specification Bullets & Features
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Weatherproof PVC clear-span roofing"
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  style={{
                    padding: '9px 16px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#a5b4fc',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Add Bullet
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(form.features || []).map((feat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#080d18',
                      border: '1px solid #1a2335',
                      borderRadius: '6px',
                      fontSize: '0.84rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <span>• {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. MEDIA & GALLERY */}
        {activeTab === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
                  Product Images & Media Gallery
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  Upload high-resolution media directly to Cloudinary CDN or choose from existing asset hub.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMediaPickerTarget('gallery');
                  setMediaPickerOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                }}
              >
                <FolderOpen size={15} />
                <span>Choose From Media Library</span>
              </button>
            </div>

            {/* Direct Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #334155',
                borderRadius: '12px',
                padding: '36px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#080d18',
                transition: 'all 0.2s',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Upload size={36} color="#818cf8" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.92rem' }}>
                {isUploading ? 'Streaming file to Cloudinary...' : 'Click to Upload High-Res Image'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                Supports JPEG, PNG, WebP up to 15MB.
              </div>
            </div>

            {/* Image URL Direct Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                Or Add Image via Direct Web URL
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        if (!form.image) updateForm({ image: val });
                        setGalleryImages((prev) => [...prev, { url: val, isPrimary: prev.length === 0 }]);
                        setIsDirty(true);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Gallery Grid */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase' }}>
                Attached Gallery Images ({galleryImages.length})
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px' }}>
                {galleryImages.map((img, idx) => {
                  const isPrimary = form.image === img.url || img.isPrimary;
                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: isPrimary ? '2px solid #818cf8' : '1px solid #1e293b',
                        background: '#080d18',
                      }}
                    >
                      <img src={img.url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                      {isPrimary && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 6,
                            left: 6,
                            background: '#6366f1',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Primary
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '4px', padding: '6px', background: '#0a0f1d' }}>
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.url)}
                            style={{
                              flex: 1,
                              padding: '3px 4px',
                              background: '#1e293b',
                              border: 'none',
                              color: '#cbd5e1',
                              fontSize: '0.7rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Set Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.url)}
                          style={{
                            padding: '3px 6px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            color: '#f87171',
                            fontSize: '0.7rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 6. DYNAMIC FILTERS & ATTRIBUTES */}
        {activeTab === 'filters' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Dynamic Facet Filters
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Tag this SKU with applicable style, material, color, and capacity facets configured in the CMS.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filters.map((f) => (
                <div key={f.id} style={{ background: '#080d18', border: '1px solid #1a2335', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
                    {f.label} ({f.name})
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {f.values.map((v) => {
                      const isSelected = selectedFilterValues.includes(v.id);
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleToggleFilterValue(v.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: isSelected ? '1px solid #818cf8' : '1px solid #1e293b',
                            background: isSelected ? 'rgba(99, 102, 241, 0.2)' : '#0d1526',
                            color: isSelected ? '#a5b4fc' : '#94a3b8',
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {isSelected ? '✓ ' : ''}
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BADGES */}
        {activeTab === 'badges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Product Badges & Marketing Labels
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {badges.map((b) => {
                const isSelected = selectedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => handleToggleBadge(b.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : '#080d18',
                      border: isSelected ? '1px solid #818cf8' : '1px solid #1e293b',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: b.bgColor || '#1e293b',
                        color: b.color || '#fbbf24',
                      }}
                    >
                      {b.icon ? `${b.icon} ` : ''}
                      {b.label}
                    </span>
                    <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. SEO METADATA */}
        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
              Search Engine Optimization (SEO)
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                Meta Title
              </label>
              <input
                type="text"
                value={form.seoTitle || ''}
                onChange={(e) => updateForm({ seoTitle: e.target.value })}
                placeholder="e.g. Royal Marigold Mandap | Shiv Shakti Events Mart"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#080d18',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                Meta Description
              </label>
              <textarea
                rows={3}
                value={form.seoDescription || ''}
                onChange={(e) => updateForm({ seoDescription: e.target.value })}
                placeholder="High-converting search snippet description..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#080d18',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
                Target Keywords
              </label>
              <input
                type="text"
                value={form.seoKeywords || ''}
                onChange={(e) => updateForm({ seoKeywords: e.target.value })}
                placeholder="e.g. wedding mandap, royal stage, delhi event logistics"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#080d18',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={handleMediaPickerSelect}
          title={
            mediaPickerTarget === 'primary'
              ? 'Select Primary Product Image'
              : 'Add Image to Product Gallery'
          }
        />
      )}

      {/* Unsaved Changes Confirmation Dialog */}
      {showExitConfirm && (
        <ConfirmDialog
          isOpen={showExitConfirm}
          onClose={() => setShowExitConfirm(false)}
          onConfirm={() => navigate('/admin/products')}
          title="Discard Unsaved Changes?"
          message="You have unsaved changes on this product SKU. Leaving now will permanently discard them."
          confirmText="Discard & Leave"
        />
      )}

      {/* Delete SKU Confirmation Dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteProduct}
          title="Delete Product SKU"
          message={`Are you sure you want to permanently delete "${form.name || form.sku || 'this product'}"? All inventory listings, images, and catalog associations for this SKU will be removed permanently. This action cannot be undone.`}
          confirmText="Delete SKU Permanently"
          isDestructive={true}
          isLoading={isDeletingProduct}
        />
      )}
    </div>
  );
};

export default ProductEditorPage;
