// components/home/courses-preview.tsx
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { it, enUS } from "date-fns/locale"
import { Clock, Calendar, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/sanity.queries"

interface CoursesPreviewProps {
  courses: Course[]
  locale: string
}

export function CoursesPreview({ courses, locale }: CoursesPreviewProps) {
  const latest = courses.slice(0, 4)
  const dateLocale = locale === "it" ? it : enUS

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8">

        {/* Left — course cards */}
        <div className="w-full md:w-1/2 flex flex-col gap-12">
          {latest.map((course) => (
            <div
              key={course._id}
              className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md"
            >
              {/* Image */}
              <div className="relative">
                {course.photo && (
                  <Image
                    src={course.photo}
                    alt={course.name}
                    width={600}
                    height={350}
                    className="w-full h-56 object-cover"
                  />
                )}
                {/* Level badge */}
                <div className="absolute top-0 right-0 translate-x-[17%] translate-y-[45%] rotate-45">
                  <Badge className="bg-brand-azure text-white px-6 py-1 text-xs rounded-sm">
                    {course.level}
                  </Badge>
                </div>
                {/* Hours badge */}
                <div className="absolute top-6 left-6 bg-brand-blue border-2 border-brand-gold rounded-2xl h-24 w-24 flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-3xl font-black text-brand-gold leading-none">
                    {course.hours}
                  </span>
                  <span className="text-brand-azure text-sm font-light">hours</span>
                  <span className="text-brand-azure text-xs font-light">course</span>
                </div>
                {/* Course name overlay */}
                <div className="border-t-4 border-brand-gold bg-white px-4 py-2 -mt-2">
                  <p className="text-brand-blue font-black text-xl">{course.name}</p>
                </div>
              </div>

              {/* Details */}
              <div className="px-4 py-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-brand-green" />
                  <span>
                    {format(new Date(course.startDate), "dd MMM yyyy", { locale: dateLocale })}
                    {" → "}
                    {format(new Date(course.endDate), "dd MMM yyyy", { locale: dateLocale })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 text-brand-green" />
                  <span>Completion: {course.completionTimeWeeks} weeks</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-blue">
                  <Trophy className="h-4 w-4 text-brand-gold" />
                  <span>Price: €{course.price}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-4 pb-4">
                <Button
                  asChild
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white uppercase text-xs font-bold tracking-wide"
                >
                  <Link href={`/${locale}/our_courses/${course.slug}`}>
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Right — sticky panel */}
        <div className="w-full md:w-1/2 md:sticky md:top-16 md:self-start">
          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-brand-blue p-6">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-snug">
                Elevate your teaching career with TEFL Tuscany
              </h2>
            </div>
            <div className="p-6">
              <p className="text-brand-blue text-base leading-relaxed">
                Our extensive TEFL courses are tailored to empower instructors
                from various walks of life, whether you are aiming to teach
                remotely or set off on a globetrotting educational expedition.
              </p>
              <Link
                href={`/${locale}/our_courses`}
                className="inline-block mt-6 text-sm font-black uppercase tracking-widest text-brand-blue border-b-2 border-brand-azure pb-1 hover:text-brand-green hover:border-brand-green transition-colors"
              >
                All courses &gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}