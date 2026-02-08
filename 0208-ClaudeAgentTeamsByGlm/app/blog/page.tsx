import Link from 'next/link'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { BlogPostCard } from '@/components/blog/blog-post-card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export const metadata = {
  title: 'Blog - Developer Blog',
  description: 'Explore our latest articles, tutorials, and insights on web development',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string; search?: string }
}) {
  const posts = await getAllPosts({
    tag: searchParams.tag,
  })

  const tags = await getAllTags()

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Explore our latest articles, tutorials, and insights on web development
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_250px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-10"
                name="search"
              />
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchParams.tag
                    ? `No posts found with tag "${searchParams.tag}"`
                    : searchParams.search
                    ? `No posts found matching "${searchParams.search}"`
                    : 'No posts yet. Check back soon!'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="/blog">
                    <Badge
                      variant={!searchParams.tag ? 'default' : 'outline'}
                      className="cursor-pointer hover:outline"
                    >
                      All
                    </Badge>
                  </Link>
                  {tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <Badge
                        variant={searchParams.tag === tag ? 'default' : 'outline'}
                        className="cursor-pointer hover:outline"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* About Card */}
            <div className="space-y-3">
              <h3 className="font-semibold">About</h3>
              <div className="text-sm text-muted-foreground">
                <p>
                  This is a modern developer blog built with Next.js, TypeScript, and Tailwind CSS.
                  Here we share tutorials, insights, and best practices for web development.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
