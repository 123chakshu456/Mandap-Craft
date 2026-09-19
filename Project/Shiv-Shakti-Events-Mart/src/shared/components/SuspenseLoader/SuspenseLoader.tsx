import React from 'react';
import { Loader2 } from 'lucide-react';

interface SuspenseLoaderProps {
  message?: string;
  minHeight?: string;
}

export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({
  message = 'Loading workspace module...',
  minHeight = '60vh',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        width: '100%',
        padding: '32px',
        gap: '16px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            animation: 'pulse 2s infinite',
          }}
        />
        <Loader2
          size={32}
          color="#818cf8"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>

      <div
        style={{
          fontSize: '0.86rem',
          fontWeight: 600,
          color: '#94a3b8',
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 0.9; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default SuspenseLoader;
