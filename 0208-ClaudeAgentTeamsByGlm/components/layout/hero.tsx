import { Button } from '@/components/ui/button'
import { ArrowRight, Github } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeroProps {
  title?: string
  description?: string
  showCta?: boolean
  className?: string
}

export function Hero({
  title = 'Welcome to the Dev Blog',
  description = 'A modern developer blog built with Next.js 16, TypeScript, and Tailwind CSS. Explore tutorials, insights, and best practices for web development.',
  showCta = true,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        'bg-gradient-to-b from-background to-muted/20',
        className
      )}
    >
      {/* Animated background pattern */}
      <div
        className={cn(
          'absolute inset-0 -z-10',
          'opacity-[0.03]',
          'dark:opacity-[0.05]'
        )}
      >
        <div
          className={cn(
            'absolute inset-0',
            'bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_50%)]',
            'dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]'
          )}
        />
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2',
              'rounded-full border border-border/40 bg-background/50 px-4 py-1.5',
              'text-sm text-muted-foreground backdrop-blur-sm',
              'mb-8 animate-fade-in'
            )}
          >
            <span
              className={cn(
                'relative flex h-2 w-2',
                'before:absolute before:inline-block before:h-full before:w-full before:animate-ping before:rounded-full before:bg-green-400',
                'before:opacity-75'
              )}
            >
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Now with Next.js 16 and React 19
          </div>

          {/* Title */}
          <h1
            className={cn(
              'text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl',
              'bg-clip-text text-transparent',
              'bg-gradient-to-r from-foreground to-foreground/70',
              'animate-fade-in-up'
            )}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className={cn(
              'mt-6 text-lg leading-8 text-muted-foreground',
              'sm:text-xl',
              'max-w-2xl mx-auto',
              'animate-fade-in-up',
              'animation-delay-200'
            )}
          >
            {description}
          </p>

          {/* CTA Buttons */}
          {showCta && (
            <div
              className={cn(
                'mt-10 flex flex-col sm:flex-row items-center justify-center gap-4',
                'animate-fade-in-up',
                'animation-delay-400'
              )}
            >
              <Button asChild size="lg" className="w-full sm:w-auto min-w-[160px]">
                <Link href="/blog">
                  Read Blog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[160px]"
              >
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          )}

          {/* Social Proof */}
          <div
            className={cn(
              'mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground',
              'animate-fade-in',
              'animation-delay-600'
            )}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 border-background',
                      'bg-gradient-to-br',
                      i === 0 && 'from-blue-400 to-blue-600',
                      i === 1 && 'from-green-400 to-green-600',
                      i === 2 && 'from-purple-400 to-purple-600',
                      i === 3 && 'from-pink-400 to-pink-600',
                      i === 4 && 'from-yellow-400 to-yellow-600'
                    )}
                  />
                ))}
              </div>
              <span>Joined by 1000+ developers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
