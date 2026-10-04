import { useState, useMemo, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Truck,
  ShieldCheck,
  User,
  Filter,
  Download,
} from 'lucide-react';

import {
  CATEGORIES,
  getCategoryById,
} from '../../constants';
import { ProductCard } from '../../features/products';
import { HomeCarousel } from '../../features/carousel';
import { CommonLoader, CommonError } from '../../shared/components/CommonLoader';
import type { Product } from '../../shared/types/models.types';

export default function HomePage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedStyleFilter,
    setSelectedStyleFilter,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    shortlist,
    handleToggleShortlist,
    cart,
    handleAddToCart,
    handleDecrementCart,
    setSelectedProductDetail,
    showToast,
    products = [],
    isLoadingProducts = false,
    refetchProducts,
    productsError = null,
    handleOpenDownloadCatalogue,
  } = useOutletContext<{
    platformMode?: 'events' | 'boutique';
    setPlatformMode?: Dispatch<SetStateAction<'events' | 'boutique'>>;
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    selectedStyleFilter: string;
    setSelectedStyleFilter: Dispatch<SetStateAction<string>>;
    selectedCategory: string;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
    selectedSubcategory: string;
    setSelectedSubcategory: Dispatch<SetStateAction<string>>;
    handleCategoryClick: (catId: string) => void;
    handleSubcategoryClick: (catId: string, subId: string) => void;
    shortlist: string[];
    handleToggleShortlist: (id: string, name: string) => void;
    cart: { id: string; name: string; price: number; image: string; type?: 'events' | 'boutique'; quantity: number }[];
    handleAddToCart: (item: { id: string; name: string; price: number; image: string }, type?: 'events' | 'boutique') => void;
    handleDecrementCart: (id: string) => void;
    setSelectedProductDetail: Dispatch<SetStateAction<any>>;
    showToast: (msg: string) => void;
    products?: Product[];
    isLoadingProducts?: boolean;
    refetchProducts?: () => void;
    productsError?: string | null;
    handleOpenDownloadCatalogue?: (catId?: string) => void;
  }>();

  // Active filter transition state for immediate visual feedback
  const [isFiltering, setIsFiltering] = useState(false);

  // Trigger smooth feedback whenever filter criteria change
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSubcategory, selectedStyleFilter, searchQuery]);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Batch rendering pagination state for high-performance catalog rendering
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Reset pagination batch count when any filter or search query changes
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, selectedSubcategory, selectedStyleFilter, searchQuery]);

  // Filtered Products from API
  const displayedItems = useMemo(() => {
    return products.filter((item: Product) => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;

      // Subcategory filter
      const matchesSubcategory = selectedSubcategory === 'all' ||
        item.subcategoryId === selectedSubcategory ||
        (selectedSubcategory === 'chairs' && (item.subcategoryId === 'designer-chairs' || item.subcategoryId === 'plastic-chairs'));

      // Style filter
      const matchesStyle = selectedStyleFilter === 'All' || item.style === selectedStyleFilter;

      // Search query filter
      const query = searchQuery.toLowerCase().trim();
      const feats = Array.isArray(item.features) ? item.features : [];
      const matchesSearch = !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.categoryId && item.categoryId.toLowerCase().includes(query)) ||
        (item.subcategoryId && item.subcategoryId.toLowerCase().includes(query)) ||
        feats.some((f: any) => typeof f === 'string' && f.toLowerCase().includes(query));

      return matchesCategory && matchesSubcategory && matchesStyle && matchesSearch;
    });
  }, [products, selectedCategory, selectedSubcategory, selectedStyleFilter, searchQuery]);

  // Paginated visible items batch for 60fps fast DOM performance
  const visibleItems = useMemo(() => {
    return displayedItems.slice(0, visibleCount);
  }, [displayedItems, visibleCount]);

  // Active category object for subcategory chips in Catalog
  const activeCategoryObj = useMemo(() => {
    return getCategoryById(selectedCategory);
  }, [selectedCategory]);

  // Reset all catalog filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedStyleFilter('All');
    setSearchQuery('');
    showToast("Filters reset. Showing all products.");
  };

  return (
    <>
      {/* ==========================================
          DYNAMIC LUXURY HERO CAROUSEL MODULE
         ========================================== */}
      <HomeCarousel />


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
              <h3>Direct Logistics &amp; Setup</h3>
              <p>On-site staging, electrical rigging &amp; insured delivery.</p>
            </div>
          </div>
          <div className="prop-item">
            <div className="prop-icon">
              <SlidersHorizontal className="icon" />
            </div>
            <div className="prop-content">
              <h3>Bespoke In-House Manufacturing</h3>
              <p>Custom tents, counters, furniture &amp; props made to order.</p>
            </div>
          </div>
          <div className="prop-item">
            <div className="prop-icon">
              <ShieldCheck className="icon" />
            </div>
            <div className="prop-content">
              <h3>Commercial Grade Certified</h3>
              <p>Food-grade catering, ISI gas pipes &amp; weather-proof structures.</p>
            </div>
          </div>
          <div className="prop-item">
            <div className="prop-icon">
              <User className="icon" />
            </div>
            <div className="prop-content">
              <h3>Dedicated Event Decorator</h3>
              <p>Assigned coordinator for 3D layout simulation &amp; execution.</p>
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
              <span className="section-label">Live Inventory &amp; Staging Catalog</span>
              <h2>
                {selectedCategory === 'all' ? 'All Wedding & Event Infrastructure' : `${activeCategoryObj?.title || 'Collection'} Catalog`}
              </h2>
              <p>
                Browse commercial pricing, technical specifications, and real site installations. Direct booking with transparent logistics.
              </p>
            </div>

            {/* Style Filters & Download Action */}
            <div className="filters" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {handleOpenDownloadCatalogue && (
                <button
                  type="button"
                  onClick={() => handleOpenDownloadCatalogue(selectedCategory)}
                  className="download-catalogue-btn"
                  title={`Download ${selectedCategory === 'all' ? 'Master' : activeCategoryObj?.shortTitle || 'Category'} PDF Specification Catalogue`}
                >
                  <Download className="icon" />
                  <span>Download {selectedCategory === 'all' ? 'Master' : activeCategoryObj?.shortTitle || 'Category'} Catalogue (PDF)</span>
                  <span className="pdf-tag">Specs Only</span>
                </button>
              )}
              {['All', 'Royal', 'Traditional', 'Modern', 'Industrial', 'Bespoke'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedStyleFilter(filter)}
                  className={`filter-btn ${selectedStyleFilter === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
              {(isFiltering || isLoadingProducts) && (
                <CommonLoader variant="inline" message="Updating..." theme="light" />
              )}
            </div>
          </div>

          {/* Category Filter Tabs Bar in Catalog */}
          <div className="catalog-category-bar">
            <div className="category-tabs-scroll">
              
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                }}
                className={`catalog-cat-tab ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                ✨ All Categories
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubcategory('all');
                    }}
                    className={`catalog-cat-tab ${isSelected ? 'active' : ''}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory Filter Chips (Shown when a category is selected) */}
          {activeCategoryObj && (
            <div className="catalog-subcategory-chips-bar">
              <span className="sub-filter-label">Subsections:</span>
              <div className="chips-list">
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className={`sub-chip ${selectedSubcategory === 'all' ? 'active' : ''}`}
                >
                  All {activeCategoryObj.shortTitle}
                </button>

                {activeCategoryObj.subsections.map((sub) => {
                  const isSubActive = selectedSubcategory === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`sub-chip ${isSubActive ? 'active' : ''}`}
                    >
                      {sub.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Filter Breadcrumbs Indicator */}
          {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || selectedStyleFilter !== 'All' || searchQuery) && (
            <div className="active-filters-breadcrumb">
              <div className="breadcrumb-info">
                <Filter className="icon" />
                <span className="text">Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="filter-tag">
                    Category: <strong>{activeCategoryObj?.title}</strong>
                  </span>
                )}
                {selectedSubcategory !== 'all' && (
                  <span className="filter-tag">
                    Subsection: <strong>{activeCategoryObj?.subsections.find(s => s.id === selectedSubcategory)?.title}</strong>
                  </span>
                )}
                {selectedStyleFilter !== 'All' && (
                  <span className="filter-tag">
                    Style: <strong>{selectedStyleFilter}</strong>
                  </span>
                )}
                {searchQuery && (
                  <span className="filter-tag">
                    Search: <strong>&ldquo;{searchQuery}&rdquo;</strong>
                  </span>
                )}
                <span className="results-count">({displayedItems.length} items found)</span>
                {(isFiltering || isLoadingProducts) && (
                  <CommonLoader variant="inline" message="Filtering collection..." theme="light" />
                )}
              </div>
              <button 
                type="button" 
                onClick={handleClearFilters}
                className="clear-all-filters-btn"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Catalog Grid Area with CommonLoader & CommonError */}
          <div style={{ position: 'relative', minHeight: '300px', width: '100%' }}>
            {/* Semi-transparent Overlay Loader during filter transitions */}
            {isFiltering && displayedItems.length > 0 && (
              <CommonLoader variant="overlay" message="Updating collection..." theme="light" />
            )}

            {isLoadingProducts && products.length === 0 ? (
              <CommonLoader variant="card" message="Loading live event infrastructure catalog..." theme="light" />
            ) : productsError ? (
              <CommonError
                variant="card"
                title="Catalog Currently Unavailable"
                message={productsError}
                onRetry={refetchProducts}
                theme="light"
              />
            ) : displayedItems.length > 0 ? (
              <>
                <div className="products-grid">
                  {visibleItems.map((item: any) => {
                    const isFavorite = shortlist.includes(item.id);
                    const cartItem = cart.find((i) => i.id === item.id);
                    return (
                      <ProductCard
                        key={item.id}
                        item={item}
                        isFavorite={isFavorite}
                        cartQuantity={cartItem?.quantity || 0}
                        onToggleShortlist={handleToggleShortlist}
                        onSelectProductDetail={setSelectedProductDetail}
                        onAddToCart={handleAddToCart}
                        onDecrementCart={handleDecrementCart}
                      />
                    );
                  })}
                </div>

                {/* Incremental Load More Progress Control */}
                {displayedItems.length > visibleCount && (
                  <div className="catalog-load-more-box" style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>
                      Showing <strong style={{ color: '#1a4d4d' }}>{visibleItems.length}</strong> of <strong style={{ color: '#1a4d4d' }}>{displayedItems.length}</strong> Products
                    </div>
                    <div style={{ width: '240px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${Math.min(100, (visibleItems.length / displayedItems.length) * 100)}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #1a4d4d, #d4af37)',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => prev + 24)}
                      style={{
                        padding: '14px 38px',
                        borderRadius: '30px',
                        backgroundColor: '#1a4d4d',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(26, 77, 77, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <span>✨ Load More Products ({displayedItems.length - visibleItems.length} Remaining)</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                <Sparkles className="icon" />
                <h3>No matching products found</h3>
                <p>Try resetting filters or searching with different keywords.</p>
                <button 
                  onClick={handleClearFilters}
                  className="reset-btn"
                >
                  Reset All Filters
                </button>
              </div>
            )}
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
            <h2>Frequently Answered Questions</h2>
          </div>

          <div className="faq-items">
            {[
              {
                q: 'What categories of event infrastructure do you manufacture and supply?',
                a: 'We provide end-to-end event infrastructure across 6 core verticals: Wedding Mandaps & Staging, Banquet Furniture & Seating, Commercial Catering Equipment & Gas Piping, Thematic Floral Decor & Lighting, Event Essentials (Industrial Coolers, Fans, VIP Carpets), and Turnkey In-House Custom Manufacturing.'
              },
              {
                q: 'Can we rent or purchase custom sizes for German Hangar tents and aluminum structures?',
                a: 'Yes! We manufacture custom-span aluminum tents from 30ft to 120ft widths with zero internal center poles. They are fire-retardant, all-weather proof, and available for both multi-day event rental and direct commercial purchase.'
              },
              {
                q: 'Are the commercial gas pipes, bhattis, and catering equipment safety certified?',
                a: 'All our industrial gas pipes are heavy-duty stainless steel braided and rated for 300+ PSI with certified quick-release regulators. Our bhattis and food warmers conform to strict commercial hospitality standards.'
              },
              {
                q: 'How does on-site delivery, anchoring, and dismantling work for large weddings?',
                a: 'Our logistics team delivers in dedicated cushioned transport vehicles. Master scaffolders, carpenters, and electrical technicians complete full on-site anchoring 12-24 hours prior to the event, with on-standby technicians available during the ceremony.'
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
