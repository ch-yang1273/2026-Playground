// MDX utilities for Next.js 16
// Next.js 16 uses @next/mdx for processing MDX files at build time
// This file provides helper utilities for markdown processing

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function extractExcerpt(content: string, maxLength = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/^#+\s+/gm, '') // Headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
    .replace(/\n+/g, ' ') // Newlines to spaces
    .trim();

  return plainText.length > maxLength
    ? plainText.slice(0, maxLength).trim() + '...'
    : plainText;
}
