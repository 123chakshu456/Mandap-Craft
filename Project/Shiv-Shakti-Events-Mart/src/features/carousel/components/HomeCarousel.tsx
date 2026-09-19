import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { carouselApi } from '../services/carouselApi';
import type { CarouselSlide, SlideTitleSize, SlideAlignment } from '../../../shared/types/models.types';
import './HomeCarousel.scss';

const FALLBACK_SLIDES: CarouselSlide[] = [
  {
    id: 'default-1',
    title: 'Complete Infrastructure For Royal Weddings & Grand Celebrations',
    subtitle: 'Direct source for bespoke Mandaps, German Hangar Tents, Luxury Banqueting, and Turnkey Custom Fabrication.',
    badge: "India's Premier Wedding Infrastructure",
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=85',
    ctaText: 'Explore What We Offer',
    ctaLink: '#categories-showcase',
    secondaryCtaText: 'Browse Full Catalog',
    secondaryCtaLink: '/',
    titleSize: 'display',
    alignment: 'left',
    overlayOpacity: 0.55,
    sortOrder: 0,
    isActive: true,
  },
  {
    id: 'default-2',
    title: 'Architectural German Hangars & All-Weather Superstructures',
    subtitle: 'Spanning up to 50m clear span with climate control, industrial rigging, and fire-retardant fabrication.',
    badge: 'Industrial Scale & Engineering',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1920&q=85',
    ctaText: 'View German Hangars',
    ctaLink: '/',
    secondaryCtaText: 'Instant Quote',
    secondaryCtaLink: '#quote-builder',
    titleSize: 'large',
    alignment: 'center',
    overlayOpacity: 0.5,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'default-3',
    title: 'Handcrafted Carved Teakwood & Royal Banquet Furniture',
    subtitle: 'Majestic Maharaja Thrones, Chiavari Suites with artisanal brass inlay, and premium velvet upholstery.',
    badge: 'Artisanal Luxury Collection',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1920&q=85',
    ctaText: 'Browse Furniture Range',
    ctaLink: '/',
    secondaryCtaText: 'Custom Fabrication',
    secondaryCtaLink: '#quote-builder',
    titleSize: 'large',
    alignment: 'right',
    overlayOpacity: 0.5,
    sortOrder: 2,
    isActive: true,
  },
];

interface HomeCarouselProps {
  initialSlides?: CarouselSlide[];
}

