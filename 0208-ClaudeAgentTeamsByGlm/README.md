# Developer Blog

A modern developer blog built with Next.js 16, TypeScript, Tailwind CSS v4, and Shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Content**: MDX with frontmatter
- **Theme**: next-themes for dark/light mode
- **Icons**: lucide-react

## Features

- ✅ Modern, responsive design
- ✅ Dark/light mode toggle
- ✅ Syntax highlighting for code blocks
- ✅ SEO optimized (sitemap, robots.txt, Open Graph)
- ✅ Static generation for optimal performance
- ✅ Mobile-first responsive design
- ✅ Touch-friendly interactions
- ✅ Error boundaries and loading states
- ✅ Performance monitoring

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── blog/              # Blog pages
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── blog/              # Blog-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Shadcn UI components
├── content/posts/         # Blog posts (MDX)
├── lib/                   # Utility functions
└── types/                 # TypeScript types
```

## Adding Blog Posts

1. Create a new `.mdx` file in `content/posts/`
2. Add frontmatter:

```yaml
---
title: Your Post Title
description: A brief description
date: 2025-01-01
author: Your Name
tags: ["tag1", "tag2"]
category: Technology
published: true
---
```

3. Write your content in MDX format

## Team Development

This project was built using Claude Agent Teams with parallel development streams:

- **content-dev**: Content system, blog posts, SEO
- **ui-dev**: UI components, responsive design
- **frontend-dev**: Page layouts, routing
- **dx-dev**: Markdown rendering, performance optimization

## License

MIT
