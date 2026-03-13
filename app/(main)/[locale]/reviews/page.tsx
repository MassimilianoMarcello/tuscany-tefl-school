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
    getCommonTopPageByIdentifier("reviews"), // 👈 verifica l'identifier in Sanity
  ])

  return (
    <main className="min-h-screen bg-brand-bg">
      <CoursesHero locale={locale} data={topPage} />

      {/* Titolo sezione */}
      <div className="w-[94%] mx-auto mt-16 mb-10 border border-brand-azure px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-black text-brand-blue text-center">
          {t("title")}
        </h2>
      </div>

      {/* Grid recensioni */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-400 py-16">{t("noReviews")}</p>
        ) : (
          <div className="flex flex-row flex-wrap gap-6 justify-between">
            {testimonials.map((testimonial) => (
              <ReviewCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </section>

      {/* Form per lasciare una recensione */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 pb-20">
        <div className="border border-brand-azure p-8 bg-white rounded-xl shadow-sm">
          <h3 className="text-2xl font-black text-brand-blue mb-2">{t("formTitle")}</h3>
          <p className="text-brand-blue/60 mb-6">{t("formSub")}</p>
          <ReviewForm locale={locale} />
        </div>
      </div>
    </main>
  )
}