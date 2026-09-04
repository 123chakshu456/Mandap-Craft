import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
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
}: CategoryMegaMenuProps) {
  const activeCategoryData = categories.find((c) => c.id === hoveredCategory);

  return (
    <nav className="category-navbar">
      <div className="category-navbar-container">
        <ul className="category-nav-list" onMouseLeave={onCategoryMouseLeave}>
          {/* All Categories Link */}
          <li className="category-nav-item">
            <button
              type="button"
              onClick={() => onCategoryClick('all')}
              className={`category-nav-link ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              <span className="cat-icon">✨</span>
              <span className="cat-label">All Collections</span>
            </button>
          </li>

          {/* Primary Category Tabs */}
          {categories.map((category) => {
            const isHovered = hoveredCategory === category.id;
            const isSelected = selectedCategory === category.id;

            return (
              <li
                key={category.id}
                className="category-nav-item"
                onMouseEnter={() => onCategoryMouseEnter(category.id)}
              >
                <button
                  type="button"
                  onClick={() => onCategoryClick(category.id)}
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

      {/* MEGA-MENU FLYOUT PANEL (Multi-Tier Cascading Hover) */}
      {hoveredCategory && activeCategoryData && (() => {
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
                    <button
                      type="button"
                      onClick={() => onSubcategoryClick(activeCategoryData.id, activeSubcategory.id)}
                      className="content-view-all-btn"
                    >
                      View All {activeSubcategory.title}
                      <ArrowRight className="icon" />
                    </button>
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
