"use client"
// components/faq/faq-list.tsx
// ✅ Client component per l'accordion interattivo
import { useState } from "react"
import { PortableText, type PortableTextBlock } from "@portabletext/react"
import { ChevronDown } from "lucide-react"
import type { Faq } from "@/lib/sanity.queries"

interface FaqListProps {
  faqs: Faq[]
}

export function FaqList({ faqs }: FaqListProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = openId === faq._id

        return (
          <div
            key={faq._id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Domanda */}
            <button
              onClick={() => setOpenId(isOpen ? null : faq._id)}
              className="w-full flex items-center justify-between px-6 py-5 text-left group"
            >
              <span className="font-bold text-brand-blue text-base pr-4 group-hover:text-brand-green transition-colors">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-brand-gold shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Risposta — accordion */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-screen" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-6 text-brand-blue/80 leading-relaxed border-t-2 border-brand-gold pt-4">
                {Array.isArray(faq.answer) ? (
                  <div className="prose prose-sm text-brand-blue">
                    <PortableText value={faq.answer as PortableTextBlock[]} />
                  </div>
                ) : (
                  <p>{faq.answer as string}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}