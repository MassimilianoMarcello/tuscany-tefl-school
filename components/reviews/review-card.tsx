// components/reviews/review-card.tsx
import Image from "next/image"
import { Quote } from "lucide-react"
import type { Testimonial } from "@/lib/sanity.queries"

interface ReviewCardProps {
  testimonial: Testimonial
}

export function ReviewCard({ testimonial }: ReviewCardProps) {
  return (
    <div className="w-full md:w-[45%] bg-white border border-brand-azure rounded-xl shadow-sm p-6 grid grid-cols-[auto_1fr] grid-rows-[auto_auto_auto] gap-x-4">
      {/* Foto — col 1 row 1 */}
      <div className="col-start-1 row-start-1">
        {testimonial.image?.asset?.url ? (
          <Image
            src={testimonial.image.asset.url}
            alt={testimonial.name}
            width={80}
            height={80}
            className="h-16 w-16 rounded-full object-cover border-2 border-brand-azure"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-brand-blue flex items-center justify-center text-white font-black text-xl border-2 border-brand-azure">
            {testimonial.name[0]}
          </div>
        )}
      </div>

      {/* Titolo — col 2 row 1 */}
      <div className="col-start-2 row-start-1 flex items-center">
        {testimonial.title && (
          <p className="text-brand-blue font-bold text-base leading-snug">
            &ldquo;{testimonial.title}&rdquo;
          </p>
        )}
      </div>

      {/* Recensione — col 1-2 row 2 */}
      <div className="col-span-2 row-start-2 mt-3">
        <p className="text-gray-600 text-sm leading-relaxed px-2">
          {testimonial.review}
        </p>
      </div>

      {/* Nome e provenienza — col 1-2 row 3 */}
      <div className="col-span-2 row-start-3 mt-4 ml-2 flex flex-col gap-1 border-t border-gray-100 pt-3">
        {/* Rating stelle */}
        {testimonial.rating && (
          <p className="text-brand-gold text-sm">
            {"⭐".repeat(testimonial.rating)}
          </p>
        )}
        <h3 className="font-bold text-brand-blue text-sm">{testimonial.name}</h3>
        <p className="text-xs text-gray-400">
          {testimonial.city}{testimonial.state ? `, ${testimonial.state}` : ""}
        </p>
        {testimonial.courseAttended && (
          <p className="text-xs text-brand-green font-semibold">
            {testimonial.courseAttended.name}
          </p>
        )}
      </div>
    </div>
  )
}