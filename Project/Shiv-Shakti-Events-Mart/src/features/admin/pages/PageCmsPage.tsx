import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { pageApi } from '../../pages-cms/services/pageApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { Page } from '../../../shared/types/models.types';

export const PageCmsPage: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Partial<Page> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null);

  const loadPages = async () => {
    setLoading(true);
    try {
      const list = await pageApi.getAdminPages();
      setPages(list);
    } catch (err) {
      console.error('Failed to load CMS pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleOpenCreate = () => {
    setEditingPage({
      title: '',
      slug: '',
      content: '# New Page Title\n\nWrite rich content here...',
      heroImage: '',
      seoTitle: '',
      seoDescription: '',
      status: 'PUBLISHED',
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Page) => {
    setEditingPage(p);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSave = async (statusOverride?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED') => {
    if (!editingPage?.title || !editingPage?.content) {
      setErrorMsg('Title and content are required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        ...editingPage,
        status: statusOverride || editingPage.status || 'PUBLISHED',
      };

      if (editingPage.id) {
        await pageApi.update(editingPage.id, payload);
      } else {
        await pageApi.create(payload);
      }

      setModalOpen(false);
      setEditingPage(null);
      loadPages();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save page.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await pageApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      loadPages();
    } catch (err: any) {
      alert(err.message || 'Failed to delete page.');
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
            Dynamic Website Pages CMS
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Publish and manage dynamic landing pages, corporate manufacturing narratives, and legal policies.
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
          <span>Create New Page</span>
        </button>
      </div>

      {/* Pages Table */}
      <div
        style={{
          background: '#0d1526',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: '#080d18', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
              <th style={{ padding: '12px 16px' }}>Page Title</th>
              <th style={{ padding: '12px 16px' }}>URL Route</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Last Updated</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  Loading CMS pages...
                </td>
              </tr>
            ) : pages.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  No pages created.
                </td>
              </tr>
            ) : (
              pages.map((p) => {
                const isPub = p.status === 'PUBLISHED';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #1a2335' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#f1f5f9' }}>
                      {p.title}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#818cf8', fontSize: '0.8rem' }}>
                      /page/{p.slug}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '99px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: isPub ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isPub ? '#34d399' : '#fbbf24',
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => window.open(`/page/${p.slug}`, '_blank')}
                          style={{ padding: '5px 8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer' }}
                          title="View Live Page"
                        >
                          <ExternalLink size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          style={{ padding: '5px 8px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer' }}
                          title="Edit Content"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#f87171', cursor: 'pointer' }}
                          title="Delete Page"
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

      {/* Editor Modal */}
      {modalOpen && editingPage && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingPage.id ? `Edit Page: ${editingPage.title}` : 'Create Dynamic CMS Page'}
          maxWidth="840px"
          footer={
            <>
              <button onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>Cancel</button>
              <button disabled={isSaving} onClick={() => handleSave('DRAFT')} style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#cbd5e1', cursor: isSaving ? 'not-allowed' : 'pointer' }}>{isSaving ? 'Saving...' : 'Save as Draft'}</button>
              <button disabled={isSaving} onClick={() => handleSave('PUBLISHED')} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer' }}>{isSaving ? 'Publishing...' : 'Publish Page'}</button>
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
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Page Title *</label>
                <input type="text" value={editingPage.title || ''} onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })} placeholder="e.g. Custom Manufacturing Capabilities" style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>URL Slug</label>
                <input type="text" value={editingPage.slug || ''} onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })} placeholder="e.g. custom-manufacturing" style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Hero Banner Image URL</label>
              <input type="text" value={editingPage.heroImage || ''} onChange={(e) => setEditingPage({ ...editingPage, heroImage: e.target.value })} placeholder="https://images.unsplash.com/..." style={{ width: '100%', padding: '9px 12px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Page Content (Markdown / HTML) *</label>
              <textarea rows={10} value={editingPage.content || ''} onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })} style={{ width: '100%', padding: '12px 14px', background: '#080d18', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none', resize: 'vertical' }} />
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
          title="Delete Page"
          message={`Are you sure you want to delete page "${deleteTarget.title}"?`}
          confirmText="Delete"
        />
      )}
    </div>
  );
};

export default PageCmsPage;
