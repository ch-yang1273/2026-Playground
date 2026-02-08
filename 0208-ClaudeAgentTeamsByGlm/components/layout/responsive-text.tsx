import { cn } from '@/lib/utils'

interface ResponsiveTextProps {
  children: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  className?: string
}

export function ResponsiveText({
  children,
  variant = 'body',
  weight = 'normal',
  className,
}: ResponsiveTextProps) {
  const variantClasses = {
    h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
    h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    h3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    h4: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    body: 'text-sm sm:text-base md:text-lg lg:text-base',
    small: 'text-xs sm:text-sm md:text-base',
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const Tag = variant.startsWith('h') ? variant : 'p'

  return (
    <Tag
      className={cn(
        variantClasses[variant],
        weightClasses[weight],
        'leading-tight tracking-tight',
        className
      )}
    >
      {children}
    </Tag>
  )
}
