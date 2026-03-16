// components/reviews/review-form.tsx
"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

interface ReviewFormProps {
  locale: string
}

const inputClass =
  "w-full px-4 py-3 bg-white border border-brand-blue/20 text-brand-blue placeholder-brand-blue/30 focus:outline-none focus:border-brand-gold text-sm transition-colors"

export function ReviewForm({ locale: _locale }: ReviewFormProps) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      <div className="text-center py-12">
        <div aria-hidden="true" className="w-12 h-[3px] bg-brand-gold mx-auto mb-6" />
        <p className="font-serif-display text-2xl text-brand-green mb-2">
          {t("formSuccess")}
        </p>
        <p className="text-brand-blue/50 text-sm">{t("formSuccessSub")}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("fieldName")}
          required
          className={inputClass}
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder={t("fieldCity")}
          className={inputClass}
        />
      </div>

      <input
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder={t("fieldState")}
        className={inputClass}
      />

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder={t("fieldTitle")}
        required
        className={inputClass}
      />

      <textarea
        name="review"
        value={form.review}
        onChange={handleChange}
        placeholder={t("fieldReview")}
        required
        rows={5}
        className={`${inputClass} resize-none`}
      />

      {/* Rating — stelle SVG invece di emoji */}
      <div className="flex items-center gap-4">
        <span className="text-xs uppercase tracking-widest font-bold text-brand-blue/50">
          {t("fieldRating")}
        </span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, rating: n }))}
              aria-label={`${n} stelle`}
              className="focus:outline-none"
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  n <= form.rating ? "text-brand-gold" : "text-brand-blue/20"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs uppercase tracking-wide">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-brand-blue hover:bg-brand-blue-dark text-white uppercase tracking-widest text-xs font-black transition-colors disabled:opacity-50"
      >
        {loading ? t("formSubmitting") : t("formSubmit")}
      </button>

    </form>
  )
}