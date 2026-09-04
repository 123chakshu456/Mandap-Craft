import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
} from 'lucide-react';
import { badgeApi } from '../../badges/services/badgeApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Badge } from '../../../shared/types/models.types';

export const BadgeManagerPage: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Partial<Badge> | null>(null);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Badge | null>(null);

  const loadBadges = async () => {
    setLoading(true);
    try {
      const list = await badgeApi.getAdminBadges();
      setBadges(list);
    } catch (err) {
      console.error('Failed to load badges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBadges();
  }, []);

  const handleOpenCreate = () => {
    setEditingBadge({
      name: '',
      slug: '',
      label: '',
      color: '#f59e0b',
      bgColor: '#451a03',
      icon: '👑',
      sortOrder: 0,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingBadge?.name || !editingBadge?.label) return;
    try {
      if (editingBadge.id) {
        await badgeApi.update(editingBadge.id, editingBadge);
      } else {
        await badgeApi.create(editingBadge);
      }
      setModalOpen(false);
      setEditingBadge(null);
      loadBadges();
    } catch (err: any) {
      alert(err.message || 'Failed to save badge.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await badgeApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadBadges();
    } catch (err: any) {
      alert(err.message || 'Failed to delete badge.');
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
            Promotional Badges & Marketing Labels
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Manage promotional ribbons and badges displayed on store product cards and catalog facets.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
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
          <span>Create New Badge</span>
        </button>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading badges...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                background: '#0d1526',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      background: b.bgColor,
                      color: b.color,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '100px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {b.icon && <span>{b.icon}</span>}
                    {b.label}
                  </span>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: b.isActive ? '#10b981' : '#64748b',
                      background: b.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {b.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>{b.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                  slug: {b.slug} &bull; order: {b.sortOrder}
                </div>

                {b.productCount !== undefined && (
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={13} color="#64748b" /> Assigned to {b.productCount} SKUs
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', borderTop: '1px solid #1a2335', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setEditingBadge(b); setModalOpen(true); }}
                  style={{ padding: '5px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(b)}
                  style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && editingBadge && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingBadge.id ? `Edit Badge: ${editingBadge.label}` : 'Create Marketing Badge'}
          footer={
            <>
              <button onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save Badge</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Badge Label *</label>
              <input type="text" value={editingBadge.label || ''} onChange={(e) => setEditingBadge({ ...editingBadge, label: e.target.value, name: e.target.value })} placeholder="e.g. Royal Bestseller" style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Text Color (Hex)</label>
                <input type="text" value={editingBadge.color || '#f59e0b'} onChange={(e) => setEditingBadge({ ...editingBadge, color: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Background Color (Hex)</label>
                <input type="text" value={editingBadge.bgColor || '#451a03'} onChange={(e) => setEditingBadge({ ...editingBadge, bgColor: e.target.value })} style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Icon Emoji</label>
              <input type="text" value={editingBadge.icon || ''} onChange={(e) => setEditingBadge({ ...editingBadge, icon: e.target.value })} placeholder="e.g. 👑, ⚡, ⭐" style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Badge"
          message={`Are you sure you want to delete badge "${deleteTarget.label}"?`}
          confirmText="Delete"
        />
      )}
    </div>
  );
};

export default BadgeManagerPage;
