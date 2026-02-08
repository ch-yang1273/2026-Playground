import { Terminal } from 'lucide-react'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { BlogClient } from '@/components/blog/blog-client'

export const metadata = {
  title: 'LOGS // DEV.LOG',
  description: 'Development logs, tutorials, and technical insights',
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const tags = await getAllTags()

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-primary text-sm">{'<logs>'}</span>
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            DEV_LOGS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Exploring the frontiers of web development, one log entry at a time.
          </p>
        </div>

        <BlogClient posts={posts} tags={tags} />
      </div>
    </main>
  )
}
