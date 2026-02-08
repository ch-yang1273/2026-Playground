import { cn } from '@/lib/utils'

/**
 * Skeleton component for loading states
 *
 * Provides a visual placeholder while content is loading.
 * Uses an animated pulse effect to indicate loading state.
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The width of the skeleton (e.g., '100%', '200px')
   */
  width?: string
  /**
   * The height of the skeleton (e.g., '20px', '1rem')
   */
  height?: string
  /**
   * Whether to show the pulse animation
   */
  animate?: boolean
}

export function Skeleton({
  className,
  width,
  height,
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-muted',
        animate && 'animate-pulse',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}

/**
 * BlogPostCardSkeleton - Loading state for blog post cards
 */
export function BlogPostCardSkeleton() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

/**
 * BlogPostGridSkeleton - Loading state for blog post grid
 */
export function BlogPostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <BlogPostCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * TextSkeleton - Loading state for text content
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 w-full"
          style={{ width: i === lines - 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  )
}

/**
 * HeroSkeleton - Loading state for hero section
 */
export function HeroSkeleton() {
  return (
    <div className="py-20 px-4 space-y-6">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <div className="flex gap-4 justify-center">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
