// ========== Centralized Design Tokens ==========
// Single source of truth for all UI styling across the system

export const colors = {
  // Brand
  primary: '#005c3f',
  primaryLight: '#008c5e',
  primaryBg: '#e6f4ef',
  primaryBorder: '#b7e4d1',

  // Semantic
  success: '#52c41a',
  successBg: '#f6ffed',
  warning: '#fa8c16',
  warningBg: '#fff7e6',
  error: '#ff4d4f',
  errorBg: '#fff2f0',
  info: '#1677ff',
  infoBg: '#e6f0ff',

  // Purple (AI / HPI)
  purple: '#722ed1',
  purpleBg: '#f9f0ff',
  purpleBorder: '#efdbff',

  // Teal (ROS / Referrals)
  teal: '#13c2c2',
  tealBg: '#e6fffb',

  // Neutral
  text: '#262626',
  textSecondary: '#8c8c8c',
  border: '#e8e8e8',
  borderLight: '#f0f0f0',
  bgPage: '#f0f2f5',
  bgCard: '#ffffff',
  bgHover: '#fafafa',
  bgSubtle: '#f5f5f5',
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  pill: 10, // for status/tag pills
} as const;

export const spacing = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 24,
} as const;

export const cardStyles = {
  borderRadius: radius.xl,
  border: `1px solid ${colors.border}`,
} as const;

export const sectionIconSize = {
  width: 28,
  height: 28,
  borderRadius: radius.md,
  fontSize: 14,
} as const;

// Step-specific colors for workflow navigation
export const stepColors = [
  colors.info,     // Subjective / Assessment
  colors.teal,     // Objective / Plan
  colors.warning,  // Assessment / Objective
  colors.success,  // Plan / Subjective
  colors.purple,   // Evaluation
  colors.primary,  // Summary
] as const;

// Gradient for primary action buttons and banners
export const gradients = {
  primary: 'linear-gradient(135deg, #005c3f 0%, #008c5e 100%)',
  success: 'linear-gradient(135deg, #52c41a 0%, #a0d911 100%)',
} as const;
