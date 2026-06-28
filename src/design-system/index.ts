/**
 * Centralized Design System Tokens for NiT Admin.
 * Derived from the Material Design 3 Stitch Export specifications.
 */

export const colors = {
  primary: '#263b74',
  primaryContainer: '#3f538d',
  onPrimary: '#ffffff',
  background: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#eaedf9',
  onSurface: '#111c2d',
  onSurfaceVariant: '#444650',
  outline: '#757681',
  outlineVariant: '#c5c6d1',
  
  // Status Colors
  success: '#16a34a',      // Present / IN
  successBg: '#dcfce7',
  successText: '#166534',
  danger: '#dc2626',       // Absent / OUT
  dangerBg: '#fee2e2',
  dangerText: '#991b1b',
  warning: '#d97706',      // Late
  warningBg: '#fef3c7',
  warningText: '#92400e',
  neutral: '#6b7280',      // Offline / General
  neutralBg: '#f3f4f6',
  neutralText: '#374151',
};

export const spacing = {
  xs: '4px',    // 0.25rem
  sm: '8px',    // 0.5rem
  md: '16px',   // 1rem
  lg: '24px',   // 1.5rem
  xl: '32px',   // 2rem
  xxl: '48px',  // 3rem
};

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    heading: 'Plus Jakarta Sans, system-ui, sans-serif',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    display: '36px',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export const zIndex = {
  base: '0',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modal: '1040',
  popover: '1050',
};

export const transitions = {
  default: 'all 0.2s ease-in-out',
  slow: 'all 0.3s ease-in-out',
  fast: 'all 0.1s ease-in-out',
};
