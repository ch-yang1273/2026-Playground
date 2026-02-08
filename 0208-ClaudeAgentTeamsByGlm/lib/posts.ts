import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMetadata, BlogSortBy, BlogSortOrder } from '@/types/blog';
import { calculateReadTime } from './markdown';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.(mdx|md)$/, ''));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const altPath = path.join(postsDirectory, `${slug}.md`);

    const filePath = fs.existsSync(fullPath) ? fullPath : altPath;

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'Anonymous',
      authorImage: data.authorImage,
      coverImage: data.coverImage,
      tags: data.tags || [],
      readTime: data.readTime || calculateReadTime(content),
      category: data.category,
      published: data.published !== false,
      content,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts({
  includeUnpublished = false,
  sortBy = 'date',
  sortOrder = 'desc',
  limit,
  tag,
  category,
}: {
  includeUnpublished?: boolean;
  sortBy?: BlogSortBy;
  sortOrder?: BlogSortOrder;
  limit?: number;
  tag?: string;
  category?: string;
} = {}): Promise<BlogPostMetadata[]> {
  const slugs = getAllPostSlugs();
  const posts: BlogPostMetadata[] = [];

  for (const slug of slugs) {
    const post = await getPostBySlug(slug);
    if (post) {
      if (!includeUnpublished && !post.published) {
        continue;
      }

      const metadata: BlogPostMetadata = {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        author: post.author,
        authorImage: post.authorImage,
        coverImage: post.coverImage,
        tags: post.tags,
        readTime: post.readTime,
        category: post.category,
        published: post.published,
      };

      if (tag && !metadata.tags.includes(tag)) {
        continue;
      }

      if (category && metadata.category !== category) {
        continue;
      }

      posts.push(metadata);
    }
  }

  return sortPosts(posts, sortBy, sortOrder).slice(0, limit);
}

function sortPosts(
  posts: BlogPostMetadata[],
  sortBy: BlogSortBy,
  sortOrder: BlogSortOrder
): BlogPostMetadata[] {
  return posts.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'readTime':
        comparison = a.readTime - b.readTime;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

export function getAllTags(): string[] {
  const slugs = getAllPostSlugs();
  const tags = new Set<string>();

  for (const slug of slugs) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const altPath = path.join(postsDirectory, `${slug}.md`);
    const filePath = fs.existsSync(fullPath) ? fullPath : altPath;

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      const postTags = data.tags || [];
      postTags.forEach((tag: string) => tags.add(tag));
    }
  }

  return Array.from(tags).sort();
}

export function getAllCategories(): string[] {
  const slugs = getAllPostSlugs();
  const categories = new Set<string>();

  for (const slug of slugs) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const altPath = path.join(postsDirectory, `${slug}.md`);
    const filePath = fs.existsSync(fullPath) ? fullPath : altPath;

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      if (data.category) {
        categories.add(data.category);
      }
    }
  }

  return Array.from(categories).sort();
}
