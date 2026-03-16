// components/home/parallax-section.tsx
"use client"

import Link from "next/link"
import { AnimateIn } from "@/components/ui/animate-in"

interface ParallaxSectionProps {
  locale: string
}

const labels = {
  it: {
    eyebrow: "Firenze · Dal 2006",
    title: "Studia dove\nl'arte incontra\nla lingua.",
    cta: "Candidati ora",
    sub: "Pronto a far parte della tradizione TEFL Tuscany?",
  },
  en: {
    eyebrow: "Florence · Since 2006",
    title: "Study where\nart meets\nlanguage.",
    cta: "Apply Now",
    sub: "Ready to become part of the TEFL Tuscany tradition?",
  },
}

export function ParallaxSection({ locale }: ParallaxSectionProps) {
  const t = locale === "it" ? labels.it : labels.en

  return (
    <section
      className="w-full bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/firenze.webp')" }}
    >
      <div className="relative bg-brand-blue/80 py-28 md:py-40 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">

          <AnimateIn variant="fadeUp" delay={0} duration={500} threshold={0.15}>
            <p className="text-brand-gold uppercase tracking-[0.25em] text-xs font-bold">
              {t.eyebrow}
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={150} duration={700} threshold={0.15}>
            <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] whitespace-pre-line">
              {t.title}
            </h2>
          </AnimateIn>

          <AnimateIn variant="fade" delay={300} duration={400} threshold={0.15}>
            <div aria-hidden="true" className="w-16 h-[3px] bg-brand-gold" />
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={400} duration={600} threshold={0.15}>
            <p className="text-lg md:text-xl text-white/70 font-light max-w-md leading-relaxed">
              {t.sub}
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={550} duration={600} threshold={0.15}>
            <div>
              <Link
                href={`/${locale}/apply`}
                className="inline-flex items-center gap-3 bg-brand-gold text-brand-blue uppercase tracking-widest text-xs font-black px-10 py-5 hover:bg-white transition-colors duration-200"
              >
                {t.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </AnimateIn>

        </div>

        {/* Taglio diagonale — dentro la sezione così vede l'immagine parallax */}
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full h-10 md:h-14 lg:h-20"
        >
          <polygon points="0,72 1440,0 1440,72" fill="var(--color-brand-bg)" />
          <line x1="0" y1="72" x2="1440" y2="0" stroke="var(--color-brand-gold)" strokeWidth="4" />
        </svg>

      </div>
    </section>
  )
}