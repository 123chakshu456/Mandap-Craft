import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { pageApi } from '../services/pageApi';
import type { Page } from '../../../shared/types/models.types';

export const DynamicPageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    pageApi.getBySlug(slug)
      .then((data) => {
        if (!data) {
          setNotFound(true);
        } else {
          setPage(data);
          // Set browser title for SEO
          if (data.seoTitle) {
            document.title = data.seoTitle;
          }
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <div style={{ width: 28, height: 28, border: '3px solid #334155', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '10px' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
          The requested page either does not exist or has not been published yet.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Hero Header */}
      <div
        style={{
          position: 'relative',
          background: page.heroImage
            ? `linear-gradient(180deg, rgba(10, 15, 29, 0.75) 0%, rgba(7, 12, 22, 0.95) 100%), url(${page.heroImage}) center/cover no-repeat`
            : 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
          padding: '80px 24px 60px',
          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '99px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
            <Sparkles size={14} /> Official Platform Narrative
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 16px', lineHeight: 1.2 }}>
            {page.title}
          </h1>
          {page.seoDescription && (
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', margin: '0 auto', maxWidth: '700px', lineHeight: 1.6 }}>
              {page.seoDescription}
            </p>
          )}
        </div>
      </div>

      {/* Main Narrative Body */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 0' }}>
        <div
          style={{
            background: '#0d1526',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '40px',
            color: '#cbd5e1',
            lineHeight: 1.8,
            fontSize: '1rem',
            whiteSpace: 'pre-line',
          }}
        >
          {page.content}
        </div>
      </div>
    </div>
  );
};

export default DynamicPageView;
