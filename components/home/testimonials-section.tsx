// components/home/testimonials-section.tsx
import Image from "next/image"
import { urlFor } from "@/lib/sanity.client"
import type { Testimonial } from "@/lib/sanity.queries"
import { Quote } from "lucide-react"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="w-full bg-brand-bg py-16 border-t-4 border-brand-blue">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-black text-brand-blue uppercase tracking-wide mb-12 text-center">
          What our students say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <Quote className="h-6 w-6 text-brand-azure" />
              <p className="text-brand-blue text-base leading-relaxed flex-1">
                {t.review}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {t.image?.asset?.url ? (
                  <Image
                    src={t.image.asset.url}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full h-12 w-12 object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-lg">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-brand-blue text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.city}{t.state ? `, ${t.state}` : ""}
                  </p>
                  {t.title && (
                    <p className="text-xs text-brand-green font-medium">{t.title}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}