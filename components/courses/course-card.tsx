// components/courses/course-card.tsx
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { it, enUS } from "date-fns/locale"
import { Calendar, Clock, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/sanity.queries"

interface CourseCardProps {
  course: Course
  locale: string
}

export function CourseCard({ course, locale }: CourseCardProps) {
  const dateLocale = locale === "it" ? it : enUS
  const discountedPrice = course.discount
    ? course.price - (course.price * course.discount) / 100
    : null

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white flex flex-col h-full">
      {/* Image */}
      <div className="relative">
        {course.photo ? (
          <Image
            src={course.photo.asset.url}
            alt={course.name}
            width={600}
            height={350}
            className="w-full h-56 object-cover"
          />
        ) : (
          <div className="w-full h-56 bg-brand-blue" />
        )}

        {/* Level badge */}
        <div className="absolute top-0 right-0 translate-x-[17%] translate-y-[45%] rotate-45">
          <Badge className="bg-brand-azure text-white px-6 py-1 text-xs rounded-sm">
            {course.level}
          </Badge>
        </div>

        {/* Hours badge */}
        <div className="absolute top-6 left-6 bg-brand-blue border-2 border-brand-gold rounded-2xl h-24 w-24 flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-3xl font-black text-brand-gold leading-none">{course.hours}</span>
          <span className="text-brand-azure text-sm font-light">hours</span>
          <span className="text-brand-azure text-xs font-light">course</span>
        </div>

        {/* Discount badge */}
        {course.discount && (
          <div className="absolute top-4 right-12">
            <Badge className="bg-brand-gold text-brand-blue font-black text-xs">
              -{course.discount}%
            </Badge>
          </div>
        )}

        {/* Course name */}
        <div className="border-t-4 border-brand-gold bg-white px-4 py-2">
          <p className="text-brand-blue font-black text-xl line-clamp-2">{course.name}</p>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 text-brand-green shrink-0" />
          <span>
            {format(new Date(course.startDate), "dd MMM yyyy", { locale: dateLocale })}
            {" → "}
            {format(new Date(course.endDate), "dd MMM yyyy", { locale: dateLocale })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4 text-brand-green shrink-0" />
          <span>{course.completionTimeWeeks} weeks</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-blue">
          <Trophy className="h-4 w-4 text-brand-gold shrink-0" />
          {discountedPrice ? (
            <span>
              <span className="line-through text-gray-400 mr-1">€{course.price}</span>
              <span className="text-brand-green">€{discountedPrice.toFixed(0)}</span>
            </span>
          ) : (
            <span>€{course.price}</span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Button
          asChild
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white uppercase text-xs font-bold tracking-wide"
        >
          <Link href={`/${locale}/our_courses/${course.slug}`}>Details</Link>
        </Button>
      </div>
    </div>
  )
}