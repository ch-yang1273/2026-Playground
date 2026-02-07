import { Metadata } from 'next'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { BlogCard } from '@/components/BlogCard'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'All Blog Posts - Developer Blog',
  description: 'Browse all articles on Next.js, TypeScript, React, Node.js, and modern web development. Find tutorials, guides, and best practices.',
  openGraph: {
    title: 'All Blog Posts - Developer Blog',
    description: 'Browse all articles on Next.js, TypeScript, React, Node.js, and modern web development.',
    type: 'website',
    url: 'https://yourdomain.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Blog Posts - Developer Blog',
    description: 'Browse all articles on Next.js, TypeScript, React, Node.js, and modern web development.',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <Container>
      <article className="py-12 md:py-20">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Posts</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore {posts.length} article{posts.length !== 1 ? 's' : ''} on web development, programming, and technology.
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Topics:</span>
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.frontmatter.title}
                description={post.frontmatter.excerpt}
                date={post.frontmatter.date}
                slug={post.slug}
                tags={post.frontmatter.tags}
              />
            ))}
          </div>
        )}
      </article>
    </Container>
  )
}
