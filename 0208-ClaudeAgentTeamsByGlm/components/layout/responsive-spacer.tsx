import { cn } from '@/lib/utils'

interface ResponsiveSpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  axis?: 'vertical' | 'horizontal'
  className?: string
}

export function ResponsiveSpacer({
  size = 'md',
  axis = 'vertical',
  className,
}: ResponsiveSpacerProps) {
  const sizeClasses = {
    xs: 'h-2 sm:h-3',
    sm: 'h-4 sm:h-6',
    md: 'h-6 sm:h-8 md:h-12',
    lg: 'h-8 sm:h-12 md:h-16 lg:h-20',
    xl: 'h-12 sm:h-16 md:h-20 lg:h-24',
    '2xl': 'h-16 sm:h-20 md:h-24 lg:h-32',
  }

  const horizontalSizeClasses = {
    xs: 'w-2 sm:w-3',
    sm: 'w-4 sm:w-6',
    md: 'w-6 sm:w-8 md:w-12',
    lg: 'w-8 sm:w-12 md:w-16 lg:w-20',
    xl: 'w-12 sm:w-16 md:w-20 lg:w-24',
    '2xl': 'w-16 sm:w-20 md:w-24 lg:w-32',
  }

  return (
    <div
      className={cn(
        axis === 'vertical' ? sizeClasses[size] : horizontalSizeClasses[size],
        className
      )}
    />
  )
}
