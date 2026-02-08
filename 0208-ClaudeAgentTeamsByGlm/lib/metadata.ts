import { Metadata } from 'next';
import { BlogPostMetadata } from '@/types/blog';

const siteConfig = {
  name: 'Developer Blog',
  description: 'A modern developer blog built with Next.js and Shadcn/ui',
  url: 'https://yourdomain.com',
  author: 'Your Name',
  images: {
    default: '/images/og-default.jpg',
    twitter: '/images/twitter-default.jpg',
  },
  social: {
    twitter: '@yourhandle',
    github: 'yourgithub',
  },
};

export function getSiteMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.images.default,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.images.twitter],
      creator: siteConfig.social.twitter,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function getBlogPostMetadata(post: BlogPostMetadata): Metadata {
  const title = post.title;
  const description = post.description;
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const image = post.coverImage || siteConfig.images.default;

  return {
    title,
    description,
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function getCategoryMetadata(category: string, count: number): Metadata {
  const title = `${category} Articles`;
  const description = `Browse ${count} articles about ${category}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
    },
  };
}

export function getTagMetadata(tag: string, count: number): Metadata {
  const title = `#${tag} Articles`;
  const description = `Browse ${count} articles tagged with ${tag}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
    },
  };
}
