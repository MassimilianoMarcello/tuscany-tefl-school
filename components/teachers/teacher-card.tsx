// components/teachers/teacher-card.tsx
import Image from "next/image"
import Link from "next/link"
import type { Teacher } from "@/lib/sanity.queries"

interface TeacherCardProps {
  teacher: Teacher
  locale: string
}

export function TeacherCard({ teacher, locale }: TeacherCardProps) {
  return (
    <div className="relative bg-[#e2e9eb] rounded-xl overflow-hidden shadow-md group h-full flex flex-col">
      {/* Decorative square — non occupa spazio del contenuto */}
      <span className="absolute right-0 top-0 h-32 w-16 bg-brand-azure z-0 opacity-60" />

      <div className="relative z-10 p-8 flex flex-col items-center text-center gap-4 flex-1">
        {/* Foto circolare */}
        {teacher.idPhoto ? (
          <Image
            src={teacher.idPhoto}
            alt={teacher.name}
            width={160}
            height={160}
            className="rounded-full border-4 border-brand-azure object-cover h-40 w-40 shrink-0"
          />
        ) : (
          <div className="h-40 w-40 rounded-full bg-brand-blue flex items-center justify-center text-white font-black text-4xl border-4 border-brand-azure shrink-0">
            {teacher.name[0]}
          </div>
        )}

        {/* Nome e ruolo — altezza fissa per uniformità tra le card */}
        <div className="w-full px-2 border-t-2 border-brand-gold">
          <div className="h-24 flex flex-col justify-center gap-1 border-b-2 border-brand-gold py-2">
            <h3 className="text-xl font-black text-brand-blue line-clamp-2 leading-tight">{teacher.name}</h3>
            <p className="text-sm text-brand-green font-semibold line-clamp-1">{teacher.role}</p>
          </div>
        </div>

        {/* Bio breve */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1 w-full text-left px-2">
          {teacher.infoParagraph ?? ""}
        </p>

        {/* Link sempre in fondo */}
        <Link
          href={`/${locale}/our_teachers/${teacher.slug}`}
          className="inline-block mt-auto text-xs font-black uppercase tracking-widest text-brand-blue border-b-2 border-brand-azure pb-1 hover:text-brand-green hover:border-brand-green transition-colors"
        >
          Read more →
        </Link>
      </div>
    </div>
  )
}