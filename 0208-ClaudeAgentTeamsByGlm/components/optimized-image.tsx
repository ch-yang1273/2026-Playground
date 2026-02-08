import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<NextImageProps, 'onLoad' | 'className'> {
  /**
   * Show a skeleton/loading state while image is loading
   */
  withSkeleton?: boolean
  /**
   * Add a blur placeholder while loading
   */
  blurPlaceholder?: boolean
  /**
   * Additional CSS class name
   */
  className?: string
}

/**
 * OptimizedImage - A wrapper around Next.js Image with additional features
 *
 * Features:
 * - Automatic optimization with Next.js Image
 * - Optional skeleton loading state
 * - Optional blur placeholder
 * - Lazy loading by default
 * - Responsive images with proper sizes
 */
export function OptimizedImage({
  withSkeleton = true,
  blurPlaceholder = false,
  className = '',
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className}`}
        style={style}
      >
        <span className="text-sm text-muted-foreground">Image not available</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {withSkeleton && isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <NextImage
        {...props}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={style}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
        placeholder={blurPlaceholder ? 'blur' : undefined}
      />
    </div>
  )
}

/**
 * CoverImage - Optimized image component for blog post covers
 */
interface CoverImageProps {
  src: string
  alt: string
  title?: string
}

export function CoverImage({ src, alt, title }: CoverImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      title={title}
      width={1200}
      height={630}
      className="aspect-video w-full"
      blurPlaceholder
      priority
    />
  )
}

/**
 * AvatarImage - Optimized circular avatar image
 */
interface AvatarImageProps {
  src: string
  alt: string
  size?: number
}

export function AvatarImage({ src, alt, size = 40 }: AvatarImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  )
}
