import { useState, useMemo, useEffect } from 'react';
import {
  X,
  Download,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import type { Product } from '../../types/models.types';
import type { CategoryData } from '../../../constants/categories';
import { triggerCataloguePdfDownload } from '../../utils/cataloguePdfGenerator';

export interface CatalogueDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  categories: CategoryData[];
  products: Product[];
  showToast: (msg: string) => void;
}

export default function CatalogueDownloadModal({
  isOpen,
  onClose,
  initialCategory = 'all',
  categories = [],
  products = [],
  showToast,
}: CatalogueDownloadModalProps) {
  // Selected category in modal
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategory || 'all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync selectedCatId when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCatId(initialCategory);
    }
  }, [initialCategory]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Active category metadata
  const activeCategory = useMemo(() => {
    if (selectedCatId === 'all') {
      return {
        id: 'all',
        title: 'Master Event Infrastructure Catalogue',
        shortTitle: 'All Categories',
        tagline: 'Complete Turnkey Wedding Staging, Banquet Furniture & Commercial Catering Equipment',
        icon: '🌟',
      };
    }
    const found = categories.find((c) => c.id === selectedCatId);
    if (found) return found;
    return {
      id: selectedCatId,
      title: `${selectedCatId.toUpperCase()} Catalogue`,
      shortTitle: selectedCatId,
      tagline: 'Technical Specifications & Commercial Equipment',
      icon: '📦',
    };
  }, [selectedCatId, categories]);

  // Filtered products for selected category
  const categoryProducts = useMemo(() => {
    if (selectedCatId === 'all') {
      return products;
    }
    return products.filter((p) => p.categoryId === selectedCatId || (p as any).category === selectedCatId);
  }, [products, selectedCatId]);

  // Download Handler
  const handleDownload = () => {
    setIsGenerating(true);
    try {
      triggerCataloguePdfDownload({
        categoryTitle: activeCategory.title,
        categoryTagline: activeCategory.tagline,
        categoryIcon: activeCategory.icon,
        products: categoryProducts,
      });
      showToast(`📄 Generating printable PDF brochure for ${activeCategory.shortTitle}! Check the print dialog.`);
    } catch {
      showToast('⚠️ Could not open print window. Please ensure popups are allowed.');
    } finally {
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  // WhatsApp Share Handler
  const handleWhatsAppShare = () => {
    const text = `*Shiv Shakti Events Mart — ${activeCategory.title}*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Format:* Product Specifications Catalogue (Commercial Specs Only, No Pricing)
📦 *Total Products:* ${categoryProducts.length} items
🔗 *Catalogue Portal:* https://shivshaktieventsmart.vercel.app/#catalog
━━━━━━━━━━━━━━━━━━━━━━━━━━
Hello Mr. Chakshu Goyal, I would like to request the official PDF catalogue and availability for the *${activeCategory.title}* collection.`;

    const url = `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('📲 Opening WhatsApp with your catalogue request details...');
  };

  if (!isOpen) return null;

  return (
    <div className="catalogue-download-backdrop" onClick={onClose}>
      <div
        className="catalogue-download-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="download-catalogue-title"
      >
        {/* HEADER */}
        <div className="download-modal-header">
          <div className="header-meta">
            <span className="pill-badge gold">Digital PDF Brochures</span>
            <h3 id="download-catalogue-title">Download Catalogue</h3>
            <p>Select any category vertical to download a clean, print-ready PDF specification brochure.</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close download modal"
          >
            <X className="icon" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="download-modal-body">

          {/* ZERO PRICING CLIENT PRESENTATION BANNER */}
          <div className="client-presentation-notice">
            <div className="notice-icon">
              <ShieldCheck className="icon" />
            </div>
            <div className="notice-content">
              <strong>100% Client-Safe Specification Brochure</strong>
              <span>
                All generated PDF catalogues contain high-resolution product photos, dimensions, SKU codes, and technical build specifications with <u>NO prices mentioned</u>. Safe to present directly to your clients, families, or committee members.
              </span>
            </div>
          </div>

          {/* STEP 1: CATEGORY SELECTION TABS */}
          <div className="category-selection-section">
            <label className="section-label">1. Choose Catalogue Vertical:</label>
            <div className="categories-grid-selection">
              {/* All / Master */}
              <button
                type="button"
                className={`cat-select-card ${selectedCatId === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCatId('all')}
              >
                <span className="card-icon">🌟</span>
                <div className="card-info">
                  <div className="card-title">All Categories (Master)</div>
                  <div className="card-count">{products.length} Products Total</div>
                </div>
                {selectedCatId === 'all' && <CheckCircle2 className="check-icon" />}
              </button>

              {/* Individual Categories */}
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.categoryId === cat.id || (p as any).category === cat.id
                ).length;
                const isSelected = selectedCatId === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-select-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedCatId(cat.id)}
                  >
                    <span className="card-icon">{cat.icon}</span>
                    <div className="card-info">
                      <div className="card-title">{cat.title}</div>
                      <div className="card-count">{count > 0 ? `${count} Products` : 'Catalogue Available'}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SUMMARY & SPECIFICATION HIGHLIGHTS */}
          <div className="selected-catalogue-summary">
            <div className="summary-left">
              <div className="summary-title-row">
                <span className="summary-icon">{activeCategory.icon}</span>
                <div>
                  <h4>{activeCategory.title}</h4>
                  <p>{activeCategory.tagline}</p>
                </div>
              </div>
              <div className="summary-stats-strip">
                <span className="stat-pill">📦 {categoryProducts.length} Items Included</span>
                <span className="stat-pill">🖨️ A4 Ready to Print</span>
                <span className="stat-pill">🏷️ SKUs &amp; Specs Included</span>
                <span className="stat-pill green">🔒 Zero Pricing Excluded</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="download-actions-grid">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating || categoryProducts.length === 0}
              className="primary-download-btn"
            >
              <Download className="icon" />
              <span>
                {isGenerating
                  ? 'Generating PDF Brochure...'
                  : `Download ${activeCategory.shortTitle} PDF Catalogue`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="whatsapp-share-btn"
            >
              <MessageCircle className="icon" />
              <span>Request on WhatsApp</span>
            </button>
          </div>

          {/* INSTRUCTIONS */}
          <div className="download-instructions-footer">
            <p>
              💡 <strong>Tip for Event Organizers:</strong> In your browser's print dialog, choose destination <strong>&ldquo;Save as PDF&rdquo;</strong> to save the document directly to your device or forward it to clients.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
