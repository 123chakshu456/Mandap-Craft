import { Heart, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { getCategoryById } from '../../../constants';
import type { Product } from '../../../shared/types/models.types';
import { handleImageError, optimizeImageUrl } from '../../../shared/utils/imageFallback';

export interface ProductCardProps {
  item: Product | any;
  isFavorite: boolean;
  cartQuantity: number;
  onToggleShortlist: (id: string, name: string) => void;
  onSelectProductDetail: (item: any) => void;
  onAddToCart: (item: any, type?: 'events' | 'boutique') => void;
  onDecrementCart: (id: string) => void;
}

export default function ProductCard({
  item,
  isFavorite,
  cartQuantity,
  onToggleShortlist,
  onSelectProductDetail,
  onAddToCart,
  onDecrementCart,
}: ProductCardProps) {
  const categoryData = getCategoryById(item.categoryId || '');
  const subcategoryData = categoryData?.subsections.find((s) => s.id === item.subcategoryId);

  return (
    <div className="product-card">
      {/* Shortlist heart overlay */}
      <button
        onClick={() => onToggleShortlist(item.id, item.name)}
        className="card-heart"
        aria-label="Add to shortlist"
      >
        <Heart
          className={`icon ${isFavorite ? 'liked' : ''}`}
          style={{ fill: isFavorite ? '#991b1b' : 'none' }}
        />
      </button>

      {/* Tag badge */}
      {item.tag && <div className="card-top-tag">{item.tag}</div>}

      {/* Image Box with High Performance Lazy Loading & Dynamic Sizing */}
      <div className="card-image" onClick={() => onSelectProductDetail(item)}>
        <img
          src={optimizeImageUrl(item.image || (item.images && item.images[0]?.url), 480)}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
        />
        <div className="image-hover-action">
          <span>Quick Specifications</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="card-content">
        {/* Category & Subcategory Breadcrumb Pill */}
        <div className="card-category-crumb">
          <span className="cat-badge-text">
            {categoryData?.icon} {categoryData?.shortTitle || item.categoryId?.toUpperCase()}
          </span>
          <span className="crumb-separator">/</span>
          <span className="sub-badge-text">
            {subcategoryData?.title || item.subcategoryId}
          </span>
          {item.pricingUnit === 'PER_SQFT' && (
            <span
              style={{
                marginLeft: 'auto',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '2px 7px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.3px',
              }}
            >
              📐 Per Sq. Ft
            </span>
          )}
        </div>

        <h3 onClick={() => onSelectProductDetail(item)} className="card-title">
          {item.name}
        </h3>

        {/* Rating & Style */}
        <div className="card-rating-row">
          <div className="card-rating">
            <span className="stars">
              <Star className="icon" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
            </span>
            <span className="rating-number">{item.rating || 4.9}</span>
            <span className="review-count">({item.reviews || 12})</span>
          </div>
          {item.style && <span className="card-style-badge">{item.style}</span>}
        </div>

        {/* Snippet */}
        <p className="card-description">{item.description}</p>

        {/* Allowed Preset Sizes Snippet */}
        {item.pricingUnit === 'PER_SQFT' && Array.isArray(item.presetSizes) && item.presetSizes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', margin: '4px 0 6px' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Sizes:</span>
            {item.presetSizes.slice(0, 4).map((sz: number) => (
              <span
                key={sz}
                style={{
                  fontSize: '0.68rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                {sz} sq.ft
              </span>
            ))}
            {item.presetSizes.length > 4 && (
              <span style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 600 }}>
                +{item.presetSizes.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Key features pill row */}
        {item.features && item.features.length > 0 && (
          <div className="card-feature-snippet">
            <CheckCircle2 className="feat-icon" />
            <span>{item.features[0]}</span>
          </div>
        )}

        {/* Pricing and Action */}
        <div className="card-footer">
          {item.pricingUnit === 'PER_SQFT' ? (
            (() => {
              const presetSizes = Array.isArray(item.presetSizes) ? item.presetSizes : [];
              const minPreset = presetSizes.length > 0
                ? Math.min(...presetSizes)
                : (item.minSqFt || item.defaultSqFt || 1);
              const startingCost = minPreset * (item.price || 0);

              return (
                <div className="price-section">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                    <span className="price">
                      <span className="currency">₹</span>
                      {item.price?.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>/ sq.ft</span>
                  </div>
                  {presetSizes.length > 0 && (
                    <span className="price-label" style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '1px' }}>
                      Starts at ₹{startingCost.toLocaleString()} ({minPreset} sq.ft)
                    </span>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="price-section">
              <span className="price-label">Starts at</span>
              <span className="price">
                <span className="currency">₹</span>
                {item.price?.toLocaleString()}
              </span>
            </div>
          )}

          {item.pricingUnit === 'PER_SQFT' ? (
            <button
              onClick={() => onSelectProductDetail(item)}
              className="action-btn book-btn"
              aria-label={`Select size for ${item.name}`}
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
              }}
            >
              <span>Select Size</span>
              <ArrowRight className="icon" />
            </button>
          ) : cartQuantity > 0 ? (
            <div className="card-qty-control">
              <button
                type="button"
                onClick={() => onDecrementCart(item.id)}
                className="qty-btn minus"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-value">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={() => onAddToCart(item, 'events')}
                className="qty-btn plus"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item, 'events')}
              className="action-btn book-btn"
              aria-label={`Book ${item.name}`}
            >
              <span>Book</span>
              <ArrowRight className="icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
