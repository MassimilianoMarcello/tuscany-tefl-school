"use client"
// components/reviews/review-form.tsx
// ✅ Salva su Sanity come bozza con published: false — l'admin approva dalla dashboard
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

interface ReviewFormProps {
  locale: string
}

export function ReviewForm({ locale }: ReviewFormProps) {
  const t = useTranslations("reviews")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    city: "",
    state: "",
    title: "",
    review: "",
    rating: 5,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Submission failed")
      setSuccess(true)
    } catch {
      setError(t("formError"))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl font-black text-brand-green mb-2">🎉 {t("formSuccess")}</p>
        <p className="text-brand-blue/60">{t("formSuccessSub")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Nome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("fieldName")}
          required
          className="px-4 py-3 rounded-lg border border-gray-200 text-brand-blue focus:outline-none focus:border-brand-azure text-sm"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder={t("fieldCity")}
          className="px-4 py-3 rounded-lg border border-gray-200 text-brand-blue focus:outline-none focus:border-brand-azure text-sm"
        />
      </div>

      <input
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder={t("fieldState")}
        className="px-4 py-3 rounded-lg border border-gray-200 text-brand-blue focus:outline-none focus:border-brand-azure text-sm"
      />

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder={t("fieldTitle")}
        required
        className="px-4 py-3 rounded-lg border border-gray-200 text-brand-blue focus:outline-none focus:border-brand-azure text-sm"
      />

      <textarea
        name="review"
        value={form.review}
        onChange={handleChange}
        placeholder={t("fieldReview")}
        required
        rows={4}
        className="px-4 py-3 rounded-lg border border-gray-200 text-brand-blue focus:outline-none focus:border-brand-azure text-sm resize-none"
      />

      {/* Rating */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-brand-blue font-semibold">{t("fieldRating")}:</span>
        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="px-3 py-2 rounded-lg border border-gray-200 text-brand-blue focus:outline-none focus:border-brand-azure text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"⭐".repeat(n)} ({n})
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="bg-brand-blue hover:bg-brand-blue-dark text-white uppercase font-black tracking-wide py-4"
      >
        {loading ? t("formSubmitting") : t("formSubmit")}
      </Button>
    </form>
  )
}