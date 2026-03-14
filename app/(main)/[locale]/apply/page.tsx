// app/(main)/[locale]/apply/page.tsx
import CommonTopPage from "@/components/TopPage"
import { ApplicationForm } from "@/components/apply/ApplicationForm"
import { getCommonTopPageByIdentifier } from "@/lib/sanity.queries"

interface ApplyPageProps {
  params: Promise<{ locale: string }>
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  await params // locale available if needed for links

  const topPage = await getCommonTopPageByIdentifier("apply")

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <CommonTopPage data={topPage} />

      {/* ── Form section ──────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        {/* Intro */}
        <div className="w-full border border-brand-azure px-6 py-8 mb-12">
          <p className="text-brand-blue/70 text-base leading-relaxed">
            Please fill out the form below to apply for a TESOL/TEFL Course.
            Once you successfully submit your form, our team will review your
            application and contact you with instructions to complete your{" "}
            <strong className="text-brand-blue">USD $500 deposit</strong>.
          </p>
        </div>

        {/* Form */}
        <ApplicationForm />
      </section>
    </main>
  )
}