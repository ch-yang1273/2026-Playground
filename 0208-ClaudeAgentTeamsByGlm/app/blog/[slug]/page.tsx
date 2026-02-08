import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'
import { BlogPostContent } from '@/components/blog/blog-post-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, User, FileText } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: '404 // ENTRY_NOT_FOUND',
    }
  }

  return {
    title: `${post.title} // DEV.LOG`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = formatDistanceToNow(new Date(post.date), { addSuffix: true })

  return (
    <main className="flex-1">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-8 font-mono text-sm hover:text-primary transition-colors"
        >
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            &lt; RETURN_TO_LOGS
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-12 relative">
          {/* Decorative elements */}
          <div className="absolute -top-8 -left-8 w-32 h-32 border border-primary/20 rounded-sm" />
          <div className="absolute -top-4 -left-4 w-24 h-24 border border-secondary/20 rounded-sm" />

          <div className="relative space-y-6">
            {/* Entry metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-mono">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-4 w-4" />
                <span>LOG_ENTRY</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-2 text-secondary">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}MIN_READ</span>
                </div>
              )}
              {post.author && (
                <div className="flex items-center gap-2 text-accent">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent neon-glow">
                {post.title}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground font-light max-w-3xl">
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="font-mono text-xs border-border/50 bg-primary/5 text-primary hover:border-primary/50 transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Category */}
            {post.category && (
              <div className="flex items-center gap-2 pt-2">
                <span className="font-mono text-xs text-muted-foreground">CATEGORY:</span>
                <Badge className="font-mono text-xs bg-secondary/20 border-secondary/50 text-secondary-foreground">
                  {post.category.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-primary/50 via-secondary/50 to-transparent mb-12" />

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <BlogPostContent content={post.content} />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/20">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs text-muted-foreground">
              &lt;end_of_entry /&gt;
            </div>
            <Button
              asChild
              variant="outline"
              className="font-mono text-sm border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Link href="/blog">
                VIEW_ALL_LOGS &gt;&gt;&gt;
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
