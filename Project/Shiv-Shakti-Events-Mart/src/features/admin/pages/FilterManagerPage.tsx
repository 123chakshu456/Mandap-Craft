import React, { useEffect, useState } from 'react';
import {
  Sliders,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { filterApi } from '../../filters/services/filterApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Filter } from '../../../shared/types/models.types';

export const FilterManagerPage: React.FC = () => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter Modal
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<Partial<Filter> | null>(null);

  // Value Modal
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<{ id?: string; label: string; value?: string; sortOrder?: number } | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'filter' | 'value'; filterId: string; valueId?: string; name: string } | null>(null);

  const loadFilters = async () => {
    setLoading(true);
    try {
      const list = await filterApi.getAdminFilters();
      setFilters(list);
    } catch (err) {
      console.error('Failed to load filters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const handleOpenCreateFilter = () => {
    setEditingFilter({
      name: '',
      label: '',
      key: '',
      type: 'select',
      sortOrder: 0,
      isActive: true,
      applicableCategories: ['all'],
    });
    setFilterModalOpen(true);
  };

  const handleSaveFilter = async () => {
    if (!editingFilter?.name || !editingFilter?.label) return;
    try {
      if (editingFilter.id) {
        await filterApi.update(editingFilter.id, editingFilter);
      } else {
        await filterApi.create(editingFilter);
      }
      setFilterModalOpen(false);
      setEditingFilter(null);
      loadFilters();
    } catch (err: any) {
      alert(err.message || 'Failed to save filter.');
    }
  };

  const handleOpenAddValue = (filterId: string) => {
    setActiveFilterId(filterId);
    setEditingValue({ label: '', value: '', sortOrder: 0 });
    setValueModalOpen(true);
  };

  const handleSaveValue = async () => {
    if (!activeFilterId || !editingValue?.label) return;
    try {
      if (editingValue.id) {
        await filterApi.updateValue(activeFilterId, editingValue.id, editingValue);
      } else {
        await filterApi.addValue(activeFilterId, editingValue);
      }
      setValueModalOpen(false);
      setEditingValue(null);
      loadFilters();
    } catch (err: any) {
      alert(err.message || 'Failed to save filter option.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'filter') {
        await filterApi.delete(deleteTarget.filterId);
      } else if (deleteTarget.valueId) {
        await filterApi.deleteValue(deleteTarget.filterId, deleteTarget.valueId);
      }
      setDeleteTarget(null);
      loadFilters();
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
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
            Dynamic Filter Facet Builder
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Configure filter attributes (e.g. Style, Material, Color, Seating) and manage selectable facet options.
          </p>
        </div>

        <button
          onClick={handleOpenCreateFilter}
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
          <span>Add Filter Group</span>
        </button>
      </div>

      {/* ── FILTERS LIST ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading dynamic filters...
          </div>
        ) : filters.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No dynamic filters configured.
          </div>
        ) : (
          filters.map((f) => (
            <div
              key={f.id}
              style={{
                background: '#0d1526',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              {/* Filter Top Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sliders size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      {f.label} <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>({f.key})</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Type: {f.type} • Status: {f.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenAddValue(f.id)}
                    style={{ padding: '5px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={12} /> Add Value
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingFilter(f); setFilterModalOpen(true); }}
                    style={{ padding: '5px 8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ type: 'filter', filterId: f.id, name: f.label })}
                    style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Filter Values Pill Grid */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {f.values.length === 0 ? (
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>No values added yet.</span>
                ) : (
                  f.values.map((v) => (
                    <div
                      key={v.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#080d18',
                        border: '1px solid #1e293b',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        color: '#cbd5e1',
                      }}
                    >
                      <span>{v.label}</span>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: 'value', filterId: f.id, valueId: v.id, name: v.label })}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Modal */}
      {filterModalOpen && editingFilter && (
        <Modal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          title={editingFilter.id ? `Edit Filter: ${editingFilter.label}` : 'Create Dynamic Filter'}
          footer={
            <>
              <button onClick={() => setFilterModalOpen(false)} style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveFilter} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save Filter</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Filter Display Label *</label>
              <input type="text" value={editingFilter.label || ''} onChange={(e) => setEditingFilter({ ...editingFilter, label: e.target.value, name: e.target.value })} placeholder="e.g. Structure Style" style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Filter Key (Slug Identifier)</label>
              <input type="text" value={editingFilter.key || ''} onChange={(e) => setEditingFilter({ ...editingFilter, key: e.target.value })} placeholder="e.g. style" style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem', outline: 'none' }} />
            </div>
          </div>
        </Modal>
      )}

      {/* Filter Value Modal */}
      {valueModalOpen && editingValue && (
        <Modal
          isOpen={valueModalOpen}
          onClose={() => setValueModalOpen(false)}
          title="Add Filter Option"
          maxWidth="440px"
          footer={
            <>
              <button onClick={() => setValueModalOpen(false)} style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveValue} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Add Value</button>
            </>
          }
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Value Label *</label>
            <input type="text" value={editingValue.label || ''} onChange={(e) => setEditingValue({ ...editingValue, label: e.target.value })} placeholder="e.g. Victorian Vintage" style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${deleteTarget.type === 'filter' ? 'Filter' : 'Option'}`}
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          confirmText="Delete"
        />
      )}
    </div>
  );
};

export default FilterManagerPage;
