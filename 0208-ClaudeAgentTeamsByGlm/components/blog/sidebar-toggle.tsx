'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarToggleProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function SidebarToggle({ isOpen, onToggle, className }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        'h-8 w-8 rounded-lg cursor-pointer',
        'flex items-center justify-center',
        'bg-gradient-to-br from-[oklch(0.70_0.20_200/0.4)] via-[oklch(0.65_0.18_220/0.3)] to-[oklch(0.60_0.15_240/0.4)]',
        'border border-[oklch(0.70_0.20_200/0.5)] backdrop-blur-md',
        'hover:from-[oklch(0.70_0.20_200/0.5)] hover:via-[oklch(0.65_0.18_220/0.4)] hover:to-[oklch(0.60_0.15_240/0.5)]',
        'shadow-[0_0_20px_oklch(0.70_0.20_200/0.5)]',
        'hover:shadow-[0_0_30px_oklch(0.70_0.20_200/0.7)]',
        'transition-all duration-300',
        'animate-neon-pulse',
        className
      )}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isOpen ? (
        <ChevronLeft className="h-4 w-4 transition-transform duration-300" style={{ color: 'oklch(0.70 0.20 200)' }} />
      ) : (
        <ChevronRight className="h-4 w-4 transition-transform duration-300" style={{ color: 'oklch(0.70 0.20 200)' }} />
      )}
    </Button>
  )
}
