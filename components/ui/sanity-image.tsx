import { urlFor } from "@/lib/sanity.client"
import NextImage from "next/image"

interface SanityImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset: any
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  sizes?: string
  quality?: number
}

export function SanityImage({
  asset,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  style,
  sizes,
  quality = 85,
}: SanityImageProps) {
  const hotspotX = asset?.hotspot?.x
  const hotspotY = asset?.hotspot?.y
  const objectPosition =
    hotspotX != null && hotspotY != null
      ? `${hotspotX * 100}% ${hotspotY * 100}%`
      : "center"

  const src = fill
    ? urlFor(asset).auto("format").quality(quality).url()
    : urlFor(asset).width(width ?? 800).height(height ?? 600).fit("crop").auto("format").quality(quality).url()

  const blurSrc = urlFor(asset).width(20).quality(20).url()

  if (fill) {
    return (
      <NextImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized
        placeholder="blur"
        blurDataURL={blurSrc}
        className={className}
        style={{ objectPosition, ...style }}
        sizes={sizes ?? "100vw"}
      />
    )
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      unoptimized
      placeholder="blur"
      blurDataURL={blurSrc}
      className={className}
      style={style}
      sizes={sizes}
    />
  )
}