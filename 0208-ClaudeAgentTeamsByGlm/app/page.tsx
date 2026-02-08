import Link from 'next/link'
import { ArrowRight, Cpu, Terminal, Zap, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAllPosts } from '@/lib/posts'

export default async function HomePage() {
  const featuredPosts = await getAllPosts({ limit: 3 })

  return (
    <main className="flex-1">
      {/* Hero Section - Asymmetrical Layout */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left side - Main content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Terminal-style prefix */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/30 bg-primary/5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-mono text-primary">SYSTEM.ONLINE</span>
              </div>

              {/* Main heading with glitch effect */}
              <div className="space-y-4">
                <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-bold leading-none">
                  <span className="block glitch-hover">DEV.LOG</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent neon-glow">
                    // JOURNAL
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl font-light">
                  Exploring the frontiers of <span className="text-primary font-normal">web development</span>,
                  <span className="text-secondary font-normal"> design</span>, and
                  <span className="text-accent font-normal"> emerging technology</span>.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary/20 border border-primary/50 text-primary-foreground hover:bg-primary/30 hover:scale-105 transition-all duration-300 box-glow animate-pulse-glow"
                >
                  <Link href="/blog" className="font-heading">
                    &gt; EXPLORE_LOGS <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border/50 hover:border-secondary/50 hover:bg-secondary/5 hover:scale-105 transition-all duration-300 font-heading"
                >
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [GITHUB_REPO]
                  </a>
                </Button>
              </div>
            </div>

            {/* Right side - Decorative terminal/code block */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="p-6 font-mono text-sm">
                    <div className="space-y-2">
                      <div className="text-muted-foreground">// System Status</div>
                      <div className="text-primary">const blog = {'{'}</div>
                      <div className="pl-4 text-accent">status: <span className="text-foreground">&apos;ONLINE&apos;</span>,</div>
                      <div className="pl-4 text-secondary">posts: <span className="text-foreground">{featuredPosts.length}</span>,</div>
                      <div className="pl-4">stack: [</div>
                      <div className="pl-8 text-primary">&apos;Next.js 16&apos;,</div>
                      <div className="pl-8 text-secondary">&apos;React 19&apos;,</div>
                      <div className="pl-8 text-accent">&apos;TypeScript&apos;</div>
                      <div className="pl-4">],</div>
                      <div className="pl-4">theme: <span className="text-foreground">&apos;cyber-tech&apos;</span></div>
                      <div>{'}'};</div>
                      <div className="mt-4 text-muted-foreground animate-pulse">_await blog.init();</div>
                    </div>
                  </CardContent>
                </Card>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border border-primary/30 rounded-sm" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-secondary/30 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Tech Section */}
      <section className="border-y border-border/20 bg-muted/10 backdrop-blur">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Terminal, label: 'NEXT.JS 16', color: 'text-primary' },
              { icon: Zap, label: 'REACT 19', color: 'text-secondary' },
              { icon: Database, label: 'TYPE', color: 'text-accent' },
              { icon: Cpu, label: 'TAILWIND', color: 'text-primary' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-3 group">
                <item.icon className={`h-8 w-8 ${item.color} group-hover:scale-110 group-hover:neon-glow transition-all duration-300`} />
                <span className="font-heading text-xs tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-24">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-primary text-sm">{'<featured>'}</span>
              <h2 className="font-heading text-4xl font-bold">LATEST_LOGS</h2>
            </div>
            <p className="text-muted-foreground font-light">
              Recent entries from the development journal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full border-border/50 bg-card/30 backdrop-blur hover:border-primary/50 hover:bg-card/50 transition-all duration-300 hover:scale-[1.02] hover:box-glow overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-mono text-xs text-primary">0{index + 1}</span>
                      <span className="text-xs text-muted-foreground">|</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {post.date?.split('-')[0] || '2025'}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-mono group-hover:translate-x-2 transition-transform">
                      <span>READ_LOG</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-300 font-heading"
            >
              <Link href="/blog">
                VIEW_ALL_LOGS &gt;&gt;&gt;
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border/20">
        <div className="container mx-auto px-4 py-24">
          <Card className="border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-secondary/10 box-glow overflow-hidden relative">
            {/* Animated border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 animate-pulse" />

            <CardContent className="relative p-12 text-center">
              <div className="font-mono text-primary text-sm mb-4">&lt;system_message&gt;</div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
                READY TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">DIVE IN</span>?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Explore the logs. Learn from the experiments. Build the future.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 font-heading"
              >
                <Link href="/blog">
                  &gt; START_EXPLORING <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
