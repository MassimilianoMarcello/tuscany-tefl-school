// components/courses/courses-hero.tsx
import { getCommonTopPage } from "@/lib/sanity.queries"
import Image from "next/image"

interface CoursesHeroProps {
  locale: string
}

export async function CoursesHero({ locale }: CoursesHeroProps) {
  // Usa commonTopPage per l'hero — come nel vecchio progetto
  let topPage = null
  try {
    topPage = await getCommonTopPage()
  } catch {}

  return (
    <div className="relative w-full overflow-hidden">
      {/* Decorative squares — brand del vecchio progetto */}
      <span className="absolute right-0 top-4 h-60 w-48 bg-brand-gold z-10 hidden md:block" />
      <span className="absolute left-0 top-40 h-64 w-10 md:w-24 bg-brand-azure z-10" />

      {/* Hero image o fallback */}
      {topPage?.backgroundImage ? (
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={topPage.backgroundImage}
            alt={topPage.title ?? "Our Courses"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-blue/50" />
        </div>
      ) : (
        <div className="h-48 md:h-72 w-full bg-brand-blue" />
      )}

      {/* Testo intro sovrapposto */}
      <div className="relative bg-brand-bg z-20 -mt-16 mx-4 md:mx-16 p-8 md:p-12 border-b-8 border-brand-blue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <p className="text-lg md:text-xl font-semibold text-brand-blue leading-relaxed">
            Our aspiring English as a Foreign Language TEFL teachers hail from
            diverse professional backgrounds, each with their unique needs and
            aspirations. To accommodate this diversity, our TEFL programs in
            Tuscany, Italy, are tailored to be beginner-friendly.
          </p>
          <p className="text-base text-gray-600 font-light leading-relaxed">
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