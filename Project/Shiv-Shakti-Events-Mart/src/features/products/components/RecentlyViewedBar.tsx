import { useState, useEffect } from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { getRecentlyViewed, clearRecentlyViewed, type ViewedProductSummary } from '../../../shared/utils/recentlyViewed';
import { handleImageError, optimizeImageUrl } from '../../../shared/utils/imageFallback';

export interface RecentlyViewedBarProps {
  onSelectProduct: (product: any) => void;
}

export default function RecentlyViewedBar({ onSelectProduct }: RecentlyViewedBarProps) {
  const [recentItems, setRecentItems] = useState<ViewedProductSummary[]>([]);

  const loadItems = () => {
    setRecentItems(getRecentlyViewed());
  };

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('recently_viewed_updated', handleUpdate);
    return () => window.removeEventListener('recently_viewed_updated', handleUpdate);
  }, []);

  if (recentItems.length === 0) return null;

  return (
    <section className="recently-viewed-section" style={{
      maxWidth: '1360px',
      margin: '28px auto 20px',
      padding: '0 20px',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #ebd9b4',
        borderRadius: '16px',
        padding: '18px 22px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          borderBottom: '1px solid #f8fafc',
          paddingBottom: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309',
            }}>
              <History size={16} />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 800,
                color: '#1a4d4d',
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '0.2px',
              }}>
                Recently Viewed Equipment
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Quick access to items you checked during this session
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={clearRecentlyViewed}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            title="Clear recently viewed history"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        </div>

        {/* Horizontal scroll strip */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '6px',
          scrollbarWidth: 'thin',
        }}>
          {recentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProduct(item);
                }
              }}
              style={{
                flex: '0 0 170px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '100%',
                height: '110px',
                borderRadius: '8px',
                background: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                border: '1px solid #f1f5f9',
              }}>
                <img
                  src={optimizeImageUrl(item.image, 200, 200)}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>

              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '4px',
              }} title={item.name}>
                {item.name}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
                paddingTop: '4px',
              }}>
                <span style={{
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  color: '#1a4d4d',
                }}>
                  ₹{item.price?.toLocaleString()}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '0.7rem',
                  color: '#d4af37',
                  fontWeight: 700,
                }}>
                  View <ArrowRight size={11} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
