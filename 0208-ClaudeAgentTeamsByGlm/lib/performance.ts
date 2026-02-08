/**
 * Performance monitoring utilities for the blog
 *
 * Provides functions to track and report Core Web Vitals and other performance metrics.
 */

/**
 * Core Web Vitals thresholds
 */
export const VITAL_THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay (ms)
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift (score)
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte (ms)
} as const

/**
 * Metric rating type
 */
export type MetricRating = 'good' | 'needs-improvement' | 'poor'

/**
 * Performance metric type
 */
export interface PerformanceMetric {
  name: string
  value: number
  rating: MetricRating
  timestamp: number
}

/**
 * Rate a performance metric
 */
export function rateMetric(
  metricName: keyof typeof VITAL_THRESHOLDS,
  value: number
): MetricRating {
  const thresholds = VITAL_THRESHOLDS[metricName]

  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

/**
 * Get performance entries by type
 */
export function getPerformanceEntries(
  type: string
): PerformanceEntryList {
  if (typeof window === 'undefined') return []

  return performance.getEntriesByType(type)
}

/**
 * Measure navigation timing
 */
export function getNavigationTiming(): PerformanceMetric | null {
  if (typeof window === 'undefined') return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  if (!navigation) return null

  const ttfb = navigation.responseStart - navigation.requestStart
  const rating = rateMetric('TTFB', ttfb)

  return {
    name: 'TTFB',
    value: Math.round(ttfb),
    rating,
    timestamp: Date.now(),
  }
}

/**
 * Measure First Contentful Paint
 */
export function getFCP(): PerformanceMetric | null {
  if (typeof window === 'undefined') return null

  const paintEntries = performance.getEntriesByType('paint')
  const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')

  if (!fcpEntry) return null

  const fcp = fcpEntry.startTime
  const rating = rateMetric('FCP', fcp)

  return {
    name: 'FCP',
    value: Math.round(fcp),
    rating,
    timestamp: Date.now(),
  }
}

/**
 * Measure Largest Contentful Paint
 */
export function getLCP(): PerformanceMetric | null {
  if (typeof window === 'undefined') return null

  const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
  const lastEntry = lcpEntries[lcpEntries.length - 1]

  if (!lastEntry) return null

  const lcp = lastEntry.startTime
  const rating = rateMetric('LCP', lcp)

  return {
    name: 'LCP',
    value: Math.round(lcp),
    rating,
    timestamp: Date.now(),
  }
}

/**
 * Measure Cumulative Layout Shift
 */
export function getCLS(): PerformanceMetric | null {
  if (typeof window === 'undefined') return null

  let clsValue = 0
  const clsEntries = performance.getEntriesByType('layout-shift')

  for (const entry of clsEntries) {
    if (!(entry as any).hadRecentInput) {
      clsValue += (entry as any).value
    }
  }

  const rating = rateMetric('CLS', clsValue)

  return {
    name: 'CLS',
    value: Math.round(clsValue * 1000) / 1000,
    rating,
    timestamp: Date.now(),
  }
}

/**
 * Get all Core Web Vitals
 */
export function getCoreWebVitals(): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = []

  const ttfb = getNavigationTiming()
  if (ttfb) metrics.push(ttfb)

  const fcp = getFCP()
  if (fcp) metrics.push(fcp)

  const lcp = getLCP()
  if (lcp) metrics.push(lcp)

  const cls = getCLS()
  if (cls) metrics.push(cls)

  return metrics
}

/**
 * Report performance metrics (placeholder for analytics integration)
 */
export function reportMetrics(metrics: PerformanceMetric[]): void {
  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to analytics
    // analytics.track('performance_metrics', { metrics })
    console.log('Performance metrics:', metrics)
  }
}

/**
 * Debounce function for layout shift tracking
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
