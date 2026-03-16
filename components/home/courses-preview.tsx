// components/home/courses-preview.tsx
import Link from "next/link"
import { format } from "date-fns"
import { it, enUS } from "date-fns/locale"
import { Calendar, Clock, BadgeEuro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SanityImage } from "@/components/ui/sanity-image"
import { AnimateIn } from "@/components/ui/animate-in"
import type { Course } from "@/lib/sanity.queries"

interface CoursesPreviewProps {
  courses: Course[]
  locale: string
}

const labels = {
  it: {
    eyebrow: "Corsi in evidenza",
    hours: "ore",
    completion: "Durata",
    weeks: "settimane",
    details: "Scopri il corso",
    allCourses: "Tutti i corsi",
    panelEyebrow: "Certificazione TEFL",
    panelTitle: "Inizia il tuo percorso di insegnamento con TEFL Tuscany",
    panelBody: "Programmi TEFL e TESOL pensati per chi vuole insegnare nel mondo, in presenza o da remoto.",
  },
  en: {
    eyebrow: "Featured courses",
    hours: "hours",
    completion: "Duration",
    weeks: "weeks",
    details: "Course details",
    allCourses: "All courses",
    panelEyebrow: "TEFL Certification",
    panelTitle: "Elevate your teaching career with TEFL Tuscany",
    panelBody: "TEFL and TESOL programs designed for educators who want to teach anywhere in the world, in-person or remotely.",
  },
}

export function CoursesPreview({ courses, locale }: CoursesPreviewProps) {
  const latest = courses.slice(0, 4)
  const dateLocale = locale === "it" ? it : enUS
  const t = locale === "it" ? labels.it : labels.en

  if (latest.length === 0) return null

  return (
    <section className="w-full bg-brand-bg py-24 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-start gap-12 lg:gap-16">

        {/* ── Colonna card ──────────────────────────────────────── */}
        <div className="w-full md:w-3/5 flex flex-col gap-8">

          <AnimateIn variant="fadeUp" delay={0} duration={500} threshold={0.05}>
            <p className="text-brand-green uppercase tracking-[0.25em] text-xs font-bold">
              {t.eyebrow}
            </p>
          </AnimateIn>

          {latest.map((course, index) => (
            <AnimateIn
              key={course._id}
              variant="fadeUp"
              delay={index * 120}
              duration={600}
              threshold={0.05}
            >
              <article className="group relative bg-white overflow-hidden border border-brand-azure/30">
                <div className="relative h-56 overflow-hidden">
                  {course.photo ? (
                    <SanityImage
                      asset={course.photo}
                      alt={course.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-azure/20" />
                  )}
                  {course.level && (
                    <span className="absolute top-4 left-4 bg-brand-blue text-brand-azure text-xs font-bold uppercase tracking-widest px-3 py-1">
                      {course.level}
                    </span>
                  )}
                  <div className="absolute top-4 right-4 bg-brand-blue border-2 border-brand-gold rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                    <span className="text-xl font-black text-brand-gold leading-none">{course.hours}</span>
                    <span className="text-brand-azure text-[9px] font-bold uppercase tracking-wide">{t.hours}</span>
                  </div>
                </div>

                <div className="px-6 py-5 border-t-4 border-brand-gold">
                  <h3 className="font-serif-display text-xl text-brand-blue mb-4 leading-snug">
                    {course.name}
                  </h3>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-brand-blue/60">
                      <Calendar className="h-4 w-4 text-brand-green shrink-0" />
                      <span>
                        {format(new Date(course.startDate), "dd MMM yyyy", { locale: dateLocale })}
                        {" → "}
                        {format(new Date(course.endDate), "dd MMM yyyy", { locale: dateLocale })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-blue/60">
                      <Clock className="h-4 w-4 text-brand-green shrink-0" />
                      <span>{t.completion}: {course.completionTimeWeeks} {t.weeks}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-blue">
                      <BadgeEuro className="h-4 w-4 text-brand-gold shrink-0" />
                      <span>€{course.price}</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="bg-brand-blue hover:bg-brand-blue-dark text-white uppercase tracking-widest text-xs font-bold px-6 py-4 rounded-none w-full"
                  >
                    <Link href={`/${locale}/our_courses/${course.slug}`}>{t.details}</Link>
                  </Button>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>

        {/* ── Pannello ──────────────────────────────────────────── */}
        <AnimateIn
          variant="fadeLeft"
          delay={200}
          duration={700}
          threshold={0.05}
          className="w-full md:w-2/5 md:sticky md:top-24"
          style={{ alignSelf: "flex-start" }}
        >
          <div className="bg-brand-blue overflow-hidden">
            <div className="h-[6px] bg-brand-gold w-full" />
            <div className="px-8 py-10">
              <p className="text-brand-azure uppercase tracking-[0.25em] text-xs font-bold mb-6">
                {t.panelEyebrow}
              </p>
              <h2 className="font-serif-display text-3xl md:text-4xl text-white leading-[1.15] mb-6">
                {t.panelTitle}
              </h2>
              <div className="w-12 h-[3px] bg-brand-gold mb-6" />
              <p className="text-white/60 text-base font-light leading-relaxed mb-10">
                {t.panelBody}
              </p>
              <div className="border-t border-white/10 pt-6 mb-10 flex items-baseline gap-3">
                <span className="font-serif-display text-5xl text-brand-gold">{courses.length}</span>
                <span className="text-white/50 text-sm uppercase tracking-widest">
                  {locale === "it" ? "corsi disponibili" : "courses available"}
                </span>
              </div>
              <Link
                href={`/${locale}/our_courses`}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-gold border-b-2 border-brand-gold pb-1 hover:text-white hover:border-white transition-colors"
              >
                {t.allCourses}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </AnimateIn>

      </div>
    </section>
  )
}
