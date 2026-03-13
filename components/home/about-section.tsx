// components/home/about-section.tsx
import Link from "next/link"

interface AboutSectionProps {
  locale: string
}

export function AboutSection({ locale }: AboutSectionProps) {
  return (
    <section className="w-full bg-white border-b-[1rem] border-brand-blue">
      {/* Title */}
      <div className="px-8 pt-12 pb-0">
        <h2 className="text-4xl md:text-5xl font-black tracking-wide ml-8 md:ml-16">
          <span className="bg-brand-green text-white uppercase px-3 py-1">TEFL</span>{" "}
          <span className="bg-brand-azure text-brand-blue font-bold px-3 py-1 shadow-lg">
            Tuscany
          </span>
        </h2>
        <p className="mt-6 bg-brand-azure text-brand-blue font-bold text-2xl md:text-3xl px-6 py-4 shadow-md capitalize">
          TEFL Certification in Tuscany. Your Teaching Journey Starts Here.
        </p>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-0">
        {/* Slogan left */}
        <div className="relative border-t-[1rem] border-b-[1rem] border-brand-blue px-8 py-10 mt-8 mx-4">
          <p className="text-2xl md:text-3xl font-black leading-relaxed text-brand-azure">
            Unlocking Language, Connecting Cultures.{" "}
            <span className="text-brand-blue">
              Where Communication Transcends Boundaries.
            </span>
          </p>
          {/* Decorative squares */}
          <span className="hidden lg:block absolute bottom-4 left-0 h-8 w-8 bg-brand-gold z-10" />
          <span className="hidden lg:block absolute bottom-4 right-0 h-8 w-8 bg-brand-azure z-10" />
        </div>

        {/* About text right */}
        <div className="border-t-[1rem] border-brand-blue px-8 py-10 mt-8 mx-4">
          <p className="text-lg md:text-xl text-brand-blue leading-relaxed">
            TEFL Tuscany has been offering its language students and TEFL
            trainees top-notch services since 2006 when it opened its doors as
            TEFL International - The Learning Center. We offer an extremely
            high-quality TESOL/TEFL certification program and we quickly grew to
            become a well-respected language and culture center.
          </p>
          <Link
            href={`/${locale}/about_us`}
            className="inline-block mt-8 text-lg font-semibold text-brand-blue border-b-4 border-brand-green pb-1 hover:text-brand-green transition-colors"
          >
            What Sets Our Center Apart? &gt;
          </Link>
        </div>

        {/* Slogan bottom full width */}
        <div className="lg:col-span-2 bg-brand-bg border-b-[1rem] border-brand-blue px-8 py-8">
          <p className="text-2xl md:text-3xl font-black text-center text-brand-blue/40 leading-relaxed">
            Immerse Yourself in Language, Embrace a Global Perspective.{" "}
            <span className="text-brand-green">
              Your Gateway to Cultural Fluency.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}