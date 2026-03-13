// app/(main)/[locale]/faq/page.tsx
import { getFaqs } from "@/lib/sanity.queries"
import { getTranslations } from "next-intl/server"
import { FaqList } from "@/components/faq/faq-list"

interface FaqPageProps {
  params: Promise<{ locale: string }>
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params
  const [faqs, t] = await Promise.all([
    getFaqs(),
    getTranslations("faq"),
  ])

  // Raggruppa per categoria
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category ?? "general"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="relative bg-brand-blue overflow-hidden">
        <span className="absolute right-0 top-0 h-40 w-32 bg-brand-gold z-0 hidden md:block" />
        <span className="absolute left-0 bottom-0 h-24 w-16 bg-brand-azure z-0" />
        <div className="max-w-4xl mx-auto px-8 py-20 relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-brand-azure text-lg font-light max-w-xl">
            {t("heroSubtitle")}
          </p>
        </div>
      </div>

      {/* FAQ per categoria */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 space-y-12">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-500 py-16">{t("noFaqs")}</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-xl font-black text-brand-blue uppercase tracking-wide border-b-4 border-brand-gold pb-3 mb-6">
                {t(`categories.${category}` as any)}
              </h2>
              <FaqList faqs={items} />
            </section>
          ))
        )}
      </div>
    </main>
  )
}