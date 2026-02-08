'use client'

import { BlogSidebar } from './blog-sidebar'
import type { TocItem } from '@/types/blog'
import { cn } from '@/lib/utils'
import { useSidebarState } from '@/hooks/use-sidebar-state'

export interface BlogLayoutProps {
  children: React.ReactNode
  tags?: string[]
  toc?: TocItem[]
  type: 'listing' | 'detail'
  postCount?: number
  tagCount?: number
  selectedTag?: string | null
  onTagSelect?: (tag: string | null) => void
}

export function BlogLayout({
  children,
  tags = [],
  toc = [],
  type,
  postCount = 0,
  tagCount = 0,
  selectedTag,
  onTagSelect,
}: BlogLayoutProps) {
  const { isOpen, setIsOpen, toggle } = useSidebarState()

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Sidebar - Mobile Sheet and Desktop Sidebar handled by BlogSidebar */}
      <BlogSidebar
        toc={type === 'detail' ? toc : []}
        tags={tags}
        type={type}
        postCount={postCount}
        tagCount={tagCount}
        selectedTag={selectedTag}
        onTagSelect={onTagSelect}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggle={toggle}
      />

      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-200 ease-out',
          // Desktop: Adjust margin based on sidebar state
          isOpen ? 'lg:ml-72' : 'lg:ml-[48px]'
        )}
      >
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
