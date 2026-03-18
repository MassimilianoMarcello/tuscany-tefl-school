import Link from "next/link"
import { SanityImage } from "@/components/ui/sanity-image"
import type { HomePage } from "@/lib/sanity.queries"
import { Button } from "@/components/ui/button"
import { AnimateIn } from "@/components/ui/animate-in"
import { getTranslations } from "next-intl/server"

interface HeroSectionProps {
  data: HomePage
  locale: string
}

export async function HeroSection({ data, locale }: HeroSectionProps) {
  const t = await getTranslations("hero")

  return (
    <div className="pb-20 bg-brand-bg w-full">
      <section
        aria-label="Hero"
        className="relative w-full min-h-svh grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
      >

        {/* ── Colonna testo (sinistra) ─────────────────────────────── */}
        <div className="relative flex flex-col justify-center bg-brand-bg px-10 md:px-16 lg:px-20 py-20 lg:py-32 order-2 lg:order-1 overflow-hidden">
          <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-gold" />

          {/* Vignette radiale navy — angolo top-right */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(26,44,78,0.07) 0%, transparent 70%)",
            }}
          />

          {/* Vignette radiale gold — angolo bottom-left */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 left-8 w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 70%)",
            }}
          />

          <AnimateIn variant="fadeUp" delay={0} duration={500}>
            <p className="text-brand-green uppercase tracking-[0.25em] text-xs font-bold mb-5">
              {t("badge")}
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={100} duration={600}>
            <h1 className="font-serif-display text-5xl md:text-6xl xl:text-7xl text-brand-blue leading-[1.1] mb-6">
              {t("mainTitle")}
            </h1>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={200} duration={400}>
            <div aria-hidden="true" className="w-16 h-0.75 bg-brand-gold mb-8" />
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={300} duration={600}>
            <div className="text-base md:text-lg text-brand-blue/70 font-light leading-relaxed mb-10 max-w-sm [&_p]:mb-2">
              <p>{t("mainText")}</p>
            </div>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={400} duration={600}>
            <div className="flex gap-3 flex-wrap">
              <Button
                asChild
                className="bg-brand-green hover:bg-brand-green-dark text-white uppercase tracking-widest text-xs font-bold px-8 py-5 rounded-none"
              >
                <Link href={`/${locale}/our_courses`}>{t("cta.courses")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-brand-bg uppercase tracking-widest text-xs font-bold px-8 py-5 rounded-none transition-colors duration-200"
              >
                <Link href={`/${locale}/apply`}>{t("cta.apply")}</Link>
              </Button>
            </div>
          </AnimateIn>
        </div>

        {/* ── Colonna immagine (destra) ────────────────────────────── */}
        <AnimateIn
          variant="fadeLeft"
          delay={200}
          duration={800}
          className="relative h-72 lg:h-auto order-1 lg:order-2 overflow-hidden"
        >
          {data.bannerImage ? (
            <>
              <SanityImage
                asset={data.bannerImage}
                alt={t("mainTitle")}
                fill
                priority
                className="object-cover pt-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-20 bg-brand-bg hidden lg:block"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-brand-blue/30 to-transparent"
              />
            </>
          ) : (
            <div className="w-full h-full bg-brand-azure/20 flex items-center justify-center">
              <span className="text-brand-blue/30 font-serif-display text-3xl italic">
                {t("imageFallback")}
              </span>
            </div>
          )}
        </AnimateIn>

        {/* Separatore bottom — solo mobile */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-1.5 bg-brand-blue lg:hidden"
        />
      </section>
    </div>
  )
}
