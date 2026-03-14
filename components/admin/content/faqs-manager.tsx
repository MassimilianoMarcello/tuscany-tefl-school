"use client"
// components/admin/content/faqs-manager.tsx
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"

interface Faq {
  _id: string
  question: string
  category?: string
  published: boolean
  _createdAt: string
}

const categoryLabels: Record<string, string> = {
  general: "General Questions",
  technical: "Paperwork & Documentation",
  living: "Living in Italy",
}

export function FaqsManager() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sanity/faqs")
      .then((r) => r.json())
      .then((data) => { setFaqs(data); setLoading(false) })
  }, [])

  async function togglePublished(id: string, published: boolean) {
    await fetch("/api/sanity/faqs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published }),
    })
    setFaqs((prev) => prev.map((f) => (f._id === id ? { ...f, published } : f)))
  }

  // Raggruppa per categoria
  const grouped = faqs.reduce<Record<string, Faq[]>>((acc, faq) => {
    const cat = faq.category ?? "general"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  if (loading) return <p className="text-gray-400 py-8 text-center">Loading...</p>

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="font-black text-brand-blue text-sm uppercase tracking-wide border-b-2 border-brand-gold pb-2 mb-3">
            {categoryLabels[category] ?? category}
          </h3>
          <div className="space-y-2">
            {items.map((faq) => (
              <div
                key={faq._id}
                className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-blue font-medium line-clamp-1">{faq.question}</p>
                </div>
                <Badge className={faq.published ? "bg-brand-green text-white shrink-0" : "bg-gray-100 text-gray-500 shrink-0"}>
                  {faq.published ? "Visible" : "Hidden"}
                </Badge>
                <button
                  onClick={() => togglePublished(faq._id, !faq.published)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                  title={faq.published ? "Hide" : "Show"}
                >
                  {faq.published
                    ? <EyeOff className="h-4 w-4 text-gray-400" />
                    : <Eye className="h-4 w-4 text-brand-green" />
                  }
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}