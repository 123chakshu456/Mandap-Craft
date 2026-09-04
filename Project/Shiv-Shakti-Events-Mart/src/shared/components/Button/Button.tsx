import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {

  return (
    <button
      className={`admin-btn ${variant} ${size} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size === 'sm' ? '6px' : '8px',
        padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '9px 16px',
        fontSize: size === 'sm' ? '0.8rem' : size === 'lg' ? '1rem' : '0.875rem',
        fontWeight: 600,
        borderRadius: '8px',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: 'all 0.15s ease',
        border: variant === 'danger' ? '1px solid #7f1d1d' : variant === 'secondary' ? '1px solid #334155' : 'none',
        background: variant === 'primary' ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : variant === 'danger' ? 'rgba(127, 29, 29, 0.4)' : variant === 'secondary' ? '#1e293b' : 'transparent',
        color: variant === 'danger' ? '#fca5a5' : variant === 'secondary' ? '#cbd5e1' : '#fff',
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
