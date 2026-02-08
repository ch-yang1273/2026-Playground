'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSidebarState } from '@/hooks/use-sidebar-state'
import { useTocHighlight } from '@/hooks/use-toc-highlight'
import type { TocItem } from '@/types/blog'
import { SidebarToc } from './sidebar-toc'
import { SidebarTagFilter } from './sidebar-tag-filter'
import { SidebarProfile } from './sidebar-profile'
import { SidebarToggle } from './sidebar-toggle'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

// VisuallyHidden component for accessibility
function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    }}>
      {children}
    </span>
  )
}

export type BlogSidebarType = 'listing' | 'detail'

export interface BlogSidebarProps {
  toc?: TocItem[]
  tags?: string[]
  type: BlogSidebarType
  postCount?: number
  tagCount?: number
  selectedTag?: string | null
  onTagSelect?: (tag: string | null) => void
  className?: string
  hideToggle?: boolean
  hideDesktopSidebar?: boolean
  // External state control (optional)
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
  toggle?: () => void
}

export function BlogSidebar({
  toc = [],
  tags = [],
  type,
  postCount = 0,
  tagCount = 0,
  selectedTag,
  onTagSelect,
  className,
  hideToggle = false,
  hideDesktopSidebar = false,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
  toggle: externalToggle,
}: BlogSidebarProps) {
  // Use external state if provided, otherwise use internal state
  const internalState = useSidebarState()
  const isOpen = externalIsOpen ?? internalState.isOpen
  const setIsOpen = externalSetIsOpen ?? internalState.setIsOpen
  const toggle = externalToggle ?? internalState.toggle
  const isMounted = internalState.isMounted

  const { activeId } = useTocHighlight(toc)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detect desktop breakpoint
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, setIsOpen])

  if (!isMounted) {
    return null
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="font-semibold text-foreground text-sm">Navigation</h2>
            <p className="text-xs text-muted-foreground">Quick access</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-6 px-2">
        {/* Profile Section - Show on both types */}
        <SidebarProfile postCount={postCount} tagCount={tagCount} />

        {/* Tag Filter - Show on listing type */}
        {type === 'listing' && tags.length > 0 && onTagSelect && (
          <div className="space-y-3">
            <SidebarTagFilter
              tags={tags}
              selectedTag={selectedTag ?? null}
              onTagSelect={onTagSelect}
            />
          </div>
        )}

        {/* Table of Contents - Show on detail type */}
        {type === 'detail' && toc.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground px-1">
              <span className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              <span>Contents</span>
            </div>
            <SidebarToc toc={toc} activeId={activeId ?? undefined} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border/30 px-2">
        <p className="text-xs text-muted-foreground text-center font-mono">
          Built with Next.js 16 + React 19
        </p>
      </div>
    </div>
  )

  // Sheet should only open on mobile
  const isSheetOpen = !isDesktop && isOpen

  return (
    <>
      {/* Mobile Sheet - Only rendered on mobile/tablet */}
      <Sheet open={isSheetOpen} onOpenChange={(open) => !isDesktop && setIsOpen(open)}>
        {!hideToggle && (
          <SheetTrigger asChild>
            {!isDesktop && (
              <SidebarToggle isOpen={isOpen} onToggle={toggle} />
            )}
          </SheetTrigger>
        )}
          <SheetContent
            side="left"
            className={cn(
              'w-full sm:max-w-md border-r border-border/30',
              'bg-gradient-to-b from-card/95 via-card/90 to-card/95',
              'backdrop-blur-xl shadow-2xl',
              'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
              'p-0'
            )}
          >
            <VisuallyHidden>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Sidebar navigation menu</SheetDescription>
            </VisuallyHidden>
            <div className="h-full p-6">
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>

      {/* Desktop: Fixed Sidebar with collapsed state */}
      {!hideDesktopSidebar && (
        <aside
          className={cn(
            'flex flex-col',
            'fixed left-0 top-16 bottom-0',
            'z-50',
            'border-r border-border/30',
            'bg-gradient-to-b from-card/95 via-card/90 to-card/95',
            'backdrop-blur-xl shadow-xl',
            'transition-all duration-300 ease-in-out',
            'overflow-x-hidden',
            'flex-shrink-0',
            className
          )}
          style={{
            width: isOpen ? '288px' : '48px',
            minWidth: isOpen ? '288px' : '48px',
            maxWidth: isOpen ? '288px' : '48px',
          } as React.CSSProperties}
        >
          {/* Sidebar content - render based on state */}
          <div className={cn(
            "h-full transition-all duration-300 ease-in-out",
            isOpen ? "p-6 opacity-100" : "p-0 opacity-0"
          )}>
            {sidebarContent}
          </div>

          {/* Toggle button - top center when collapsed, top-right when expanded */}
          <div className={cn(
            "absolute z-10 transition-all duration-300",
            isOpen ? "top-4 right-4" : "top-4 left-1/2 -translate-x-1/2"
          )}>
            <SidebarToggle isOpen={isOpen} onToggle={toggle} />
          </div>
        </aside>
      )}
    </>
  )
}
