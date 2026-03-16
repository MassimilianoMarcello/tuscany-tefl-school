// app/[locale]/page.tsx
import { getHomePage, getCourses, getTestimonials } from "@/lib/sanity.queries"
import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { FeatureSection } from "@/components/home/feature-section"
import { CoursesPreview } from "@/components/home/courses-preview"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { ParallaxSection } from "@/components/home/parallax-section"
import {
  DividerHeroToFeature,
  DividerFeatureToAbout,

  DividerCoursesToTestimonials,
} from "@/components/ui/section-dividers"

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const [paramsResult, homePageResult, coursesResult, testimonialsResult] =
    await Promise.allSettled([params, getHomePage(), getCourses(), getTestimonials()])

  const locale =
    paramsResult.status === "fulfilled" ? paramsResult.value.locale : "it"
  const homePage =
    homePageResult.status === "fulfilled" ? homePageResult.value : null
  const courses =
    coursesResult.status === "fulfilled" ? coursesResult.value : []
  const testimonials =
    testimonialsResult.status === "fulfilled" ? testimonialsResult.value : []

  return (
    <main >

      {/* 1 ── chiaro */}
      {homePage && <HeroSection data={homePage} locale={locale} />}

      <DividerHeroToFeature />

      {/* 2 ── scuro */}
      {homePage && <FeatureSection data={homePage} locale={locale} />}

      <DividerFeatureToAbout />

      {/* 3 ── chiaro */}
      <AboutSection locale={locale} />

      {/* nessun separatore — la Parallax emerge direttamente */}

      {/* 4 ── scuro */}
      <ParallaxSection locale={locale} />

      {/* <DividerParallaxToCourses /> */}

      {/* 5 ── chiaro */}
      <CoursesPreview courses={courses} locale={locale} />

      <DividerCoursesToTestimonials />

      {/* 6 ── scuro */}
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} locale={locale} />
      )}

    </main>
  )
}
