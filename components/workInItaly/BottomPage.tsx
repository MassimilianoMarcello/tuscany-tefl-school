// common-components/common-bottom-page/BottomPage.tsx
import Image from "next/image"
import { urlFor } from "@/lib/sanity.client"
import { PortableText } from "@portabletext/react"
import type { PageType } from "@/lib/sanity.queries"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Props {
  data: PageType | null
  id: string
}

/**
 * Content page body: main image + alternating image/text sections.
 * Even sections (0,2…): image LEFT | text RIGHT
 * Odd  sections (1,3…): text LEFT  | image RIGHT
 */
export default function CommonBottomPage({ data, id }: Props) {
  if (!data) {
    return (
      <p className="p-8 text-center text-brand-text">
        Caricamento dati in corso…
      </p>
    )
  }

  const { mainTitle, sections, mainImage } = data
  const mainImageUrl = mainImage?.asset?.url
    ? urlFor(mainImage).width(1600).height(1000).url()
    : null

  return (
    <div id={id} className="relative px-4 py-12 bg-[#f9f9f9] md:px-8">
      {/* ── Main title ──────────────────────────────────────────────── */}
      <h1 className="text-4xl font-bold mb-8 text-brand-text">{mainTitle}</h1>

      {/* ── Main image ──────────────────────────────────────────────── */}
      {mainImageUrl && (
        <Image
          src={mainImageUrl}
          alt={mainTitle}
          sizes="100vw"
          width={1600}
          height={500}
          className="w-full h-auto rounded-lg mb-8"
        />
      )}

      {/* ── Apply button ────────────────────────────────────────────── */}
      <div className="flex justify-end mb-8 pr-4 md:pr-16">
        <Button asChild className="bg-brand-gold hover:bg-brand-gold/80 text-brand-blue font-black uppercase tracking-wide text-sm border-2 border-brand-blue rounded-none px-6 py-3"><Link href="/apply">Apply Today</Link></Button>
      </div>

      {/* ── Sections ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-8 mt-8">
        {sections.map((section, index) => {
          const { title, subtitle, text, image, content, _key } = section
          const imageUrl = image?.asset?.url
            ? urlFor(image).width(1600).height(1000).url()
            : null
          const isEven = index % 2 === 0

          return (
            <div
              key={_key}
              className="
                grid grid-cols-1 gap-6
                bg-white rounded-xl p-6
                shadow-[0_4px_16px_rgba(0,0,0,0.10)]
                md:grid-cols-3 md:gap-8
              "
            >
              {/* Image cell */}
              <div
                className={`w-full ${
                  isEven
                    ? "md:col-span-2 md:col-start-1 md:row-start-1"
                    : "md:col-span-2 md:col-start-2 md:row-start-1"
                }`}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={title}
                    sizes="(max-width: 768px) 100vw, 66vw"
                    width={1600}
                    height={1000}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-brand-azure/30 rounded-lg" />
                )}
              </div>

              {/* Text cell */}
              <div
                className={`flex flex-col justify-center p-4 ${
                  isEven
                    ? "md:col-start-3 md:row-start-1"
                    : "md:col-start-1 md:row-start-1"
                }`}
              >
                <h2 className="text-2xl font-semibold mb-3 text-brand-text">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-lg font-medium mb-3 text-brand-azure">
                    {subtitle}
                  </p>
                )}
                {text && (
                  <p className="text-base text-[#333] leading-relaxed mb-4">
                    {text}
                  </p>
                )}
                {content && content.length > 0 && (
                  <div className="prose prose-sm max-w-none mt-4 text-brand-text">
                    <PortableText value={content} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Enroll button ────────────────────────────────────────────── */}
      <div className="flex justify-center mt-12">
        <Button asChild className="bg-brand-green hover:bg-brand-green-dark text-white font-black uppercase tracking-wide text-sm rounded-none px-8 py-3"><Link href="/apply">Enroll Now</Link></Button>
      </div>
    </div>
  )
}