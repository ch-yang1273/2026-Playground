'use client'

import { useEffect, useState } from 'react'
import { getCoreWebVitals, type PerformanceMetric } from '@/lib/performance'

/**
 * PerformanceMonitor - Client component for monitoring Core Web Vitals
 *
 * This component tracks and displays performance metrics in development mode.
 * In production, it would send metrics to your analytics service.
 */
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    // Wait for page to load before measuring
    const timer = setTimeout(() => {
      const vitals = getCoreWebVitals()
      setMetrics(vitals)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') return null

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Toggle performance metrics"
      >
        {isVisible ? 'Hide' : 'Show'} Performance
      </button>

      {/* Metrics panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-background border rounded-lg shadow-xl p-4 w-80 max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Core Web Vitals</h3>
            <button
              onClick={() => setMetrics(getCoreWebVitals())}
              className="text-xs text-primary hover:underline"
            >
              Refresh
            </button>
          </div>

          {metrics.length === 0 ? (
            <p className="text-sm text-muted-foreground">Loading metrics...</p>
          ) : (
            <div className="space-y-3">
              {metrics.map((metric) => (
                <MetricCard key={metric.name} metric={metric} />
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <p>Metrics update after page load</p>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * MetricCard - Display a single performance metric
 */
function MetricCard({ metric }: { metric: PerformanceMetric }) {
  const getRatingColor = (rating: PerformanceMetric['rating']) => {
    switch (rating) {
      case 'good':
        return 'text-green-500'
      case 'needs-improvement':
        return 'text-yellow-500'
      case 'poor':
        return 'text-red-500'
    }
  }

  const getRatingIcon = (rating: PerformanceMetric['rating']) => {
    switch (rating) {
      case 'good':
        return '✓'
      case 'needs-improvement':
        return '⚠'
      case 'poor':
        return '✗'
    }
  }

  const getUnit = (name: string) => {
    if (name === 'CLS') return ''
    return 'ms'
  }

  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/50">
      <div className="flex items-center gap-2">
        <span className={getRatingColor(metric.rating)}>
          {getRatingIcon(metric.rating)}
        </span>
        <span className="text-sm font-medium">{metric.name}</span>
      </div>
      <span className="text-sm font-mono">
        {metric.value}
        {getUnit(metric.name)}
      </span>
    </div>
  )
}

/**
 * usePerformance - Hook for accessing performance metrics
 */
export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])

  useEffect(() => {
    // Wait for page to load before measuring
    const timer = setTimeout(() => {
      setMetrics(getCoreWebVitals())
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return { metrics }
}
