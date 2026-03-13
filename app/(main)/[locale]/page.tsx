// app/[locale]/page.tsx
import { getHomePage, getCourses, getTestimonials } from "@/lib/sanity.queries"
import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { FeatureSection } from "@/components/home/feature-section"
import { CoursesPreview } from "@/components/home/courses-preview"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { ParallaxSection } from "@/components/home/parallax-section"

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  // ✅ Promise.allSettled — se una query fallisce le altre si renderizzano comunque
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
    <>
      {homePage && <HeroSection data={homePage} locale={locale} />}
      <AboutSection locale={locale} />
      {homePage && <FeatureSection data={homePage} locale={locale} />}
      <CoursesPreview courses={courses} locale={locale} />
      <ParallaxSection locale={locale} />
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}
    </>
  )
}
