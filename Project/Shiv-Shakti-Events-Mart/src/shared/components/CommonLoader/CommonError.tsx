import React from 'react';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export interface CommonErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'banner' | 'table' | 'card';
  theme?: 'dark' | 'light' | 'auto';
  colSpan?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CommonError: React.FC<CommonErrorProps> = ({
  title = 'API Request Failed',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
  variant = 'card',
  theme = 'dark',
  colSpan = 9,
  className = '',
  style = {},
}) => {
  const isDark = theme === 'dark';

  // 1. TABLE ROW VARIANT
  if (variant === 'table') {
    return (
      <tr className={`common-error-table-row ${className}`}>
        <td
          colSpan={colSpan}
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.8)',
            ...style,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '480px',
              margin: '0 auto',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f87171',
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: isDark ? '#fca5a5' : '#b91c1c' }}>
              {title}
            </div>

            <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.4 }}>
              {message}
            </div>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                style={{
                  marginTop: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#ef4444',
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.4)' : '#dc2626'}`,
                  color: isDark ? '#fecaca' : '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // 2. BANNER VARIANT (compact bar for top of lists or modals)
  if (variant === 'banner') {
    return (
      <div
        className={`common-error-banner ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 18px',
          borderRadius: '10px',
          background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
          border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5'}`,
          color: isDark ? '#fca5a5' : '#991b1b',
          fontSize: '0.85rem',
          marginBottom: '16px',
          animation: 'fadeIn 0.2s ease',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          <div>
            {title && <strong style={{ marginRight: '6px' }}>{title}:</strong>}
            <span>{message}</span>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              background: isDark ? 'rgba(239, 68, 68, 0.25)' : '#fee2e2',
              border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.5)' : '#f87171'}`,
              color: isDark ? '#fff' : '#7f1d1d',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  // 3. CARD VARIANT (for grids or card views)
  return (
    <div
      className={`common-error-card ${className}`}
      style={{
        gridColumn: '1 / -1',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        background: isDark ? 'rgba(239, 68, 68, 0.06)' : '#fff5f5',
        border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.2)' : '#fed7d7'}`,
        borderRadius: '16px',
        textAlign: 'center',
        gap: '14px',
        ...style,
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
        }}
      >
        <AlertTriangle size={28} />
      </div>

      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isDark ? '#fca5a5' : '#991b1b' }}>
        {title}
      </div>

      <p style={{ maxWidth: '440px', fontSize: '0.86rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, margin: 0 }}>
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '24px',
            background: isDark ? 'rgba(239, 68, 68, 0.25)' : '#dc2626',
            border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.45)' : '#b91c1c'}`,
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
          }}
        >
          <RefreshCw size={15} />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};

export default CommonError;
