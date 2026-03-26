import { describe, it, expect } from 'vitest';
import { extractTokensFromSource } from '../src/extractors/token-extractor.js';

const sampleConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
};
`;

describe('extractTokensFromSource', () => {
  it('extracts colors from tailwind config', () => {
    const tokens = extractTokensFromSource(sampleConfig);
    expect(tokens.colors).toBeDefined();
    expect(tokens.colors['border']).toBe('hsl(var(--border))');
  });

  it('extracts nested color objects', () => {
    const tokens = extractTokensFromSource(sampleConfig);
    expect(tokens.colors['primary']).toEqual({
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
    });
  });

  it('returns empty objects for missing sections', () => {
    const tokens = extractTokensFromSource('module.exports = {};');
    expect(tokens.colors).toEqual({});
    expect(tokens.spacing).toEqual({});
    expect(tokens.typography).toEqual({ fontSizes: {}, fontFamily: {}, letterSpacing: {} });
  });
});
