import { BlogPostCard } from './blog-post-card'
import { BlogPostMetadata } from '@/types/blog'
import { cn } from '@/lib/utils'

interface BlogPostGridProps {
  posts: BlogPostMetadata[]
  className?: string
  layout?: 'grid' | 'list' | 'masonry'
  columns?: 1 | 2 | 3 | 4
}

export function BlogPostGrid({
  posts,
  className,
  layout = 'grid',
  columns = 3,
}: BlogPostGridProps) {
  if (posts.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground">No posts found</p>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    )
  }

  if (layout === 'masonry') {
    return (
      <div
        className={cn(
          'columns-1 gap-6 space-y-6',
          'md:columns-2',
          'lg:columns-3',
          className
        )}
      >
        {posts.map((post) => (
          <div key={post.slug} className="break-inside-avoid">
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
    )
  }

  // Default grid layout with responsive columns
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns]

  return (
    <div className={cn('grid gap-6', gridCols, className)}>
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
