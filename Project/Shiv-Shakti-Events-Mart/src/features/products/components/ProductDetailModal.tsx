import { useState, useEffect } from 'react';
import { X, Ruler, Check, Calculator } from 'lucide-react';
import { handleImageError, optimizeImageUrl } from '../../../shared/utils/imageFallback';

export interface ProductDetailModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating?: number;
    reviews?: number;
    description: string;
    features?: string[];
    pricingUnit?: 'FIXED' | 'PER_SQFT';
    areaMode?: 'PRESET_SIZES' | 'CUSTOM_DIMENSIONS' | 'BOTH';
    presetSizes?: number[];
    minSqFt?: number | null;
    maxSqFt?: number | null;
    defaultSqFt?: number | null;
  } | null;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (
    product: any,
    customArea?: { selectedSqFt: number; dimensionsNote?: string; calculatedPrice: number }
  ) => void;
  onDecrementCart: (id: string) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  cartQuantity,
  onAddToCart,
  onDecrementCart,
}: ProductDetailModalProps) {
  if (!product) return null;

  const isPerSqFt = product.pricingUnit === 'PER_SQFT';
  const presetSizes = Array.isArray(product.presetSizes) ? product.presetSizes : [];
  const areaMode = product.areaMode || (presetSizes.length > 0 ? 'PRESET_SIZES' : 'CUSTOM_DIMENSIONS');

  // Dimension state for Per-SqFt products
  const [activeModeTab, setActiveModeTab] = useState<'preset' | 'custom'>(
    areaMode === 'CUSTOM_DIMENSIONS' ? 'custom' : 'preset'
  );

  const [selectedPreset, setSelectedPreset] = useState<number>(() => {
    if (product.defaultSqFt && presetSizes.includes(product.defaultSqFt)) {
      return product.defaultSqFt;
    }
    return presetSizes.length > 0 ? presetSizes[0] : (product.minSqFt || 8);
  });

  const [customLength, setCustomLength] = useState<string>('10');
  const [customWidth, setCustomWidth] = useState<string>('10');
  const [directSqFt, setDirectSqFt] = useState<string>('');

  // Update selection when product changes
  useEffect(() => {
    if (product) {
      const pSizes = Array.isArray(product.presetSizes) ? product.presetSizes : [];
      if (product.defaultSqFt && pSizes.includes(product.defaultSqFt)) {
        setSelectedPreset(product.defaultSqFt);
      } else if (pSizes.length > 0) {
        setSelectedPreset(pSizes[0]);
      } else if (product.minSqFt) {
        setSelectedPreset(product.minSqFt);
      }
      setActiveModeTab(product.areaMode === 'CUSTOM_DIMENSIONS' ? 'custom' : 'preset');
    }
  }, [product]);

  const features = Array.isArray(product.features) ? product.features : [];

  // Compute effective square footage
  let effectiveSqFt = selectedPreset;
  let dimensionsNote: string | undefined = undefined;

  if (isPerSqFt) {
    if (activeModeTab === 'custom' || areaMode === 'CUSTOM_DIMENSIONS') {
      const len = parseFloat(customLength);
      const wid = parseFloat(customWidth);
      const dir = parseFloat(directSqFt);

      if (!isNaN(dir) && dir > 0) {
        effectiveSqFt = dir;
        dimensionsNote = `${dir} sq.ft`;
      } else if (!isNaN(len) && !isNaN(wid) && len > 0 && wid > 0) {
        effectiveSqFt = Math.round(len * wid * 100) / 100;
        dimensionsNote = `${len}ft × ${wid}ft (${effectiveSqFt} sq.ft)`;
      } else {
        effectiveSqFt = product.minSqFt || 1;
      }
    } else {
      effectiveSqFt = selectedPreset;
      dimensionsNote = `${selectedPreset} sq.ft`;
    }
  }

  const effectivePrice = isPerSqFt ? effectiveSqFt * product.price : product.price;

  const handleConfirmAddToCart = () => {
    if (isPerSqFt) {
      onAddToCart(product, {
        selectedSqFt: effectiveSqFt,
        dimensionsNote,
        calculatedPrice: effectivePrice,
      });
      onClose();
    } else {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn" aria-label="Close modal">
          <X className="icon" />
        </button>
        <div className="product-grid">
          <div className="product-image">
            <img
              src={optimizeImageUrl(product.image, 800)}
              alt={product.name}
              decoding="async"
              onError={handleImageError}
            />
          </div>
          <div className="product-details">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                {isPerSqFt && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#fbbf24',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Ruler size={12} />
                    Per Square Foot Pricing
                  </span>
                )}
              </div>
              <h1>{product.name}</h1>
              <div className="rating">
                <span className="stars" style={{ color: '#f59e0b' }}>
                  ★
                </span>
                <span className="count">
                  {' '}
                  {product.rating || 4.9} ({product.reviews || 12} Reviews)
                </span>
              </div>
            </div>

            <p className="description">{product.description}</p>

            {features.length > 0 && (
              <div className="features">
                <h3>Key Specifications</h3>
                <ul>
                  {features.map((feat: string, idx: number) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── PER SQ.FT AREA SELECTION ── */}
            {isPerSqFt && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '12px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Ruler size={16} color="#fbbf24" />
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f1f5f9' }}>
                      Select Required Dimensions
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>
                    Rate: ₹{product.price.toLocaleString()} / sq.ft
                  </span>
                </div>

                {/* Switch between Preset and Custom (if BOTH is enabled) */}
                {areaMode === 'BOTH' && presetSizes.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', background: '#080d18', padding: '3px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModeTab('preset')}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeModeTab === 'preset' ? '#1e293b' : 'transparent',
                        color: activeModeTab === 'preset' ? '#fbbf24' : '#94a3b8',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      Preset Sizes ({presetSizes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModeTab('custom')}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeModeTab === 'custom' ? '#1e293b' : 'transparent',
                        color: activeModeTab === 'custom' ? '#fbbf24' : '#94a3b8',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      Custom Dimensions
                    </button>
                  </div>
                )}

                {/* Preset Sizes Mode */}
                {activeModeTab === 'preset' && presetSizes.length > 0 && (
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                      Choose an available booking size:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {presetSizes.map((sz) => {
                        const isSelected = selectedPreset === sz;
                        const priceForSize = (sz * product.price).toLocaleString();
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedPreset(sz)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              background: isSelected ? 'rgba(245, 158, 11, 0.2)' : '#080d18',
                              border: isSelected ? '2px solid #f59e0b' : '1px solid #1e293b',
                              color: isSelected ? '#fde68a' : '#cbd5e1',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              transition: 'all 0.15s',
                            }}
                          >
                            <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>{sz} sq.ft</span>
                            <span style={{ color: isSelected ? '#34d399' : '#64748b', fontSize: '0.78rem' }}>
                              ₹{priceForSize}
                            </span>
                            {isSelected && <Check size={13} color="#f59e0b" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Dimensions Mode */}
                {(activeModeTab === 'custom' || areaMode === 'CUSTOM_DIMENSIONS' || presetSizes.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Enter event setup dimensions in feet:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '3px' }}>
                          Length (ft)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          value={customLength}
                          onChange={(e) => {
                            setCustomLength(e.target.value);
                            setDirectSqFt('');
                          }}
                          placeholder="e.g. 10"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: '#080d18',
                            border: '1px solid #1e293b',
                            borderRadius: '6px',
                            color: '#f1f5f9',
                            fontSize: '0.86rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <span style={{ color: '#64748b', fontWeight: 700, marginTop: '16px' }}>×</span>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: '3px' }}>
                          Width (ft)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          value={customWidth}
                          onChange={(e) => {
                            setCustomWidth(e.target.value);
                            setDirectSqFt('');
                          }}
                          placeholder="e.g. 10"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: '#080d18',
                            border: '1px solid #1e293b',
                            borderRadius: '6px',
                            color: '#f1f5f9',
                            fontSize: '0.86rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Or direct sq.ft:</span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={directSqFt}
                        onChange={(e) => setDirectSqFt(e.target.value)}
                        placeholder="Direct sq.ft"
                        style={{
                          width: '130px',
                          padding: '5px 8px',
                          background: '#080d18',
                          border: '1px solid #1e293b',
                          borderRadius: '6px',
                          color: '#cbd5e1',
                          fontSize: '0.78rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Live Calculated Area & Price Preview */}
                <div
                  style={{
                    background: '#080d18',
                    border: '1px dashed #334155',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calculator size={14} color="#34d399" />
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      Calculated Area: <strong>{effectiveSqFt} sq. ft</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>
                    ₹{effectivePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="footer">
              <div className="price">
                <span className="label">
                  {isPerSqFt ? `Total for ${effectiveSqFt} sq.ft` : 'Package starts'}
                </span>
                <span className="value">₹{effectivePrice.toLocaleString()}</span>
              </div>

              {isPerSqFt ? (
                <button
                  type="button"
                  onClick={handleConfirmAddToCart}
                  className="add-btn"
                  style={{
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  Book {effectiveSqFt} sq.ft (₹{effectivePrice.toLocaleString()})
                </button>
              ) : cartQuantity > 0 ? (
                <div className="modal-qty-control">
                  <button
                    type="button"
                    onClick={() => onDecrementCart(product.id)}
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
                    onClick={() => onAddToCart(product)}
                    className="qty-btn plus"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button onClick={() => onAddToCart(product)} className="add-btn">
                  Book / Add to Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
