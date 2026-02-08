export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorImage?: string;
  coverImage?: string;
  tags: string[];
  readTime: number;
  category?: string;
  published: boolean;
  content: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorImage?: string;
  coverImage?: string;
  tags: string[];
  readTime: number;
  category?: string;
  published: boolean;
}

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  authorImage?: string;
  coverImage?: string;
  tags: string[];
  readTime?: number;
  category?: string;
  published?: boolean;
}

export type BlogSortBy = 'date' | 'title' | 'readTime';
export type BlogSortOrder = 'asc' | 'desc';
