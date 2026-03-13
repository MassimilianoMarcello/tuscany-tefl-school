// components/courses/courses-hero.tsx
import Image from "next/image"
import type { CommonTopPage } from "@/lib/sanity.queries"

interface CoursesHeroProps {
  locale: string
  data: CommonTopPage | null
}

export function CoursesHero({ locale, data }: CoursesHeroProps) {
  return (
    <div className="relative w-full overflow-hidden bg-brand-bg">

      {/* ── Immagine hero ─────────────────────────────────────────────── */}
      <div className="relative w-full h-[90vh] min-h-120">
        {data?.backgroundImage ? (
          <Image
            src={data.backgroundImage}
            alt={data.title ?? "Our Courses"}
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="w-full h-full bg-brand-blue" />
        )}

        {/* Overlay sfumato dal basso */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/30 to-transparent" />

        {/* ── Cornice decorativa — angolo top-left ─────────────────────── */}
        <span className="absolute top-0 left-0 h-16 w-16 bg-brand-gold z-20" />
        <span className="absolute top-16 left-0 h-8 w-8 bg-brand-azure z-20" />
        <span className="absolute top-0 left-16 h-8 w-8 bg-brand-azure z-20" />

        {/* Angolo top-right */}
        <span className="absolute top-0 right-0 h-16 w-16 bg-brand-azure z-20" />
        <span className="absolute top-16 right-0 h-8 w-8 bg-brand-gold z-20" />
        <span className="absolute top-0 right-16 h-8 w-8 bg-brand-gold z-20" />

        {/* Angolo bottom-left */}
        <span className="absolute bottom-0 left-0 h-12 w-12 bg-brand-azure z-20" />

        {/* Angolo bottom-right */}
        <span className="absolute bottom-0 right-0 h-12 w-12 bg-brand-gold z-20" />

        {/* ── Testo sovrapposto — centrato e verticalmente basso ────────── */}
        <div className="w-2xl absolute bottom-20  right-0 z-30 px-8 md:px-20 pb-12 md:pb-16">
          <div className="max-w-4xl">
            {data?.title && (
              <h1 className="block bg-brand-bg text-brand-blue font-black text-3xl md:text-5xl lg:text-6xl px-5 py-3 leading-tight mb-3 w-fit">
                {data.title}
              </h1>
            )}
            {data?.subtitle && (
              <p className="block bg-brand-bg/90 text-brand-blue/70 font-medium text-base md:text-lg px-5 py-2 w-fit">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Sezione intro testo ──────────────────────────────────────── */}
      <div className="relative z-10 mx-4 md:mx-16 border-l-8 border-r-8 border-b-8 border-brand-blue bg-brand-bg">
        {/* Bordo gold top */}
        <div className="h-1 w-full bg-brand-gold" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x-2 divide-brand-azure">
          <p className="text-base md:text-lg font-semibold text-brand-blue leading-relaxed p-8 md:p-10">
            Our aspiring English as a Foreign Language TEFL teachers hail from
            diverse professional backgrounds, each with their unique needs and
            aspirations. To accommodate this diversity, our TEFL programs in
            Tuscany, Italy, are tailored to be beginner-friendly, welcoming
            individuals with minimal or no prior teaching experience.
          </p>
          <p className="text-sm md:text-base text-brand-blue/70 font-light leading-relaxed p-8 md:p-10">
            We prioritize intimate learning environments, limiting class sizes
            to a maximum of 12 trainees. This ensures personalized attention and
            guidance for everyone. At TEFL Tuscany learning center, we emphasize
            practical teaching experience, offering a minimum of 7 hours of
            in-person teaching practice with real English learners.
          </p>
        </div>
      </div>

    </div>
  )
}