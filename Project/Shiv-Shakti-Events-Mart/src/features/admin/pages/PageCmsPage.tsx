import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  Code,
  Columns,
  Image as ImageIcon,
  FolderOpen,
  Globe,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { pageApi } from '../../pages-cms/services/pageApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import { MediaPickerModal } from '../../../shared/components/MediaPickerModal/MediaPickerModal';
import type { Page } from '../../../shared/types/models.types';

// Simple, secure Markdown to HTML renderer for CMS live preview
const renderMarkdown = (md: string) => {
  if (!md) return '';

  const lines = md.split('\n');
  const rendered: string[] = [];
  let inList = false;

  lines.forEach((line) => {
    let l = line;

    // Headers
    if (l.startsWith('#### ')) {
      rendered.push(`<h4 style="color:#f8fafc;font-size:1rem;margin:14px 0 6px;font-weight:700;">${parseInline(l.slice(5))}</h4>`);
      return;
    }
    if (l.startsWith('### ')) {
      rendered.push(`<h3 style="color:#f8fafc;font-size:1.15rem;margin:16px 0 8px;font-weight:700;">${parseInline(l.slice(4))}</h3>`);
      return;
    }
    if (l.startsWith('## ')) {
      rendered.push(`<h2 style="color:#f8fafc;font-size:1.3rem;margin:20px 0 10px;font-weight:800;border-bottom:1px solid #1e293b;padding-bottom:6px;">${parseInline(l.slice(3))}</h2>`);
      return;
    }
    if (l.startsWith('# ')) {
      rendered.push(`<h1 style="color:#f8fafc;font-size:1.6rem;margin:24px 0 12px;font-weight:800;background:linear-gradient(135deg,#fff,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${parseInline(l.slice(2))}</h1>`);
      return;
    }

    // Horizontal Rule
    if (l.trim() === '---' || l.trim() === '***') {
      rendered.push('<hr style="border:none;border-top:1px solid #1e293b;margin:20px 0;" />');
      return;
    }

    // Blockquote
    if (l.startsWith('> ')) {
      rendered.push(`<blockquote style="border-left:3px solid #6366f1;padding-left:14px;color:#94a3b8;font-style:italic;margin:12px 0;">${parseInline(l.slice(2))}</blockquote>`);
      return;
    }

    // Unordered List
    if (l.startsWith('- ') || l.startsWith('* ')) {
      if (!inList) {
        inList = true;
        rendered.push('<ul style="margin:8px 0;padding-left:20px;color:#cbd5e1;">');
      }
      rendered.push(`<li style="margin-bottom:4px;">${parseInline(l.slice(2))}</li>`);
      return;
    } else if (inList) {
      inList = false;
      rendered.push('</ul>');
    }

    // Empty lines
    if (!l.trim()) {
      rendered.push('<div style="height:10px;"></div>');
      return;
    }

    // Regular Paragraph
    rendered.push(`<p style="color:#cbd5e1;line-height:1.65;margin:8px 0;font-size:0.92rem;">${parseInline(l)}</p>`);
  });

  if (inList) rendered.push('</ul>');
  return rendered.join('\n');
};

const parseInline = (text: string) => {
  return text
    // Images: ![alt](url)
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:12px 0;box-shadow:0 4px 12px rgba(0,0,0,0.5);" />')
    // Links: [text](url)
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#818cf8;text-decoration:underline;">$1</a>')
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f8fafc;">$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em style="color:#e2e8f0;">$1</em>')
    // Inline Code: `code`
    .replace(/`(.*?)`/g, '<code style="background:#1e293b;color:#a5b4fc;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em;">$1</code>');
};

