// app/(main)/[locale]/our_teachers/[slug]/page.tsx
import { getTeachers } from "@/lib/sanity.queries"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { Button } from "@/components/ui/button"
import { client } from "@/lib/sanity.client"
import { groq } from "next-sanity"

interface TeacherDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const teachers = await getTeachers()
  return teachers.map((t) => ({ slug: t.slug }))
}

export default async function TeacherDetailPage({ params }: TeacherDetailPageProps) {
  const { locale, slug } = await params
  const t = await getTranslations("teachers")

  const teacher = await client.fetch(
    groq`*[_type == "teachers" && slug.current == $slug][0]{
      _id,
      name,
      role,
      "idPhoto": idPhoto.asset->url,
      infoParagraph,
      content,
      "slug": slug.current
    }`,
    { slug }
  )

  if (!teacher) notFound()

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <div className="relative bg-brand-blue overflow-hidden py-16">
        <span className="absolute right-0 top-0 h-40 w-32 bg-brand-gold z-0" />
        <span className="absolute left-0 bottom-0 h-32 w-16 bg-brand-azure z-0" />
        <div className="max-w-5xl mx-auto px-8 relative z-10 flex items-center gap-8">
          {teacher.idPhoto && (
            <Image
              src={teacher.idPhoto}
              alt={teacher.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-brand-azure h-28 w-28 object-cover shrink-0"
            />
          )}
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white">{teacher.name}</h1>
            <p className="text-brand-gold font-semibold mt-2 text-lg">{teacher.role}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        {/* Bio breve */}
        {teacher.infoParagraph && (
          <div className="bg-[rgb(231,248,248)] p-8 text-lg text-brand-blue leading-relaxed border-l-4 border-brand-gold">
            {teacher.infoParagraph}
          </div>
        )}

        {/* Bio completa rich text */}
        {teacher.content && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="prose prose-lg text-brand-blue leading-relaxed">
              {Array.isArray(teacher.content) ? (
                <PortableText value={teacher.content as PortableTextBlock[]} />
              ) : (
                <p>{teacher.content as string}</p>
              )}
            </div>
          </div>
        )}

        {/* Back button */}
        <Button
          asChild
          variant="outline"
          className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white uppercase font-bold tracking-wide"
        >
          <Link href={`/${locale}/our_teachers`}>{t("backToTeachers")}</Link>
        </Button>
      </div>
    </main>
  )
}