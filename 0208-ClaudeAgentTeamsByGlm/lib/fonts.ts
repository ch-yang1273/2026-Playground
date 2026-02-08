import { Inter, JetBrains_Mono } from 'next/font/google'

/**
 * Optimized font configuration for the blog
 *
 * Uses Next.js font optimization to:
 * - Automatically self-host fonts
 * - Remove request to Google Fonts
 * - Apply font display strategy
 * - Enable font subsetting
 */

/**
 * Inter - Primary font for body text and headings
 *
 * - display: swap ensures text is immediately visible with fallback font
 * - subsets: latin includes only characters needed for English
 * - variable: true uses variable font for better performance
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

/**
 * JetBrains Mono - Monospace font for code blocks
 *
 * - display: swap ensures code is immediately visible with fallback font
 * - subsets: latin includes only characters needed for English
 */
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
})

/**
 * Font CSS variables for use in Tailwind config
 */
export const fontVariables = `${inter.variable} ${jetBrainsMono.variable}`

/**
 * Typography utilities
 */
export const typography = {
  /**
   * Base font family
   */
  sans: 'var(--font-inter), system-ui, sans-serif',

  /**
   * Monospace font family for code
   */
  mono: 'var(--font-mono), ui-monospace, monospace',

  /**
   * Font sizes using modular scale
   */
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },

  /**
   * Line heights
   */
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  /**
   * Letter spacing
   */
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
}

/**
 * Get font class names for a given element type
 */
export function getFontClass(element: 'heading' | 'body' | 'code'): string {
  switch (element) {
    case 'heading':
      return 'font-sans font-semibold tracking-tight'
    case 'body':
      return 'font-sans tracking-normal'
    case 'code':
      return 'font-mono'
    default:
      return 'font-sans'
  }
}
