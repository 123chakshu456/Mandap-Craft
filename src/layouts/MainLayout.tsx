import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  X,
  Sparkles,
  Phone,
  MessageSquare,
} from 'lucide-react';

import {
  DECOR_THEMES,
  FURNITURE_ITEMS,
} from '../constants';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';

export default function MainLayout() {
  const navigate = useNavigate();

  // Navigation & Platform States
  const [platformMode, setPlatformMode] = useState<'events' | 'boutique'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');

  // Modals & UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<{
    id: string;
    name: string;
    price: number;
    image: string;
    style: string;
    rating: number;
    reviews: number;
    description: string;
    features: string[];
  } | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Custom Toast hook
  const { toastMessage, showToast } = useToast();

  // Cart Custom Hook
  const {
    cart,
    setCart,
    shortlist,
    handleAddToCart,
    handleDecrementCart,
    handleRemoveFromCart,
    handleToggleShortlist
  } = useCart(showToast);

  return (
    <div className="app">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast">
          <Sparkles className="toast-icon" />
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* TOP DECORATIVE PROMO BANNER */}
      <div className="promo-banner">
        <Sparkles className="banner-icon" />
        <span className="banner-text">🎉 FESTIVE SEASON: COMPLIMENTARY CONSULTATION & ₹15,000 CASHBACK | CODE: ROYALMAJESTY</span>
      </div>

      {/* PRIMARY HEADER */}
      <header className="header">
        <div className="header-container">
          
          {/* LOGO AREA */}
          <Link 
            to="/" 
            className="logo" 
            style={{ textDecoration: 'none' }}
            onClick={() => {
              setPlatformMode('events');
              setSearchQuery('');
              setSelectedStyleFilter('All');
            }}
          >
            <span className="logo-text">MANDAP<span className="logo-dot">·</span>CRAFT</span>
          </Link>

          {/* PLATFORM SWITCHER DESKTOP */}
          <div className="nav-switcher">
            <Link 
              to="/"
              onClick={() => setPlatformMode('events')}
              className={`nav-btn ${platformMode === 'events' ? 'active' : ''}`}
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Events & Decors
            </Link>
            <Link 
              to="/"
              onClick={() => setPlatformMode('boutique')}
              className={`nav-btn ${platformMode === 'boutique' ? 'active' : ''}`}
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Furnishings
            </Link>
          </div>

          {/* ACTION ICONS */}
          <div className="actions">
            
            {/* SEARCH TRIGGER */}
            <div className="search-box">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-btn">
                  <X className="icon" />
                </button>
              )}
            </div>

            {/* FAVORITES BUTTON */}
            <button 
              onClick={() => setIsShortlistOpen(true)}
              className="action-btn"
              title="View Shortlist"
            >
              <Heart className="icon" />
              {shortlist.length > 0 && (
                <span className="badge">
                  {shortlist.length}
                </span>
              )}
            </button>

            {/* CART / BOOKING BUTTON */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="cart-btn"
            >
              <ShoppingBag className="icon" />
              <span className="text">
                {platformMode === 'events' ? 'Bookings' : 'My Cart'}
              </span>
              <span className="count">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>

            {/* USER LOGIN / PROFILE BUTTON */}
            {currentUser ? (
              <Link to="/login" className="action-btn logged-in" title={`Welcome, ${currentUser.name}`}>
                <User className="icon" />
                <span className="user-dot"></span>
              </Link>
            ) : (
              <Link to="/login" className="login-nav-btn" title="Sign In / Create Account">
                <User className="icon" />
                <span className="btn-text">Sign In</span>
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* DYNAMIC CHILD PAGE CONTENT */}
      <main>
        <Outlet 
          context={{
            platformMode,
            setPlatformMode,
            searchQuery,
            setSearchQuery,
            selectedStyleFilter,
            setSelectedStyleFilter,
            cart,
            setCart,
            shortlist,
            currentUser,
            setCurrentUser,
            handleAddToCart,
            handleDecrementCart,
            handleRemoveFromCart,
            handleToggleShortlist,
            setSelectedProductDetail,
            showToast,
          }} 
        />
      </main>

      {/* ==========================================
          FOOTER MODULE & NEWSLETTER SIGNUP
         ========================================== */}
      <footer className="footer">
        <div className="footer-container">
          
          {/* Top Newsletter Grid */}
          <div className="footer-newsletter">
            <div className="newsletter-info">
              <h3>Join Mandap-Craft Privilege Club</h3>
              <p>
                Subscribe to receive invite-only alerts for designer collaborations, seasonal furniture auctions, wedding decor trends, and elite lifestyle content.
              </p>
            </div>
            <div className="newsletter-form">
              <form 
                onSubmit={(e) => { e.preventDefault(); showToast("Welcome to the Privilege Club! Check your inbox."); }} 
                style={{ display: 'flex', gap: '12px', width: '100%' }}
              >
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email address" 
                />
                <button type="submit">
                  Join Privilege
                </button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="footer-top">
            
            <div className="footer-brand">
              <Link 
                to="/" 
                className="brand-logo" 
                style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
                onClick={() => {
                  setPlatformMode('events');
                  setSearchQuery('');
                  setSelectedStyleFilter('All');
                }}
              >
                <span className="logo-text">MANDAP·CRAFT</span>
                <p className="logo-tagline">Bespoke Heritage & Interiors</p>
              </Link>
              <p style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '12px', lineHeight: '1.6' }}>
                Blending centuries-old South Asian festive heritage with exquisite contemporary design philosophies. We craft moments and spaces that breathe royalty.
              </p>
              <div className="social-links">
                <a href="#">
                  <Phone className="icon" />
                </a>
                <a href="#">
                  <MessageSquare className="icon" />
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4>Events Decors</h4>
              <ul>
                <li><Link to="/" onClick={() => setPlatformMode('events')}>Royal Mandaps</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('events')}>Floral Stages</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('events')}>Haldi Concepts</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('events')}>Mehendi Sets</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('events')}>Reception Stages</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Boutique Store</h4>
              <ul>
                <li><Link to="/" onClick={() => setPlatformMode('boutique')}>Teakwood swings</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('boutique')}>Accent Chairs</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('boutique')}>Marble Tables</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('boutique')}>Glass Lamps</Link></li>
                <li><Link to="/" onClick={() => setPlatformMode('boutique')}>Tufted Beds</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Enterprise</h4>
              <ul>
                <li><a href="#">Partner Program</a></li>
                <li><a href="#">Hotel Consults</a></li>
                <li><a href="#">Bulk Gifting</a></li>
                <li><a href="#">Artisan Council</a></li>
                <li><a href="#">Sustainability</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="footer-bottom">
            <p>© 2026 Mandap-Craft Luxury Pvt Ltd. All Rights Reserved. Crafted with extreme luxury.</p>
          </div>

        </div>
      </footer>

      {/* ==========================================
          SLIDE-OVER DRAWERS & MODALS
         ========================================== */}
      
      {/* 1. SHORTLIST / FAVORITES DRAWER */}
      <div className={`shortlist-modal ${isShortlistOpen ? 'open' : ''}`}>
        <div className="modal-header">
          <h2>My Saved Favorites ({shortlist.length})</h2>
          <button onClick={() => setIsShortlistOpen(false)} className="close-btn">
            <X className="icon" />
          </button>
        </div>

        <div className="modal-content">
          <div className="shortlist-items">
            {shortlist.length > 0 ? (
              [...DECOR_THEMES, ...FURNITURE_ITEMS]
                .filter(item => shortlist.includes(item.id))
                .map(item => (
                  <div key={item.id} className="item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">₹{item.price.toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => handleToggleShortlist(item.id, item.name)}
                      className="remove-btn"
                    >
                      <X className="icon" />
                    </button>
                  </div>
                ))
            ) : (
              <div className="empty">
                <Heart className="icon" />
                <p>You haven't shortlisted any luxury concepts yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isShortlistOpen && <div className="modal-overlay" onClick={() => setIsShortlistOpen(false)}></div>}

      {/* 2. BOOKINGS & CART DRAWER */}
      <div className={`cart-modal ${isCartOpen ? 'open' : ''}`}>
        <div className="modal-header">
          <h2>Selected Booking Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
          <button onClick={() => setIsCartOpen(false)} className="close-btn">
            <X className="icon" />
          </button>
        </div>

        <div className="modal-content">
          <div className="shortlist-items">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div key={idx} className="item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                    <div className="item-quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <button 
                        type="button" 
                        onClick={() => handleDecrementCart(item.id)}
                        style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#f0f0f0', cursor: 'pointer', fontSize: '12px' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => handleAddToCart(item, item.type)}
                        style={{ padding: '2px 8px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#f0f0f0', cursor: 'pointer', fontSize: '12px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="remove-btn"
                  >
                    <X className="icon" />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">
                <ShoppingBag className="icon" />
                <p>Your cart is empty.</p>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="total-section">
              <span className="total-label">Total Booking Estimate</span>
              <div className="total-value">
                ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="checkout-btn"
              >
                Checkout and Secure Slots
              </button>
            </div>
          )}
        </div>
      </div>
      {isCartOpen && <div className="modal-overlay" onClick={() => setIsCartOpen(false)}></div>}

      {/* 3. PRODUCT QUICK VIEW MODAL */}
      {selectedProductDetail && (
        <div className="product-modal">
          <div className="modal-overlay" onClick={() => setSelectedProductDetail(null)}></div>
          <div className="modal-inner">
            <button onClick={() => setSelectedProductDetail(null)} className="close-btn">
              <X className="icon" />
            </button>
            <div className="product-grid">
              <div className="product-image">
                <img src={selectedProductDetail.image} alt={selectedProductDetail.name} />
              </div>
              <div className="product-details">
                <div>
                  <h1>{selectedProductDetail.name}</h1>
                  <div className="rating">
                    <span className="stars" style={{ color: '#f59e0b' }}>★</span>
                    <span className="count"> {selectedProductDetail.rating} ({selectedProductDetail.reviews} Reviews)</span>
                  </div>
                </div>
                <p className="description">{selectedProductDetail.description}</p>
                <div className="features">
                  <h3>Key Specifications</h3>
                  <ul>
                    {selectedProductDetail.features.map((feat: string, idx: number) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                </div>
                <div className="footer">
                  <div className="price">
                    <span className="label">Package starts</span>
                    <span className="value">₹{selectedProductDetail.price.toLocaleString()}</span>
                  </div>
                  {(() => {
                    const cartItem = cart.find(i => i.id === selectedProductDetail.id);
                    if (cartItem) {
                      return (
                        <div className="card-qty-control" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            type="button" 
                            onClick={() => handleDecrementCart(selectedProductDetail.id)}
                            className="qty-btn"
                            style={{ width: '36px', height: '36px', border: '1px solid #1a4d4d', borderRadius: '6px', background: 'transparent', color: '#1a4d4d', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                          >
                            -
                          </button>
                          <span className="qty-value" style={{ fontWeight: 'bold', minWidth: '24px', textAlign: 'center', color: '#0f2f2f', fontSize: '16px' }}>
                            {cartItem.quantity}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => handleAddToCart(selectedProductDetail, platformMode)}
                            className="qty-btn"
                            style={{ width: '36px', height: '36px', border: '1px solid #1a4d4d', borderRadius: '6px', background: 'transparent', color: '#1a4d4d', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                          >
                            +
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button 
                        onClick={() => {
                          handleAddToCart(selectedProductDetail, platformMode);
                        }}
                        className="add-btn"
                      >
                        Book Now
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
