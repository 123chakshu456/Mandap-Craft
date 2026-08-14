import { useState, useMemo } from 'react';
import type { Dispatch, SetStateAction, FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Star,
  Sparkles,
  ArrowRight,
  Play,
  SlidersHorizontal,
  ChevronDown,
  Truck,
  ShieldCheck,
  Award,
  Heart,
  User,
} from 'lucide-react';

import {
  DECOR_THEMES,
  FURNITURE_ITEMS,
  INFLUENCER_REELS,
  CUSTOMIZER_BACKDROPS,
  CUSTOMIZER_THEMES,
  CUSTOMIZER_SEATINGS
} from '../../constants';

export default function HomePage() {
  const {
    platformMode,
    setPlatformMode,
    searchQuery,
    setSearchQuery,
    selectedStyleFilter,
    setSelectedStyleFilter,
    shortlist,
    handleToggleShortlist,
    cart,
    handleAddToCart,
    handleDecrementCart,
    setSelectedProductDetail,
    showToast,
  } = useOutletContext<{
    platformMode: 'events' | 'boutique';
    setPlatformMode: Dispatch<SetStateAction<'events' | 'boutique'>>;
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    selectedStyleFilter: string;
    setSelectedStyleFilter: Dispatch<SetStateAction<string>>;
    shortlist: string[];
    handleToggleShortlist: (id: string, name: string) => void;
    cart: { id: string; name: string; price: number; image: string; type: 'events' | 'boutique'; quantity: number }[];
    handleAddToCart: (item: { id: string; name: string; price: number; image: string }, type: 'events' | 'boutique') => void;
    handleDecrementCart: (id: string) => void;
    setSelectedProductDetail: Dispatch<SetStateAction<any>>;
    showToast: (msg: string) => void;
  }>();

  // Customizer States
  const [customBackdrop, setCustomBackdrop] = useState('palace');
  const [customTheme, setCustomTheme] = useState('royal-marigold');
  const [customSeating, setCustomSeating] = useState('swing');
  const [isCustomizerSaved, setIsCustomizerSaved] = useState(false);

  // Quote Builder States
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardScale, setWizardScale] = useState('premium');
  const [wizardVenue, setWizardVenue] = useState('banquet');
  const [wizardDrapes, setWizardDrapes] = useState('heavy');
  const [wizardEmail, setWizardEmail] = useState('');
  const [wizardCompleted, setWizardCompleted] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Switch modes smoothly
  const handleModeChange = (mode: 'events' | 'boutique') => {
    setPlatformMode(mode);
    setSelectedStyleFilter('All');
    setSearchQuery('');
    showToast(`Welcome to Mandap-Craft ${mode === 'events' ? 'Events & Decors' : 'Luxury Boutique'}!`);
  };

  // Computed customizer price
  const customizerTotalPrice = useMemo(() => {
    const themeObj = CUSTOMIZER_THEMES.find(t => t.id === customTheme);
    const seatObj = CUSTOMIZER_SEATINGS.find(s => s.id === customSeating);
    const basePrice = platformMode === 'events' ? 85000 : 25000;
    return basePrice + (themeObj?.cost || 0) + (seatObj?.cost || 0);
  }, [customTheme, customSeating, platformMode]);

  // Handle Customizer Save
  const handleSaveCustomization = () => {
    setIsCustomizerSaved(true);
    showToast("✨ Bespoke design saved successfully! Our visualizers are preparing a high-res render.");
    setTimeout(() => setIsCustomizerSaved(false), 4000);
  };

  // Filtered Products
  const displayedItems = useMemo(() => {
    const rawList = platformMode === 'events' ? DECOR_THEMES : FURNITURE_ITEMS;
    return rawList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle = selectedStyleFilter === 'All' || item.style === selectedStyleFilter;
      return matchesSearch && matchesStyle;
    });
  }, [platformMode, searchQuery, selectedStyleFilter]);

  // Quote Builder Calculation
  const estimatedQuotePrice = useMemo(() => {
    let base = 60000;
    if (wizardScale === 'intimate') base += 20000;
    if (wizardScale === 'premium') base += 85000;
    if (wizardScale === 'royal') base += 190000;

    if (wizardVenue === 'fort') base += 50000;
    if (wizardVenue === 'beach') base += 30000;
    if (wizardVenue === 'banquet') base += 15000;

    if (wizardDrapes === 'heavy') base += 25000;
    if (wizardDrapes === 'glass') base += 45000;

    return base;
  }, [wizardScale, wizardVenue, wizardDrapes]);

  const handleWizardSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!wizardEmail) {
      showToast("Please enter an email to receive your quote proposal.");
      return;
    }
    setWizardCompleted(true);
    showToast("🎉 Custom Estimate sent to your email! Our team will call you within 2 hours.");
  };

  const resetWizard = () => {
    setWizardStep(1);
    setWizardCompleted(false);
    setWizardEmail('');
  };

  return (
    <>
      {/* MOBILE SECTOR & SEARCH BAR */}
      <div className="mobile-nav">
        <div className="switcher">
          <button 
            onClick={() => handleModeChange('events')}
            className={`btn ${platformMode === 'events' ? 'active' : ''}`}
          >
            🏰 Event Decors
          </button>
          <button 
            onClick={() => handleModeChange('boutique')}
            className={`btn ${platformMode === 'boutique' ? 'active' : ''}`}
          >
            🛋️ Luxury Boutique
          </button>
        </div>
        <div className="search">
          <Search className="icon" />
          <input 
            type="text" 
            placeholder={platformMode === 'events' ? "Search wedding backdrops..." : "Search home furnishings..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ==========================================
          HERO BANNER MODULE
         ========================================== */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>

        <div className="hero-content">
          
          <div className="hero-text">
            <div className="badge">
              <Sparkles className="icon" />
              Elite Artisanal Living
            </div>

            {platformMode === 'events' ? (
              <>
                <h1>
                  Where Sacred Traditions Meet <span className="highlight">Contemporary Grandeur</span>
                </h1>
                <p>
                  Step into the finest catalog of designer wedding mandaps, custom Haldi stages, floral canopies, and reception backdrops tailored with precise architectural symmetry.
                </p>
              </>
            ) : (
              <>
                <h1>
                  Bespoke Furniture Crafted For <span className="highlight">Generations</span>
                </h1>
                <p>
                  Bring home the heritage of royal teakwood swings, emerald velvet seating, Italian marble tables, and ancient stained-glass lantern crafts. Made meticulously to order.
                </p>
              </>
            )}

            <div>
              <a href="#catalog" className="cta-btn">
                {platformMode === 'events' ? 'Explore Royal Decors' : 'Explore Collections'}
                <ArrowRight className="icon" />
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="hero-metrics">
              <div className="metric-item">
                <span className="metric-val">1200+</span>
                <span className="metric-label">Bespoke Events</span>
              </div>
              <div className="metric-item">
                <span className="metric-val">100%</span>
                <span className="metric-label">Handcrafted Timber</span>
              </div>
              <div className="metric-item">
                <span className="metric-val">4.9 ★</span>
                <span className="metric-label">Verified Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Frame */}
          <div className="hero-media">
            <div className="media-glow"></div>
            <div className="media-frame">
              <img 
                src={platformMode === 'events' 
                  ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' 
                  : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
                } 
                alt="Premium Crafted Focus" 
              />
              {/* Overlapping Info Badge */}
              <div className="media-badge">
                <div className="badge-info">
                  <span className="badge-label">Featured Concept</span>
                  <span className="badge-title">
                    {platformMode === 'events' ? 'The Mughal Court Heritage Setup' : 'The Imperial Tufted Seating'}
                  </span>
                </div>
                <div className="badge-price">
                  <span className="price-label">Starts at</span>
                  <span className="price-value">
                    {platformMode === 'events' ? '₹1,50,000' : '₹45,999'}
                  </span>
                </div>
              </div>
            </div>

            {/* floating elements for high modern feel */}
            <div className="floating-award">
              <Award className="icon" />
              National Design Excellence Award
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          PLATFORM VALUE PROPS / TRUST BADGES
         ========================================== */}
      <section className="value-props">
        <div className="props-container">
          <div className="prop-item">
            <div className="prop-icon">
              <Truck className="icon" />
            </div>
            <div className="prop-content">
              <h3>Premium Safe Delivery</h3>
              <p>Insured & assembled by our experts at your location.</p>
            </div>
          </div>
          <div className="prop-item">
            <div className="prop-icon">
              <SlidersHorizontal className="icon" />
            </div>
            <div className="prop-content">
              <h3>100% Customizable</h3>
              <p>Tailor materials, drapes, heights, and flower schemes.</p>
            </div>
          </div>
          <div className="prop-item">
            <div className="prop-icon">
              <ShieldCheck className="icon" />
            </div>
            <div className="prop-content">
              <h3>Heritage Guarantee</h3>
              <p>10-year warranty on solid seasoned teak wood frames.</p>
            </div>
          </div>
          <div className="prop-item">
            <div className="prop-icon">
              <User className="icon" />
            </div>
            <div className="prop-content">
              <h3>Dedicated Artisan</h3>
              <p>Assigned site decorator and interior consultant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          DESIGNS THAT TRAVEL THROUGH TIME
         ========================================== */}
      <section className="design-styles">
        <div className="styles-container">
          <div className="section-header">
            <span className="section-label">Bespoke Aesthetics</span>
            <h2>Designs That Travel Through Time</h2>
            <p>
              Whether you cherish centuries-old Indian royal motifs, clean Scandinavian mid-century contours, or breezy bohemian setups—we synthesize them into absolute elegance.
            </p>
          </div>

          <div className="styles-grid">
            {[
              { title: 'Royal Heritage', subtitle: 'Gold foil arches, heavy rose work', themeClass: 'royal' },
              { title: 'Modern Minimal', subtitle: 'Clean pastel contours, floating lights', themeClass: 'minimal' },
              { title: 'Bohemian Dream', subtitle: 'Macrame hangings, rich pampas grass', themeClass: 'boho' },
              { title: 'Victorian Charm', subtitle: 'Deep button tufts, rich high valances', themeClass: 'victorian' },
              { title: 'Rustic Woodland', subtitle: 'Birch arches, heavy vines, warm bulbs', themeClass: 'woodland' },
              { title: 'Vibrant Fusion', subtitle: 'Marigold cascades, Rajasthani colors', themeClass: 'fusion' }
            ].map((style, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedStyleFilter(style.title.split(' ')[0]);
                  const catSec = document.getElementById('catalog');
                  if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`style-card ${style.themeClass}`}
              >
                <div className="card-number">
                  {idx + 1}
                </div>
                <h3>{style.title}</h3>
                <span>{style.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          INTERACTIVE DESIGNER STUDIO MODULE (LIVE CUSTOMIZER)
         ========================================== */}
      <section id="studio" className="customizer">
        <div className="customizer-container">
          <div className="customizer-grid">
            
            {/* Customizer Sidebar Configuration */}
            <div className="customizer-sidebar">
              <div className="customizer-header">
                <span className="section-label">Interactive Studio</span>
                <h2>Interactive Bespoke Studio</h2>
                <p>
                  Compose your dream {platformMode === 'events' ? 'wedding stage setup' : 'luxury living corner'} in real-time. Pick an iconic venue backdrop, custom curated color schemes, and custom heritage seating.
                </p>
              </div>

              {/* Backdrop Select */}
              <div className="customizer-option">
                <span className="option-label">1. Select Venue/Room Backdrop</span>
                <div className="option-grid">
                  {CUSTOMIZER_BACKDROPS.map((bd) => (
                    <button
                      key={bd.id}
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
                <span className="option-label">2. Choose Theme Scheme</span>
                <div className="option-grid">
                  {CUSTOMIZER_THEMES.map((theme) => (
                    <button
                      key={theme.id}
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
                <span className="option-label">3. Select Seating / Main Craft</span>
                <div className="option-grid">
                  {CUSTOMIZER_SEATINGS.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => setCustomSeating(seat.id)}
                      className={`option-btn ${customSeating === seat.id ? 'active' : ''}`}
                    >
                      <span className="option-name">{seat.img} {seat.name}</span>
                      <span className="option-price">(+₹{seat.cost.toLocaleString()})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="price-card">
                <div className="price-info">
                  <span className="price-label">Estimated Pricing</span>
                  <div className="price-value">₹{customizerTotalPrice.toLocaleString()}</div>
                </div>
                <button onClick={handleSaveCustomization} className="book-btn">
                  {isCustomizerSaved ? '✨ Concept Saved' : 'Book Custom Setup'}
                </button>
              </div>
            </div>

            {/* Customizer Interactive Preview Card */}
            <div className="customizer-preview">
              <img 
                src={CUSTOMIZER_BACKDROPS.find(b => b.id === customBackdrop)?.image} 
                alt="Backdrop visualizer" 
              />
              <div className="preview-overlay"></div>
              
              <div className="preview-header">
                <div className="preview-badge">
                  <span className="badge-dot"></span>
                  Visualizer Active
                </div>
                <div className="theme-label">
                  {CUSTOMIZER_THEMES.find(t => t.id === customTheme)?.name}
                </div>
              </div>

              <div className="preview-content">
                {/* curtians layout */}
                <div className="preview-curtains">
                  <div 
                    className="curtain" 
                    style={{ 
                      background: `linear-gradient(to bottom, ${
                        customTheme === 'royal-marigold' ? '#f59e0b, #d97706' :
                        customTheme === 'pastel-orchid' ? '#f472b6, #c084fc' :
                        customTheme === 'crimson-velvet' ? '#991b1b, #7f1d1d' :
                        '#d6d3d1, #f59e0b'
                      })` 
                    }}
                  ></div>
                  <div 
                    className="curtain" 
                    style={{ 
                      background: `linear-gradient(to right, ${
                        customTheme === 'royal-marigold' ? '#f59e0b, #d97706' :
                        customTheme === 'pastel-orchid' ? '#f472b6, #c084fc' :
                        customTheme === 'crimson-velvet' ? '#991b1b, #7f1d1d' :
                        '#d6d3d1, #f59e0b'
                      })` 
                    }}
                  ></div>
                  <div 
                    className="curtain" 
                    style={{ 
                      background: `linear-gradient(to bottom, ${
                        customTheme === 'royal-marigold' ? '#f59e0b, #d97706' :
                        customTheme === 'pastel-orchid' ? '#f472b6, #c084fc' :
                        customTheme === 'crimson-velvet' ? '#991b1b, #7f1d1d' :
                        '#d6d3d1, #f59e0b'
                      })` 
                    }}
                  ></div>
                </div>

                {/* Central main seating illustration */}
                <div className="preview-seating">
                  <div className="seating-emoji">
                    {CUSTOMIZER_SEATINGS.find(s => s.id === customSeating)?.img}
                  </div>
                  <span className="seating-label">
                    {CUSTOMIZER_SEATINGS.find(s => s.id === customSeating)?.name}
                  </span>
                </div>
              </div>

              {/* Customizer Spec Sheets overlay */}
              <div className="preview-footer">
                <div className="footer-config">
                  <h4>Your Configuration</h4>
                  <div className="config-details">
                    <span>📍 Venue: {CUSTOMIZER_BACKDROPS.find(b => b.id === customBackdrop)?.name}</span>
                    <span>🛋️ Seating: {CUSTOMIZER_SEATINGS.find(s => s.id === customSeating)?.name}</span>
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

      {/* ==========================================
          PRODUCT CATALOG & FILTERING MODULE
         ========================================== */}
      <section id="catalog" className="catalog">
        <div className="catalog-container">
          
          {/* Section Header */}
          <div className="catalog-header">
            <div className="header-content">
              <span className="section-label">Premium Collection</span>
              <h2>
                {platformMode === 'events' ? 'Exclusive Wedding Decor' : 'Luxury Furnishings'}
              </h2>
              <p>
                Expertly curated designs with premium materials and impeccable craftsmanship. Discover the perfect choice for your space.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="filters">
              {['All', 'Traditional', 'Modern', 'Royal', 'Boho'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedStyleFilter(filter)}
                  className={`filter-btn ${selectedStyleFilter === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          {displayedItems.length > 0 ? (
            <div className="products-grid">
              {displayedItems.map((item) => {
                const isFavorite = shortlist.includes(item.id);
                return (
                  <div key={item.id} className="product-card">
                    
                    {/* Shortlist heart overlay */}
                    <button 
                      onClick={() => handleToggleShortlist(item.id, item.name)}
                      className="card-heart"
                    >
                      <Heart className={`icon ${isFavorite ? 'liked' : ''}`} style={{ fill: isFavorite ? '#991b1b' : 'none' }} />
                    </button>

                    {/* Image Box */}
                    <div className="card-image" onClick={() => setSelectedProductDetail(item)}>
                      <img src={item.image} alt={item.name} />
                    </div>

                    {/* Product Info */}
                    <div className="card-content">
                      <h3 onClick={() => setSelectedProductDetail(item)} className="card-title">
                        {item.name}
                      </h3>

                      {/* Rating */}
                      <div className="card-rating">
                        <span className="stars">
                          <Star className="icon" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                        </span>
                        <span className="rating-number">{item.rating}</span>
                        <span className="review-count">({item.reviews})</span>
                      </div>

                      {/* Snippet */}
                      <p className="card-description">
                        {item.description}
                      </p>

                      {/* Pricing and Action */}
                      <div className="card-footer">
                        <div className="price-section">
                          <h4>Price</h4>
                          <span className="price">
                            ₹{item.price.toLocaleString()}
                          </span>
                        </div>
                        {(() => {
                          const cartItem = cart.find(i => i.id === item.id);
                          if (cartItem) {
                            return (
                              <div className="card-qty-control" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button 
                                  type="button" 
                                  onClick={() => handleDecrementCart(item.id)}
                                  className="qty-btn"
                                  style={{ width: '28px', height: '28px', border: '1px solid #1a4d4d', borderRadius: '6px', background: 'transparent', color: '#1a4d4d', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                  -
                                </button>
                                <span className="qty-value" style={{ fontWeight: 'bold', minWidth: '16px', textAlign: 'center', color: '#0f2f2f', fontSize: '14px' }}>
                                  {cartItem.quantity}
                                </span>
                                <button 
                                  type="button" 
                                  onClick={() => handleAddToCart(item, platformMode)}
                                  className="qty-btn"
                                  style={{ width: '28px', height: '28px', border: '1px solid #1a4d4d', borderRadius: '6px', background: 'transparent', color: '#1a4d4d', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                  +
                                </button>
                              </div>
                            );
                          }
                          return (
                            <button
                              onClick={() => handleAddToCart(item, platformMode)}
                              className="add-btn"
                            >
                              Add
                            </button>
                          );
                        })()}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <Sparkles className="icon" />
              <h3>No matching designs found</h3>
              <p>Try searching other keywords or choose a different style filter.</p>
              <button 
                onClick={() => { setSelectedStyleFilter('All'); setSearchQuery(''); }}
                className="reset-btn"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ==========================================
          INTERACTIVE ESTIMATOR / QUOTE WIZARD (STEPPER)
         ========================================== */}
      <section className="wizard">
        <div className="wizard-container">
          
          <div className="wizard-header">
            <span className="section-label">Quote Builder</span>
            <h2>Generate Your Bespoke Budget Quote</h2>
            <p>
              Don't wait weeks for an interior decorator or wedding planner to respond. Use our instant custom estimator to map details and get pricing transparently.
            </p>
            
            {/* Step Indicators */}
            <div className="steps">
              {[1, 2, 3].map((step) => (
                <button 
                  key={step} 
                  type="button"
                  onClick={() => setWizardStep(step)}
                  className={`step-btn ${wizardStep === step ? 'active' : ''}`}
                >
                  Step {step}: {step === 1 ? 'Scale' : step === 2 ? 'Venue' : 'Details'}
                </button>
              ))}
            </div>
          </div>

          <div className="wizard-body">
            
            {/* Step Contents */}
            {!wizardCompleted ? (
              <form onSubmit={handleWizardSubmit} className="wizard-options">
                
                {wizardStep === 1 && (
                  <div className="option-group">
                    <span className="option-label">1. Scale of your setup or event</span>
                    <div className="option-items">
                      {[
                        { id: 'intimate', name: 'Intimate / Elegant' },
                        { id: 'premium', name: 'Premium Craft' },
                        { id: 'royal', name: 'Royal Heritage' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setWizardScale(item.id)}
                          className={`option-item ${wizardScale === item.id ? 'active' : ''}`}
                        >
                          {item.name} {wizardScale === item.id && <span className="check"></span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="option-group">
                    <span className="option-label">2. Venue/space layout to style</span>
                    <div className="option-items">
                      {[
                        { id: 'banquet', name: '🏛️ Banquet Hall' },
                        { id: 'garden', name: '🌳 Outdoor Garden' },
                        { id: 'beach', name: '🏖️ Beachfront' },
                        { id: 'fort', name: '🏰 Palace / Fort' },
                        { id: 'residence', name: '🏡 Residence' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setWizardVenue(item.id)}
                          className={`option-item ${wizardVenue === item.id ? 'active' : ''}`}
                        >
                          {item.name} {wizardVenue === item.id && <span className="check"></span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="option-group">
                    <span className="option-label">3. Customise material drapes & floristry</span>
                    <div className="option-items">
                      {[
                        { id: 'standard', name: 'Standard Georgette' },
                        { id: 'heavy', name: 'Premium Velvet & Blooms' },
                        { id: 'glass', name: 'Crystals & Edison Lamps' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setWizardDrapes(item.id)}
                          className={`option-item ${wizardDrapes === item.id ? 'active' : ''}`}
                        >
                          {item.name} {wizardDrapes === item.id && <span className="check"></span>}
                        </button>
                      ))}
                    </div>
                    
                    <div style={{ marginTop: '24px' }}>
                      <span className="option-label">Save Estimate Email</span>
                      <input 
                        type="email" 
                        required
                        placeholder="name@luxury-living.com" 
                        className="email-input"
                        value={wizardEmail}
                        onChange={(e) => setWizardEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="wizard-actions">
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep(prev => prev - 1)}
                      className="btn-submit"
                    >
                      Back
                    </button>
                  )}

                  {wizardStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(prev => prev + 1)}
                      className="btn-get-quote"
                    >
                      Next
                    </button>
                  ) : (
                    <button type="submit" className="btn-get-quote">
                      Generate Estimate
                    </button>
                  )}
                </div>

              </form>
            ) : (
              // Calculated Result display
              <div className="quote-success">
                <div className="success-icon">
                  <span className="icon">✓</span>
                </div>
                <div>
                  <span className="success-label">Quote Generated</span>
                  <h3>Estimate Finalized</h3>
                </div>
                <div className="quote-amount">
                  ₹{estimatedQuotePrice.toLocaleString()}
                </div>
                <div className="quote-details">
                  A detailed visual layout PDF and invoice estimate has been dispatched to <strong>{wizardEmail}</strong>. Our site decorator will coordinate layout slots within 2 hours.
                </div>
                <button onClick={resetWizard} className="continue-btn">
                  Recalculate Estimate
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ==========================================
          INFLUENCER / CLIENT SHOWCASE MODULE
         ========================================== */}
      <section className="influencer">
        <div className="influencer-container">
          
          <div className="section-header">
            <span className="section-label">Influencer Testimonials</span>
            <h2>What Makes Our Craft &ldquo;Home&rdquo;</h2>
          </div>

          <div className="reels-grid">
            {INFLUENCER_REELS.map((reel, idx) => (
              <div key={idx} className="reel-card">
                <img src={reel.image} alt={reel.name} />
                <div className="reel-play">
                  <Play className="icon" />
                </div>
                <div className="reel-badge">
                  {reel.views} Views
                </div>
                <div className="reel-footer">
                  <div className="person-quote">{reel.quote}</div>
                  <div className="person-name">{reel.name}</div>
                  <div className="person-role">{reel.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          FAQ ACCORDION MODULE
         ========================================== */}
      <section className="faq">
        <div className="faq-container">
          
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2>Frequently Asked Clarifications</h2>
          </div>

          <div className="faq-items">
            {[
              {
                q: 'How long do the wedding flowers remain fresh after booking installation?',
                a: 'We source fresh marigolds, roses, and orchids directly from verified high-altitude nurseries. They are misted with micro-nutrients immediately post-scaffolding and are guaranteed to retain absolute velvet sheen for up to 36 hours from installation.'
              },
              {
                q: 'Can I choose custom fabric colors or heights not listed in the visualizer?',
                a: 'Absolutely! Our Customizer Studio shows only popular curated choices. Our full production unit carries over 140 fabric colors in organza, georgette, and thick velvet, and frames can be scaled dynamically from 8 feet to 16 feet depending on venue roof clearances.'
              },
              {
                q: 'Is the solid furniture catalog assembled on delivery or flatpacked?',
                a: 'Our premium teakwood swings and tufted emerald sofas are delivered fully assembled in highly cushioned luxury trucks. Our specialized master carpenters perform the final site anchoring to ensure structural safety.'
              },
              {
                q: 'What is your booking slot advance cancellation and refund policy?',
                a: 'For event bookings, we offer a 100% refund or slot change up to 14 days prior to your occasion. For custom teakwood furniture, because each piece is individually carved by master artisans, changes are accepted only within 48 hours of order confirmation.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="faq-item">
                  <div 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`faq-question ${isOpen ? 'open' : ''}`}
                  >
                    <span className="question-text">{faq.q}</span>
                    <ChevronDown className="toggle-icon" />
                  </div>
                  <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                    <div className="answer-text">{faq.a}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}
