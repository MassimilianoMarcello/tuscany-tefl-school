"use client"

// components/home/parallax-section.tsx
// ✅ ssr: false nel vecchio progetto — rimane client component per background-attachment: fixed
import Link from "next/link"

interface ParallaxSectionProps {
  locale: string
}

export function ParallaxSection({ locale }: ParallaxSectionProps) {
  return (
    <section
      className="w-full mt-20 bg-fixed bg-cover bg-left"
      style={{ backgroundImage: "url('/assets/firienze.webp')" }}
    >
      {/* Overlay verde brand semitrasparente */}
      <div className="bg-[rgba(116,139,103,0.85)] py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#e4ece1] leading-snug">
            Since 2006, our school in Tuscany, located in the heart of Florence
            and in the Tuscany countryside, has served as a hub for aspiring
            TEFL teachers.
          </h2>
          <p className="text-base md:text-2xl font-light text-white leading-relaxed">
            Studying in a school located in Tuscany, particularly in Florence,
            is an unparalleled experience that seamlessly blends academic rigor
            with cultural immersion. Tuscany, renowned for its breathtaking
            landscapes, rich history, and artistic heritage, serves as an
            inspiring backdrop for learning. Florence, the heart of Tuscany, is
            a city where every cobblestone street whispers tales of the
            Renaissance, offering students a unique opportunity to walk in the
            footsteps of history&apos;s greatest minds.
          </p>
          <h3 className="text-lg md:text-xl font-normal text-brand-gold">
            Ready to become a part of the TEFL Tuscany tradition?
          </h3>
          <Link
            href={`/${locale}/apply`}
            className="inline-block w-40 text-center uppercase font-bold text-sm tracking-wide bg-white text-[#0741a4] px-4 py-3 rounded-md hover:bg-brand-gold hover:text-white transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </section>
  )
}