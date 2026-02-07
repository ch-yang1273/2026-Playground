import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostSlugs, getPostWithHTML, getPostBySlug } from '@/lib/posts'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft } from 'lucide-react'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const post = getPostBySlug(slug)
    const { frontmatter } = post

    return {
      title: `${frontmatter.title} - Developer Blog`,
      description: frontmatter.excerpt,
      authors: [{ name: frontmatter.author }],
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.excerpt,
        type: 'article',
        publishedTime: frontmatter.date,
        authors: [frontmatter.author],
        url: `https://yourdomain.com/blog/${slug}`,
        images: frontmatter.coverImage ? [{ url: frontmatter.coverImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.excerpt,
        images: frontmatter.coverImage ? [frontmatter.coverImage] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Post Not Found - Developer Blog',
      description: 'The requested blog post could not be found.',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  let post
  try {
    post = await getPostWithHTML(slug)
  } catch (error) {
    notFound()
  }

  const { frontmatter, htmlContent } = post

  // Assign glow colors to tags
  const tagGlowColors = ['glow-purple', 'glow-blue', 'glow-cyan', 'glow-pink']

  return (
    <>
      {/* Floating back button */}
      <div className="fixed top-24 left-4 z-50">
        <Link href="/blog">
          <Button className="glass-medium hover-lift hover-glow-purple border border-purple-500/30 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Hero header with gradient */}
      <section className="relative w-full py-20 overflow-hidden border-b border-purple-500/20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 pattern-mesh opacity-30" />

        <Container>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="font-['Orbitron'] font-black text-5xl md:text-6xl mb-6 gradient-text-primary animate-fade-up-blur">
              {frontmatter.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6 animate-fade-up-blur delay-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{frontmatter.author}</span>
              </div>
            </div>

            {/* Tags */}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 animate-fade-up-blur delay-200">
                {frontmatter.tags.map((tag, index) => (
                  <Badge
                    key={tag}
                    className={`glass-medium border border-purple-500/30 hover:${tagGlowColors[index % tagGlowColors.length]} transition-all duration-300`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            <p className="font-['Work_Sans'] text-lg text-muted-foreground leading-relaxed border-l-4 border-purple-500 pl-4 italic animate-fade-up-blur delay-300">
              {frontmatter.excerpt}
            </p>
          </div>
        </Container>
      </section>

      {/* Article content */}
      <Container>
        <article className="py-12 max-w-4xl mx-auto">
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-['Rajdhani'] prose-headings:font-bold prose-headings:gradient-text-primary
              prose-h2:text-4xl prose-h3:text-3xl
              prose-p:font-['Work_Sans'] prose-p:leading-relaxed
              prose-code:font-['Fira_Code'] prose-code:bg-purple-500/10
              prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-cyan-300
              prose-pre:glass-dark prose-pre:glow-purple prose-pre:border prose-pre:border-purple-500/30
              prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:glow-cyan
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:glow-cyan
              prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:pl-4
              prose-blockquote:italic prose-blockquote:text-muted-foreground
              prose-ul:list-disc prose-ol:list-decimal
              prose-strong:text-purple-400 prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </Container>
    </>
  )
}
