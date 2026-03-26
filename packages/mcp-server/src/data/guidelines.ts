import { GuidelineSection } from '../types.js';

export const GUIDELINES: GuidelineSection[] = [
  {
    topic: 'spacing',
    content: `Use a consistent spacing system based on multiples of 4 or 8px.
Common values: 4px, 8px, 16px, 24px, 32px, 48px, 64px.
Let elements breathe. Add consistent spacing between sections.
Vercel style: p-4 or p-5 for cards, gap-3 between elements, py-2 px-3 for small elements.`,
  },
  {
    topic: 'hierarchy',
    content: `Create visual hierarchy so users instantly see what is most important.
Tools: size, color, position, contrast.
Most important info: larger, higher on page, higher contrast.
Secondary info: smaller, lower, less contrast.
Limit to 6 or fewer font sizes. Use Geist font with tracking-tight on headings.`,
  },
  {
    topic: 'dark-mode',
    content: `Near-black backgrounds (gray-950). Cards at gray-900, never gray-800 for backgrounds.
Lighter cards on darker backgrounds for depth via color layers, not shadows.
Muted secondary text: text-gray-500 dark:text-gray-400 — never text-gray-300.
Dividers: border-t border-gray-100 dark:border-gray-800.`,
  },
  {
    topic: 'motion',
    content: `Vercel-minimal: transition-colors duration-150 only.
No transforms, bounces, or scale effects on hover.
Hover: hover:bg-gray-50 dark:hover:bg-gray-900 — subtle background shift.
Only allowed animations: color transitions and loading spinners.`,
  },
  {
    topic: 'vercel-style',
    content: `Borders over shadows: border border-gray-200 dark:border-gray-800.
Monochrome first with ONE accent color (blue) for CTAs.
Card pattern: rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950.
Pill badges: rounded-full px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800.
Focus rings: focus-visible:ring-2 focus-visible:ring-gray-400.
Icons should match text size consistently. Use lucide-react.`,
  },
];
