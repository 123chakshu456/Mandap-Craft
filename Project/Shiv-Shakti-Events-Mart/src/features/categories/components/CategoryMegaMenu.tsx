import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, ArrowRight, Download, X } from 'lucide-react';
import type { CategoryData } from '../../../constants/categories';

export interface CategoryMegaMenuProps {
  categories: CategoryData[];
  selectedCategory: string;
  hoveredCategory: string | null;
  hoveredSubcategory: string | null;
  onCategoryMouseEnter: (catId: string) => void;
  onCategoryMouseLeave: () => void;
  onSubcategoryHover: (subId: string) => void;
  onCategoryClick: (catId: string) => void;
  onSubcategoryClick: (catId: string, subId: string) => void;
  onOpenDownloadCatalogue?: (catId?: string) => void;
}

export default function CategoryMegaMenu({
  categories,
  selectedCategory,
  hoveredCategory,
  hoveredSubcategory,
  onCategoryMouseEnter,
  onCategoryMouseLeave,
  onSubcategoryHover,
  onCategoryClick,
  onSubcategoryClick,
  onOpenDownloadCatalogue,
}: CategoryMegaMenuProps) {
  const navRef = useRef<HTMLElement>(null);

  // Responsive state: screen width < 1024px represents mobile/tablet view
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });

  // Track which category's subsections dropdown is open via click on mobile/tablet
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileOrTablet(isMobile);
      if (!isMobile) {
        setMobileOpenCategory(null);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile dropdown on outside click or Escape key
  useEffect(() => {
    if (!mobileOpenCategory) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpenCategory(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpenCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpenCategory]);

  const activeCategoryData = categories.find((c) => c.id === hoveredCategory);
  const activeMobileCategoryData = categories.find((c) => c.id === mobileOpenCategory);

  return (
    <nav className="category-navbar" ref={navRef}>
      <div className="category-navbar-container">
        <ul
          className="category-nav-list"
          onMouseLeave={() => {
            if (!isMobileOrTablet) {
              onCategoryMouseLeave();
            }
          }}
        >
          {/* All Categories Link */}
          <li className="category-nav-item">
            <button
              type="button"
              onClick={() => {
                if (isMobileOrTablet) {
                  setMobileOpenCategory(null);
                }
                onCategoryClick('all');
              }}
              className={`category-nav-link ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              <span className="cat-icon">✨</span>
              <span className="cat-label">All Collections</span>
            </button>
          </li>

          {/* Primary Category Tabs */}
          {categories.map((category) => {
            const isHovered = !isMobileOrTablet && hoveredCategory === category.id;
            const isSelected = selectedCategory === category.id;
            const isMobileOpen = isMobileOrTablet && mobileOpenCategory === category.id;
            const isExpanded = isMobileOrTablet ? isMobileOpen : isHovered;

            return (
              <li
                key={category.id}
                className="category-nav-item"
                onMouseEnter={() => {
                  if (!isMobileOrTablet) {
                    onCategoryMouseEnter(category.id);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isMobileOrTablet) {
                      // On mobile/tablet, toggle subsections dropdown on click
                      setMobileOpenCategory((prev) => (prev === category.id ? null : category.id));
                    } else {
                      onCategoryClick(category.id);
                    }
                  }}
                  className={`category-nav-link ${isSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''} ${isMobileOpen ? 'open' : ''}`}
                  aria-expanded={isExpanded}
                  aria-haspopup="true"
                >
                  <span className="cat-icon">{category.icon}</span>
                  <span className="cat-label">{category.title}</span>
                  <ChevronDown className={`cat-chevron ${isExpanded ? 'rotate' : ''}`} />
                  {category.badge && (
                    <span className="nav-pill-badge">{category.badge}</span>
                  )}
                </button>
              </li>
            );
          })}

          {/* Download Catalogue Nav Button */}
          {onOpenDownloadCatalogue && (
            <li className="category-nav-item download-nav-item">
              <button
                type="button"
                onClick={() => {
                  if (isMobileOrTablet) {
                    setMobileOpenCategory(null);
                  }
                  onOpenDownloadCatalogue('all');
                }}
                className="category-nav-link download-brochure-nav-btn"
                title="Download Category Specification Catalogue (PDF)"
              >
                <Download className="cat-icon" size={14} />
                <span className="cat-label">Download Catalogue</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* MOBILE / TABLET CLICK-ACTIVATED SUBSECTIONS DROPDOWN */}
      {isMobileOrTablet && mobileOpenCategory && activeMobileCategoryData && (
        <>
          <div
            className="mobile-subsections-dropdown-backdrop"
            onClick={() => setMobileOpenCategory(null)}
            aria-hidden="true"
          />
          <div
            className="mobile-subsections-dropdown"
            id="mobile-category-subsections-dropdown"
            role="region"
            aria-label={`${activeMobileCategoryData.title} Subsections`}
          >
            <div className="mobile-dropdown-inner">
              {/* Dropdown Header */}
              <div className="mobile-dropdown-header">
                <div className="header-category-info">
                  <span className="cat-icon-badge">{activeMobileCategoryData.icon}</span>
                  <div className="header-titles">
                    <div className="header-title-row">
                      <h3 className="category-heading">{activeMobileCategoryData.title}</h3>
                      {activeMobileCategoryData.badge && (
                        <span className="cat-pill-badge">{activeMobileCategoryData.badge}</span>
                      )}
                    </div>
                    <p className="category-tagline">{activeMobileCategoryData.tagline}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mobile-dropdown-close-btn"
                  onClick={() => setMobileOpenCategory(null)}
                  aria-label="Close subsections menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Action Row: View All & Catalogue Download */}
              <div className="mobile-dropdown-actions">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpenCategory(null);
                    onCategoryClick(activeMobileCategoryData.id);
                  }}
                  className="mobile-view-all-category-btn"
                >
                  <span>Explore All in {activeMobileCategoryData.shortTitle}</span>
                  <ArrowRight size={14} />
                </button>

                {onOpenDownloadCatalogue && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpenCategory(null);
                      onOpenDownloadCatalogue(activeMobileCategoryData.id);
                    }}
                    className="mobile-download-catalogue-btn"
                    title={`Download ${activeMobileCategoryData.title} PDF Catalogue`}
                  >
                    <Download size={14} />
                    <span>PDF Catalogue</span>
                  </button>
                )}
              </div>

              {/* Subsections Grid / List */}
              <div className="mobile-subsections-container">
                <div className="subsections-section-title">
                  <span>Browse Subsections ({activeMobileCategoryData.subsections.length})</span>
                </div>

                <div className="mobile-subsections-grid">
                  {activeMobileCategoryData.subsections.map((sub) => {
                    const isSubSelected =
                      selectedCategory === activeMobileCategoryData.id &&
                      hoveredSubcategory === sub.id;

                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setMobileOpenCategory(null);
                          onSubcategoryClick(activeMobileCategoryData.id, sub.id);
                        }}
                        className={`mobile-subsection-card ${isSubSelected ? 'active' : ''}`}
                      >
                        <div className="card-top">
                          <div className="card-text">
                            <span className="sub-title">{sub.title}</span>
                            {sub.description && (
                              <p className="sub-description">{sub.description}</p>
                            )}
                          </div>
                          <ChevronRight size={16} className="sub-chevron" />
                        </div>

                        {sub.popularItems && sub.popularItems.length > 0 && (
                          <div className="popular-items-chips">
                            {sub.popularItems.slice(0, 3).map((item, idx) => (
                              <span key={idx} className="popular-item-chip">
                                {item}
                              </span>
                            ))}
                            {sub.popularItems.length > 3 && (
                              <span className="popular-item-chip more">
                                +{sub.popularItems.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DESKTOP MEGA-MENU FLYOUT PANEL (Multi-Tier Cascading Hover) */}
      {!isMobileOrTablet && hoveredCategory && activeCategoryData && (() => {
        const activeSubcategory =
          activeCategoryData.subsections.find(
            (s) => s.id === (hoveredSubcategory || activeCategoryData.subsections[0]?.id)
          ) || activeCategoryData.subsections[0];

        return (
          <div
            className="megamenu-panel"
            onMouseEnter={() => onCategoryMouseEnter(hoveredCategory)}
            onMouseLeave={onCategoryMouseLeave}
          >
            <div className="megamenu-cascading-container">
              {/* Column 1: Subcategory Headings List */}
              <div className="megamenu-sidebar">
                <div className="sidebar-header">
                  <span className="sidebar-cat-tag">
                    {activeCategoryData.icon} {activeCategoryData.title}
                  </span>
                  <span className="sidebar-subtitle">
                    {activeCategoryData.subsections.length} Subcategories
                  </span>
                </div>
                <ul className="sidebar-nav-list">
                  {activeCategoryData.subsections.map((sub) => {
                    const isSubHovered = activeSubcategory?.id === sub.id;
                    return (
                      <li
                        key={sub.id}
                        onMouseEnter={() => onSubcategoryHover(sub.id)}
                        className={`sidebar-nav-item ${isSubHovered ? 'active' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => onSubcategoryClick(activeCategoryData.id, sub.id)}
                          className="sidebar-nav-btn"
                        >
                          <span className="sub-title">{sub.title}</span>
                          <ChevronRight className="sub-arrow" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Column 2: Active Subcategory Details & Offerings Grid */}
              {activeSubcategory && (
                <div className="megamenu-content-panel">
                  <div className="content-panel-header">
                    <div>
                      <h3>{activeSubcategory.title}</h3>
                      <p className="content-panel-desc">{activeSubcategory.description}</p>
                    </div>
                    <div className="megamenu-action-group">
                      {onOpenDownloadCatalogue && (
                        <button
                          type="button"
                          onClick={() => onOpenDownloadCatalogue(activeCategoryData.id)}
                          className="megamenu-download-btn"
                          title={`Download ${activeCategoryData.title} PDF Catalogue`}
                        >
                          <Download className="icon" />
                          <span>Download {activeCategoryData.shortTitle} Catalogue</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSubcategoryClick(activeCategoryData.id, activeSubcategory.id)}
                        className="content-view-all-btn"
                      >
                        View All {activeSubcategory.title}
                        <ArrowRight className="icon" />
                      </button>
                    </div>
                  </div>

                  <div className="items-section">
                    <span className="section-label">Popular Offerings &amp; Items</span>
                    <div className="items-grid">
                      {activeSubcategory.popularItems.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => onSubcategoryClick(activeCategoryData.id, activeSubcategory.id)}
                          className="popular-item-card"
                        >
                          <span className="item-dot">❖</span>
                          <span className="item-title">{item}</span>
                          <ArrowRight className="item-arrow" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Column 3: Spotlight Preview Card */}
              <div className="megamenu-spotlight">
                <div className="spotlight-card">
                  <div className="spotlight-image">
                    <img
                      src={activeSubcategory?.image || activeCategoryData.promo.image}
                      alt={activeSubcategory?.title || activeCategoryData.promo.title}
                    />
                    <div className="spotlight-badge">
                      {activeSubcategory ? activeSubcategory.title : activeCategoryData.promo.badge}
                    </div>
                  </div>
                  <div className="spotlight-body">
                    <h4>{activeSubcategory ? activeSubcategory.title : activeCategoryData.promo.title}</h4>
                    <p>{activeSubcategory ? activeSubcategory.description : activeCategoryData.promo.subtitle}</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeSubcategory) {
                          onSubcategoryClick(activeCategoryData.id, activeSubcategory.id);
                        } else {
                          onCategoryClick(activeCategoryData.id);
                        }
                      }}
                      className="spotlight-btn"
                    >
                      Explore {activeSubcategory ? activeSubcategory.title : activeCategoryData.title}
                      <ArrowRight className="icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </nav>
  );
}
