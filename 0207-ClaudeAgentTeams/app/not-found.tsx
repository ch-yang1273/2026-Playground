import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-12">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-4">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            The page might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  )
}
