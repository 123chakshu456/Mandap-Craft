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

        {/* Key features pill row */}
        {item.features && item.features.length > 0 && (
          <div className="card-feature-snippet">
            <CheckCircle2 className="feat-icon" />
            <span>{item.features[0]}</span>
          </div>
        )}

        {/* Pricing and Action */}
        <div className="card-footer">
          <div className="price-section">
            <span className="price-label">Starts at</span>
            <span className="price">
              <span className="currency">₹</span>
              {item.price?.toLocaleString()}
            </span>
          </div>

          {cartQuantity > 0 ? (
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
