import React, { useState, useRef } from 'react';
import {
  Upload,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { mediaApi } from '../../media/services/mediaApi';

export const MediaLibraryPage: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState<Array<{ url: string; publicId: string; name: string }>>([
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85', publicId: 'demo-1', name: 'Royal Mandap Stage Banner' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85', publicId: 'demo-2', name: 'Wedding Floral Arch' },
    { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=85', publicId: 'demo-3', name: 'Grand Ballroom Stage' },
    { url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200&q=85', publicId: 'demo-4', name: 'Brass Traditional Diyas' },
    { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&q=85', publicId: 'demo-5', name: 'Maharaja Velvet Throne' },
  ]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const file = files[0];
      const result = await mediaApi.uploadImage(file, 'shiv-shakti-events/library');
      setUploadedAssets((prev) => [
        { url: result.url, publicId: result.publicId, name: file.name },
        ...prev,
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed. Ensure Cloudinary credentials are valid.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
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
            Media & Cloudinary CDN Library
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0' }}>
            Upload raw photography and instantly acquire CDN URLs for products, banners, and CMS pages.
          </p>
        </div>

        <button
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
          <span>{isUploading ? 'Streaming to Cloudinary...' : 'Upload Media Asset'}</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 18px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#fca5a5', fontSize: '0.86rem', marginBottom: '20px' }}>
          {errorMsg}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {uploadedAssets.map((asset, idx) => (
          <div
            key={idx}
            style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '170px', background: '#080d18', position: 'relative' }}>
              <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {asset.name}
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
                  <span>{copiedUrl === asset.url ? 'Copied CDN URL!' : 'Copy URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.open(asset.url, '_blank')}
                  style={{ padding: '7px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', cursor: 'pointer' }}
                  title="Open Full Image"
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLibraryPage;
