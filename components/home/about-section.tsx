// components/home/about-section.tsx
import Image from "next/image"
import Link from "next/link"

interface AboutSectionProps {
  locale: string
}

export function AboutSection({ locale }: AboutSectionProps) {
  return (
    <div style={{ paddingTop: "6rem", paddingBottom: "6rem" }} className="bg-brand-bg w-full">
    <section className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

      {/* ── Colonna immagine (sinistra) ───────────────────────── */}
      <div className="relative h-72 lg:h-auto overflow-hidden order-1">
        <Image
          src="/assets/tuscany.jpg"
          alt="Tuscany countryside"
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Overlay leggero per profondità */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brand-blue/10"
        />
      </div>

      {/* ── Colonna testo (destra) ────────────────────────────── */}
      <div
        className="relative flex flex-col justify-center bg-brand-bg px-10 md:px-16 lg:px-20 order-2"
        style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
      >
        {/* Brand mark */}
        <p className="text-brand-green uppercase tracking-[0.25em] text-xs font-bold mb-5">
          Since 2006 · Florence, Italy
        </p>

        {/* Titolo brand */}
        <h2 className="font-serif-display text-4xl md:text-5xl xl:text-6xl text-brand-blue leading-[1.1] mb-6">
          TEFL Tuscany
        </h2>

        {/* Separatore gold */}
        <div
          aria-hidden="true"
          className="w-16 h-0.5 bg-brand-gold mb-8"
        />

        {/* Slogan */}
        <p className="text-xl md:text-2xl font-serif-display italic text-brand-azure mb-8 leading-snug">
          Unlocking Language,<br />Connecting Cultures.
        </p>

        {/* About text */}
        <p className="text-base md:text-lg text-brand-blue/70 font-light leading-relaxed mb-10 max-w-md">
          TEFL Tuscany has been offering top-notch TEFL certification programs
          since 2006, quickly growing into a well-respected language and culture
          center in the heart of Florence.
        </p>

        {/* Link */}
        <Link
          href={`/${locale}/about_us`}
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-blue border-b-2 border-brand-green pb-1 hover:text-brand-green transition-colors w-fit"
        >
          What sets us apart
          <span aria-hidden="true">→</span>
        </Link>
      </div>

    </section>
    </div>
  )
}