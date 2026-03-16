// components/ui/section-dividers.tsx

// ── 1. Hero → Feature ─────────────────────────────────────────
// chiaro → scuro | taglio diagonale gold che cade verso destra
export function DividerHeroToFeature() {
  return (
    <div className="w-full  bg-brand-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="w-full h-10 md:h-14 lg:h-20 block"
      >
        <polygon
          points="0,72 1440,0 1440,72"
          fill="var(--color-brand-blue)"
        />
        <line
          x1="0" y1="72"
          x2="1440" y2="0"
          stroke="var(--color-brand-gold)"
          strokeWidth="5"
        />
      </svg>
    </div>
  )
}

// ── 2. Feature → About ────────────────────────────────────────
// scuro → chiaro | onda invertita con accento gold
export function DividerFeatureToAbout() {
  return (
    <div className="w-full bg-brand-blue" aria-hidden="true">
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="w-full h-10 md:h-14 lg:h-20 block"
      >
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
          fill="var(--color-brand-bg)"
        />
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36"
          fill="none"
          stroke="var(--color-brand-gold)"
          strokeWidth="4"
        />
      </svg>
    </div>
  )
}

// ── 3. Parallax → Courses ─────────────────────────────────────
// scuro → chiaro | banda gold piena + taglio netto
export function DividerParallaxToCourses() {
  return (
    <div className="w-full" aria-hidden="true">
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="w-full h-8 md:h-10 lg:h-12 block"
      >
        {/* Triangolo brand-bg che taglia ↘ */}
        <polygon
          points="0,0 1440,48 0,48"
          fill="var(--color-brand-bg)"
        />
        {/* Bordo gold diagonale: segue esattamente il taglio ↘ */}
        <line
          x1="0" y1="0"
          x2="1440" y2="48"
          stroke="var(--color-brand-gold, #C9A84C)"
          strokeWidth="4"
        />
      </svg>
    </div>
  )
}

// ── 4. Courses → Testimonials ─────────────────────────────────
// chiaro → scuro | taglio diagonale inverso — speculare al primo
export function DividerCoursesToTestimonials() {
  return (
    <div className="w-full bg-brand-bg" aria-hidden="true">
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="w-full h-10 md:h-14 lg:h-20 block"
      >
        <polygon
          points="0,0 1440,72 0,72"
          fill="var(--color-brand-blue)"
        />
        <line
          x1="0" y1="0"
          x2="1440" y2="72"
          stroke="var(--color-brand-gold)"
          strokeWidth="5"
        />
      </svg>
    </div>
  )
}