import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

interface BlogCardProps {
  title: string
  description: string
  date: string
  slug: string
  tags?: string[]
  readTime?: string
  featured?: boolean
}

const tagColors = [
  'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20 hover:shadow-[0_0_15px_rgba(167,139,250,0.4)]',
  'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 hover:shadow-[0_0_15px_rgba(96,165,250,0.4)]',
  'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]',
  'bg-pink-500/10 text-pink-400 border-pink-500/30 hover:bg-pink-500/20 hover:shadow-[0_0_15px_rgba(244,114,182,0.4)]',
]

export function BlogCard({ title, description, date, slug, tags = [], readTime, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="block h-full group">
      <Card className="relative h-full glass-medium border-purple-500/30 hover-lift hover-glow-purple overflow-hidden transition-all duration-400">
        {/* Gradient overlay that appears on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />

        <CardHeader className="relative z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</time>
            {readTime && <span>• {readTime}</span>}
          </div>
          <CardTitle className={`line-clamp-2 transition-all duration-300 group-hover:gradient-text-primary ${featured ? 'text-3xl' : 'text-xl'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
            {title}
          </CardTitle>
          <CardDescription className={`line-clamp-3 ${featured ? 'text-base' : 'text-sm'}`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`transition-all duration-300 ${tagColors[index % tagColors.length]}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="relative z-10">
          <span className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Read more →
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
