// components/home/feature-section.tsx
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { urlFor } from "@/lib/sanity.client"
import type { HomePage } from "@/lib/sanity.queries"
import { Button } from "@/components/ui/button"

interface FeatureSectionProps {
  data: HomePage
  locale: string
}

export function FeatureSection({ data, locale }: FeatureSectionProps) {
  const feature = data.components?.[0]
  if (!feature) return null

  return (
    <section className="relative w-full grid grid-cols-8 grid-rows-4 overflow-hidden bg-white">
      <span className="col-span-2 row-span-3 bg-brand-azure z-10 hidden lg:block" />
      <span className="col-start-7 col-span-2 row-span-1 bg-brand-gold z-10" />
      <span className="col-start-7 col-span-2 row-span-3 bg-brand-azure z-10 hidden lg:block" />

      {feature.image && (
        <div className="absolute inset-0 z-20">
          <Image
            src={urlFor(feature.image).width(1440).height(900).url()}
            alt={feature.title ?? "Feature"}
            width={1440}
            height={900}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      <div className="absolute top-8 right-4 md:right-16 z-30 max-w-sm md:max-w-lg">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-blue bg-brand-bg px-4 py-3 leading-tight">
          {feature.title}
        </h2>
      </div>

      <div className="absolute bottom-16 left-4 md:left-16 z-30 max-w-sm md:max-w-lg border-b-[1rem] border-brand-gold pb-8">
        <div className="text-base md:text-lg text-brand-blue bg-brand-bg px-4 py-3 font-light leading-relaxed">
          {Array.isArray(feature.text) ? (
            <PortableText value={feature.text as PortableTextBlock[]} />
          ) : (
            <p>{feature.text as string}</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 md:left-8 z-30">
        <Button
          asChild
          className="bg-white border-4 border-brand-azure text-brand-blue hover:bg-brand-azure uppercase font-bold tracking-wide rounded-3xl px-6 py-4"
        >
          <Link href={`/${locale}/contact`}>Book a Call</Link>
        </Button>
      </div>

      <div className="col-span-8 row-span-4 min-h-160 md:min-h-240" />
    </section>
  )
}