// app/(main)/[locale]/our_courses/page.tsx
import { getCourses } from "@/lib/sanity.queries"
import { getTranslations } from "next-intl/server"
import { CourseCard } from "@/components/courses/course-card"
import { CoursesHero } from "@/components/courses/courses-hero"

interface CoursesPageProps {
  params: Promise<{ locale: string }>
}

export default async function CoursesPage({ params }: CoursesPageProps) {
  const { locale } = await params
  const [courses, t] = await Promise.all([
    getCourses(),
    getTranslations("courses"),
  ])

  return (
    <main className="min-h-screen bg-brand-bg">
      <CoursesHero locale={locale} />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Titolo sezione */}
        <div className="w-full border border-brand-azure px-4 py-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-brand-blue text-center uppercase tracking-wide">
            {t("specialize")}
          </h2>
          <p className="text-center text-brand-blue/70 mt-4 max-w-2xl mx-auto text-lg">
            {t("intro")}
          </p>
        </div>

        {/* Grid corsi */}
        {courses.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{t("noCourses")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}