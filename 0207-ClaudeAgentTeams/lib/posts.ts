import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostFrontmatter, PostWithHTML } from './types';
import { processMarkdown } from './markdown';

const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * Get all post slugs from the content/posts directory
 * @returns Array of post slugs (filenames without .md extension)
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

/**
 * Get post data by slug
 * @param slug - Post slug (filename without extension)
 * @returns Post object with frontmatter and content
 */
export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  };
}

/**
 * Get post with HTML content
 * @param slug - Post slug
 * @returns Post with HTML content
 */
export async function getPostWithHTML(slug: string): Promise<PostWithHTML> {
  const post = getPostBySlug(slug);
  const htmlContent = await processMarkdown(post.content);

  return {
    ...post,
    htmlContent,
  };
}

/**
 * Get all posts sorted by date (newest first)
 * @returns Array of all posts
 */
export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter(post => post.frontmatter.published !== false)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  return posts;
}

/**
 * Get posts by tag
 * @param tag - Tag to filter by
 * @returns Array of posts with the specified tag
 */
export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post =>
    post.frontmatter.tags.includes(tag)
  );
}

/**
 * Get all unique tags from all posts
 * @returns Array of unique tags
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach(post => {
    post.frontmatter.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}
