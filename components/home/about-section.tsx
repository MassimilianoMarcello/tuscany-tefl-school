import Image from "next/image"
import Link from "next/link"
import { AnimateIn } from "@/components/ui/animate-in"
import { getTranslations } from "next-intl/server"

interface AboutSectionProps {
  locale: string
}

export async function AboutSection({ locale }: AboutSectionProps) {
  const t = await getTranslations("aboutSection")

  return (
    <div style={{ paddingTop: "6rem", paddingBottom: "6rem" }} className="bg-brand-bg w-full">
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-150">

        {/* ── Colonna immagine (sinistra) ───────────────────────── */}
        <AnimateIn
          variant="fadeRight"
          delay={0}
          duration={800}
          threshold={0.1}
          className="relative h-72 lg:h-auto overflow-hidden order-1"
        >
          <Image
            src="/assets/tuscany.jpg"
            alt={t("title")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-brand-blue/10" />
        </AnimateIn>

        {/* ── Colonna testo (destra) ────────────────────────────── */}
        <div
          className="relative flex flex-col justify-center bg-brand-bg px-10 md:px-16 lg:px-20 order-2 overflow-hidden"
          style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
        >
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

          <AnimateIn variant="fadeUp" delay={100} duration={500} threshold={0.1}>
            <p className="text-brand-green uppercase tracking-[0.25em] text-xs font-bold mb-5">
              {t("eyebrow")}
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={200} duration={600} threshold={0.1}>
            <h2 className="font-serif-display text-4xl md:text-5xl xl:text-6xl text-brand-blue leading-[1.1] mb-6">
              {t("title")}
            </h2>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={300} duration={400} threshold={0.1}>
            <div aria-hidden="true" className="w-16 h-0.5 bg-brand-gold mb-8" />
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={400} duration={600} threshold={0.1}>
           <p className="text-xl md:text-2xl font-serif-display italic text-brand-azure-dark mb-8 leading-snug">
              {t("tagline").split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={500} duration={600} threshold={0.1}>
            <p className="text-base md:text-lg text-brand-blue/70 font-light leading-relaxed mb-10 max-w-md">
              {t("text")}
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={600} duration={600} threshold={0.1}>
            <Link
              href={`/${locale}/about_us`}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-blue border-b-2 border-brand-green pb-1 hover:text-brand-green transition-colors w-fit"
            >
              {t("cta")}
              <span aria-hidden="true">→</span>
            </Link>
          </AnimateIn>
        </div>

      </section>
    </div>
  )
}