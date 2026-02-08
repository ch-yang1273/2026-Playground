import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function ResponsiveContainer({
  children,
  className,
  size = 'lg',
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <div className={cn('container mx-auto px-4', sizeClasses[size], className)}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    mobile?: 1 | 2
    tablet?: 1 | 2 | 3
    desktop?: 1 | 2 | 3 | 4
    wide?: 1 | 2 | 3 | 4 | 5 | 6
  }
  gap?: 'sm' | 'md' | 'lg'
}

export function ResponsiveGrid({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  }

  const gridClasses = cn(
    'grid',
    gapClasses[gap],
    cols.mobile === 1 && 'grid-cols-1',
    cols.mobile === 2 && 'grid-cols-2',
    cols.tablet === 1 && 'sm:grid-cols-1',
    cols.tablet === 2 && 'sm:grid-cols-2',
    cols.tablet === 3 && 'sm:grid-cols-3',
    cols.desktop === 1 && 'lg:grid-cols-1',
    cols.desktop === 2 && 'lg:grid-cols-2',
    cols.desktop === 3 && 'lg:grid-cols-3',
    cols.desktop === 4 && 'lg:grid-cols-4',
    cols.wide === 1 && 'xl:grid-cols-1',
    cols.wide === 2 && 'xl:grid-cols-2',
    cols.wide === 3 && 'xl:grid-cols-3',
    cols.wide === 4 && 'xl:grid-cols-4',
    cols.wide === 5 && 'xl:grid-cols-5',
    cols.wide === 6 && 'xl:grid-cols-6',
    className
  )

  return <div className={gridClasses}>{children}</div>
}
