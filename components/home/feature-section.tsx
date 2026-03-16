// components/home/feature-section.tsx
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import type { HomePage } from "@/lib/sanity.queries"
import { Button } from "@/components/ui/button"
import { SanityImage } from "@/components/ui/sanity-image"

interface FeatureSectionProps {
  data: HomePage
  locale: string
}

export function FeatureSection({ data, locale }: FeatureSectionProps) {
  const feature = data.components?.[0]
  if (!feature) return null

  return (
    <section className="w-full  grid grid-cols-1 lg:grid-cols-2 min-h-150 ">

      {/* ── Colonna immagine (sinistra) ───────────────────────── */}
     <div className="relative h-72  lg:h-auto overflow-hidden bg-brand-blue ">
        {feature.image ? (
          <SanityImage
            asset={feature.image}
            alt={feature.title ?? "Feature"}
            fill
            className="object-cover py-20 object-[-25%_center] lg:object-[-11%_center]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-brand-azure/20" />
        )}
      </div>

      {/* ── Colonna testo (destra) ────────────────────────────── */}
<div className="relative flex flex-col justify-center bg-brand-blue px-10 md:px-16 lg:px-20 py-24 lg:py-40">

        {/* Accento verticale gold — speculare all'Hero */}
        <span
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-1.5 bg-brand-gold"
        />

        {/* Eyebrow */}
        <p className="text-brand-azure uppercase tracking-[0.25em] text-xs font-bold mb-5">
          Our Approach
        </p>

        {/* Titolo */}
        <h2 className="font-serif-display text-4xl md:text-5xl xl:text-6xl text-white leading-[1.1] mb-6">
          {feature.title}
        </h2>

        {/* Separatore gold */}
        <div
          aria-hidden="true"
          className="w-16 h-[3px] bg-brand-gold mb-8"
        />

        {/* Body text */}
        {feature.text && (
          <div className="text-base md:text-lg text-white/70 font-light leading-relaxed mb-10 max-w-md [&_p]:mb-3">
            {Array.isArray(feature.text) ? (
              <PortableText value={feature.text as PortableTextBlock[]} />
            ) : (
              <p>{feature.text as string}</p>
            )}
          </div>
        )}

        {/* CTA */}
        <div>
          <Button
            asChild
            className="bg-transparent border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-blue uppercase tracking-widest text-xs font-bold px-8 py-5 rounded-none transition-colors duration-200"
          >
            <Link href={`/${locale}/contact`}>Book a Call</Link>
          </Button>
        </div>
      </div>

    </section>
  )
}