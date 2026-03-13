// components/home/hero-section.tsx
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { urlFor } from "@/lib/sanity.client"
import type { HomePage } from "@/lib/sanity.queries"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  data: HomePage
  locale: string
}

export function HeroSection({ data, locale }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <span className="absolute top-24 left-0 h-32 w-32 bg-brand-azure z-10 hidden md:block" />
      <span className="absolute bottom-16 right-0 h-20 w-40 bg-brand-gold z-10" />
      <div className="relative">
        <div className="absolute top-0 left-0 z-20 p-6 md:p-12 max-w-xl lg:max-w-2xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-blue bg-brand-bg px-4 py-3 leading-tight">
            {data.mainTitle}
          </h1>
          {data.mainText && (
            <div className="mt-6 text-base md:text-2xl font-light text-brand-blue bg-brand-bg px-4 py-3 leading-relaxed max-w-lg">
              {Array.isArray(data.mainText) ? (
                <PortableText value={data.mainText as PortableTextBlock[]} />
              ) : (
                <p>{data.mainText as string}</p>
              )}
            </div>
          )}
          <div className="mt-8 flex gap-3 flex-wrap">
            <Button
              asChild
              className="bg-brand-green hover:bg-brand-green-dark text-white uppercase font-bold tracking-wide"
            >
              <Link href={`/${locale}/our_courses`}>Explore Courses</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-brand-gold text-brand-blue hover:bg-brand-gold uppercase font-bold tracking-wide"
            >
              <Link href={`/${locale}/apply`}>Apply Now</Link>
            </Button>
          </div>
        </div>
        {data.bannerImage && (
          <Image
            src={urlFor(data.bannerImage).width(1440).height(800).url()}
            alt={data.mainTitle ?? "Banner"}
            width={1440}
            height={800}
            priority
            placeholder="blur"
            blurDataURL={urlFor(data.bannerImage).width(50).height(30).url()}
            className="w-full h-auto object-cover"
            sizes="100vw"
          />
        )}
      </div>
      <div className="h-4 w-full bg-brand-blue" />
    </section>
  )
}