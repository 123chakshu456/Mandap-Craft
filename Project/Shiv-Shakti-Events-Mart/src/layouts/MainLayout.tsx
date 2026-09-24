import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  X,
  Sparkles,
  Phone,
  MessageSquare,
  Menu,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

import { CATEGORIES } from '../constants';
import { useCart } from '../features/orders/hooks/useCart';
import CartDrawer from '../features/orders/components/CartDrawer';
import { useToast, useDebounce } from '../shared/hooks';
import { useProducts, ProductDetailModal, ShortlistDrawer } from '../features/products';
import { CategoryMegaMenu } from '../features/categories';
import { authApi } from '../features/auth';
import { searchApi, type SearchResults } from '../features/search';
import type { Product } from '../shared/types/models.types';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Platform States
  const [platformMode, setPlatformMode] = useState<'events' | 'boutique'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');

  // Products from API (replaces CATALOG_PRODUCTS static import)
  const { products, isLoading: isLoadingProducts, refetch: refetchProducts, error: productsError } = useProducts();

  // Global Search states
  const [searchResults, setSearchResults] = useState<SearchResults>({ orders: [], quotes: [], posts: [] });
  const [localProductResults, setLocalProductResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const desktopSearchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Mega-Menu & Mobile Nav States
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const [isMegaMenuPinned, setIsMegaMenuPinned] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>('wedding');

  const menuLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    categoryId?: string;
    subcategoryId?: string;
  } | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; id?: string } | null>(null);

  // Custom Toast hook
  const { toastMessage, showToast } = useToast();

  // Restore authenticated session from backend on mount
  useEffect(() => {
    authApi.getMe().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    }).catch(() => {
      // Offline / not logged in
    });
  }, []);

  // Clean /#catalog or #catalog from URL if present and scroll smoothly
  useEffect(() => {
    if (window.location.hash === '#catalog' || window.location.hash === '#/catalog') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // Debounced search query for backend calls
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  // Fetch backend results (Orders / Quotes) for authenticated users
  useEffect(() => {
    const query = debouncedSearchQuery.trim();
    if (!query) {
      setSearchResults({ orders: [], quotes: [], posts: [] });
      return;
    }

    if (currentUser) {
      setIsSearching(true);
      searchApi.search(query)
        .then((res) => {
          setSearchResults(res);
        })
        .catch((err) => {
          console.error('Global search error:', err);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [debouncedSearchQuery, currentUser]);

  // Handle click outside to close suggestion lists
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDesktop = desktopSearchRef.current?.contains(target);
      const clickedMobile = mobileSearchRef.current?.contains(target);
      if (!clickedDesktop && !clickedMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update query and filter products instantly on the client
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setShowSuggestions(true);

    if (!val.trim()) {
      setLocalProductResults([]);
      setSearchResults({ orders: [], quotes: [], posts: [] });
      return;
    }

    const query = val.toLowerCase().trim();
    const matches = products.filter((item) => {
      const feats = Array.isArray(item.features) ? item.features : [];
      return (
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.categoryId && item.categoryId.toLowerCase().includes(query)) ||
        (item.subcategoryId && item.subcategoryId.toLowerCase().includes(query)) ||
        feats.some((f: any) => typeof f === 'string' && f.toLowerCase().includes(query))
      );
    });

    setLocalProductResults(matches.slice(0, 5) as any); // Limit to 5 suggestions
  };

  // Submit search form (Redirect to home page catalog)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (location.pathname !== '/') {
      navigate('/');
    }

    setTimeout(() => {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProductDetail(product);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const handleSelectOrder = (order: any) => {
    try {
      navigator.clipboard.writeText(order.orderNumber);
      showToast(`📋 Order Reference "${order.orderNumber}" copied to clipboard!`);
    } catch {
      showToast(`Order Reference: ${order.orderNumber}`);
    }
    setShowSuggestions(false);
  };

  const handleSelectQuote = (quote: any) => {
    try {
      navigator.clipboard.writeText(quote.id);
      showToast(`📋 Quote ID copied to clipboard!`);
    } catch {
      showToast(`Quote: ${quote.venue} (${quote.status})`);
    }
    setShowSuggestions(false);
  };

  const renderSuggestions = () => {
    const hasProducts = localProductResults.length > 0;
    const hasOrders = searchResults.orders && searchResults.orders.length > 0;
    const hasQuotes = searchResults.quotes && searchResults.quotes.length > 0;

    if (!hasProducts && !hasOrders && !hasQuotes) {
      return (
        <div className="no-results">
          <p>No matches found for "<strong>{searchQuery}</strong>"</p>
        </div>
      );
    }

    return (
      <div className="suggestions-scroll-container">
        {/* Products Section */}
        {hasProducts && (
          <div className="suggestion-group">
            <div className="group-header">Catalog Items</div>
            {localProductResults.map((product) => (
              <div
                key={product.id}
                className="suggestion-item product-item"
                onClick={() => handleSelectProduct(product)}
              >
                <div className="product-thumb">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="item-details">
                  <div className="item-name">{product.name}</div>
                  <div className="item-meta">
                    <span className="style-tag">{product.style}</span>
                    <span className="price-tag">₹{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders Section */}
        {hasOrders && (
          <div className="suggestion-group">
            <div className="group-header">Your Orders</div>
            {searchResults.orders.map((order) => (
              <div
                key={order.id}
                className="suggestion-item order-item"
                onClick={() => handleSelectOrder(order)}
              >
                <div className="item-icon-wrapper">📦</div>
                <div className="item-details">
                  <div className="item-name">{order.orderNumber} - {order.customerName}</div>
                  <div className="item-meta">
                    <span className="status-tag">{order.status}</span>
                    <span className="price-tag">₹{order.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quotes Section */}
        {hasQuotes && (
          <div className="suggestion-group">
            <div className="group-header">Bespoke Quotes</div>
            {searchResults.quotes.map((quote) => (
              <div
                key={quote.id}
                className="suggestion-item quote-item"
                onClick={() => handleSelectQuote(quote)}
              >
                <div className="item-icon-wrapper">📋</div>
                <div className="item-details">
                  <div className="item-name">{quote.venue} ({quote.scale})</div>
                  <div className="item-meta">
                    <span className="status-tag">{quote.status}</span>
                    <span className="price-tag">Est: ₹{quote.estimated.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };


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

  // Handle Mega-Menu Hover interactions
  const handleCategoryMouseEnter = (catId: string) => {
    if (menuLeaveTimeoutRef.current) {
      clearTimeout(menuLeaveTimeoutRef.current);
      menuLeaveTimeoutRef.current = null;
    }
    setHoveredCategory(catId);
    const catData = CATEGORIES.find((c) => c.id === catId);
    if (catData && catData.subsections.length > 0) {
      setHoveredSubcategory((prev) => {
        // If current hoveredSubcategory belongs to this category, keep it; else reset to first subsection
        const exists = catData.subsections.some((s) => s.id === prev);
        return exists ? prev : catData.subsections[0].id;
      });
    }
  };

  const handleCategoryMouseLeave = () => {
    if (isMegaMenuPinned) return;
    menuLeaveTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 220);
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
    setSelectedStyleFilter('All');
    setHoveredCategory(null);
    setIsMegaMenuPinned(false);
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSubcategoryClick = (catId: string, subId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(subId);
    setSelectedStyleFilter('All');
    setHoveredCategory(null);
    setIsMegaMenuPinned(false);
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
    }
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSelectProductDetail = (item: any) => {
    setHoveredCategory(null);
    setIsMegaMenuPinned(false);
    setIsMobileMenuOpen(false);
    setSelectedProductDetail(item);
  };

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
        <span className="banner-text">🎉 FESTIVE SEASON: COMPLIMENTARY DESIGN CONSULTATION &amp; UP TO 25% OFF WEDDINGS | CODE: ROYALMAJESTY</span>
      </div>

      {/* PRIMARY HEADER */}
      <header className="header">
        <div className="header-container">

          {/* MOBILE MENU TOGGLE */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open categories menu"
          >
            <Menu className="icon" />
          </button>

          {/* LOGO AREA */}
          <Link
            to="/"
            className="logo"
            style={{ textDecoration: 'none' }}
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
              setSearchQuery('');
              setSelectedStyleFilter('All');
            }}
          >
            <span className="logo-text">SHIV SHAKTI EVENTS MART</span>
            <span className="logo-subtext">WEDDING &amp; EVENT INFRASTRUCTURE</span>
          </Link>

          {/* ACTION ICONS & SEARCH */}
          <div className="actions">

            {/* SEARCH TRIGGER */}
            <form onSubmit={handleSearchSubmit} className="search-box-container" ref={desktopSearchRef}>
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search mandaps, chairs, tents, crockery..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                {(searchQuery || isSearching) && (
                  <div className="search-controls" style={{ display: 'flex', alignItems: 'center' }}>
                    {isSearching ? (
                      <span className="search-spinner" />
                    ) : (
                      <button type="button" onClick={() => handleSearchChange('')} className="clear-btn" aria-label="Clear search">
                        <X className="icon" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* Dropdown Suggestions */}
              {showSuggestions && searchQuery.trim() !== '' && (
                <div className="search-suggestions-dropdown">
                  {renderSuggestions()}
                </div>
              )}
            </form>

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
                Bookings
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

            {/* ADMIN PANEL BUTTON — only for ADMIN role */}
            {currentUser && (currentUser as any).role === 'ADMIN' && (
              <Link
                to="/admin"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '6px 12px', borderRadius: '7px',
                  background: 'linear-gradient(135deg, #312e81, #4c1d95)',
                  color: '#a5b4fc', textDecoration: 'none',
                  fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em',
                  border: '1px solid #4338ca', transition: 'opacity 0.15s',
                  flexShrink: 0,
                }}
                title="Admin Dashboard"
              >
                ⚙ Admin
              </Link>
            )}

          </div>
        </div>

        {/* ==========================================
            MEGA-MENU CATEGORY NAVIGATION BAR
           ========================================== */}
        <CategoryMegaMenu
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          hoveredCategory={hoveredCategory}
          hoveredSubcategory={hoveredSubcategory}
          onCategoryMouseEnter={handleCategoryMouseEnter}
          onCategoryMouseLeave={handleCategoryMouseLeave}
          onSubcategoryHover={(subId) => setHoveredSubcategory(subId)}
          onCategoryClick={handleCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
        />
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      <div className={`mobile-category-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            <span className="logo-text">SHIV SHAKTI EVENTS MART</span>
            <span className="drawer-subtitle">Browse Categories</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="drawer-close-btn"
            aria-label="Close menu"
          >
            <X className="icon" />
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="drawer-search-container" ref={mobileSearchRef}>
          <div className="drawer-search">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            {(searchQuery || isSearching) && (
              <div className="search-controls" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                {isSearching ? (
                  <span className="search-spinner" />
                ) : (
                  <button type="button" onClick={() => handleSearchChange('')} className="clear-btn" aria-label="Clear search" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <X className="icon" style={{ width: '14px', height: '14px' }} />
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Dropdown Suggestions */}
          {showSuggestions && searchQuery.trim() !== '' && (
            <div className="search-suggestions-dropdown mobile-dropdown">
              {renderSuggestions()}
            </div>
          )}
        </form>

        <div className="drawer-content">
          <button
            type="button"
            onClick={() => handleCategoryClick('all')}
            className={`drawer-all-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            <span>✨ All Categories &amp; Collections</span>
            <ArrowRight className="icon" />
          </button>

          <div className="drawer-accordion-list">
            {CATEGORIES.map((cat) => {
              const isExpanded = expandedMobileCategory === cat.id;
              return (
                <div key={cat.id} className="drawer-accordion-item">
                  <div
                    className={`drawer-accordion-trigger ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                  >
                    <div className="trigger-left">
                      <span className="cat-icon">{cat.icon}</span>
                      <span className="cat-title">{cat.title}</span>
                    </div>
                    <div className="trigger-right">
                      {cat.badge && <span className="cat-badge">{cat.badge}</span>}
                      <ChevronDown className={`chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="drawer-subsections-list">
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        className="drawer-sub-all-btn"
                      >
                        All in {cat.shortTitle} →
                      </button>
                      {cat.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubcategoryClick(cat.id, sub.id)}
                          className="drawer-sub-item-btn"
                        >
                          <span className="sub-title">{sub.title}</span>
                          <span className="sub-desc">{sub.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

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
            selectedCategory,
            setSelectedCategory,
            selectedSubcategory,
            setSelectedSubcategory,
            handleCategoryClick,
            handleSubcategoryClick,
            cart,
            setCart,
            shortlist,
            currentUser,
            setCurrentUser,
            handleAddToCart,
            handleDecrementCart,
            handleRemoveFromCart,
            handleToggleShortlist,
            setSelectedProductDetail: handleSelectProductDetail,
            showToast,
            products,
            isLoadingProducts,
            refetchProducts,
            productsError,
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
              <h3>Join Shiv Shakti Events Mart Privilege Club</h3>
              <p>
                Subscribe to receive invite-only alerts for designer collaborations, wedding stage trends, catering equipment auctions, and seasonal catalog launches.
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

          {/* Links Grid - 6 Main Categories */}
          <div className="footer-top">

            <div className="footer-brand">
              <Link
                to="/"
                className="brand-logo"
                style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setSearchQuery('');
                  setSelectedStyleFilter('All');
                }}
              >
                <span className="logo-text">SHIV SHAKTI EVENTS MART</span>
                <p className="logo-tagline">Bespoke Wedding &amp; Event Infrastructure</p>
              </Link>
              <p style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '12px', lineHeight: '1.6' }}>
                India's premier marketplace for royal wedding mandaps, banquet furniture, industrial catering equipment, decorative props, climate essentials, and turnkey manufacturing.
              </p>
              <div className="social-links">
                <a href="#" aria-label="Phone consultation">
                  <Phone className="icon" />
                </a>
                <a href="#" aria-label="Chat with stylist">
                  <MessageSquare className="icon" />
                </a>
              </div>
            </div>

            {/* Wedding & Furniture Columns */}
            <div className="footer-section">
              <h4>Wedding &amp; Furniture</h4>
              <ul>
                <li><button type="button" onClick={() => handleSubcategoryClick('wedding', 'ceilings')}>Ceilings &amp; Canopies</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('wedding', 'mandaps')}>Mandaps</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('wedding', 'tents')}>Tents &amp; Shamianas</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('wedding', 'canopies')}>Canopies</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('furniture', 'designer-chairs')}>Designer Chairs</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('furniture', 'plastic-chairs')}>Plastic Chairs</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('furniture', 'tables')}>Tables</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('furniture', 'sofas')}>Sofas &amp; Seating</button></li>
              </ul>
            </div>

            {/* Catering & Decor Columns */}
            <div className="footer-section">
              <h4>Catering &amp; Decor</h4>
              <ul>
                <li><button type="button" onClick={() => handleSubcategoryClick('catering', 'crockery')}>Brass &amp; Silver Crockery</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('catering', 'serving-items')}>Chafing Dishes</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('catering', 'buffet-counters')}>Buffet Counters</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('decor', 'artificial-flowers')}>Artificial Flowers</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('decor', 'panels')}>Jali &amp; Mirror Panels</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('decor', 'lighting')}>Ambient Lighting</button></li>
              </ul>
            </div>

            {/* Essentials & Custom Columns */}
            <div className="footer-section">
              <h4>Essentials &amp; Custom</h4>
              <ul>
                <li><button type="button" onClick={() => handleSubcategoryClick('event-essentials', 'coolers')}>Mist Coolers</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('event-essentials', 'fans')}>Industrial Fans</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('event-essentials', 'carpets')}>Red VIP Carpets</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('custom-manufacturing', 'custom-tents')}>Custom Tents</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('custom-manufacturing', 'custom-counters')}>Custom Counters</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('custom-manufacturing', 'custom-decor')}>Custom Décor</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p>© 2026 Shiv Shakti Events Mart Pvt Ltd. All Rights Reserved. Crafted for royal celebrations.</p>
            <Link
              to="/admin"
              style={{
                color: '#d4af37',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '5px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              ⚙ Admin Cockpit →
            </Link>
          </div>

        </div>
      </footer>

      {/* ==========================================
          SLIDE-OVER DRAWERS & MODALS
         ========================================== */}

      {/* 1. SHORTLIST / FAVORITES DRAWER */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlist={shortlist}
        products={products}
        onToggleShortlist={handleToggleShortlist}
      />

      {/* 2. BOOKINGS & CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onDecrement={handleDecrementCart}
        onIncrement={(item, type) => handleAddToCart(item, type)}
        onRemove={handleRemoveFromCart}
        onCheckout={() => navigate('/checkout')}
      />

      {/* 3. PRODUCT QUICK VIEW MODAL */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        cartQuantity={cart.find((i) => i.id === selectedProductDetail?.id)?.quantity || 0}
        onAddToCart={(item, customArea) => handleAddToCart(item, platformMode, customArea)}
        onDecrementCart={handleDecrementCart}
      />

    </div>
  );
}
