// components/about/about-us-content.tsx
// ✅ Renderizza le sezioni polimorfiche del documento "page" di tipo aboutUs
import Image from "next/image"
import { PortableText, type PortableTextBlock } from "@portabletext/react"

interface Section {
  _key: string
  order?: number
  title?: string
  subtitle?: string
  text?: string
  image?: { asset: { url: string } }
  content?: PortableTextBlock[] | string
}

interface AboutUsContentProps {
  sections: Section[]
}

export function AboutUsContent({ sections }: AboutUsContentProps) {
  // Ordina per campo order se presente
  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      {/* Grid a 3 colonne come originale — border-bottom brand-blue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b-[1rem] border-brand-blue pb-8 mb-12">
        {sorted.map((section) => {
          const imageUrl = section.image?.asset?.url ?? null

          return (
            <div key={section._key} className="flex flex-col">
              {/* Immagine sezione */}
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={section.title ?? ""}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-brand-azure/30 rounded-t-lg" />
              )}

              {/* Testo */}
              <div className="bg-[rgb(237,243,248)] p-6 flex-1">
                {section.title && (
                  <h2 className="text-lg font-black text-white bg-brand-green px-3 py-2 text-center -mx-6 -mt-6 mb-4">
                    {section.title}
                  </h2>
                )}
                {section.subtitle && (
                  <p className="text-brand-blue font-semibold mb-2">{section.subtitle}</p>
                )}
                {section.text && (
                  <p className="text-brand-blue/80 text-sm leading-relaxed">{section.text}</p>
                )}
                {section.content && (
                  <div className="text-brand-blue/80 text-sm leading-relaxed mt-2">
                    {Array.isArray(section.content) ? (
                      <PortableText value={section.content as PortableTextBlock[]} />
                    ) : (
                      <p>{section.content as string}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}