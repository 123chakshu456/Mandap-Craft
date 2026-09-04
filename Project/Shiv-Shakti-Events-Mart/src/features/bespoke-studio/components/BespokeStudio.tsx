import { useState, useMemo } from 'react';
import {
  CUSTOMIZER_BACKDROPS,
  CUSTOMIZER_THEMES,
  CUSTOMIZER_SEATINGS,
} from '../../../constants';

export interface BespokeStudioProps {
  showToast: (msg: string) => void;
}

export default function BespokeStudio({ showToast }: BespokeStudioProps) {
  const [customBackdrop, setCustomBackdrop] = useState('palace');
  const [customTheme, setCustomTheme] = useState('royal-marigold');
  const [customSeating, setCustomSeating] = useState('swing');
  const [isCustomizerSaved, setIsCustomizerSaved] = useState(false);

  // Computed customizer price
  const customizerTotalPrice = useMemo(() => {
    const themeObj = CUSTOMIZER_THEMES.find((t) => t.id === customTheme);
    const seatObj = CUSTOMIZER_SEATINGS.find((s) => s.id === customSeating);
    const basePrice = 85000;
    return basePrice + (themeObj?.cost || 0) + (seatObj?.cost || 0);
  }, [customTheme, customSeating]);

  const handleSaveCustomization = () => {
    setIsCustomizerSaved(true);
    showToast('✨ Bespoke design saved successfully! Our visualizers are preparing a high-res render.');
    setTimeout(() => setIsCustomizerSaved(false), 4000);
  };

  const currentBackdrop = CUSTOMIZER_BACKDROPS.find((b) => b.id === customBackdrop);
  const currentTheme = CUSTOMIZER_THEMES.find((t) => t.id === customTheme);
  const currentSeating = CUSTOMIZER_SEATINGS.find((s) => s.id === customSeating);

  return (
    <section id="studio" className="customizer">
      <div className="customizer-container">
        <div className="customizer-grid">
          {/* Customizer Sidebar Configuration */}
          <div className="customizer-sidebar">
            <div className="customizer-header">
              <span className="section-label">Interactive 3D Visualizer</span>
              <h2>Interactive Stage &amp; Mandap Studio</h2>
              <p>
                Compose your dream wedding setup in real-time. Pick an iconic venue backdrop, custom curated floral color schemes, and heritage couple seating.
              </p>
            </div>

            {/* Backdrop Select */}
            <div className="customizer-option">
              <span className="option-label">1. Select Venue / Architecture Backdrop</span>
              <div className="option-grid">
                {CUSTOMIZER_BACKDROPS.map((bd) => (
                  <button
                    key={bd.id}
                    type="button"
                    onClick={() => setCustomBackdrop(bd.id)}
                    className={`option-btn ${customBackdrop === bd.id ? 'active' : ''}`}
                  >
                    <span className="option-name">{bd.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Floral / Concept Scheme */}
            <div className="customizer-option">
              <span className="option-label">2. Choose Floral / Fabric Theme</span>
              <div className="option-grid">
                {CUSTOMIZER_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setCustomTheme(theme.id)}
                    className={`option-btn ${customTheme === theme.id ? 'active' : ''}`}
                  >
                    <span className="option-name">{theme.name}</span>
                    <span className="option-price">(+₹{theme.cost.toLocaleString()})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Central Seating Element */}
            <div className="customizer-option">
              <span className="option-label">3. Select Couple Seating Craft</span>
              <div className="option-grid">
                {CUSTOMIZER_SEATINGS.map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => setCustomSeating(seat.id)}
                    className={`option-btn ${customSeating === seat.id ? 'active' : ''}`}
                  >
                    <span className="option-name">
                      {seat.img} {seat.name}
                    </span>
                    <span className="option-price">(+₹{seat.cost.toLocaleString()})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Calculation Card */}
            <div className="price-card">
              <div className="price-info">
                <span className="price-label">Estimated Setup Cost</span>
                <div className="price-value">₹{customizerTotalPrice.toLocaleString()}</div>
              </div>
              <button onClick={handleSaveCustomization} className="book-btn">
                {isCustomizerSaved ? '✨ Concept Shortlisted' : 'Book Custom Setup'}
              </button>
            </div>
          </div>

          {/* Customizer Interactive Preview Card */}
          <div className="customizer-preview">
            <img src={currentBackdrop?.image} alt="Backdrop visualizer" />
            <div className="preview-overlay" />

            <div className="preview-header">
              <div className="preview-badge">
                <span className="badge-dot" />
                Visualizer Active
              </div>
              <div className="theme-label">{currentTheme?.name}</div>
            </div>

            <div className="preview-content">
              {/* curtains layout */}
              <div className="preview-curtains">
                <div
                  className="curtain"
                  style={{
                    background: `linear-gradient(to bottom, ${
                      customTheme === 'royal-marigold'
                        ? '#f59e0b, #d97706'
                        : customTheme === 'pastel-orchid'
                        ? '#f472b6, #c084fc'
                        : customTheme === 'crimson-velvet'
                        ? '#991b1b, #7f1d1d'
                        : '#d6d3d1, #f59e0b'
                    })`,
                  }}
                />
                <div
                  className="curtain"
                  style={{
                    background: `linear-gradient(to right, ${
                      customTheme === 'royal-marigold'
                        ? '#f59e0b, #d97706'
                        : customTheme === 'pastel-orchid'
                        ? '#f472b6, #c084fc'
                        : customTheme === 'crimson-velvet'
                        ? '#991b1b, #7f1d1d'
                        : '#d6d3d1, #f59e0b'
                    })`,
                  }}
                />
                <div
                  className="curtain"
                  style={{
                    background: `linear-gradient(to bottom, ${
                      customTheme === 'royal-marigold'
                        ? '#f59e0b, #d97706'
                        : customTheme === 'pastel-orchid'
                        ? '#f472b6, #c084fc'
                        : customTheme === 'crimson-velvet'
                        ? '#991b1b, #7f1d1d'
                        : '#d6d3d1, #f59e0b'
                    })`,
                  }}
                />
              </div>

              {/* Central main seating illustration */}
              <div className="preview-seating">
                <div className="seating-emoji">{currentSeating?.img}</div>
                <span className="seating-label">{currentSeating?.name}</span>
              </div>
            </div>

            {/* Customizer Spec Sheets overlay */}
            <div className="preview-footer">
              <div className="footer-config">
                <h4>Your Live Configuration</h4>
                <div className="config-details">
                  <span>📍 Venue: {currentBackdrop?.name}</span>
                  <span>🛋️ Seating: {currentSeating?.name}</span>
                </div>
              </div>
              <div className="footer-actions">
                <div className="price-display">
                  <span className="price-label">Pricing estimate</span>
                  <span className="price-value">₹{customizerTotalPrice.toLocaleString()}</span>
                </div>
                <button onClick={handleSaveCustomization} className="save-btn">
                  {isCustomizerSaved ? '✓ Saved' : 'Shortlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
