'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Terminal, FileCode } from 'lucide-react'
import type { BlogPostMetadata } from '@/types/blog'

interface BlogClientProps {
  posts: BlogPostMetadata[]
  tags: string[]
}

export function BlogClient({ posts, tags }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTag = !selectedTag || post.tags.includes(selectedTag)

      return matchesSearch && matchesTag
    })
  }, [posts, searchQuery, selectedTag])

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
      {/* Main Content */}
      <div className="space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="search_logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-mono text-sm border-border/50 bg-card/30 backdrop-blur focus:border-primary/50"
          />
        </div>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <Card className="border-border/30 bg-card/20 backdrop-blur hover:border-primary/50 hover:bg-card/40 transition-all duration-300 hover:box-glow overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Entry Number */}
                      <div className="font-mono text-primary text-lg font-bold shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-mono">{post.date?.split('-')[0] || '2025'}</span>
                          {post.category && (
                            <>
                              <span>|</span>
                              <span className="font-mono text-secondary">{post.category.toUpperCase()}</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-heading text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.description}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="font-mono text-xs border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-primary text-sm font-mono group-hover:translate-x-2 transition-transform">
                          <span>READ_ENTRY</span>
                          <FileCode className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-border/30 bg-card/20 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Terminal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-mono text-muted-foreground mb-2">
                &lt;no_results_found /&gt;
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedTag
                  ? `No logs found with tag "${selectedTag}"`
                  : searchQuery
                  ? `No logs found matching "${searchQuery}"`
                  : 'No logs yet. Check back soon!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <aside className="space-y-8">
        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary text-sm"># TAGS</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedTag ? 'default' : 'outline'}
                onClick={() => setSelectedTag(null)}
                className={`cursor-pointer font-mono text-xs ${
                  !selectedTag
                    ? 'bg-primary/20 border-primary/50 text-primary-foreground hover:bg-primary/30'
                    : 'border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors'
                }`}
              >
                [ALL]
              </Badge>
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`cursor-pointer font-mono text-xs ${
                    selectedTag === tag
                      ? 'bg-primary/20 border-primary/50 text-primary-foreground hover:bg-primary/30'
                      : 'border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors'
                  }`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* System Info Card */}
        <Card className="border-border/30 bg-card/20 backdrop-blur">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-primary">SYSTEM.INFO</span>
            </div>
            <div className="font-mono text-xs text-muted-foreground space-y-1">
              <div>{posts.length} logs available</div>
              <div>{tags.length} tags indexed</div>
              <div className="text-accent">status: ONLINE</div>
            </div>
          </CardContent>
        </Card>

        {/* About Card */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary text-sm">&lt;about/&gt;</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>
          <div className="text-sm text-muted-foreground font-light">
            <p className="mb-2">
              A digital journal documenting experiments in web development, design systems, and emerging technologies.
            </p>
            <p className="font-mono text-xs text-primary">
              Built with Next.js 16 + React 19 + TypeScript
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
