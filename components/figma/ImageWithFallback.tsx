import React, { useState } from 'react'
import Image from 'next/image';
import type { ImageProps } from 'next/image';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  alt: string;
}

export function ImageWithFallback({ src, alt, className, style, width, height, fill, ...props }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const imgSrc = src || undefined

  // If no src or error occurred, show fallback
  if (!imgSrc || didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ERROR_IMG_SRC}
            alt={alt || "Error loading image"}
            className={className}
            style={style}
            data-original-url={src || undefined}
            width={width as number}
            height={height as number}
          />
        </div>
      </div>
    )
  }

  // Use fill if provided, otherwise use width/height or defaults
  if (fill) {
    return (
      <div className="relative" style={style}>
        <Image
          key={imgSrc}
          src={imgSrc}
          alt={alt}
          className={className}
          fill
          {...props}
          onError={() => setDidError(true)}
        />
      </div>
    )
  }

  return (
    <Image
      key={imgSrc}
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      width={width || 1000}
      height={height || 800}
      {...props}
      onError={() => setDidError(true)}
    />
  )
}
