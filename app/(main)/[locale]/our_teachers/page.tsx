// app/(main)/[locale]/our_teachers/page.tsx
import { getTeachers, getCommonTopPageByIdentifier } from "@/lib/sanity.queries"
import { getTranslations } from "next-intl/server"
import { TeacherCard } from "@/components/teachers/teacher-card"
import { CoursesHero } from "@/components/courses/courses-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TeachersPageProps {
  params: Promise<{ locale: string }>
}

export default async function TeachersPage({ params }: TeachersPageProps) {
  const { locale } = await params
  const [teachers, t, topPage] = await Promise.all([
    getTeachers(),
    getTranslations("teachers"),
    getCommonTopPageByIdentifier("our-teachers"), // 👈 usa l'identifier corretto da Sanity
  ])

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero — ora da Sanity */}
      <CoursesHero locale={locale} data={topPage} />

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

      {/* Join the team CTA */}
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
