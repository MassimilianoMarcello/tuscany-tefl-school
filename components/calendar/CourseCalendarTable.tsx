// components/calendar/CourseCalendarTable.tsx
import Link from "next/link"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import type { Course } from "@/lib/sanity.queries"

interface CourseCalendarTableProps {
  courses: Course[]
  locale: string
}

export function CourseCalendarTable({ courses, locale }: CourseCalendarTableProps) {
  if (courses.length === 0) {
    return (
      <div className="border border-brand-azure px-8 py-16 text-center">
        <p className="text-brand-blue/60 text-lg font-medium">
          No upcoming courses scheduled at the moment.
        </p>
        <p className="text-brand-blue/40 text-sm mt-2">
          Check back soon or{" "}
          <Link
            href={`/${locale}/contact`}
            className="underline underline-offset-2 hover:text-brand-green transition-colors"
          >
            contact us
          </Link>{" "}
          for more information.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <thead>
          <tr className="bg-brand-blue text-white">
            {[
              "Course",
              "Start Date",
              "End Date",
              "Level",
              "Hours",
              "Duration",
              "Price",
              "Availability",
              "",
            ].map((col) => (
              <th
                key={col}
                className="
                  px-4 py-4 text-left text-xs font-black uppercase
                  tracking-widest whitespace-nowrap
                  first:border-l-4 first:border-brand-gold
                "
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Rows ───────────────────────────────────────────────────── */}
        <tbody>
          {courses.map((course, index) => {
            const discountedPrice = course.discount
              ? course.price - (course.price * course.discount) / 100
              : null

            // Placeholder: once booking is live, replace with
            // (course.maxStudents ?? 0) - bookedCount
            const spotsLeft = course.maxStudents ?? null

            const isEven = index % 2 === 0

            return (
              <tr
                key={course._id}
                className={`
                  border-b border-brand-azure/40
                  transition-colors hover:bg-brand-azure/10
                  ${isEven ? "bg-white" : "bg-brand-bg"}
                `}
              >
                {/* Course name */}
                <td className="px-4 py-4 border-l-4 border-brand-gold">
                  <span className="font-black text-brand-blue text-base leading-tight">
                    {course.name}
                  </span>
                </td>

                {/* Start date */}
                <td className="px-4 py-4 whitespace-nowrap text-brand-blue font-medium">
                  {format(new Date(course.startDate), "dd MMM yyyy", {
                    locale: enUS,
                  })}
                </td>

                {/* End date */}
                <td className="px-4 py-4 whitespace-nowrap text-brand-blue/70">
                  {format(new Date(course.endDate), "dd MMM yyyy", {
                    locale: enUS,
                  })}
                </td>

                {/* Level */}
                <td className="px-4 py-4">
                  <span className="bg-brand-azure/30 text-brand-blue text-xs font-bold px-2 py-1 uppercase tracking-wide">
                    {course.level}
                  </span>
                </td>

                {/* Hours */}
                <td className="px-4 py-4 text-center">
                  <span className="font-black text-brand-gold text-lg leading-none">
                    {course.hours}
                  </span>
                  <span className="block text-brand-blue/50 text-xs">hrs</span>
                </td>

                {/* Duration */}
                <td className="px-4 py-4 whitespace-nowrap text-brand-blue/70">
                  {course.completionTimeWeeks}{" "}
                  <span className="text-xs">wks</span>
                </td>

                {/* Price */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {discountedPrice ? (
                    <span className="flex flex-col">
                      <span className="line-through text-brand-blue/40 text-xs">
                        €{course.price}
                      </span>
                      <span className="text-brand-green font-black">
                        €{discountedPrice.toFixed(0)}
                      </span>
                      {course.discount && (
                        <span className="text-[10px] bg-brand-gold text-brand-blue font-bold px-1 w-fit">
                          -{course.discount}%
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="font-bold text-brand-blue">
                      €{course.price}
                    </span>
                  )}
                </td>

                {/* Availability — placeholder until booking logic */}
                <td className="px-4 py-4 text-center">
                  {spotsLeft !== null ? (
                    <span
                      className={`
                        text-sm font-black
                        ${spotsLeft <= 3
                          ? "text-red-500"
                          : spotsLeft <= 6
                          ? "text-brand-gold"
                          : "text-brand-green"}
                      `}
                    >
                      {spotsLeft}
                      <span className="block text-[10px] font-normal text-brand-blue/50 uppercase tracking-wide">
                        spots
                      </span>
                    </span>
                  ) : (
                    <span className="text-brand-blue/30 text-xs">—</span>
                  )}
                </td>

                {/* Info button */}
                <td className="px-4 py-4">
                  <Button
                    asChild
                    size="sm"
                    className="bg-brand-blue hover:bg-brand-blue-dark text-white uppercase text-xs font-bold tracking-wide rounded-none gap-1.5"
                  >
                    <Link href={`/${locale}/our_courses/${course.slug}`}>
                      <Info className="h-3.5 w-3.5" />
                      Info
                    </Link>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}