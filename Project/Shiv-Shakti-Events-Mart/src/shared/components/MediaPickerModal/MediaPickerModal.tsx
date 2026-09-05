import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  Folder,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { mediaApi } from '../../../features/media/services/mediaApi';
import type { MediaAsset } from '../../types/models.types';

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: { url: string; altText?: string; publicId?: string; name?: string }) => void;
  title?: string;
  folder?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
  folder = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>(folder);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [altTextInput, setAltTextInput] = useState('');
  const [uploadFolder, setUploadFolder] = useState('shiv-shakti-events');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load library assets
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await mediaApi.getMediaAssets({
          limit: 36,
          search: search.trim() || undefined,
          folder: selectedFolder !== 'all' ? selectedFolder : undefined,
        });
        if (!isCancelled) {
          setAssets(res.assets || []);
        }
      } catch (err) {
        console.error('Failed to load media assets:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    const timer = setTimeout(fetchAssets, 250);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, search, selectedFolder]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    if (!altTextInput) {
      setAltTextInput(file.name.replace(/\.[^/.]+$/, ''));
    }
    setUploadError('');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadError('');
    try {
      const res = await mediaApi.uploadImage(uploadFile, uploadFolder, altTextInput);
      // Auto-select and notify parent
      onSelect({
        url: res.url,
        altText: altTextInput || uploadFile.name,
        publicId: res.publicId,
        name: uploadFile.name,
      });
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Check Cloudinary settings.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmSelect = () => {
    if (!selectedAsset) return;
    onSelect({
      url: selectedAsset.url,
      altText: selectedAsset.altText || selectedAsset.name,
      publicId: selectedAsset.publicId || undefined,
      name: selectedAsset.name,
    });
    onClose();
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          backgroundColor: '#0a1020',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          animation: 'fadeInScale 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #1e293b',
            background: '#0d1526',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                {title}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                Select an existing CDN asset or stream new media directly to Cloudinary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            padding: '0 24px',
            borderBottom: '1px solid #1e293b',
            background: '#0a1020',
            gap: '24px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'library' ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === 'library' ? '#f8fafc' : '#64748b',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ImageIcon size={16} color={activeTab === 'library' ? '#6366f1' : '#64748b'} />
            <span>Media Library</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'upload' ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === 'upload' ? '#f8fafc' : '#64748b',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Upload size={16} color={activeTab === 'upload' ? '#6366f1' : '#64748b'} />
            <span>Upload New Asset</span>
          </button>
        </div>

        {/* Tab 1: Library Browser */}
        {activeTab === 'library' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            {/* Search & Filter Toolbar */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '16px 24px',
                borderBottom: '1px solid #1e293b',
                background: '#0d1526',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <Search
                  size={15}
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
                  placeholder="Search assets by name, tag, or alt text..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Folder size={15} color="#64748b" />
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Folders</option>
                  <option value="shiv-shakti-events">General</option>
                  <option value="shiv-shakti-events/products">Products</option>
                  <option value="shiv-shakti-events/library">Library</option>
                  <option value="shiv-shakti-events/banners">Banners</option>
                  <option value="shiv-shakti-events/cms">CMS Pages</option>
                </select>
              </div>
            </div>

            {/* Asset Grid */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 24px',
                minHeight: '340px',
                maxHeight: '440px',
              }}
            >
              {loading ? (
                <div
                  style={{
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    color: '#64748b',
                  }}
                >
                  <Loader2 size={28} className="animate-spin" color="#6366f1" />
                  <span style={{ fontSize: '0.85rem' }}>Loading CDN assets...</span>
                </div>
              ) : assets.length === 0 ? (
                <div
                  style={{
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    color: '#64748b',
                    textAlign: 'center',
                  }}
                >
                  <ImageIcon size={36} color="#334155" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#94a3b8' }}>No media assets found</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      Try adjusting your search filters or upload a new image.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Upload an Image Now
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {assets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id || selectedAsset?.url === asset.url;
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        style={{
                          background: '#0d1526',
                          border: isSelected ? '2px solid #6366f1' : '1px solid #1e293b',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: '#6366f1',
                              color: '#fff',
                              borderRadius: '50%',
                              width: '22px',
                              height: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 2,
                              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                            }}
                          >
                            <Check size={13} strokeWidth={3} />
                          </div>
                        )}

                        <div
                          style={{
                            height: '110px',
                            background: '#080d18',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={asset.url}
                            alt={asset.altText || asset.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            loading="lazy"
                          />
                          {asset.format && (
                            <span
                              style={{
                                position: 'absolute',
                                bottom: '6px',
                                left: '6px',
                                background: 'rgba(3, 7, 18, 0.75)',
                                color: '#94a3b8',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '1px 5px',
                                borderRadius: '4px',
                              }}
                            >
                              {asset.format}
                            </span>
                          )}
                        </div>

                        <div style={{ padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: isSelected ? '#f8fafc' : '#cbd5e1',
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
                              fontSize: '0.68rem',
                              color: '#64748b',
                              marginTop: '4px',
                            }}
                          >
                            <span>{asset.width ? `${asset.width}×${asset.height}` : ''}</span>
                            <span>{formatFileSize(asset.bytes)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Quick Upload */}
        {activeTab === 'upload' && (
          <form
            onSubmit={handleUploadSubmit}
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {uploadError && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  color: '#fca5a5',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Dropzone area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #334155',
                borderRadius: '14px',
                padding: '36px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: uploadPreview ? '#080d18' : 'rgba(15, 23, 42, 0.5)',
                transition: 'border-color 0.15s, background 0.15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = '#334155';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#334155';
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setUploadFile(file);
                  setUploadPreview(URL.createObjectURL(file));
                  if (!altTextInput) setAltTextInput(file.name.replace(/\.[^/.]+$/, ''));
                }
              }}
            >
              {uploadPreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    style={{
                      maxHeight: '160px',
                      maxWidth: '100%',
                      borderRadius: '8px',
                      objectFit: 'contain',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Click or drag a different file to replace ({uploadFile?.name})
                  </span>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#818cf8',
                    }}
                  >
                    <Upload size={22} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0', fontSize: '0.92rem' }}>
                      Click or drag and drop an image file here
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                      Supports PNG, JPG, WebP, GIF up to 15MB
                    </p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Upload Meta Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#94a3b8',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                  }}
                >
                  Accessibility Alt Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Gold Fiber Mandap Pillar with Floral Finish"
                  value={altTextInput}
                  onChange={(e) => setAltTextInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#94a3b8',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                  }}
                >
                  Cloudinary Target Folder
                </label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#080d18',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="shiv-shakti-events/products">shiv-shakti-events/products</option>
                  <option value="shiv-shakti-events/library">shiv-shakti-events/library</option>
                  <option value="shiv-shakti-events/banners">shiv-shakti-events/banners</option>
                  <option value="shiv-shakti-events/cms">shiv-shakti-events/cms</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={!uploadFile || isUploading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  cursor: !uploadFile || isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  opacity: !uploadFile || isUploading ? 0.6 : 1,
                }}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Streaming to Cloudinary CDN...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload & Select Asset</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        {activeTab === 'library' && (
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #1e293b',
              background: '#0d1526',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {selectedAsset ? (
                <span>
                  Selected: <strong style={{ color: '#f8fafc' }}>{selectedAsset.name}</strong>
                </span>
              ) : (
                <span>Click an image from the library above to select it.</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!selectedAsset}
                onClick={handleConfirmSelect}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 20px',
                  background: selectedAsset
                    ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                    : '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: selectedAsset ? '#fff' : '#64748b',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: selectedAsset ? 'pointer' : 'not-allowed',
                  boxShadow: selectedAsset ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                }}
              >
                <Check size={15} />
                <span>Use Selected Asset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPickerModal;
