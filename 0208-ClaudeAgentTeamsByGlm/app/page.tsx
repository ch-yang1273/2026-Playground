import Link from 'next/link'
import { ArrowRight, BookOpen, Code2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPosts } from '@/lib/posts'

export default async function HomePage() {
  const featuredPosts = await getAllPosts({ limit: 3 })

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Welcome to the Dev Blog
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A modern developer blog built with Next.js 16, TypeScript, and Tailwind CSS.
            Explore tutorials, insights, and best practices for web development.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/blog">
                Read Blog <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Code2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Modern Stack</CardTitle>
                <CardDescription>
                  Built with the latest technologies including Next.js 16, React 19, and Tailwind CSS v4.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized for performance with server-side rendering and static generation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Developer Focused</CardTitle>
                <CardDescription>
                  Content written by developers, for developers. Practical tutorials and insights.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Posts</h2>
              <p className="text-muted-foreground mt-2">
                Check out the latest articles and tutorials
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link href="/blog">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Card key={post.slug} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="p-0">
                    <Link href={`/blog/${post.slug}`}>
                      Read more <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="ghost">
              <Link href="/blog">
                View all posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border/40">
        <div className="container mx-auto px-4 py-16">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">Ready to dive in?</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Start exploring our blog posts and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/blog">
                  Browse Blog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
