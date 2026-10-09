import { useState, useRef, useEffect } from 'react';
import { Heart, Star, ArrowRight, ChevronLeft, ChevronRight, Zap, Gauge, Maximize2, Scale, Layers, Share2 } from 'lucide-react';
import { getCategoryById } from '../../../constants';
import type { Product } from '../../../shared/types/models.types';
import { handleImageError, optimizeImageUrl } from '../../../shared/utils/imageFallback';
import { formatModelLabel } from '../../../shared/utils/formatters';
import WhatsAppIcon from '../../../shared/components/icons/WhatsAppIcon';
import { getProductWhatsAppUrl, shareProductToWhatsApp, ENABLE_WHATSAPP_CHAT } from '../../../shared/utils/whatsapp';

export interface MachineModelVariant {
  model: string;
  motor?: string;
  size?: string;
  weight?: string;
  capacity?: string;
  price: number;
  description?: string;
}

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

  // Extract all available images
  const rawImages: string[] = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    item.images.forEach((img: any) => {
      const url = typeof img === 'string' ? img : img?.url;
      if (url && !rawImages.includes(url)) rawImages.push(url);
    });
  }
  if (item.image && !rawImages.includes(item.image)) {
    rawImages.unshift(item.image);
  }
  const displayImages = rawImages.length > 0 ? rawImages : ['/images/placeholder.jpg'];

  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Extract machine model variants if available
  const machineModels: MachineModelVariant[] | null =
    Array.isArray(item.presetSizes) && item.presetSizes.length > 0 && typeof item.presetSizes[0] === 'object'
      ? (item.presetSizes as MachineModelVariant[])
      : null;

  const [selectedModelIdx, setSelectedModelIdx] = useState(0);
  const activeModel = machineModels ? machineModels[selectedModelIdx] || machineModels[0] : null;

  // Active price: selected model price if present, else base price
  const activePrice = activeModel ? activeModel.price : (item.price || 0);

  // Horizontal scroll & drag controls for model selection pills on desktop
  const pillsRowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const updateScrollState = () => {
    const el = pillsRowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    const el = pillsRowRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, [machineModels]);

  const handleScrollPills = (direction: 'left' | 'right') => {
    const el = pillsRowRef.current;
    if (!el) return;
    const scrollAmount = 140;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handlePillsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = pillsRowRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = pillsRowRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = pillsRowRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const handleSelectModel = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    setSelectedModelIdx(idx);
  };

  const handleCardClick = () => {
    onSelectProductDetail({
      ...item,
      selectedModelIndex: selectedModelIdx,
      selectedModel: activeModel,
      activePrice,
    });
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getProductWhatsAppUrl({
      name: item.name,
      sku: item.sku,
      price: activePrice,
      activeModel: activeModel?.model,
      categoryTitle: categoryData?.title,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareToWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareProductToWhatsApp({
      id: item.id,
      sku: item.sku,
      name: item.name,
      price: activePrice,
      pricingUnit: item.pricingUnit,
      categoryTitle: categoryData?.title,
      activeModel: activeModel?.model,
    });
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeModel) {
      onAddToCart(
        {
          ...item,
          price: activeModel.price,
          selectedModel: activeModel,
          name: `${item.name} (${formatModelLabel(activeModel.model)})`,
        },
        'events'
      );
    } else {
      onAddToCart(item, 'events');
    }
  };

  // Format rating nicely (e.g. 4.9 instead of 4.899999999999999)
  const rawRating = item.rating !== undefined ? Number(item.rating) : 4.9;
  const formattedRating = !isNaN(rawRating) && rawRating > 0 ? rawRating.toFixed(1) : '4.9';

  return (
    <div className={`product-card ${machineModels ? 'machine-card' : ''}`}>
      {/* Shortlist heart overlay */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleShortlist(item.id, item.name);
        }}
        className="card-heart"
        aria-label="Add to shortlist"
        title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`icon ${isFavorite ? 'liked' : ''}`}
          style={{ fill: isFavorite ? '#991b1b' : 'none' }}
        />
      </button>

      {/* Share to WhatsApp overlay button (directly under wishlist heart) */}
      <button
        type="button"
        onClick={handleShareToWhatsApp}
        className="card-share"
        aria-label={`Share ${item.name} to WhatsApp`}
        title={`Share ${item.name} to WhatsApp`}
      >
        <Share2 className="icon" size={16} />
      </button>

      {/* Tag badge */}
      {item.tag && <div className="card-top-tag">{item.tag}</div>}

      {/* ── IMAGE CAROUSEL BOX ── */}
      <div className="card-image machine-image-stage" onClick={handleCardClick}>
        <img
          src={optimizeImageUrl(displayImages[currentImgIdx] || item.image, 600)}
          alt={`${item.name} - View ${currentImgIdx + 1}`}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="machine-hero-photo"
        />

        {/* Carousel Navigation Arrows if multiple pictures */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="carousel-nav-btn prev-btn"
              aria-label="Previous photo"
              title="Previous Photo"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="carousel-nav-btn next-btn"
              aria-label="Next photo"
              title="Next Photo"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots Indicator */}
            <div className="carousel-dots-bar" onClick={(e) => e.stopPropagation()}>
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIdx(idx);
                  }}
                  className={`carousel-dot-indicator ${idx === currentImgIdx ? 'active' : ''}`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Photo Counter Badge */}
            <div className="carousel-photo-badge">
              <span>HD • {currentImgIdx + 1}/{displayImages.length} Views</span>
            </div>
          </>
        )}

        {/* Clean View Details Indicator (doesn't obstruct carousel) */}
        {!machineModels && (
          <div className="image-hover-action">
            <span>Quick Specifications</span>
          </div>
        )}
      </div>

      {/* ── PRODUCT CONTENT ── */}
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
                color: '#b45309',
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

        <h3 onClick={handleCardClick} className="card-title">
          {item.name}
        </h3>

        {/* Rating & Style */}
        <div className="card-rating-row">
          <div className="card-rating">
            <span className="stars">
              <Star className="icon" style={{ fill: '#d4af37', color: '#d4af37' }} />
            </span>
            <span className="rating-number">{formattedRating}</span>
            <span className="review-count">({item.reviews || 18} Verified)</span>
          </div>
          {item.style && <span className="card-style-badge">{item.style}</span>}
        </div>

        {/* Snippet Description */}
        <p className="card-description">{item.description}</p>

        {/* ── MACHINE MODEL NUMBERS & SPECIFICATIONS OVERVIEW ── */}
        {machineModels && machineModels.length > 0 && (
          <div className="machine-overview-panel" onClick={(e) => e.stopPropagation()}>
            {/* Model Selector Bar (Only show if multiple models exist) */}
            {machineModels.length > 1 && (
              <div className="machine-models-bar">
                <div className="models-bar-header">
                  <div className="models-header-left">
                    <Layers size={12} className="models-icon" />
                    <span className="models-title">Select Model ({machineModels.length})</span>
                  </div>
                  <div className="models-header-right">
                    <span className="active-model-indicator">{formatModelLabel(activeModel?.model)}</span>
                    <div className="models-scroll-arrows">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScrollPills('left');
                        }}
                        disabled={!canScrollLeft}
                        className={`pill-nav-arrow left ${canScrollLeft ? 'enabled' : 'disabled'}`}
                        aria-label="Scroll models left"
                        title="Scroll models left"
                      >
                        <ChevronLeft size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScrollPills('right');
                        }}
                        disabled={!canScrollRight}
                        className={`pill-nav-arrow right ${canScrollRight ? 'enabled' : 'disabled'}`}
                        aria-label="Scroll models right"
                        title="Scroll models right"
                      >
                        <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="models-pills-row"
                  ref={pillsRowRef}
                  onWheel={handlePillsWheel}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {machineModels.map((m, idx) => {
                    const isSelected = idx === selectedModelIdx;
                    const formattedModel = formatModelLabel(m.model);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleSelectModel(e, idx)}
                        className={`model-pill-btn ${isSelected ? 'active' : ''}`}
                        title={`Select ${formattedModel}`}
                      >
                        <span className="pill-name">{formattedModel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Specifications Grid */}
            {activeModel && (
              <div className="machine-specs-box">
                <div className="specs-box-header">
                  <span className="specs-tag">⚡ Quick Specifications</span>
                  {machineModels.length === 1 && (
                    <span className="specs-model-name">{formatModelLabel(activeModel.model)}</span>
                  )}
                </div>

                <div className="specs-features-grid">
                  {activeModel.motor && (
                    <div className="spec-feature-cell">
                      <div className="cell-icon-wrap motor">
                        <Zap size={11} />
                      </div>
                      <div className="cell-info">
                        <span className="cell-title">Motor</span>
                        <span className="cell-value" title={activeModel.motor}>{activeModel.motor}</span>
                      </div>
                    </div>
                  )}

                  {activeModel.capacity && (
                    <div className="spec-feature-cell">
                      <div className="cell-icon-wrap capacity">
                        <Gauge size={11} />
                      </div>
                      <div className="cell-info">
                        <span className="cell-title">Capacity</span>
                        <span className="cell-value" title={activeModel.capacity}>{activeModel.capacity}</span>
                      </div>
                    </div>
                  )}

                  {activeModel.size && (
                    <div className="spec-feature-cell">
                      <div className="cell-icon-wrap size">
                        <Maximize2 size={11} />
                      </div>
                      <div className="cell-info">
                        <span className="cell-title">Dimensions</span>
                        <span className="cell-value" title={activeModel.size}>{activeModel.size}</span>
                      </div>
                    </div>
                  )}

                  {activeModel.weight && (
                    <div className="spec-feature-cell">
                      <div className="cell-icon-wrap weight">
                        <Scale size={11} />
                      </div>
                      <div className="cell-info">
                        <span className="cell-title">Weight</span>
                        <span className="cell-value" title={activeModel.weight}>{activeModel.weight}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Allowed Preset Sizes Snippet (For Per-SqFt products like Mandaps) */}
        {item.pricingUnit === 'PER_SQFT' && Array.isArray(item.presetSizes) && item.presetSizes.length > 0 && typeof item.presetSizes[0] !== 'object' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', margin: '4px 0 6px' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Sizes:</span>
            {item.presetSizes.slice(0, 4).map((sz: number) => (
              <span
                key={sz}
                style={{
                  fontSize: '0.68rem',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                {sz} sq.ft
              </span>
            ))}
            {item.presetSizes.length > 4 && (
              <span style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 600 }}>
                +{item.presetSizes.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* ── CARD FOOTER & PRICING ── */}
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
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>/ sq.ft</span>
                  </div>
                  {presetSizes.length > 0 && (
                    <span className="price-label" style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '1px' }}>
                      Starts at ₹{startingCost.toLocaleString()} ({minPreset} sq.ft)
                    </span>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="price-section">
              <span className="price-label">
                {machineModels && machineModels.length > 1
                  ? 'Selected Model Rate'
                  : 'Starting Price'}
              </span>
              <span className="price machine-price-highlight">
                <span className="currency">₹</span>
                {activePrice?.toLocaleString()}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {ENABLE_WHATSAPP_CHAT && (
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="card-whatsapp-btn"
                title="Direct WhatsApp Merchant Inquiry"
                aria-label={`Inquire about ${item.name} on WhatsApp`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 2px 6px rgba(18, 140, 126, 0.3)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <WhatsAppIcon size={18} color="#ffffff" />
              </button>
            )}

            {item.pricingUnit === 'PER_SQFT' ? (
              <button
                onClick={handleCardClick}
                className="action-btn book-btn"
                aria-label={`Select size for ${item.name}`}
                style={{
                  background: 'linear-gradient(135deg, #1a4d4d, #0f2f2f)',
                  border: '1px solid #d4af37',
                }}
              >
                <span>Select Size</span>
                <ArrowRight className="icon" />
              </button>
            ) : cartQuantity > 0 ? (
              <div className="card-qty-control" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecrementCart(item.id);
                  }}
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
                  onClick={handleAddToCart}
                  className="qty-btn plus"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="action-btn book-btn machine-book-btn"
                aria-label={`Book ${item.name}`}
              >
                <span>Book</span>
                <ArrowRight className="icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
