// common-components/common-top-page/TopPage.tsx
import Image from "next/image"
import type { CommonTop } from "@/lib/sanity.queries"

interface Props {
  data: CommonTop | null
}

export default function CommonTopPage({ data }: Props) {
  if (!data) return null

  const { title, subtitle, backgroundImage } = data

  return (
    <div className="relative w-full overflow-hidden bg-brand-bg">

      {/* ── Image ─────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[90vh] min-h-120">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="w-full h-full bg-brand-blue" />
        )}

        {/* Gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/30 to-transparent" />

        {/* ── Decorative corners — top-left ──────────────────────────── */}
        <span className="absolute top-0 left-0 h-16 w-16 bg-brand-gold z-20" />
        <span className="absolute top-16 left-0 h-8 w-8 bg-brand-azure z-20" />
        <span className="absolute top-0 left-16 h-8 w-8 bg-brand-azure z-20" />

        {/* top-right */}
        <span className="absolute top-0 right-0 h-16 w-16 bg-brand-azure z-20" />
        <span className="absolute top-16 right-0 h-8 w-8 bg-brand-gold z-20" />
        <span className="absolute top-0 right-16 h-8 w-8 bg-brand-gold z-20" />

        {/* bottom-left */}
        <span className="absolute bottom-0 left-0 h-12 w-12 bg-brand-azure z-20" />

        {/* bottom-right */}
        <span className="absolute bottom-0 right-0 h-12 w-12 bg-brand-gold z-20" />

        {/* ── Text — bottom right like CoursesHero ──────────────────── */}
        <div className="absolute bottom-20 right-0 z-30 px-8 md:px-20 pb-12 md:pb-16">
          <div className="max-w-4xl">
            {title && (
              <h1 className="block bg-brand-bg text-brand-blue font-black text-3xl md:text-5xl lg:text-6xl px-5 py-3 leading-tight mb-3 w-fit">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="block bg-brand-bg/90 text-brand-blue/70 font-medium text-base md:text-lg px-5 py-2 w-fit">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}