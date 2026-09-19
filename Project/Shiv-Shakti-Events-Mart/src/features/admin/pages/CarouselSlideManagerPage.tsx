import React, { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { carouselApi } from '../../carousel/services/carouselApi';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import type {
  CarouselSlide,
  SlideTitleSize,
  SlideAlignment,
} from '../../../shared/types/models.types';

const PRESET_IMAGES = [
  {
    label: 'Royal Mughal Mandap',
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=85',
  },
  {
    label: 'German Hangar Superstructure',
    url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1920&q=85',
  },
  {
    label: 'Teakwood Banqueting Suite',
    url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1920&q=85',
  },
  {
    label: 'Luxury Ambient Night Staging',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=85',
  },
  {
    label: 'Grand Ballroom Illumination',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1920&q=85',
  },
];

export const CarouselSlideManagerPage: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<CarouselSlide> | null>(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<CarouselSlide | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const loadSlides = async () => {
    setLoading(true);
    try {
      const list = await carouselApi.getAdminSlides();
      setSlides(list);
    } catch (err: any) {
      console.error('Failed to load slides:', err);
      showFeedback('Failed to load carousel slides.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleOpenCreate = () => {
    setEditingSlide({
      title: '',
      subtitle: '',
      badge: "India's Premier Wedding Infrastructure",
      image: PRESET_IMAGES[0].url,
      ctaText: 'Explore What We Offer',
      ctaLink: '#categories-showcase',
      secondaryCtaText: 'Browse Full Catalog',
      secondaryCtaLink: '/',
      titleSize: 'large',
      alignment: 'left',
      overlayOpacity: 0.5,
      sortOrder: slides.length,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (slide: CarouselSlide) => {
    setEditingSlide({ ...slide });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingSlide?.title?.trim()) {
      alert('Slide title is required.');
      return;
    }
    if (!editingSlide?.image?.trim()) {
      alert('Slide background image URL is required.');
      return;
    }

    try {
      if (editingSlide.id) {
        await carouselApi.updateSlide(editingSlide.id, editingSlide);
        showFeedback('Carousel slide updated successfully.');
      } else {
        await carouselApi.createSlide(editingSlide);
        showFeedback('New carousel slide created successfully.');
      }
      setModalOpen(false);
      setEditingSlide(null);
      loadSlides();
    } catch (err: any) {
      console.error('Failed to save slide:', err);
      alert(err.message || 'Failed to save slide.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await carouselApi.deleteSlide(deleteTarget.id);
      showFeedback('Slide deleted successfully.');
      setDeleteTarget(null);
      loadSlides();
    } catch (err: any) {
      console.error('Failed to delete slide:', err);
      alert(err.message || 'Failed to delete slide.');
    }
  };

  const handleToggleActive = async (slide: CarouselSlide) => {
    try {
      const updated = await carouselApi.toggleSlideActive(slide.id);
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, isActive: updated.isActive } : s))
      );
      showFeedback(
        `Slide "${slide.title.slice(0, 25)}..." ${updated.isActive ? 'activated' : 'deactivated'}.`
      );
    } catch (err: any) {
      console.error('Failed to toggle active:', err);
      alert('Failed to toggle slide status.');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index - 1];
    newSlides[index - 1] = temp;

    // Reassign sort orders
    const items = newSlides.map((s, idx) => ({ id: s.id, sortOrder: idx }));
    setSlides(newSlides);
    try {
      await carouselApi.reorderSlides(items);
      showFeedback('Slides reordered.');
    } catch (err) {
      loadSlides();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + 1];
    newSlides[index + 1] = temp;

    // Reassign sort orders
    const items = newSlides.map((s, idx) => ({ id: s.id, sortOrder: idx }));
    setSlides(newSlides);
    try {
      await carouselApi.reorderSlides(items);
      showFeedback('Slides reordered.');
    } catch (err) {
      loadSlides();
    }
  };

  const activeCount = slides.filter((s) => s.isActive).length;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '10px',
            background: feedbackMsg.type === 'success' ? '#065f46' : '#991b1b',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={18} />
          {feedbackMsg.text}
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#f8fafc',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Homepage Carousel Cockpit
            </h1>
            <span
              style={{
                background: 'rgba(99, 102, 241, 0.18)',
                color: '#a5b4fc',
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: '100px',
                fontWeight: 700,
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              Dynamic CMS
            </span>
          </div>
          <p
            style={{
              fontSize: '0.88rem',
              color: '#94a3b8',
              marginTop: '6px',
              maxWidth: '750px',
              lineHeight: 1.5,
            }}
          >
            Manage unbounded slides displayed at the top of your homepage. Configure individual text
            scale, alignment, badge accents, background imagery, and direct CTA actions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '9px',
              background: '#1e293b',
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: 600,
              border: '1px solid #334155',
            }}
          >
            <ExternalLink size={15} />
            View Storefront
          </a>

          <button
            type="button"
            onClick={handleOpenCreate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#0f172a',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
            }}
          >
            <Plus size={18} />
            Add New Slide
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Configured Slides
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {slides.length}
          </div>
        </div>

        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>
            Active on Homepage
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {activeCount}
          </div>
        </div>

        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase' }}>
            Slide Typography Customization
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0', marginTop: '8px' }}>
            Compact &bull; Regular &bull; Large &bull; Display Hero
          </div>
        </div>
      </div>

      {/* Slides List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading carousel slides...
        </div>
      ) : slides.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#0d1526',
            border: '1px dashed #334155',
            borderRadius: '14px',
          }}
        >
          <Layers size={42} style={{ color: '#64748b', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#f1f5f9', margin: '0 0 6px 0' }}>No Carousel Slides Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 20px 0' }}>
            Click below to create your first dynamic slide.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            style={{
              padding: '9px 20px',
              borderRadius: '8px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Create Slide
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              style={{
                background: '#0d1526',
                border: `1px solid ${slide.isActive ? '#1e293b' : '#1e293b88'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'stretch',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                transition: 'all 0.2s ease',
                opacity: slide.isActive ? 1 : 0.65,
              }}
            >
              {/* Left Image & Overlay Preview */}
              <div
                style={{
                  width: '320px',
                  minHeight: '190px',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#020617',
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {/* Opacity Mask Preview */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: `rgba(6, 12, 20, ${slide.overlayOpacity ?? 0.5})`,
                  }}
                />

                {/* Sequence Order Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#f59e0b',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  Slide #{index + 1}
                </div>

                {/* Typography Tag on Thumbnail */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#38bdf8',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  Size: {slide.titleSize || 'large'}
                </div>
              </div>

              {/* Center Content Info */}
              <div
                style={{
                  padding: '20px 24px',
                  flex: 1,
                  minWidth: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginBottom: '8px',
                    }}
                  >
                    {slide.badge && (
                      <span
                        style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '100px',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Sparkles size={11} /> {slide.badge}
                      </span>
                    )}

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '5px',
                        background: '#1e293b',
                        color: '#94a3b8',
                        textTransform: 'capitalize',
                      }}
                    >
                      Align: {slide.alignment || 'left'}
                    </span>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '5px',
                        background: '#1e293b',
                        color: '#94a3b8',
                      }}
                    >
                      Overlay: {Math.round((slide.overlayOpacity ?? 0.5) * 100)}%
                    </span>
                  </div>

                  {/* Title Preview with Typography Scale styling */}
                  <div
                    style={{
                      fontSize:
                        slide.titleSize === 'display'
                          ? '1.35rem'
                          : slide.titleSize === 'large'
                          ? '1.2rem'
                          : slide.titleSize === 'regular'
                          ? '1.08rem'
                          : '0.96rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      marginBottom: '6px',
                      fontFamily: "'Cinzel', serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {slide.title}
                  </div>

                  {slide.subtitle && (
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: '#94a3b8',
                        lineHeight: 1.5,
                        margin: '0 0 12px 0',
                        maxWidth: '650px',
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  )}

                  {/* CTA destinations info */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '0.76rem',
                      color: '#64748b',
                      flexWrap: 'wrap',
                    }}
                  >
                    {slide.ctaText && (
                      <span>
                        <strong style={{ color: '#cbd5e1' }}>Primary CTA:</strong>{' '}
                        {slide.ctaText} &rarr;{' '}
                        <code style={{ color: '#f59e0b' }}>{slide.ctaLink}</code>
                      </span>
                    )}
                    {slide.secondaryCtaText && (
                      <span>
                        <strong style={{ color: '#cbd5e1' }}>Secondary CTA:</strong>{' '}
                        {slide.secondaryCtaText} &rarr;{' '}
                        <code style={{ color: '#38bdf8' }}>{slide.secondaryCtaLink}</code>
                      </span>
                    )}
                  </div>
                </div>

                {/* Slide Status Pill */}
                <div style={{ marginTop: '14px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: slide.isActive ? '#10b981' : '#64748b',
                      background: slide.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      border: `1px solid ${slide.isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(100, 116, 139, 0.25)'}`,
                      padding: '3px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {slide.isActive ? '● Active on Homepage' : '○ Inactive / Draft'}
                  </span>
                </div>
              </div>

              {/* Right Action Tools Strip */}
              <div
                style={{
                  padding: '16px',
                  borderLeft: '1px solid #1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#0a0f1d',
                  minWidth: '150px',
                }}
              >
                {/* Reorder Up/Down */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move slide up"
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: index === 0 ? '#475569' : '#cbd5e1',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === slides.length - 1}
                    title="Move slide down"
                    style={{
                      flex: 1,
                      padding: '6px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: index === slides.length - 1 ? '#475569' : '#cbd5e1',
                      cursor: index === slides.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Toggle Active Button */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(slide)}
                  style={{
                    padding: '7px 10px',
                    background: slide.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    border: `1px solid ${slide.isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.3)'}`,
                    borderRadius: '7px',
                    color: slide.isActive ? '#10b981' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {slide.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                  {slide.isActive ? 'Active' : 'Hidden'}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(slide)}
                  style={{
                    padding: '7px 10px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '7px',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Pencil size={13} /> Edit
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(slide)}
                  style={{
                    padding: '7px 10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '7px',
                    color: '#f87171',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide Edit / Create Modal */}
      {modalOpen && editingSlide && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingSlide.id ? `Edit Carousel Slide: #${editingSlide.sortOrder ?? ''}` : 'Create New Carousel Slide'}
          footer={
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '9px 18px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: '9px 24px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                }}
              >
                {editingSlide.id ? 'Update Slide' : 'Create Slide'}
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
            {/* Live Interactive Preview Box inside Modal */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                height: '180px',
                backgroundColor: '#050911',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                padding: '24px',
              }}
            >
              <img
                src={editingSlide.image || PRESET_IMAGES[0].url}
                alt="Preview"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(6, 12, 20, ${editingSlide.overlayOpacity ?? 0.5})`,
                }}
              />

              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  width: '100%',
                  textAlign:
                    editingSlide.alignment === 'center'
                      ? 'center'
                      : editingSlide.alignment === 'right'
                      ? 'right'
                      : 'left',
                }}
              >
                {editingSlide.badge && (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#fbbf24',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '100px',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      display: 'inline-block',
                      marginBottom: '6px',
                    }}
                  >
                    {editingSlide.badge}
                  </span>
                )}

                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1.2,
                    fontSize:
                      editingSlide.titleSize === 'display'
                        ? '1.45rem'
                        : editingSlide.titleSize === 'large'
                        ? '1.25rem'
                        : editingSlide.titleSize === 'regular'
                        ? '1.08rem'
                        : '0.94rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  }}
                >
                  {editingSlide.title || 'Slide Headline Preview'}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
                  {editingSlide.subtitle || 'Slide descriptive subtitle will appear here.'}
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 3,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#f59e0b',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                LIVE PREVIEW
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Slide Title / Headline *
              </label>
              <input
                type="text"
                value={editingSlide.title || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                placeholder="e.g. Complete Infrastructure For Royal Weddings & Grand Celebrations"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0f1d',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Typography Scale Control (USER REQUIREMENT) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Type size={16} style={{ color: '#f59e0b' }} />
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f8fafc' }}>
                  Slide Headline Typography Size *
                </label>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  (Adjusted specifically for this slide)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
                {(
                  [
                    { key: 'compact', label: 'Compact', scale: '32px Scale', desc: 'Long / detailed headings' },
                    { key: 'regular', label: 'Regular', scale: '44px Scale', desc: 'Balanced editorial' },
                    { key: 'large', label: 'Large', scale: '56px Scale', desc: 'Standard high-impact' },
                    { key: 'display', label: 'Display Hero', scale: '72px Scale', desc: 'Bold royal luxury' },
                  ] as const
                ).map((opt) => {
                  const isSelected = (editingSlide.titleSize || 'large') === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, titleSize: opt.key as SlideTitleSize })}
                      style={{
                        padding: '12px 10px',
                        background: isSelected ? 'rgba(245, 158, 11, 0.15)' : '#0a0f1d',
                        border: `1px solid ${isSelected ? '#f59e0b' : '#334155'}`,
                        borderRadius: '9px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#fbbf24' : '#f1f5f9' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isSelected ? '#fcd34d' : '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
                        {opt.scale}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alignment Control */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                Content Alignment
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(
                  [
                    { key: 'left', label: 'Left Aligned', icon: AlignLeft },
                    { key: 'center', label: 'Centered', icon: AlignCenter },
                    { key: 'right', label: 'Right Aligned', icon: AlignRight },
                  ] as const
                ).map((item) => {
                  const isSelected = (editingSlide.alignment || 'left') === item.key;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, alignment: item.key as SlideAlignment })}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : '#0a0f1d',
                        border: `1px solid ${isSelected ? '#818cf8' : '#334155'}`,
                        borderRadius: '8px',
                        color: isSelected ? '#a5b4fc' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <Icon size={15} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Slide Subtitle / Paragraph Description
              </label>
              <textarea
                value={editingSlide.subtitle || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                rows={2}
                placeholder="Direct source for designer Mandaps, German Hangar Tents, and Turnkey Fabrication..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0f1d',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.86rem',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Badge Accent */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Top Badge Accent Pill (Optional)
              </label>
              <input
                type="text"
                value={editingSlide.badge || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                placeholder="e.g. India's Premier Wedding Infrastructure"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0f1d',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                }}
              />
            </div>

            {/* Background Image URL & Presets */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                  Background Image URL *
                </label>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>High Resolution recommended (1920x1080)</span>
              </div>
              <input
                type="text"
                value={editingSlide.image || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0f1d',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                }}
              />

              {/* Quick Preset Selector */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Quick curated event presets:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, image: preset.url })}
                      style={{
                        padding: '4px 8px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '5px',
                        color: '#94a3b8',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dark Overlay Opacity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                  Dark Contrast Overlay Opacity
                </label>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>
                  {Math.round((editingSlide.overlayOpacity ?? 0.5) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={editingSlide.overlayOpacity ?? 0.5}
                onChange={(e) => setEditingSlide({ ...editingSlide, overlayOpacity: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>

            {/* CTAs Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={editingSlide.ctaText || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                  placeholder="e.g. Explore What We Offer"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0a0f1d',
                    border: '1px solid #334155',
                    borderRadius: '7px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                  }}
                />
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', marginBottom: '2px' }}>
                  Primary CTA Link / URL
                </label>
                <input
                  type="text"
                  value={editingSlide.ctaLink || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                  placeholder="e.g. #categories-showcase or /checkout"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0a0f1d',
                    border: '1px solid #334155',
                    borderRadius: '7px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  value={editingSlide.secondaryCtaText || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })}
                  placeholder="e.g. Browse Full Catalog"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0a0f1d',
                    border: '1px solid #334155',
                    borderRadius: '7px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                  }}
                />
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', marginBottom: '2px' }}>
                  Secondary CTA Link / URL
                </label>
                <input
                  type="text"
                  value={editingSlide.secondaryCtaLink || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaLink: e.target.value })}
                  placeholder="e.g. / or /#quote-builder"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#0a0f1d',
                    border: '1px solid #334155',
                    borderRadius: '7px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Active Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
              <input
                type="checkbox"
                id="slide-is-active"
                checked={editingSlide.isActive ?? true}
                onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <label htmlFor="slide-is-active" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9', cursor: 'pointer' }}>
                Slide is Active & Visible on Homepage
              </label>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          title="Delete Carousel Slide"
          message={`Are you sure you want to permanently delete the slide "${deleteTarget.title}"? This action cannot be undone.`}
          confirmText="Delete Slide"
          isDestructive={true}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};
export default CarouselSlideManagerPage;
