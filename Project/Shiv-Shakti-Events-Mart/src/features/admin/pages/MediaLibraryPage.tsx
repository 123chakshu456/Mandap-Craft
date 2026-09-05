import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Search,
  Folder,
  Loader2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { mediaApi } from '../../media/services/mediaApi';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type { MediaAsset } from '../../../shared/types/models.types';

export const MediaLibraryPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [targetFolder, setTargetFolder] = useState('shiv-shakti-events/library');
  const [altTextInput, setAltTextInput] = useState('');
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');

  // UI Feedback
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load assets from backend
  const loadAssets = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await mediaApi.getMediaAssets({
        page,
        limit: 24,
        search: search.trim() || undefined,
        folder: selectedFolder !== 'all' ? selectedFolder : undefined,
      });
      setAssets(res.assets || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error('Failed to load media library:', err);
      setErrorMsg(err.message || 'Failed to connect to media storage.');
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedFolder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAssets();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadAssets]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    if (!altTextInput) {
      setAltTextInput(file.name.replace(/\.[^/.]+$/, ''));
    }
    setShowUploadPanel(true);
  };

  const handleExecuteUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUploadFile) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      await mediaApi.uploadImage(selectedUploadFile, targetFolder, altTextInput);
      setSuccessMsg(`Successfully uploaded "${selectedUploadFile.name}" to Cloudinary CDN.`);
      setSelectedUploadFile(null);
      setUploadPreview('');
      setAltTextInput('');
      setShowUploadPanel(false);
      loadAssets();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed. Ensure Cloudinary credentials are valid.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await mediaApi.deleteMediaAsset(deleteTarget.id);
      setDeleteTarget(null);
      setSuccessMsg('Media asset deleted from database and Cloudinary.');
      loadAssets();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete media asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notifications */}
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

      {errorMsg && (
        <div
          style={{
            marginBottom: '16px',
            padding: '12px 18px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
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
              Cloudinary Media CDN & Asset Hub
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
              Neon Postgres Linked
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            {total} synchronized assets. Stream high-res event photography directly into global CDN edge nodes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: '#fff',
              border: 'none',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Upload size={16} />
            <span>Upload Media Asset</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Upload Slide-down Form */}
      {showUploadPanel && (
        <form
          onSubmit={handleExecuteUpload}
          style={{
            background: '#0d1526',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
              Confirm Upload Details
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowUploadPanel(false);
                setSelectedUploadFile(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#080d18',
                border: '1px solid #1e293b',
              }}
            >
              {uploadPreview ? (
                <img src={uploadPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <ImageIcon size={24} />
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                Asset Alt Text / Description
              </label>
              <input
                type="text"
                value={altTextInput}
                onChange={(e) => setAltTextInput(e.target.value)}
                placeholder="Descriptive name for SEO and accessibility"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#080d18',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                Cloudinary Storage Folder
              </label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#080d18',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '0.84rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="shiv-shakti-events/library">shiv-shakti-events/library</option>
                <option value="shiv-shakti-events/products">shiv-shakti-events/products</option>
                <option value="shiv-shakti-events/banners">shiv-shakti-events/banners</option>
                <option value="shiv-shakti-events/cms">shiv-shakti-events/cms</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={isUploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                }}
              >
                {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                <span>{isUploading ? 'Streaming...' : 'Confirm Upload'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
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
            placeholder="Search CDN assets by name, tag, or format..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Folder size={15} color="#64748b" />
          <select
            value={selectedFolder}
            onChange={(e) => {
              setSelectedFolder(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '9px 14px',
              background: '#080d18',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#cbd5e1',
              fontSize: '0.84rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All CDN Folders</option>
            <option value="shiv-shakti-events">General</option>
            <option value="shiv-shakti-events/library">Library</option>
            <option value="shiv-shakti-events/products">Products</option>
            <option value="shiv-shakti-events/banners">Banners</option>
            <option value="shiv-shakti-events/cms">CMS Pages</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div
          style={{
            height: '360px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: '#64748b',
          }}
        >
          <Loader2 size={32} className="animate-spin" color="#6366f1" />
          <span style={{ fontSize: '0.88rem' }}>Loading synchronized CDN media library...</span>
        </div>
      ) : assets.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            color: '#64748b',
          }}
        >
          <ImageIcon size={44} color="#334155" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: 0, color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>
            No assets found matching filters
          </h3>
          <p style={{ margin: '6px 0 16px', fontSize: '0.84rem' }}>
            Upload raw event photography to build your centralized media catalog.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '8px 18px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Upload First Asset
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {assets.map((asset) => (
            <div
              key={asset.id}
              style={{
                background: '#0d1526',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ height: '180px', background: '#080d18', position: 'relative' }}>
                <img
                  src={asset.url}
                  alt={asset.altText || asset.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  {asset.format && (
                    <span
                      style={{
                        background: 'rgba(3, 7, 18, 0.8)',
                        color: '#60a5fa',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(96, 165, 250, 0.2)',
                      }}
                    >
                      {asset.format}
                    </span>
                  )}
                  {asset.folder && (
                    <span
                      style={{
                        background: 'rgba(3, 7, 18, 0.8)',
                        color: '#94a3b8',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {asset.folder.split('/').pop()}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={asset.name}
                  >
                    {asset.name}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      color: '#64748b',
                      marginTop: '4px',
                    }}
                  >
                    <span>{asset.width ? `${asset.width}×${asset.height} px` : 'Optimized'}</span>
                    <span>{formatFileSize(asset.bytes)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleCopy(asset.url)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '7px 10px',
                      background: copiedUrl === asset.url ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: copiedUrl === asset.url ? '#34d399' : '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {copiedUrl === asset.url ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedUrl === asset.url ? 'Copied CDN URL!' : 'Copy CDN URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open(asset.url, '_blank')}
                    style={{
                      padding: '7px 10px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                    title="Open in Cloudinary CDN"
                  >
                    <ExternalLink size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(asset)}
                    style={{
                      padding: '7px 10px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '6px',
                      color: '#f87171',
                      cursor: 'pointer',
                    }}
                    title="Delete Asset"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '24px',
            padding: '12px 18px',
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '10px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Page {page} of {totalPages} ({total} assets)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: page <= 1 ? '#475569' : '#cbd5e1',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
              }}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: page >= totalPages ? '#475569' : '#cbd5e1',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Media Asset"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This will permanently remove it from Cloudinary CDN and Postgres.`}
          confirmText={isDeleting ? 'Deleting...' : 'Delete Forever'}
        />
      )}
    </div>
  );
};

export default MediaLibraryPage;
