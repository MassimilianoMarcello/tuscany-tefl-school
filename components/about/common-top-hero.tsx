// components/about/common-top-hero.tsx
// ✅ Riutilizzabile per tutte le pagine con hero immagine + titolo sovrapposto
import Image from "next/image"

interface CommonTopHeroProps {
  data: {
    title?: string
    subtitle?: string
    backgroundImage?: string
  } | null
}

export function CommonTopHero({ data }: CommonTopHeroProps) {
  if (!data) return <div className="h-48 bg-brand-blue" />

  return (
    <div className="relative w-full overflow-hidden">
      {/* Decorative squares */}
      <span className="absolute left-12 top-12 h-20 w-20 bg-brand-azure z-10 hidden md:block" />
      <span className="absolute right-0 top-0 h-40 w-20 bg-brand-gold z-10" />

      {/* Background image */}
      {data.backgroundImage ? (
        <Image
          src={data.backgroundImage}
          alt={data.title ?? ""}
          width={1400}
          height={500}
          className="w-full h-64 md:h-96 object-cover"
          priority
        />
      ) : (
        <div className="w-full h-64 md:h-96 bg-brand-blue" />
      )}

      {/* Testo sovrapposto */}
      <div className="absolute left-8 md:left-20 top-1/2 -translate-y-1/2 z-20 bg-brand-bg p-6 md:p-10 max-w-sm md:max-w-lg">
        {data.title && (
          <h1 className="text-3xl md:text-5xl font-black text-brand-blue capitalize leading-tight">
            {data.title}
          </h1>
        )}
        {data.subtitle && (
          <p className="mt-3 text-brand-blue/60 font-medium text-lg">{data.subtitle}</p>
        )}
      </div>
    </div>
  )
}