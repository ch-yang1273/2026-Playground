import { cn } from '@/lib/utils'

/**
 * BlogPostContent - A wrapper component for styling blog post content
 *
 * This component wraps MDX/Markdown content with consistent styling.
 * Use this in your blog post pages to wrap the rendered content.
 */
interface BlogPostContentProps {
  children?: React.ReactNode
  className?: string
  content?: string
}

export function BlogPostContent({ children, className, content }: BlogPostContentProps) {
  return (
    <article
      className={cn('prose max-w-none dark:prose-invert', className)}
      dangerouslySetInnerHTML={content ? { __html: content } : undefined}
    >
      {children}
    </article>
  )
}
