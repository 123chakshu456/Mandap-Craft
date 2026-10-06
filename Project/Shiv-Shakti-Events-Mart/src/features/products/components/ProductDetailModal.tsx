import { useState, useEffect } from 'react';
import { X, Ruler, Check, Calculator, ChevronLeft, ChevronRight, Zap, Gauge, Maximize2, Scale } from 'lucide-react';
import { handleImageError, optimizeImageUrl } from '../../../shared/utils/imageFallback';
import { formatModelLabel } from '../../../shared/utils/formatters';

export interface MachineModelVariant {
  model: string;
  motor?: string;
  size?: string;
  weight?: string;
  capacity?: string;
  price: number;
  description?: string;
}

export interface ProductDetailModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    images?: Array<{ url: string; altText?: string | null }>;
    rating?: number;
    reviews?: number;
    description: string;
    features?: string[];
    pricingUnit?: 'FIXED' | 'PER_SQFT';
    areaMode?: 'PRESET_SIZES' | 'CUSTOM_DIMENSIONS' | 'BOTH';
    presetSizes?: any;
    minSqFt?: number | null;
    maxSqFt?: number | null;
    defaultSqFt?: number | null;
    selectedModelIndex?: number;
    selectedModel?: MachineModelVariant;
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

  // Extract gallery images
  const rawImages: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img: any) => {
      const url = typeof img === 'string' ? img : img?.url;
      if (url && !rawImages.includes(url)) rawImages.push(url);
    });
  }
  if (product.image && !rawImages.includes(product.image)) {
    rawImages.unshift(product.image);
  }
  const displayImages = rawImages.length > 0 ? rawImages : ['/images/placeholder.jpg'];

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Machine Models detection
  const isMachine =
    Array.isArray(product.presetSizes) &&
    product.presetSizes.length > 0 &&
    typeof product.presetSizes[0] === 'object';

  const machineModels: MachineModelVariant[] = isMachine
    ? (product.presetSizes as MachineModelVariant[])
    : [];

  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(() => {
    return product.selectedModelIndex !== undefined && product.selectedModelIndex >= 0
      ? product.selectedModelIndex
      : 0;
  });

  const activeModel = machineModels.length > 0 ? machineModels[selectedModelIdx] || machineModels[0] : null;

  const isPerSqFt = product.pricingUnit === 'PER_SQFT';
  const presetSizes = !isMachine && Array.isArray(product.presetSizes) ? product.presetSizes : [];
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
      setActiveImgIdx(0);
      if (product.selectedModelIndex !== undefined) {
        setSelectedModelIdx(product.selectedModelIndex);
      } else {
        setSelectedModelIdx(0);
      }
      const pSizes = !isMachine && Array.isArray(product.presetSizes) ? product.presetSizes : [];
      if (product.defaultSqFt && pSizes.includes(product.defaultSqFt)) {
        setSelectedPreset(product.defaultSqFt);
      } else if (pSizes.length > 0) {
        setSelectedPreset(pSizes[0]);
      } else if (product.minSqFt) {
        setSelectedPreset(product.minSqFt);
      }
      setActiveModeTab(product.areaMode === 'CUSTOM_DIMENSIONS' ? 'custom' : 'preset');
    }
  }, [product, isMachine]);

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

  // Effective price:
  // If machine with selected model -> model price
  // If Per Sq Ft -> sqft * price
  // Else base price
  const effectivePrice = isMachine && activeModel
    ? activeModel.price
    : isPerSqFt
    ? effectiveSqFt * product.price
    : product.price;

  const handleConfirmAddToCart = () => {
    if (isPerSqFt) {
      onAddToCart(product, {
        selectedSqFt: effectiveSqFt,
        dimensionsNote,
        calculatedPrice: effectivePrice,
      });
      onClose();
    } else if (isMachine && activeModel) {
      onAddToCart({
        ...product,
        price: activeModel.price,
        selectedModel: activeModel,
        name: `${product.name} (${formatModelLabel(activeModel.model)})`,
      });
      onClose();
    } else {
      onAddToCart(product);
      onClose();
    }
  };

  return (
    <div className="product-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn" aria-label="Close modal">
          <X className="icon" />
        </button>

        <div className="product-grid" style={{ alignItems: 'flex-start' }}>
          {/* ── LEFT: IMAGE GALLERY & CAROUSEL ── */}
          <div className="product-image-section" style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '16px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #ebd9b4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              <img
                src={optimizeImageUrl(displayImages[activeImgIdx], 800)}
                alt={`${product.name} - HD View ${activeImgIdx + 1}`}
                decoding="async"
                onError={handleImageError}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />

              {displayImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
                    }}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#1a4d4d',
                      border: '1px solid #ebd9b4',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#1a4d4d',
                      border: '1px solid #ebd9b4',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* HD Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#1a4d4d',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  color: '#f5e6a1',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '99px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                }}
              >
                HD View {activeImgIdx + 1}/{displayImages.length}
              </div>
            </div>

            {/* Thumbnails row */}
            {displayImages.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {displayImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      border: idx === activeImgIdx ? '2px solid #d4af37' : '1px solid #ebd9b4',
                      padding: '2px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={optimizeImageUrl(imgUrl, 120)}
                      alt="Thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: PRODUCT DETAILS & SPECIFICATIONS ── */}
          <div className="product-details">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {isPerSqFt && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#b45309',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 9px',
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
                {isMachine && (
                  <span
                    style={{
                      background: '#faf8f5',
                      border: '1px solid #ebd9b4',
                      color: '#1a4d4d',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '99px',
                    }}
                  >
                    ⚙️ Industrial Machine ({machineModels.length} Models)
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                {product.name}
              </h1>
              <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="stars" style={{ color: '#d4af37' }}>★</span>
                <span className="count" style={{ color: '#64748b', fontSize: '0.84rem', fontWeight: 600 }}>
                  {typeof product.rating === 'number' ? product.rating.toFixed(1) : (parseFloat(product.rating || '4.9').toFixed(1))} ({product.reviews || 18} Verified Inquiries)
                </span>
              </div>
            </div>

            <p className="description" style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {product.description}
            </p>

            {/* ── MACHINE MODEL SELECTION ── */}
            {isMachine && machineModels.length > 0 && (
              <div
                style={{
                  background: '#faf8f5',
                  border: '1px solid #ebd9b4',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  margin: '12px 0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1a4d4d', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Select Model Number & Capacity:
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#8c734b', fontWeight: 600 }}>
                    {machineModels.length} models available
                  </span>
                </div>

                {/* Model Pill Buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {machineModels.map((m, idx) => {
                    const isSelected = idx === selectedModelIdx;
                    const formattedModel = formatModelLabel(m.model);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedModelIdx(idx)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: isSelected ? '1.5px solid #1a4d4d' : '1px solid #dfd6c8',
                          background: isSelected ? '#1a4d4d' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 6px rgba(26, 77, 77, 0.2)' : 'none',
                        }}
                      >
                        <span>{formattedModel}</span>
                        {isSelected && <Check size={12} color="#fde68a" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Model Highlight Details */}
                {activeModel && (
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #ebd9b4',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '10px',
                    }}
                  >
                    {activeModel.motor && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Zap size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#8c734b', textTransform: 'uppercase', fontWeight: 700 }}>Motor</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a4d4d' }}>{activeModel.motor}</div>
                        </div>
                      </div>
                    )}
                    {activeModel.capacity && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Gauge size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#8c734b', textTransform: 'uppercase', fontWeight: 700 }}>Capacity / Output</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a4d4d' }}>{activeModel.capacity}</div>
                        </div>
                      </div>
                    )}
                    {activeModel.size && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e0f2fe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Maximize2 size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#8c734b', textTransform: 'uppercase', fontWeight: 700 }}>Dimensions (L×W×H)</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a4d4d' }}>{activeModel.size}</div>
                        </div>
                      </div>
                    )}
                    {activeModel.weight && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Scale size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: '#8c734b', textTransform: 'uppercase', fontWeight: 700 }}>Approx Weight</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a4d4d' }}>{activeModel.weight}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── TECHNICAL SPECIFICATION TABLE (From Catalogue) ── */}
            {isMachine && machineModels.length > 0 && (
              <div style={{ margin: '16px 0' }}>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1a4d4d', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Complete Catalogue Models & Rates Table
                </h3>
                <div style={{ overflowX: 'auto', border: '1px solid #ebd9b4', borderRadius: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#1a4d4d', color: '#ffffff', borderBottom: '1px solid #ebd9b4' }}>
                        <th style={{ padding: '9px 12px' }}>Model</th>
                        <th style={{ padding: '9px 12px' }}>Motor</th>
                        <th style={{ padding: '9px 12px' }}>Dimensions</th>
                        <th style={{ padding: '9px 12px' }}>Capacity</th>
                        <th style={{ padding: '9px 12px' }}>Weight</th>
                        <th style={{ padding: '9px 12px', textAlign: 'right' }}>Rate (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {machineModels.map((m, idx) => {
                        const isRowSelected = idx === selectedModelIdx;
                        return (
                          <tr
                            key={idx}
                            onClick={() => setSelectedModelIdx(idx)}
                            style={{
                              borderBottom: '1px solid #f0e7d8',
                              background: isRowSelected ? '#fef9ee' : idx % 2 === 0 ? '#ffffff' : '#faf8f5',
                              cursor: 'pointer',
                              color: isRowSelected ? '#92400e' : '#334155',
                              fontWeight: isRowSelected ? 700 : 400,
                              borderLeft: isRowSelected ? '3px solid #d4af37' : '3px solid transparent',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                              {isRowSelected && <span style={{ color: '#d4af37', marginRight: '6px' }}>●</span>}
                              {formatModelLabel(m.model)}
                            </td>
                            <td style={{ padding: '8px 12px' }}>{m.motor || '-'}</td>
                            <td style={{ padding: '8px 12px' }}>{m.size || '-'}</td>
                            <td style={{ padding: '8px 12px' }}>{m.capacity || '-'}</td>
                            <td style={{ padding: '8px 12px' }}>{m.weight || '-'}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#059669', fontWeight: 800 }}>
                              ₹{m.price.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Standard Features */}
            {features.length > 0 && (
              <div className="features" style={{ margin: '12px 0', borderTop: '1px dashed #ebd9b4', borderBottom: '1px dashed #ebd9b4', padding: '12px 0' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a4d4d', marginBottom: '6px' }}>
                  Features & Highlights
                </h3>
                <ul style={{ paddingLeft: '18px', color: '#475569', fontSize: '0.84rem', lineHeight: '1.6' }}>
                  {features.map((feat: string, idx: number) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── PER SQ.FT AREA SELECTION (Mandaps / Event Flooring) ── */}
            {isPerSqFt && (
              <div
                style={{
                  background: '#faf8f5',
                  border: '1px solid #ebd9b4',
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
                    <Ruler size={16} color="#d4af37" />
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1a4d4d' }}>
                      Select Required Dimensions
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                    Rate: ₹{product.price.toLocaleString()} / sq.ft
                  </span>
                </div>

                {/* Switch between Preset and Custom */}
                {areaMode === 'BOTH' && presetSizes.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', background: '#f5efe6', padding: '3px', borderRadius: '8px', border: '1px solid #ebd9b4' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModeTab('preset')}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeModeTab === 'preset' ? '#1a4d4d' : 'transparent',
                        color: activeModeTab === 'preset' ? '#ffffff' : '#64748b',
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
                        background: activeModeTab === 'custom' ? '#1a4d4d' : 'transparent',
                        color: activeModeTab === 'custom' ? '#ffffff' : '#64748b',
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
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                      Choose an available booking size:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {presetSizes.map((sz: number) => {
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
                              background: isSelected ? '#1a4d4d' : '#ffffff',
                              border: isSelected ? '1.5px solid #1a4d4d' : '1px solid #dfd6c8',
                              color: isSelected ? '#ffffff' : '#334155',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              transition: 'all 0.15s',
                              boxShadow: isSelected ? '0 2px 8px rgba(26, 77, 77, 0.25)' : 'none',
                            }}
                          >
                            <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>{sz} sq.ft</span>
                            <span style={{ color: isSelected ? '#fde68a' : '#059669', fontSize: '0.78rem', fontWeight: 700 }}>
                              ₹{priceForSize}
                            </span>
                            {isSelected && <Check size={13} color="#fde68a" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Custom Dimensions Mode */}
                {(activeModeTab === 'custom' || areaMode === 'CUSTOM_DIMENSIONS' || presetSizes.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
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
                            background: '#ffffff',
                            border: '1px solid #dfd6c8',
                            borderRadius: '6px',
                            color: '#1e293b',
                            fontSize: '0.86rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <span style={{ color: '#8c734b', fontWeight: 700, marginTop: '16px' }}>×</span>
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
                            background: '#ffffff',
                            border: '1px solid #dfd6c8',
                            borderRadius: '6px',
                            color: '#1e293b',
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
                          background: '#ffffff',
                          border: '1px solid #dfd6c8',
                          borderRadius: '6px',
                          color: '#1e293b',
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
                    background: '#f0fdf4',
                    border: '1px dashed #86efac',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calculator size={14} color="#16a34a" />
                    <span style={{ fontSize: '0.78rem', color: '#166534' }}>
                      Calculated Area: <strong>{effectiveSqFt} sq. ft</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#166534' }}>
                    ₹{effectivePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* ── FOOTER & ACTION ── */}
            <div className="footer" style={{ borderTop: '1px solid #ebd9b4', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="price">
                <span className="label" style={{ fontSize: '0.72rem', color: '#8c734b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {isMachine && activeModel
                    ? `Rate for ${activeModel.model}`
                    : isPerSqFt
                    ? `Total for ${effectiveSqFt} sq.ft`
                    : 'Starting Price'}
                </span>
                <span className="value" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a4d4d', fontFamily: 'Playfair Display, serif' }}>
                  <span style={{ color: '#d4af37', marginRight: '2px' }}>₹</span>
                  {effectivePrice.toLocaleString()}
                </span>
              </div>

              {isPerSqFt ? (
                <button
                  type="button"
                  onClick={handleConfirmAddToCart}
                  className="add-btn"
                  style={{
                    background: 'linear-gradient(135deg, #1a4d4d, #0d3333)',
                    border: '1px solid #d4af37',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '12px 24px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 14px rgba(26, 77, 77, 0.25)',
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
                  <span className="qty-value">{cartQuantity}</span>
                  <button
                    type="button"
                    onClick={handleConfirmAddToCart}
                    className="qty-btn plus"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConfirmAddToCart}
                  className="add-btn"
                  style={{
                    background: 'linear-gradient(135deg, #1a4d4d, #0d3333)',
                    border: '1px solid #d4af37',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '12px 24px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 14px rgba(26, 77, 77, 0.25)',
                  }}
                >
                  {isMachine && activeModel ? `Book ${activeModel.model}` : 'Book / Add to Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
