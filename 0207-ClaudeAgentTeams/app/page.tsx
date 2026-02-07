import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { BlogCard } from '@/components/BlogCard'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Developer Blog - Latest Posts on Web Development',
  description: 'Explore the latest articles on Next.js, TypeScript, React, and modern web development. Learn from in-depth tutorials and best practices.',
  openGraph: {
    title: 'Developer Blog - Latest Posts on Web Development',
    description: 'Explore the latest articles on Next.js, TypeScript, React, and modern web development.',
    type: 'website',
    url: 'https://yourdomain.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Blog - Latest Posts on Web Development',
    description: 'Explore the latest articles on Next.js, TypeScript, React, and modern web development.',
  },
}

export default function Home() {
  const allPosts = getAllPosts()
  const latestPosts = allPosts.slice(0, 6) // Show 6 most recent posts

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pattern-mesh animate-gradient-shift" />
        <div className="absolute inset-0 pattern-grid opacity-30" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-cyan-500/10 blur-3xl animate-float delay-300" />

        {/* Main content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="font-['Orbitron'] font-black text-7xl md:text-8xl mb-6 gradient-text-primary animate-glitch-in">
            Developer Blog
          </h1>

          <p className="font-['Work_Sans'] text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up-blur delay-300">
            최첨단 웹 개발 기술과 대담한 인사이트를 탐험하세요
          </p>

          <div className="animate-fade-up-blur delay-600">
            <Link href="#posts">
              <Button className="glass-medium hover-glow-purple text-lg px-8 py-6 rounded-2xl border border-purple-500/30">
                아티클 둘러보기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <Container>
        <section id="posts" className="py-20">
          {latestPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Asymmetric Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {latestPosts.map((post, index) => (
                  <div
                    key={post.slug}
                    className={cn(
                      "animate-fade-up-blur",
                      index === 0 && "delay-100",
                      index === 1 && "delay-200",
                      index === 2 && "delay-300",
                      index === 3 && "delay-400",
                      index === 4 && "delay-500",
                      index === 5 && "delay-600",
                      index === 0 && "lg:col-span-2 lg:row-span-2",
                      index === 3 && "lg:col-span-2"
                    )}
                  >
                    <BlogCard
                      title={post.frontmatter.title}
                      description={post.frontmatter.excerpt}
                      date={post.frontmatter.date}
                      slug={post.slug}
                      tags={post.frontmatter.tags}
                      featured={index === 0}
                    />
                  </div>
                ))}
              </div>

              {allPosts.length > 6 && (
                <div className="text-center">
                  <Link href="/blog">
                    <Button size="lg" className="gap-2 glass-medium hover-glow-cyan border border-cyan-500/30">
                      View All Posts
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </Container>
    </>
  )
}
