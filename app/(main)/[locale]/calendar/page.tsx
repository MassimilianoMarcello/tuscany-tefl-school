// app/(main)/[locale]/calendar/page.tsx
import { getUpcomingCourses, getCommonTopPageByIdentifier } from "@/lib/sanity.queries"
import CommonTopPage from "@/components/TopPage"
import { CourseCalendarTable } from "@/components/calendar/CourseCalendarTable"
import { CalendarDays } from "lucide-react"

interface CalendarPageProps {
  params: Promise<{ locale: string }>
}

export default async function CalendarPage({ params }: CalendarPageProps) {
  const { locale } = await params

  const [courses, topPage] = await Promise.all([
    getUpcomingCourses(),
    getCommonTopPageByIdentifier("course-calendar"),
  ])

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <CommonTopPage data={topPage} />

      {/* ── Table section ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">

        {/* Section header */}
        <div className="w-full border border-brand-azure px-4 py-8 mb-10 flex items-center gap-4">
          <CalendarDays className="h-8 w-8 text-brand-gold shrink-0" />
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-brand-blue uppercase tracking-wide">
              Upcoming Courses
            </h2>
            <p className="text-brand-blue/60 mt-1 text-base">
              All scheduled courses — sorted by start date. Spots are limited.
            </p>
          </div>
        </div>

        {/* Table */}
        <CourseCalendarTable courses={courses} locale={locale} />

        {/* Footer note on spots */}
        <p className="mt-6 text-xs text-brand-blue/40 text-right">
          * Availability shows max seats. Live booking count coming soon.
        </p>
      </section>
    </main>
  )
}