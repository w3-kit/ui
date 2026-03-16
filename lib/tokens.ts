/**
 * Design token exports for W3-Kit.
 * These mirror the CSS custom properties defined in globals.css
 * and can be used in TypeScript/JS contexts (e.g., Chart.js).
 */

export const colors = {
  primary: "hsl(var(--primary))",
  primaryForeground: "hsl(var(--primary-foreground))",
  primaryHover: "hsl(var(--primary-hover))",
  primaryActive: "hsl(var(--primary-active))",

  secondary: "hsl(var(--secondary))",
  secondaryForeground: "hsl(var(--secondary-foreground))",

  destructive: "hsl(var(--destructive))",
  destructiveForeground: "hsl(var(--destructive-foreground))",
  destructiveHover: "hsl(var(--destructive-hover))",

  success: "hsl(var(--success))",
  successForeground: "hsl(var(--success-foreground))",
  successHover: "hsl(var(--success-hover))",
  successMuted: "hsl(var(--success-muted))",

  warning: "hsl(var(--warning))",
  warningForeground: "hsl(var(--warning-foreground))",
  warningHover: "hsl(var(--warning-hover))",
  warningMuted: "hsl(var(--warning-muted))",

  info: "hsl(var(--info))",
  infoForeground: "hsl(var(--info-foreground))",
  infoHover: "hsl(var(--info-hover))",
  infoMuted: "hsl(var(--info-muted))",

  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  card: "hsl(var(--card))",
  cardForeground: "hsl(var(--card-foreground))",
  muted: "hsl(var(--muted))",
  mutedForeground: "hsl(var(--muted-foreground))",
  accent: "hsl(var(--accent))",
  accentForeground: "hsl(var(--accent-foreground))",
  border: "hsl(var(--border))",
  ring: "hsl(var(--ring))",
  overlay: "hsl(var(--overlay))",
} as const;

/** Read a CSS variable's computed value at runtime (useful for Chart.js) */
export function getCSSVar(name: string, el?: Element): string {
  const target = el ?? document.documentElement;
  return getComputedStyle(target).getPropertyValue(name).trim();
}

/** Build an hsl() color string from a CSS variable at runtime */
export function getTokenColor(token: string, el?: Element): string {
  const value = getCSSVar(token, el);
  return `hsl(${value})`;
}

export const shadows = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  overlay: "var(--shadow-overlay)",
} as const;

export const radii = {
  sm: "var(--radius-sm)",
  default: "var(--radius)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  full: "var(--radius-full)",
} as const;

export const transitions = {
  fast: "var(--transition-fast)",
  base: "var(--transition-base)",
  slow: "var(--transition-slow)",
  spring: "var(--transition-spring)",
} as const;

export const typography = {
  fontSans: "var(--font-sans)",
  fontMono: "var(--font-mono)",
  headingLetterSpacing: "var(--heading-letter-spacing)",
  headingLineHeight: "var(--heading-line-height)",
} as const;
