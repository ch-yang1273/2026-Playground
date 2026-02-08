import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'
import { BlogPostContent } from '@/components/blog/blog-post-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - Developer Blog`,
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
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const formattedDate = formatDistanceToNow(new Date(post.date), { addSuffix: true })

  return (
    <main className="flex-1">
      <article className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <time dateTime={post.date} className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </time>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground">{post.description}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {post.coverImage && (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="max-w-3xl">
          <BlogPostContent content={post.content} />
        </div>
      </article>
    </main>
  )
}
