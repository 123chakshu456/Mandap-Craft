import { useState, useEffect, useRef } from 'react';
import { History, X, Trash2, ArrowRight } from 'lucide-react';
import {
  getRecentlyViewed,
  clearRecentlyViewed,
  removeRecentlyViewedItem,
  type ViewedProductSummary,
} from '../../../shared/utils/recentlyViewed';
import { handleImageError, optimizeImageUrl } from '../../../shared/utils/imageFallback';

export interface RecentlyViewedPillProps {
  onSelectProduct: (product: any) => void;
}

export default function RecentlyViewedPill({ onSelectProduct }: RecentlyViewedPillProps) {
  const [recentItems, setRecentItems] = useState<ViewedProductSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadItems = () => {
    setRecentItems(getRecentlyViewed());
  };

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('recently_viewed_updated', handleUpdate);
    return () => window.removeEventListener('recently_viewed_updated', handleUpdate);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close when clicking outside panel
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (recentItems.length === 0) return null;

  return (
    <>
      {/* ── 1. FLOATING MINI-PILL AT BOTTOM-LEFT ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="floating-history-pill"
        aria-label={`View browsing history: ${recentItems.length} items`}
        title={`View your browsing history (${recentItems.length} items)`}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 990,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px 8px 10px',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, #1a4d4d 0%, #0d3333 100%)',
          color: '#ffffff',
          border: '1.5px solid #d4af37',
          boxShadow: '0 8px 24px rgba(26, 77, 77, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(212, 175, 55, 0.35), 0 4px 12px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(26, 77, 77, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)';
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(212, 175, 55, 0.4)',
          }}
        >
          <History size={14} />
        </div>

        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.3px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          History
        </span>

        <span
          style={{
            background: '#d4af37',
            color: '#1a4d4d',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '10px',
            lineHeight: 1.2,
          }}
        >
          {recentItems.length}
        </span>
      </button>

      {/* ── 2. QUICK HISTORY DRAWER / POPUP ── */}
      {isOpen && (
        <div
          className="history-popup-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 1040,
            animation: 'historyFadeIn 0.18s ease-out',
          }}
        >
          <div
            ref={panelRef}
            className="history-popup-card"
            style={{
              position: 'fixed',
              bottom: '76px',
              left: '24px',
              width: 'min(440px, calc(100vw - 32px))',
              maxHeight: 'min(560px, calc(100vh - 120px))',
              background: '#ffffff',
              borderRadius: '18px',
              border: '1.5px solid #d4af37',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.28), 0 4px 12px rgba(212, 175, 55, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 1050,
              animation: 'historySlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                background: 'linear-gradient(135deg, #1a4d4d 0%, #0d3333 100%)',
                color: '#ffffff',
                borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d4af37',
                  }}
                >
                  <History size={16} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      fontFamily: 'Playfair Display, serif',
                      letterSpacing: '0.2px',
                    }}
                  >
                    Recently Viewed
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                    {recentItems.length} item{recentItems.length > 1 ? 's' : ''} saved in this session
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    clearRecentlyViewed();
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#e2e8f0',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '5px 9px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                    e.currentTarget.style.color = '#fca5a5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }}
                  title="Clear all viewing history"
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: '#ffffff',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
                  aria-label="Close history popup"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Product List */}
            <div
              style={{
                padding: '12px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '440px',
              }}
            >
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d4af37';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.16)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #f1f5f9',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={optimizeImageUrl(item.image, 128, 128)}
                      alt={item.name}
                      loading="lazy"
                      onError={handleImageError}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      {item.sku && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            background: '#e0e7ff',
                            color: '#3730a3',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '4px',
                          }}
                        >
                          {item.sku}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#1a4d4d',
                        }}
                      >
                        ₹{item.price ? item.price.toLocaleString('en-IN') : 'Contact'}
                      </span>
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.72rem',
                        color: '#0284c7',
                        fontWeight: 600,
                        marginTop: '3px',
                      }}
                    >
                      <span>Click to open details</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>

                  {/* Delete individual entry button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentlyViewedItem(item.id);
                    }}
                    title="Remove from history"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.15s ease',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 14px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: '#64748b',
              }}
            >
              <span>Instant access from anywhere on the page</span>
              <span style={{ color: '#d4af37', fontWeight: 700 }}>⚡ Shiv Shakti</span>
            </div>
          </div>
        </div>
      )}

      {/* Inject Keyframe animations */}
      <style>{`
        @keyframes historyFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes historySlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 768px) {
          .floating-history-pill {
            bottom: 84px !important;
            left: 14px !important;
            padding: 7px 12px 7px 8px !important;
          }
          .history-popup-card {
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100vw !important;
            max-height: 80vh !important;
            border-radius: 20px 20px 0 0 !important;
          }
        }
      `}</style>
    </>
  );
}
