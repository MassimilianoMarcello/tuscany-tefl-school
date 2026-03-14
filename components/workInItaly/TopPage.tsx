// common-components/common-top-page/TopPage.tsx
import Image from "next/image"
import type { CommonTop } from "@/lib/sanity.queries"

interface Props {
  data: CommonTop | null
}

export default function CommonTopPage({ data }: Props) {
  if (!data) return null

  const { title, subtitle, backgroundImage } = data

  return (
    <div className="relative grid grid-cols-6">
      {/* ── Background image ───────────────────────────────────────── */}
      <div className="col-span-6">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={title}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            width={1400}
            height={560}
            priority
          />
        ) : (
          <div className="w-full h-72 bg-brand-blue" />
        )}
      </div>

      {/* ── Text overlay ───────────────────────────────────────────── */}
      <div
        className="
          absolute z-10
          border-t-8 border-brand-gold
          bg-brand-bg
          capitalize
          right-4 top-12
          sm:right-8 sm:top-16
          md:left-20 md:right-auto md:top-20
          lg:top-24
        "
      >
        <h1
          className="
            text-center text-brand-blue font-black capitalize
            text-2xl px-8 py-4
            sm:text-[2.8rem]
            lg:text-5xl
            xl:text-[5rem]
          "
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="
              text-center text-brand-blue font-black
              bg-brand-azure
              text-xs px-4 pb-4
              sm:text-[1.4rem]
              lg:text-base
              xl:text-[1.7rem]
            "
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}