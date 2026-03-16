// app/(main)/[locale]/reviews/page.tsx
import { getTestimonials, getCommonTopPageByIdentifier } from "@/lib/sanity.queries"
import { getTranslations } from "next-intl/server"
import { CoursesHero } from "@/components/courses/courses-hero"
import { ReviewCard } from "@/components/reviews/review-card"
import { ReviewForm } from "@/components/reviews/review-form"

interface ReviewsPageProps {
  params: Promise<{ locale: string }>
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { locale } = await params
  const [testimonials, t, topPage] = await Promise.all([
    getTestimonials(),
    getTranslations("reviews"),
    getCommonTopPageByIdentifier("reviews"),
  ])

  return (
    <main className="min-h-screen bg-brand-bg">
      <CoursesHero locale={locale} data={topPage} />

      {/* Titolo sezione */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        <p className="text-brand-green uppercase tracking-[0.25em] text-xs font-bold mb-4">
          {t("eyebrow") ?? "Student Stories"}
        </p>
        <h2 className="font-serif-display text-4xl md:text-5xl text-brand-blue leading-[1.1]">
          {t("title")}
        </h2>
        <div aria-hidden="true" className="w-16 h-[3px] bg-brand-gold mt-6" />
      </div>

      {/* Grid recensioni */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        {testimonials.length === 0 ? (
          <p className="text-center text-brand-blue/40 uppercase tracking-widest text-xs py-16">
            {t("noReviews")}
          </p>
        ) : (
          <div className="flex flex-row flex-wrap gap-6">
            {testimonials.map((testimonial) => (
              <ReviewCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </section>

      {/* Form */}
      <section className="bg-brand-blue py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="text-brand-azure uppercase tracking-[0.25em] text-xs font-bold mb-4">
            Share your experience
          </p>
          <h3 className="font-serif-display text-3xl md:text-4xl text-white leading-[1.1] mb-4">
            {t("formTitle")}
          </h3>
          <div aria-hidden="true" className="w-12 h-[3px] bg-brand-gold mb-8" />
          <p className="text-white/50 text-sm font-light mb-10">
            {t("formSub")}
          </p>
          <ReviewForm locale={locale} />
        </div>
      </section>

    </main>
  )
}