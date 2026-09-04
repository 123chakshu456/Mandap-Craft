import React, { useEffect, useState } from 'react';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Package,
} from 'lucide-react';
import { categoryApi } from '../../categories/services/categoryApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Category } from '../../../shared/types/models.types';

export const CategoryManagerPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [targetLevel, setTargetLevel] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTree = async () => {
    setLoading(true);
    try {
      const tree = await categoryApi.getAdminTree();
      setCategories(tree);
      // Auto expand root items
      const initialExp: Record<string, boolean> = {};
      tree.forEach((c) => { initialExp[c.id] = true; });
      setExpandedNodes(initialExp);
    } catch (err) {
      console.error('Failed to load category tree:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenCreate = (parentId: string | null = null, level: number = 1) => {
    setTargetParentId(parentId);
    setTargetLevel(level);
    setEditingCategory({
      name: '',
      slug: '',
      shortTitle: '',
      tagline: '',
      description: '',
      image: '',
      icon: '',
      badge: '',
      sortOrder: 0,
      isActive: true,
      popularItems: [],
      promo: {
        title: '',
        subtitle: '',
        badge: '',
        discount: '',
        image: '',
        ctaText: 'Explore Category',
      },
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory({
      ...cat,
      promo: cat.promo || {
        title: '',
        subtitle: '',
        badge: '',
        discount: '',
        image: '',
        ctaText: 'Explore Category',
      },
      popularItems: Array.isArray(cat.popularItems) ? cat.popularItems : [],
    });
    setTargetParentId(cat.parentId || null);
    setTargetLevel(cat.level || 1);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCategory?.name?.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        ...editingCategory,
        parentId: targetParentId,
        level: targetLevel,
      };

      if (editingCategory.id) {
        await categoryApi.update(editingCategory.id, payload);
      } else {
        await categoryApi.create(payload);
      }

      setModalOpen(false);
      setEditingCategory(null);
      loadTree();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      await categoryApi.toggleStatus(cat.id, !cat.isActive);
      loadTree();
    } catch (err: any) {
      alert(err.message || 'Failed to update category status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await categoryApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadTree();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category. Ensure no products are linked.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: Category, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];

    return (
      <div key={node.id} style={{ marginLeft: depth > 0 ? '24px' : '0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: depth === 0 ? '#0d1526' : depth === 1 ? '#0a1020' : '#080d18',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            marginBottom: '8px',
            transition: 'all 0.15s',
          }}
        >
          {/* Left: Expand toggle & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: 0 }}
              >
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            ) : (
              <div style={{ width: 18 }} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: depth === 0 ? '1rem' : '0.88rem', fontWeight: depth === 0 ? 700 : 600, color: '#f8fafc' }}>
                {node.icon ? `${node.icon} ` : ''}{node.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                ({node.slug})
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: depth === 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(51, 65, 85, 0.4)',
                  color: depth === 0 ? '#a5b4fc' : '#94a3b8',
                  fontWeight: 600,
                }}
              >
                Level {node.level}
              </span>
              {node.productCount !== undefined && node.productCount > 0 && (
                <span style={{ fontSize: '0.7rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Package size={12} /> {node.productCount} SKUs
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Add Child button if level < 3 */}
            {node.level < 3 && (
              <button
                type="button"
                onClick={() => handleOpenCreate(node.id, node.level + 1)}
                style={{
                  padding: '4px 8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#818cf8',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={12} /> Add Sub
              </button>
            )}

            {/* Toggle Active */}
            <button
              type="button"
              onClick={() => handleToggleStatus(node)}
              style={{
                padding: '4px 8px',
                background: node.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: '1px solid transparent',
                borderRadius: '6px',
                color: node.isActive ? '#34d399' : '#f87171',
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              {node.isActive ? 'Active' : 'Disabled'}
            </button>

            {/* Edit */}
            <button
              type="button"
              onClick={() => handleOpenEdit(node)}
              style={{
                padding: '4px 8px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <Pencil size={13} />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => setDeleteTarget(node)}
              style={{
                padding: '4px 8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#f87171',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Render Children Recursively */}
        {hasChildren && isExpanded && (
          <div style={{ marginTop: '4px', marginBottom: '8px' }}>
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
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
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            3-Tier Category Taxonomy Manager
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Structure and maintain Root Verticals (L1), Subcategories (L2), and Sub-subcategories (L3).
          </p>
        </div>

        <button
          onClick={() => handleOpenCreate(null, 1)}
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
          <span>Add Root Category</span>
        </button>
      </div>

      {/* ── TREE VIEW CONTAINER ── */}
      <div
        style={{
          background: '#0a0f1d',
          border: '1px solid #1e293b',
          borderRadius: '14px',
          padding: '24px',
        }}
      >
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading category hierarchy...
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No categories defined. Click "Add Root Category" to begin.
          </div>
        ) : (
          categories.map((root) => renderTreeNode(root, 0))
        )}
      </div>

      {/* ── CREATE / EDIT CATEGORY MODAL ── */}
      {modalOpen && editingCategory && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCategory.id ? `Edit Category: ${editingCategory.name}` : `Create Level ${targetLevel} Category`}
          maxWidth="640px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                {isSaving ? 'Saving...' : 'Save Category'}
              </button>
            </>
          }
        >
          {errorMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.82rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Wedding Mandaps"
                  style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Custom Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. wedding-mandaps"
                  style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Short Title / Tagline
                </label>
                <input
                  type="text"
                  value={editingCategory.shortTitle || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, shortTitle: e.target.value })}
                  placeholder="e.g. Mandaps"
                  style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Icon Emoji / Badge
                </label>
                <input
                  type="text"
                  value={editingCategory.icon || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  placeholder="e.g. 🎪"
                  style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                Banner Image URL
              </label>
              <input
                type="text"
                value={editingCategory.image || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                Description
              </label>
              <textarea
                rows={3}
                value={editingCategory.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                placeholder="Catalog vertical description..."
                style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget.name}"? If there are any child subcategories or assigned products, delete will be prevented to protect catalog integrity.`}
          confirmText="Delete Category"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CategoryManagerPage;
