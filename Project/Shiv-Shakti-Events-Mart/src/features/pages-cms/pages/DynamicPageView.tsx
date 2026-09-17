import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { pageApi } from '../services/pageApi';
import type { Page } from '../../../shared/types/models.types';

// Markdown parser helper for dynamic CMS content
const parseInline = (text: string) => {
  return text
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:10px;margin:16px 0;box-shadow:0 6px 18px rgba(0,0,0,0.5);" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#818cf8;text-decoration:underline;">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f8fafc;font-weight:700;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#e2e8f0;">$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#1e293b;color:#a5b4fc;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.88em;">$1</code>');
};

const formatMarkdown = (md: string) => {
  if (!md) return '';
  const lines = md.split('\n');
  const rendered: string[] = [];
  let inList = false;

  lines.forEach((line) => {
    const l = line;

    if (l.startsWith('#### ')) {
      if (inList) { inList = false; rendered.push('</ul>'); }
      rendered.push(`<h4 style="color:#f8fafc;font-size:1.1rem;margin:20px 0 8px;font-weight:700;">${parseInline(l.slice(5))}</h4>`);
      return;
    }
    if (l.startsWith('### ')) {
      if (inList) { inList = false; rendered.push('</ul>'); }
      rendered.push(`<h3 style="color:#f8fafc;font-size:1.25rem;margin:24px 0 10px;font-weight:700;letter-spacing:-0.01em;">${parseInline(l.slice(4))}</h3>`);
      return;
    }
    if (l.startsWith('## ')) {
      if (inList) { inList = false; rendered.push('</ul>'); }
      rendered.push(`<h2 style="color:#f8fafc;font-size:1.5rem;margin:28px 0 12px;font-weight:800;border-bottom:1px solid #1e293b;padding-bottom:8px;letter-spacing:-0.02em;">${parseInline(l.slice(3))}</h2>`);
      return;
    }
    if (l.startsWith('# ')) {
      if (inList) { inList = false; rendered.push('</ul>'); }
      rendered.push(`<h1 style="color:#f8fafc;font-size:1.85rem;margin:32px 0 16px;font-weight:900;letter-spacing:-0.02em;">${parseInline(l.slice(2))}</h1>`);
      return;
    }

    if (l.trim() === '---' || l.trim() === '***') {
      if (inList) { inList = false; rendered.push('</ul>'); }
      rendered.push('<hr style="border:none;border-top:1px solid #1e293b;margin:28px 0;" />');
      return;
    }

    if (l.startsWith('> ')) {
      if (inList) { inList = false; rendered.push('</ul>'); }
      rendered.push(`<blockquote style="border-left:4px solid #6366f1;padding:12px 18px;background:rgba(99, 102, 241, 0.06);border-radius:0 8px 8px 0;color:#cbd5e1;font-style:italic;margin:16px 0;">${parseInline(l.slice(2))}</blockquote>`);
      return;
    }

    if (l.startsWith('- ') || l.startsWith('* ')) {
      if (!inList) {
        inList = true;
        rendered.push('<ul style="margin:12px 0;padding-left:24px;color:#cbd5e1;line-height:1.8;">');
      }
      rendered.push(`<li style="margin-bottom:6px;">${parseInline(l.slice(2))}</li>`);
      return;
    } else if (inList) {
      inList = false;
      rendered.push('</ul>');
    }

    if (!l.trim()) {
      rendered.push('<div style="height:12px;"></div>');
      return;
    }

    rendered.push(`<p style="color:#cbd5e1;line-height:1.8;margin:10px 0;font-size:1rem;">${parseInline(l)}</p>`);
  });

  if (inList) rendered.push('</ul>');
  return rendered.join('\n');
};

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
          if (data.seoTitle) {
            document.title = data.seoTitle;
          }
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const formattedHtml = useMemo(() => {
    return page?.content ? formatMarkdown(page.content) : '';
  }, [page?.content]);

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

      {/* Main Narrative Body with Formatted Markdown */}
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
          }}
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
        />
      </div>
    </div>
  );
};

export default DynamicPageView;
