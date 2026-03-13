// app/(main)/[locale]/about_us/page.tsx
import { client } from "@/lib/sanity.client"
import { groq } from "next-sanity"
import { getTranslations } from "next-intl/server"
import { AboutUsContent } from "@/components/about/about-us-content"
import { CommonTopHero } from "@/components/about/common-top-hero"

interface AboutUsPageProps {
  params: Promise<{ locale: string }>
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
  const { locale } = await params
  const t = await getTranslations("aboutUs")

  // Fetch pagina About Us — pageType.current == "aboutUs"
  const pageData = await client.fetch(
    groq`*[_type == "page" && pageType.current == "aboutUs"][0]{
      _id,
      mainTitle,
      mainImage{ asset->{ url } },
      sections[]{
        _key,
        order,
        title,
        subtitle,
        text,
        image{ asset->{ url } },
        content
      }
    }`
  )

  // Fetch commonTopPage per l'hero
  const topPage = await client.fetch(
    groq`*[_type == "commonTopPage"][0]{
      _id,
      title,
      subtitle,
      "backgroundImage": backgroundImage.asset->url
    }`
  )

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero con immagine di sfondo */}
      <CommonTopHero data={topPage} />

      {/* Titolo principale */}
      {pageData?.mainTitle && (
        <div className="w-[96%] mx-auto mt-16 mb-8 border border-brand-azure px-4 py-10">
          <h1 className="text-3xl md:text-5xl font-black text-brand-blue text-center">
            {pageData.mainTitle}
          </h1>
        </div>
      )}

      {/* Sezioni contenuto */}
      {pageData?.sections?.length > 0 ? (
        <AboutUsContent sections={pageData.sections} />
      ) : (
        <div className="max-w-4xl mx-auto px-8 py-16 text-center text-gray-400">
          {t("noContent")}
        </div>
      )}

      {/* CTA Apply */}
      <div className="w-full bg-brand-azure border-t-[1rem] border-brand-gold py-12 flex flex-col items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-black text-brand-blue text-center px-4">
          {t("ctaTitle")}
        </h2>
        <a
          href={`/${locale}/apply`}
          className="inline-block uppercase font-black tracking-wide bg-brand-blue text-white px-10 py-4 rounded-full hover:bg-brand-blue-dark transition-colors"
        >
          {t("ctaButton")}
        </a>
      </div>
    </main>
  )
}