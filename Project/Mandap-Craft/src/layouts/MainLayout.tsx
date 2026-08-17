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
  ChevronDown,
  Menu,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

import {
  CATEGORIES,
  CATALOG_PRODUCTS,
  type CategoryData,
  type ProductItem,
} from '../constants';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { authApi, searchApi, type SearchResults } from '../services/api';

// Custom Debounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Platform States
  const [platformMode, setPlatformMode] = useState<'events' | 'boutique'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  
  // Global Search states
  const [searchResults, setSearchResults] = useState<SearchResults>({ orders: [], quotes: [], posts: [] });
  const [localProductResults, setLocalProductResults] = useState<ProductItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const desktopSearchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Mega-Menu & Mobile Nav States
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
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
    const matches = CATALOG_PRODUCTS.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categoryId.toLowerCase().includes(query) ||
        item.subcategoryId.toLowerCase().includes(query) ||
        item.features.some((f) => f.toLowerCase().includes(query))
      );
    });

    setLocalProductResults(matches.slice(0, 5)); // Limit to 5 suggestions
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

  const handleSelectProduct = (product: ProductItem) => {
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

  const activeCategoryData: CategoryData | undefined = CATEGORIES.find(
    (c) => c.id === (hoveredCategory || 'wedding')
  );

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
            <span className="logo-text">MANDAP<span className="logo-dot">·</span>CRAFT</span>
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

          </div>
        </div>

        {/* ==========================================
            MEGA-MENU CATEGORY NAVIGATION BAR
           ========================================== */}
        <nav className="category-navbar">
          <div className="category-navbar-container">
            <ul className="category-nav-list" onMouseLeave={handleCategoryMouseLeave}>
              
              {/* All Categories Link */}
              <li className="category-nav-item">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('all')}
                  className={`category-nav-link ${selectedCategory === 'all' ? 'active' : ''}`}
                >
                  <span className="cat-icon">✨</span>
                  <span className="cat-label">All Collections</span>
                </button>
              </li>

              {/* 6 Primary Category Tabs */}
              {CATEGORIES.map((category) => {
                const isHovered = hoveredCategory === category.id;
                const isSelected = selectedCategory === category.id;

                return (
                  <li 
                    key={category.id} 
                    className="category-nav-item"
                    onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                  >
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(category.id)}
                      className={`category-nav-link ${isSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                    >
                      <span className="cat-icon">{category.icon}</span>
                      <span className="cat-label">{category.title}</span>
                      <ChevronDown className={`cat-chevron ${isHovered ? 'rotate' : ''}`} />
                      {category.badge && (
                        <span className="nav-pill-badge">{category.badge}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ==========================================
              MEGA-MENU FLYOUT PANEL (Pepperfry Style)
             ========================================== */}
          {hoveredCategory && activeCategoryData && (
            <div 
              className="megamenu-panel"
              onMouseEnter={() => handleCategoryMouseEnter(hoveredCategory)}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <div className="megamenu-container">
                
                {/* Left: Subsections Multi-Column List */}
                <div className="megamenu-columns">
                  
                  <div className="megamenu-header-row">
                    <div className="megamenu-title-group">
                      <span className="megamenu-tag">{activeCategoryData.icon} {activeCategoryData.title}</span>
                      <h3>{activeCategoryData.tagline}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(activeCategoryData.id)}
                      className="megamenu-view-all"
                    >
                      View All {activeCategoryData.shortTitle} ({activeCategoryData.subsections.length} Subcategories)
                      <ArrowRight className="icon" />
                    </button>
                  </div>

                  <div className="megamenu-subsections-grid">
                    {activeCategoryData.subsections.map((sub) => {
                      return (
                        <div key={sub.id} className="megamenu-column-group">
                          <button
                            type="button"
                            onClick={() => handleSubcategoryClick(activeCategoryData.id, sub.id)}
                            className="megamenu-heading-btn"
                          >
                            <span className="heading-title">{sub.title}</span>
                            <ChevronRight className="icon" />
                          </button>
                          <p className="column-desc">{sub.description}</p>
                          <ul className="megamenu-item-list">
                            {sub.popularItems.map((item, i) => (
                              <li key={i}>
                                <button
                                  type="button"
                                  onClick={() => handleSubcategoryClick(activeCategoryData.id, sub.id)}
                                  className="megamenu-item-link"
                                >
                                  {item}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Right: Spotlight Promotional Card */}
                <div className="megamenu-spotlight">
                  <div className="spotlight-card">
                    <div className="spotlight-image">
                      <img 
                        src={activeCategoryData.promo.image} 
                        alt={activeCategoryData.promo.title} 
                      />
                      <div className="spotlight-badge">
                        {activeCategoryData.promo.badge}
                      </div>
                      {activeCategoryData.promo.discount && (
                        <div className="spotlight-discount">
                          {activeCategoryData.promo.discount}
                        </div>
                      )}
                    </div>
                    <div className="spotlight-body">
                      <h4>{activeCategoryData.promo.title}</h4>
                      <p>{activeCategoryData.promo.subtitle}</p>
                      <button
                        type="button"
                        onClick={() => {
                          if (activeCategoryData.promo.targetSubcategory) {
                            handleSubcategoryClick(activeCategoryData.id, activeCategoryData.promo.targetSubcategory);
                          } else {
                            handleCategoryClick(activeCategoryData.id);
                          }
                        }}
                        className="spotlight-btn"
                      >
                        {activeCategoryData.promo.ctaText}
                        <ArrowRight className="icon" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </nav>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      <div className={`mobile-category-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-logo">
            <span className="logo-text">MANDAP·CRAFT</span>
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
                <span className="logo-text">MANDAP·CRAFT</span>
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
                <li><button type="button" onClick={() => handleSubcategoryClick('wedding', 'mandaps')}>Mandaps</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('wedding', 'tents')}>Tents &amp; Shamianas</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('wedding', 'canopies')}>Canopies</button></li>
                <li><button type="button" onClick={() => handleSubcategoryClick('furniture', 'chairs')}>Chairs</button></li>
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
          <div className="footer-bottom">
            <p>© 2026 Mandap-Craft Infrastructure Pvt Ltd. All Rights Reserved. Crafted for royal celebrations.</p>
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
              CATALOG_PRODUCTS
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
                        Book / Add to Order
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