export const PageCmsPage: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Partial<Page> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // CMS Editor View Mode: 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');

  // Media Picker Modal for CMS
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'hero' | 'content'>('content');

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
      content: '# Custom Fabrication & Mandap Manufacturing\n\nShiv Shakti Events Mart specializes in heavy-duty commercial mandap framing, velvet draping systems, and artisanal fiberglass setups.\n\n## Our Capabilities\n- Precision CNC metal welding and load engineering\n- Commercial fire-retardant fabric finishing\n- Turnkey site assembly across Delhi NCR & North India\n\n> "Crafting iconic ceremonial environments for 25+ years."',
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
        setSuccessMsg(`Page "${editingPage.title}" updated successfully.`);
      } else {
        await pageApi.create(payload);
        setSuccessMsg(`Page "${editingPage.title}" published successfully.`);
      }

      setModalOpen(false);
      setEditingPage(null);
      loadPages();
      setTimeout(() => setSuccessMsg(''), 4000);
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
      setSuccessMsg('Page deleted successfully.');
      loadPages();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete page.');
    }
  };

  const handleMediaPickerSelect = (asset: { url: string; altText?: string; publicId?: string; name?: string }) => {
    if (!editingPage) return;

    if (mediaPickerTarget === 'hero') {
      setEditingPage((prev) => ({ ...prev, heroImage: asset.url }));
    } else {
      // Insert Markdown image into content
      const imgMarkdown = `\n\n![${asset.altText || asset.name || 'Event Photography'}](${asset.url})\n\n`;
      setEditingPage((prev) => ({
        ...prev,
        content: (prev?.content || '') + imgMarkdown,
      }));
    }
  };

  const renderedPreviewHtml = useMemo(() => {
    return renderMarkdown(editingPage?.content || '');
  }, [editingPage?.content]);

  // SERP character counters
  const serpTitle = (editingPage?.seoTitle || editingPage?.title || 'Page Title') + ' | Shiv Shakti Events Mart';
  const serpDescription =
    editingPage?.seoDescription ||
    (editingPage?.content ? editingPage.content.replace(/[#*`_>[\]!()-]/g, '').slice(0, 155) + '...' : 'Explore Shiv Shakti Events Mart dynamic ceremonial infrastructure and catalog...');
  const serpSlug = editingPage?.slug || 'page-slug';

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Notifications */}
      {successMsg && (
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
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Dynamic Website Pages CMS
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '99px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
              }}
            >
              <Sparkles size={11} />
              Markdown + SERP Studio
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Author marketing landing pages, manufacturing narratives, and client policies with live rendering and Google SERP snippet previews.
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
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: '#080d18', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
              <th style={{ padding: '12px 16px' }}>Page Title</th>
              <th style={{ padding: '12px 16px' }}>URL Route</th>
              <th style={{ padding: '12px 16px' }}>Lifecycle Status</th>
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
                  No dynamic pages created yet. Click "Create New Page" to publish your first content piece.
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
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: '99px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: isPub ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isPub ? '#34d399' : '#fbbf24',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: isPub ? '#34d399' : '#fbbf24',
                          }}
                        />
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
                          style={{
                            padding: '5px 8px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                          }}
                          title="View Live Page"
                        >
                          <ExternalLink size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          style={{
                            padding: '5px 8px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '6px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                          }}
                          title="Edit Content"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          style={{
                            padding: '5px 8px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            color: '#f87171',
                            cursor: 'pointer',
                          }}
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

      {/* Editor Modal with Split View & SERP Preview */}
      {modalOpen && editingPage && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingPage.id ? `Edit Page: ${editingPage.title}` : 'Dynamic CMS Studio'}
          maxWidth="1100px"
          footer={
            <>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                disabled={isSaving}
                onClick={() => handleSave('DRAFT')}
                style={{
                  padding: '8px 16px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
              >
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                disabled={isSaving}
                onClick={() => handleSave('PUBLISHED')}
                style={{
                  padding: '8px 20px',
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}
              >
                {isSaving ? 'Publishing...' : 'Publish Page'}
              </button>
            </>
          }
        >
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '0.82rem',
                marginBottom: '16px',
              }}
            >
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title & Slug Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Page Title *
                </label>
                <input
                  type="text"
                  value={editingPage.title || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  placeholder="e.g. Custom Manufacturing Capabilities"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
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
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                  URL Route Slug
                </label>
                <input
                  type="text"
                  value={editingPage.slug || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  placeholder="e.g. custom-manufacturing"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#818cf8',
                    fontFamily: 'monospace',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Hero Image with Media Picker button */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Hero Banner Image URL
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('hero');
                    setMediaPickerOpen(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: '#818cf8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <FolderOpen size={13} />
                  <span>Choose from Media Library</span>
                </button>
              </div>
              <input
                type="text"
                value={editingPage.heroImage || ''}
                onChange={(e) => setEditingPage({ ...editingPage, heroImage: e.target.value })}
                placeholder="https://res.cloudinary.com/..."
                style={{
                  width: '100%',
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

            {/* Content Toolbar with View Mode Switches */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#080d18',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Content Editor:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget('content');
                    setMediaPickerOpen(true);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#a5b4fc',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <ImageIcon size={13} />
                  <span>Insert Image from CDN</span>
                </button>
              </div>

              {/* View Mode Switches */}
              <div style={{ display: 'flex', background: '#0d1526', borderRadius: '6px', padding: '2px', border: '1px solid #1e293b' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('editor')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: viewMode === 'editor' ? '#1e293b' : 'transparent',
                    color: viewMode === 'editor' ? '#f8fafc' : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Code size={13} />
                  <span>Editor Only</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: viewMode === 'split' ? '#1e293b' : 'transparent',
                    color: viewMode === 'split' ? '#f8fafc' : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Columns size={13} />
                  <span>Split View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: viewMode === 'preview' ? '#1e293b' : 'transparent',
                    color: viewMode === 'preview' ? '#f8fafc' : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Eye size={13} />
                  <span>Live Preview</span>
                </button>
              </div>
            </div>

            {/* Split Screen Container */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  viewMode === 'split' ? '1fr 1fr' : viewMode === 'editor' ? '1fr' : '1fr',
                gap: '16px',
                minHeight: '340px',
              }}
            >
              {/* Left Column: Markdown Editor */}
              {(viewMode === 'split' || viewMode === 'editor') && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <textarea
                    rows={14}
                    value={editingPage.content || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                    placeholder="# Page Header&#10;&#10;Write markdown content with headers, bullets, and images..."
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '14px',
                      background: '#080d18',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '0.86rem',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      lineHeight: '1.6',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>
              )}

              {/* Right Column: Live Rendered Preview */}
              {(viewMode === 'split' || viewMode === 'preview') && (
                <div
                  style={{
                    padding: '16px 20px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    overflowY: 'auto',
                    maxHeight: '380px',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                    Live HTML / Markdown Preview
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: renderedPreviewHtml }}
                    style={{ color: '#cbd5e1' }}
                  />
                </div>
              )}
            </div>

            {/* Google SERP Snippet Preview Card */}
            <div
              style={{
                background: '#080d18',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Globe size={15} color="#60a5fa" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase' }}>
                  Google Search Engine SERP Card Preview
                </span>
              </div>

              {/* Google Result Box */}
              <div
                style={{
                  background: '#0d1526',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  maxWidth: '650px',
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>https://shivshaktieventsmart.com</span>
                  <span>›</span>
                  <span>page</span>
                  <span>›</span>
                  <span style={{ color: '#818cf8' }}>{serpSlug}</span>
                </div>
                <div
                  style={{
                    color: '#8ab4f8',
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    lineHeight: '1.3',
                    cursor: 'pointer',
                  }}
                >
                  {serpTitle}
                </div>
                <div style={{ color: '#bdc1c6', fontSize: '0.82rem', lineHeight: '1.45', marginTop: '2px' }}>
                  {serpDescription}
                </div>
              </div>

              {/* SERP Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                      SEO Meta Title
                    </label>
                    <span style={{ fontSize: '0.7rem', color: (editingPage.seoTitle?.length || 0) > 60 ? '#f87171' : '#64748b' }}>
                      {editingPage.seoTitle?.length || 0} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingPage.seoTitle || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                    placeholder="Custom page title for search engines"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#0d1526',
                      border: '1px solid #1e293b',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                      SEO Meta Description
                    </label>
                    <span style={{ fontSize: '0.7rem', color: (editingPage.seoDescription?.length || 0) > 160 ? '#f87171' : '#64748b' }}>
                      {editingPage.seoDescription?.length || 0} / 160 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingPage.seoDescription || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, seoDescription: e.target.value })}
                    placeholder="Short summary displayed under the search result snippet"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#0d1526',
                      border: '1px solid #1e293b',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
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
          title="Delete CMS Page"
          message={`Are you sure you want to permanently delete page "${deleteTarget.title}"?`}
          confirmText="Delete Page"
        />
      )}

      {/* Media Picker Modal for CMS */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelect={handleMediaPickerSelect}
          title={
            mediaPickerTarget === 'hero'
              ? 'Select Hero Banner Image'
              : 'Insert Media into Markdown Content'
          }
        />
      )}
    </div>
  );
};

export default PageCmsPage;
