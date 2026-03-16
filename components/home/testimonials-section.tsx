// components/home/testimonials-section.tsx
import Image from "next/image"
import type { Testimonial } from "@/lib/sanity.queries"
import { AnimateIn } from "@/components/ui/animate-in"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  locale?: string
}

const labels = {
  it: {
    eyebrow: "Cosa dicono i nostri studenti",
    more: "altre storie",
  },
  en: {
    eyebrow: "What our students say",
    more: "more stories",
  },
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} stelle su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`w-4 h-4 ${i < count ? "text-brand-gold" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.image?.asset?.url) {
    return (
      <Image
        src={testimonial.image.asset.url}
        alt={testimonial.name}
        width={48}
        height={48}
        className="rounded-full h-12 w-12 object-cover shrink-0"
      />
    )
  }
  return (
    <div className="h-12 w-12 rounded-full bg-brand-azure/20 border border-brand-azure/30 flex items-center justify-center text-brand-azure font-bold text-lg shrink-0">
      {testimonial.name[0]}
    </div>
  )
}

function AuthorInfo({ t }: { t: Testimonial }) {
  return (
    <div>
      <p className="font-bold text-white text-sm">{t.name}</p>
      <p className="text-xs text-white/40">
        {t.city}{t.state ? `, ${t.state}` : ""}
      </p>
      {t.title && (
        <p className="text-xs text-brand-azure mt-0.5">{t.title}</p>
      )}
    </div>
  )
}

export function TestimonialsSection({
  testimonials,
  locale = "en",
}: TestimonialsSectionProps) {
  const t = locale === "it" ? labels.it : labels.en
  const [featured, ...rest] = testimonials

  return (
    <section className="w-full bg-brand-blue py-24 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Eyebrow */}
        <AnimateIn variant="fadeUp" delay={0} duration={500} threshold={0.1}>
          <p className="text-brand-azure uppercase tracking-[0.25em] text-xs font-bold mb-12">
            {t.eyebrow}
          </p>
        </AnimateIn>

        {/* ── Testimonial in evidenza ───────────────────────────── */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 mb-16 pb-16 border-b border-white/10">
            <div className="relative">
              <AnimateIn variant="fadeUp" delay={100} duration={600} threshold={0.1}>
                <div aria-hidden="true" className="w-16 h-[3px] bg-brand-gold mb-8" />
              </AnimateIn>
              <blockquote className="relative">
                <AnimateIn variant="fadeUp" delay={200} duration={700} threshold={0.1}>
                  <p className="font-serif-display text-2xl md:text-3xl lg:text-4xl text-white leading-[1.3] mb-8">
                    {featured.review}
                  </p>
                </AnimateIn>
                <AnimateIn variant="fadeUp" delay={350} duration={500} threshold={0.1}>
                  <StarRating />
                  <footer className="flex items-center gap-4 mt-6">
                    <Avatar testimonial={featured} />
                    <AuthorInfo t={featured} />
                  </footer>
                </AnimateIn>
              </blockquote>
            </div>
            <div
              aria-hidden="true"
              className="hidden lg:block w-[3px] bg-brand-gold/30 self-stretch"
            />
          </div>
        )}

        {/* ── Altre testimonial — scroll orizzontale ────────────── */}
        {rest.length > 0 && (
          <>
            <AnimateIn variant="fade" delay={0} duration={500} threshold={0.05}>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-6">
                {rest.length} {t.more}
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={100} duration={600} threshold={0.05}>
              <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-12 md:px-12 snap-x snap-mandatory scrollbar-none">
                {rest.map((item) => (
                  <article
                    key={item._id}
                    className="shrink-0 w-72 bg-white/5 border border-white/10 p-6 snap-start"
                  >
                    <StarRating />
                    <p className="text-white/70 text-sm font-light leading-relaxed mt-4 mb-6 line-clamp-4">
                      {item.review}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <Avatar testimonial={item} />
                      <AuthorInfo t={item} />
                    </div>
                  </article>
                ))}
              </div>
            </AnimateIn>
          </>
        )}

      </div>
    </section>
  )
}