// components/reviews/review-card.tsx
import Image from "next/image"
import type { Testimonial } from "@/lib/sanity.queries"

interface ReviewCardProps {
  testimonial: Testimonial
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} su 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          className={`w-3.5 h-3.5 ${i < count ? "text-brand-gold" : "text-brand-blue/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function ReviewCard({ testimonial }: ReviewCardProps) {
  return (
    <div className="w-full md:w-[47%] bg-white border border-brand-azure/30 border-t-4 border-t-brand-gold flex flex-col gap-4 p-6">

      {/* Titolo recensione */}
      {testimonial.title && (
        <p className="font-serif-display text-lg text-brand-blue leading-snug">
          &ldquo;{testimonial.title}&rdquo;
        </p>
      )}

      {/* Separatore gold */}
      <div aria-hidden="true" className="w-10 h-[2px] bg-brand-gold" />

      {/* Testo recensione */}
      <p className="text-brand-blue/70 text-sm font-light leading-relaxed flex-1">
        {testimonial.review}
      </p>

      {/* Rating + autore */}
      <div className="flex items-center gap-4 pt-4 border-t border-brand-blue/10">
        {testimonial.image?.asset?.url ? (
          <Image
            src={testimonial.image.asset.url}
            alt={testimonial.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-black text-lg shrink-0">
            {testimonial.name[0]}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {testimonial.rating && <StarRating count={testimonial.rating} />}
          <p className="font-bold text-brand-blue text-sm">{testimonial.name}</p>
          <p className="text-xs text-brand-blue/40 uppercase tracking-wide">
            {testimonial.city}{testimonial.state ? `, ${testimonial.state}` : ""}
          </p>
          {testimonial.courseAttended && (
            <p className="text-xs text-brand-green font-bold uppercase tracking-wide">
              {testimonial.courseAttended.name}
            </p>
          )}
        </div>
      </div>

    </div>
  )
}