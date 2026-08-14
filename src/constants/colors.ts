// ==========================================
// MODERN COLOR THEME & TYPOGRAPHY
// Contemporary luxury design system
// ==========================================

export const COLORS = {
  // Primary: Sophisticated Deep Teal
  primary: {
    dark: '#0f2f2f',    // Deep teal (replaces emerald-950)
    base: '#1a4d4d',    // Teal
    light: '#2d7a7a',   // Lighter teal
    lighter: '#4a9b9b'  // Even lighter
  },

  // Accent: Modern Warm Gold
  accent: {
    base: '#d4af37',    // Warm gold (modern replace for amber)
    light: '#e8c547',   // Lighter gold
    lighter: '#f5e6a1'  // Very light gold
  },

  // Neutrals: Premium grayscale
  neutral: {
    black: '#0a0a0a',
    dark: '#1a1a1a',
    darkGray: '#2a2a2a',
    mediumGray: '#404040',
    gray: '#666666',
    lightGray: '#b0b0b0',
    lighter: '#d9d9d9',
    veryLight: '#f0f0f0',
    warmCream: '#faf7f2',    // Warm cream background
    paleGold: '#f5f1e8',     // Pale gold background
    white: '#ffffff'
  },

  // Accents: Jewel tones
  jewels: {
    sapphire: '#0f3f7f',      // Deep blue
    emerald: '#1b5e4d',       // Deep green
    ruby: '#7d1935',          // Deep red
    amethyst: '#4a1a6f',      // Deep purple
    topaz: '#cc7722'          // Warm orange
  },

  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Gradients
  gradients: {
    heroTeal: 'linear-gradient(135deg, #0f2f2f 0%, #1a4d4d 50%, #0a0a0a 100%)',
    heroGold: 'linear-gradient(135deg, #d4af37 0%, #f5e6a1 100%)',
    subtle: 'linear-gradient(to right, #f0f0f0, #ffffff)'
  }
};

export const TAILWIND_COLORS = {
  // Map to Tailwind utilities for use in className
  primary: 'teal',      // Will use teal-900, teal-700, etc.
  accent: 'yellow',     // Closest to warm gold in Tailwind
  neutral: 'slate',     // Better neutral grays
  secondary: 'cyan',    // For secondary accents
  dark: 'slate-950',
  light: 'slate-50'
};

// Typography scales
export const TYPOGRAPHY = {
  fonts: {
    serif: 'font-serif',      // For headings
    sans: 'font-sans'         // For body
  },
  
  heading: {
    h1: 'text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold',
    h2: 'text-3xl sm:text-4xl font-serif font-bold',
    h3: 'text-2xl font-serif font-bold',
    h4: 'text-lg font-serif font-bold'
  },
  
  body: {
    large: 'text-base font-light',
    base: 'text-sm font-light',
    small: 'text-xs font-light'
  },
  
  label: {
    base: 'text-[10px] uppercase tracking-widest font-extrabold'
  }
};

// Spacing scale
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px'
};

// Shadow system for modern depth
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  luxury: '0 20px 40px rgba(0, 0, 0, 0.15)'
};

// Border radius for modern feel
export const BORDER_RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px'
};
