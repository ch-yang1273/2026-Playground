import Link from 'next/link'
import { Calendar, Clock, Tag, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BlogPostMetadata } from '@/types/blog'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface BlogPostCardProps {
  post: BlogPostMetadata
  variant?: 'default' | 'compact' | 'featured'
}

export function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.date), { addSuffix: true })

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group">
        <article className="flex flex-col gap-3 p-4 rounded-lg border border-border/40 bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">
                  {post.description}
                </p>
              )}
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
            <time dateTime={post.date} className="flex items-center gap-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{formattedDate}</span>
              <span className="xs:hidden">{new Date(post.date).toLocaleDateString()}</span>
            </time>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{post.readTime}m</span>
              </span>
            )}
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/40 hover:border-border group">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <CardHeader className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <time dateTime={post.date} className="hidden sm:inline">{formattedDate}</time>
            <time dateTime={post.date} className="sm:hidden">{new Date(post.date).toLocaleDateString()}</time>
            {post.readTime && (
              <>
                <span className="mx-1">•</span>
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{post.readTime}m</span>
              </>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-base sm:text-lg lg:text-xl">{post.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm sm:text-base">{post.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {post.coverImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs">
                  <Tag className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
        {(post.author || variant === 'featured') && (
          <CardFooter className="flex items-center justify-between">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.authorImage && (
                  <img
                    src={post.authorImage}
                    alt={post.author}
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                  />
                )}
                <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="hidden xs:inline">{post.author}</span>
                </span>
              </div>
            )}
            {variant === 'featured' && (
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            )}
          </CardFooter>
        )}
      </Link>
    </Card>
  )
}
