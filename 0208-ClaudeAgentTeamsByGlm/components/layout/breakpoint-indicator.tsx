'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')

  useEffect(() => {
    const getBreakpoint = (): Breakpoint => {
      const width = window.innerWidth
      if (width < 640) return 'xs'
      if (width < 768) return 'sm'
      if (width < 1024) return 'md'
      if (width < 1280) return 'lg'
      if (width < 1536) return 'xl'
      return '2xl'
    }

    const handleResize = () => setBreakpoint(getBreakpoint())

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

interface ShowAtProps {
  breakpoint: Breakpoint
  children: React.ReactNode
  className?: string
}

export function ShowAt({ breakpoint, children, className }: ShowAtProps) {
  const currentBreakpoint = useBreakpoint()
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const shouldShow = breakpointOrder.indexOf(currentBreakpoint) >= breakpointOrder.indexOf(breakpoint)

  if (!shouldShow) return null

  return <div className={className}>{children}</div>
}

interface HideAtProps {
  breakpoint: Breakpoint
  children: React.ReactNode
  className?: string
}

export function HideAt({ breakpoint, children, className }: HideAtProps) {
  const currentBreakpoint = useBreakpoint()
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const shouldShow = breakpointOrder.indexOf(currentBreakpoint) < breakpointOrder.indexOf(breakpoint)

  if (!shouldShow) return null

  return <div className={className}>{children}</div>
}

interface BreakpointIndicatorProps {
  className?: string
}

export function BreakpointIndicator({ className }: BreakpointIndicatorProps) {
  const breakpoint = useBreakpoint()

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-[100] rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg',
        className
      )}
    >
      {breakpoint}
    </div>
  )
}
