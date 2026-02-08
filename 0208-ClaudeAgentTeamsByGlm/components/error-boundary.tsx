'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * ErrorBoundary - React Error Boundary for catching and displaying errors
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }

    return this.props.children
  }
}

/**
 * DefaultErrorFallback - Default error UI component
 */
interface DefaultErrorFallbackProps {
  error: Error | null
  reset: () => void
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Something went wrong</CardTitle>
          <CardDescription>
            {error?.message || 'An unexpected error occurred'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We apologize for the inconvenience. Please try again or contact support if the problem persists.
          </p>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold">
                Error Details
              </summary>
              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-48">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/**
 * BlogPostErrorBoundary - Specialized error boundary for blog posts
 */
interface BlogPostErrorBoundaryProps {
  children: React.ReactNode
}

export function BlogPostErrorBoundary({ children }: BlogPostErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-destructive">Failed to load blog post</CardTitle>
              <CardDescription>
                The blog post could not be loaded. Please try again later.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => window.location.href = '/blog'}>
                Back to Blog
              </Button>
            </CardFooter>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * withErrorBoundary - Higher-order component for adding error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
): React.ComponentType<P> {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
