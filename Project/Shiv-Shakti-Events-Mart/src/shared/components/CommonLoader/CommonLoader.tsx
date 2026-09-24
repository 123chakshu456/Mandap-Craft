import React from 'react';
import { Loader2 } from 'lucide-react';

export interface CommonLoaderProps {
  message?: string;
  variant?: 'inline' | 'table' | 'card' | 'overlay' | 'fullscreen' | 'section';
  size?: number;
  theme?: 'dark' | 'light' | 'auto';
  colSpan?: number;
  minHeight?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const CommonLoader: React.FC<CommonLoaderProps> = ({
  message = 'Loading...',
  variant = 'section',
  size,
  theme = 'dark',
  colSpan = 9,
  minHeight,
  className = '',
  style = {},
}) => {
  const isDark = theme === 'dark';
  const primaryColor = isDark ? '#818cf8' : '#1a4d4d';
  const secondaryColor = isDark ? '#6366f1' : '#d4af37';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const bgColor = isDark ? '#080d18' : '#ffffff';

  // 1. INLINE LOADER (compact for filter toolbars, buttons, headers)
  if (variant === 'inline') {
    const iconSize = size || 14;
    return (
      <span
        className={`common-loader-inline ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: isDark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(26, 77, 77, 0.08)',
          border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(26, 77, 77, 0.18)'}`,
          color: isDark ? '#a5b4fc' : '#1a4d4d',
          fontSize: '0.78rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-in-out',
          ...style,
        }}
      >
        <Loader2
          size={iconSize}
          style={{
            animation: 'commonLoaderSpin 0.85s linear infinite',
            flexShrink: 0,
            color: isDark ? '#818cf8' : '#1a4d4d',
          }}
        />
        {message && <span>{message}</span>}
        <style>{`
          @keyframes commonLoaderSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </span>
    );
  }

  // Spinner Graphic Element
  const spinnerElement = (
    <div
      style={{
        position: 'relative',
        width: size ? `${size + 24}px` : '54px',
        height: size ? `${size + 24}px` : '54px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer Glowing Pulse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isDark ? 'rgba(99, 102, 241, 0.28)' : 'rgba(212, 175, 55, 0.22)'} 0%, transparent 70%)`,
          animation: 'commonLoaderPulse 1.8s ease-in-out infinite',
        }}
      />
      {/* Rotating Ring */}
      <div
        style={{
          position: 'absolute',
          inset: '4px',
          borderRadius: '50%',
          border: `2px solid ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(26, 77, 77, 0.15)'}`,
          borderTopColor: primaryColor,
          borderRightColor: secondaryColor,
          animation: 'commonLoaderSpin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite',
        }}
      />
      {/* Center Icon */}
      <Loader2
        size={size || 22}
        color={primaryColor}
        style={{
          animation: 'commonLoaderSpin 1.4s linear infinite reverse',
          zIndex: 2,
        }}
      />
    </div>
  );

  // 2. TABLE ROW LOADER (for Data Tables)
  if (variant === 'table') {
    return (
      <tr className={`common-loader-table-row ${className}`}>
        <td
          colSpan={colSpan}
          style={{
            padding: '56px 20px',
            textAlign: 'center',
            background: isDark ? 'rgba(13, 21, 38, 0.7)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(6px)',
            ...style,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
            }}
          >
            {spinnerElement}
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: textColor,
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{message}</span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: isDark ? '#475569' : '#94a3b8',
              }}
            >
              Synchronizing catalog with server...
            </div>
          </div>
          <style>{`
            @keyframes commonLoaderSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes commonLoaderPulse {
              0%, 100% { opacity: 0.35; transform: scale(0.92); }
              50% { opacity: 0.85; transform: scale(1.18); }
            }
          `}</style>
        </td>
      </tr>
    );
  }

  // 3. OVERLAY LOADER (sits on top of active table/grid during filter updates)
  if (variant === 'overlay') {
    return (
      <div
        className={`common-loader-overlay ${className}`}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          background: isDark ? 'rgba(8, 13, 24, 0.72)' : 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(5px)',
          borderRadius: 'inherit',
          animation: 'fadeIn 0.15s ease-out',
          ...style,
        }}
      >
        {spinnerElement}
        <div
          style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: isDark ? '#f1f5f9' : '#1e293b',
            letterSpacing: '0.02em',
            background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            padding: '6px 16px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {message}
        </div>
        <style>{`
          @keyframes commonLoaderSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes commonLoaderPulse {
            0%, 100% { opacity: 0.35; transform: scale(0.92); }
            50% { opacity: 0.85; transform: scale(1.18); }
          }
        `}</style>
      </div>
    );
  }

  // 4. CARD / GRID LOADER (for storefront products grid or card lists)
  if (variant === 'card') {
    return (
      <div
        className={`common-loader-card ${className}`}
        style={{
          gridColumn: '1 / -1',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: minHeight || '320px',
          padding: '48px 24px',
          background: isDark ? '#0d1526' : '#f8fafc',
          border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
          borderRadius: '16px',
          gap: '16px',
          ...style,
        }}
      >
        {spinnerElement}
        <div
          style={{
            fontSize: '0.94rem',
            fontWeight: 600,
            color: isDark ? '#cbd5e1' : '#334155',
          }}
        >
          {message}
        </div>
        <div
          style={{
            fontSize: '0.8rem',
            color: isDark ? '#64748b' : '#64748b',
          }}
        >
          Fetching live catalog items...
        </div>
        <style>{`
          @keyframes commonLoaderSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes commonLoaderPulse {
            0%, 100% { opacity: 0.35; transform: scale(0.92); }
            50% { opacity: 0.85; transform: scale(1.18); }
          }
        `}</style>
      </div>
    );
  }

  // 5. SECTION / FULLSCREEN LOADER
  return (
    <div
      className={`common-loader-section ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: minHeight || (variant === 'fullscreen' ? '80vh' : '280px'),
        width: '100%',
        padding: '32px',
        gap: '16px',
        background: variant === 'fullscreen' ? bgColor : 'transparent',
        ...style,
      }}
    >
      {spinnerElement}
      <div
        style={{
          fontSize: '0.88rem',
          fontWeight: 600,
          color: textColor,
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </div>
      <style>{`
        @keyframes commonLoaderSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes commonLoaderPulse {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 0.85; transform: scale(1.18); }
        }
      `}</style>
    </div>
  );
};

export default CommonLoader;
