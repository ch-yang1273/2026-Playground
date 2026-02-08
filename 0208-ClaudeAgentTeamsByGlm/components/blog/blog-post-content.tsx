import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { cn } from '@/lib/utils'

const mdxComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('font-heading text-4xl font-bold mt-8 mb-4 first:mt-0', className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn('font-heading text-3xl font-bold mt-8 mb-4', className)} {...props} />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('font-heading text-2xl font-bold mt-6 mb-3', className)} {...props} />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn('font-heading text-xl font-bold mt-4 mb-2', className)} {...props} />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('text-base leading-7 my-4 text-muted-foreground font-light', className)} {...props} />
  ),
  a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn('text-primary hover:text-secondary transition-colors underline underline-offset-4', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('list-disc list-inside my-4 space-y-2 text-muted-foreground', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('list-decimal list-inside my-4 space-y-2 text-muted-foreground', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('ml-4', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn('border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-primary/5', className)}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'bg-card border border-border/50 rounded-lg p-4 overflow-x-auto my-6 font-mono text-sm',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes('hljs')
    return (
      <code
        className={cn(
          'font-mono text-sm',
          isInline && 'bg-primary/10 text-primary px-1.5 py-0.5 rounded',
          !isInline && className,
          className
        )}
        {...props}
      />
    )
  },
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={cn('border-border/30 my-8', className)} {...props} />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <strong className={cn('font-semibold text-foreground', className)} {...props} />
  ),
  em: ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <em className={cn('italic text-muted-foreground', className)} {...props} />
  ),
}

interface BlogPostContentProps {
  content: string
  className?: string
}

export function BlogPostContent({ content, className }: BlogPostContentProps) {
  return (
    <article className={cn('prose prose-lg max-w-none dark:prose-invert', className)}>
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            rehypePlugins: [
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ],
          },
        }}
      />
    </article>
  )
}
