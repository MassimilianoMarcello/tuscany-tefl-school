// app/(main)/[locale]/our_teachers/page.tsx
import { getTeachers } from "@/lib/sanity.queries"
import { getTranslations } from "next-intl/server"
import { TeacherCard } from "@/components/teachers/teacher-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TeachersPageProps {
  params: Promise<{ locale: string }>
}

export default async function TeachersPage({ params }: TeachersPageProps) {
  const { locale } = await params
  const [teachers, t] = await Promise.all([
    getTeachers(),
    getTranslations("teachers"),
  ])

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="relative bg-brand-blue overflow-hidden">
        <span className="absolute right-0 top-0 h-40 w-32 bg-brand-gold z-10 hidden md:block" />
        <span className="absolute left-0 bottom-0 h-32 w-16 bg-brand-azure z-10" />
        <div className="max-w-5xl mx-auto px-8 py-20 relative z-20">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            {t("heroTitle")}
          </h1>
        </div>
      </div>

      {/* Intro testo — doppia colonna come originale */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[rgb(231,248,248)] p-8 text-lg text-brand-blue leading-relaxed">
          {t("introOne")}
        </div>
        <div className="bg-[rgb(231,248,248)] p-8 text-base text-brand-blue/80 font-light leading-relaxed">
          {t("introTwo")}
        </div>
      </div>

      {/* Grid teachers */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {teachers.length === 0 ? (
          <p className="text-center text-gray-500 py-16">{t("noTeachers")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher._id} teacher={teacher} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* Join the team CTA — dal vecchio buttonApplication */}
      <div className="w-full bg-brand-azure border-t-[1rem] border-brand-gold py-12 flex flex-col items-center gap-4">
        <Button
          asChild
          className="bg-brand-blue hover:bg-brand-blue-dark text-white uppercase font-black tracking-wide px-10 py-6 text-base rounded-full"
        >
          <Link href={`/${locale}/contact`}>{t("joinTeam")}</Link>
        </Button>
        <p className="text-white text-center">{t("joinTeamSub")}</p>
      </div>
    </main>
  )
}