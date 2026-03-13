// app/(main)/[locale]/our_courses/[slug]/page.tsx
import { getCourse, getCourses } from "@/lib/sanity.queries"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Trophy, Users} from "lucide-react"
import { format } from "date-fns"
import { it, enUS } from "date-fns/locale"

interface CourseDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

// ✅ Genera le route statiche per tutti i corsi pubblicati
export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({ slug: course.slug }))
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { locale, slug } = await params
  const [course, t] = await Promise.all([
    getCourse(slug),
    getTranslations("courses"),
  ])

  if (!course) notFound()

  const dateLocale = locale === "it" ? it : enUS
  const discountedPrice = course.discount
    ? course.price - (course.price * course.discount) / 100
    : null

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero immagine */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        {course.photo ? (
          <Image
            src={course.photo}
            alt={course.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-brand-blue" />
        )}
        <div className="absolute inset-0 bg-brand-blue/60" />
        <div className="absolute inset-0 flex items-end p-8">
          <div>
            <Badge className="bg-brand-gold text-brand-blue mb-3 text-sm font-bold">
              {course.level}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              {course.name}
            </h1>
          </div>
        </div>
        {/* Hours badge */}
        <div className="absolute top-6 right-6 bg-brand-blue border-2 border-brand-gold rounded-2xl h-24 w-24 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-3xl font-black text-brand-gold leading-none">{course.hours}</span>
          <span className="text-brand-azure text-sm font-light">hours</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonna sinistra — descrizione */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-blue mb-4 uppercase tracking-wide">
              {t("aboutCourse")}
            </h2>
            {course.description ? (
              <div className="prose prose-brand text-brand-blue leading-relaxed">
                {Array.isArray(course.description) ? (
                  <PortableText value={course.description as PortableTextBlock[]} />
                ) : (
                  <p>{course.description as string}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-400">{t("noDescription")}</p>
            )}
          </div>
        </div>

        {/* Colonna destra — dettagli + CTA */}
        <div className="space-y-4">
          {/* Prezzo */}
          <div className="bg-brand-blue rounded-2xl p-6 text-white">
            <p className="text-brand-azure text-sm uppercase tracking-wide mb-1">{t("price")}</p>
            {discountedPrice ? (
              <>
                <p className="text-gray-400 line-through text-lg">€{course.price}</p>
                <p className="text-4xl font-black text-brand-gold">€{discountedPrice.toFixed(0)}</p>
                <Badge className="bg-brand-gold text-brand-blue mt-2">-{course.discount}%</Badge>
              </>
            ) : (
              <p className="text-4xl font-black text-brand-gold">€{course.price}</p>
            )}
          </div>

          {/* Dettagli */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="h-5 w-5 text-brand-green shrink-0" />
              <div>
                <p className="font-semibold text-brand-blue">{t("dates")}</p>
                <p>{format(new Date(course.startDate), "dd MMM yyyy", { locale: dateLocale })}</p>
                <p>{format(new Date(course.endDate), "dd MMM yyyy", { locale: dateLocale })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="h-5 w-5 text-brand-green shrink-0" />
              <div>
                <p className="font-semibold text-brand-blue">{t("completion")}</p>
                <p>{course.completionTimeWeeks} {t("weeks")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Trophy className="h-5 w-5 text-brand-gold shrink-0" />
              <div>
                <p className="font-semibold text-brand-blue">{t("level")}</p>
                <p>{course.level}</p>
              </div>
            </div>
            {course.maxStudents && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Users className="h-5 w-5 text-brand-azure shrink-0" />
                <div>
                  <p className="font-semibold text-brand-blue">{t("maxStudents")}</p>
                  <p>{course.maxStudents}</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <Button
            asChild
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white uppercase font-black tracking-wide py-6 text-base"
          >
            <Link href={`/${locale}/apply`}>{t("applyNow")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white uppercase font-bold tracking-wide"
          >
            <Link href={`/${locale}/our_courses`}>{t("backToCourses")}</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}