export const HomeCarousel: React.FC<HomeCarouselProps> = ({ initialSlides }) => {
  const [slides, setSlides] = useState<CarouselSlide[]>(initialSlides || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Fetch active slides from API on mount
  useEffect(() => {
    let mounted = true;
    const fetchSlides = async () => {
      try {
        const data = await carouselApi.getPublicSlides();
        if (mounted && data && data.length > 0) {
          setSlides(data);
        } else if (mounted && slides.length === 0) {
          setSlides(FALLBACK_SLIDES);
        }
      } catch (err) {
        console.warn('Could not fetch carousel slides from backend, using default luxury slides:', err);
        if (mounted && slides.length === 0) {
          setSlides(FALLBACK_SLIDES);
        }
      }
    };
    fetchSlides();
    return () => {
      mounted = false;
    };
  }, []);

  const totalSlides = slides.length || 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer (advances every 6.5s if not hovered)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, link?: string | null) => {
    const targetLink = link || '/';
    if (targetLink === '/' || targetLink === '#catalog' || targetLink === '/#catalog') {
      e.preventDefault();
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      return;
    }
    if (targetLink.startsWith('#')) {
      e.preventDefault();
      const targetId = targetLink.replace(/^#/, '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      return;
    }
  };

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex] || slides[0];

  // Map per-slide titleSize to responsive font sizing
  const getTitleStyle = (size: SlideTitleSize): React.CSSProperties => {
    switch (size) {
      case 'compact':
        return {
          fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
          lineHeight: 1.25,
          fontWeight: 700,
        };
      case 'regular':
        return {
          fontSize: 'clamp(2.1rem, 4vw, 3.1rem)',
          lineHeight: 1.2,
          fontWeight: 800,
        };
      case 'display':
        return {
          fontSize: 'clamp(2.75rem, 6vw, 4.85rem)',
          lineHeight: 1.1,
          fontWeight: 900,
          letterSpacing: '-0.02em',
        };
      case 'large':
      default:
        return {
          fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
          lineHeight: 1.15,
          fontWeight: 800,
        };
    }
  };

  // Map per-slide alignment
  const getAlignmentClass = (align: SlideAlignment): string => {
    switch (align) {
      case 'center':
        return 'align-center';
      case 'right':
        return 'align-right';
      case 'left':
      default:
        return 'align-left';
    }
  };

  return (
    <div
      className="home-luxury-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Event Infrastructure Carousel"
    >
      {/* Background Slides with Ken Burns / Fade Effect */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        const opacity = slide.overlayOpacity !== undefined ? slide.overlayOpacity : 0.5;

        return (
          <div
            key={slide.id || index}
            className={`carousel-slide-layer ${isActive ? 'active' : ''}`}
            style={{
              zIndex: isActive ? 2 : 1,
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="carousel-slide-img"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                // Fallback to high-res event image if custom URL fails
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=85';
              }}
            />
            {/* Dynamic Dark Gradient Overlay */}
            <div
              className="carousel-slide-overlay"
              style={{
                backgroundColor: `rgba(6, 12, 20, ${opacity})`,
                backgroundImage:
                  'radial-gradient(ellipse at 50% 30%, rgba(13, 26, 45, 0.4) 0%, rgba(5, 9, 17, 0.85) 100%)',
              }}
            />
          </div>
        );
      })}

      {/* Decorative Grid Mesh & Luxury Ambience Accent */}
      <div className="carousel-grid-mesh" />
      <div className="carousel-glow-radial" />

      {/* Slide Content Layer */}
      <div className="carousel-content-container">
        <div className={`carousel-text-wrapper ${getAlignmentClass(currentSlide.alignment)}`}>
          {/* Badge */}
          {currentSlide.badge && (
            <div className="carousel-badge">
              <Sparkles size={14} className="badge-sparkle-icon" />
              <span>{currentSlide.badge}</span>
            </div>
          )}

          {/* Dynamic Headline (Text size customized per slide) */}
          <h1
            className={`carousel-title size-${currentSlide.titleSize || 'large'}`}
            style={getTitleStyle(currentSlide.titleSize)}
          >
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          {currentSlide.subtitle && (
            <p className="carousel-subtitle">{currentSlide.subtitle}</p>
          )}

          {/* Action CTAs */}
          {(currentSlide.ctaText || currentSlide.secondaryCtaText) && (
            <div className="carousel-actions">
              {currentSlide.ctaText && (
                <a
                  href={currentSlide.ctaLink || '/'}
                  onClick={(e) => handleCtaClick(e, currentSlide.ctaLink)}
                  className="carousel-btn primary-btn"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight size={18} className="btn-icon" />
                </a>
              )}
              {currentSlide.secondaryCtaText && (
                <a
                  href={currentSlide.secondaryCtaLink || '/'}
                  onClick={(e) => handleCtaClick(e, currentSlide.secondaryCtaLink)}
                  className="carousel-btn secondary-btn"
                >
                  <span>{currentSlide.secondaryCtaText}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Arrows (Glassmorphic) */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            className="carousel-nav-btn prev-btn"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            className="carousel-nav-btn next-btn"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators & Counter Bar at Bottom */}
      <div className="carousel-indicators-bar">
        <div className="indicators-wrapper">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`indicator-pill ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className="pill-progress" />
            </button>
          ))}
        </div>

        {/* Slide Counter (e.g. 01 / 03) */}
        <div className="carousel-counter">
          <span className="counter-current">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="counter-divider">/</span>
          <span className="counter-total">
            {String(totalSlides).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};
export default HomeCarousel;
