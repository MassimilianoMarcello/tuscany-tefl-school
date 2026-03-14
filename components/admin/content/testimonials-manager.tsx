"use client"
// components/admin/content/testimonials-manager.tsx
import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Trash2, Star } from "lucide-react"
import { format } from "date-fns"

interface Testimonial {
  _id: string
  name: string
  city?: string
  state?: string
  title?: string
  review: string
  rating?: number
  published: boolean
  _createdAt: string
  imageUrl?: string
}

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "published">("pending")

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    setLoading(true)
    const res = await fetch("/api/sanity/testimonials")
    const data = await res.json()
    setTestimonials(data)
    setLoading(false)
  }

  async function togglePublished(id: string, published: boolean) {
    await fetch("/api/sanity/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published }),
    })
    setTestimonials((prev) =>
      prev.map((t) => (t._id === id ? { ...t, published } : t))
    )
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this review?")) return
    await fetch("/api/sanity/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setTestimonials((prev) => prev.filter((t) => t._id !== id))
  }

  const filtered = testimonials.filter((t) => {
    if (filter === "pending") return !t.published
    if (filter === "published") return t.published
    return true
  })

  const pendingCount = testimonials.filter((t) => !t.published).length

  if (loading) return <p className="text-gray-400 py-8 text-center">Loading...</p>

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["pending", "published", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              filter === f
                ? "bg-brand-blue text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No reviews found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t._id}
              className={`bg-white rounded-xl border p-4 flex gap-4 ${
                !t.published ? "border-brand-gold/50 bg-amber-50/30" : "border-gray-100"
              }`}
            >
              {/* Foto */}
              <div className="shrink-0">
                {t.imageUrl ? (
                  <Image
                    src={t.imageUrl}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-black">
                    {t.name[0]}
                  </div>
                )}
              </div>

              {/* Contenuto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-brand-blue text-sm">{t.name}</span>
                  {t.city && <span className="text-xs text-gray-400">{t.city}{t.state ? `, ${t.state}` : ""}</span>}
                  {t.rating && (
                    <span className="text-brand-gold text-xs">{"⭐".repeat(t.rating)}</span>
                  )}
                  <Badge className={t.published ? "bg-brand-green text-white" : "bg-amber-100 text-amber-700"}>
                    {t.published ? "Published" : "Pending"}
                  </Badge>
                  <span className="text-xs text-gray-300 ml-auto">
                    {format(new Date(t._createdAt), "dd/MM/yyyy")}
                  </span>
                </div>
                {t.title && <p className="text-sm font-semibold text-brand-blue mt-1">"{t.title}"</p>}
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.review}</p>
              </div>

              {/* Azioni */}
              <div className="flex flex-col gap-2 shrink-0">
                {!t.published ? (
                  <Button
                    size="sm"
                    className="bg-brand-green hover:bg-brand-green-dark text-white h-8 w-8 p-0"
                    onClick={() => togglePublished(t._id, true)}
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-300 text-amber-600 hover:bg-amber-50 h-8 w-8 p-0"
                    onClick={() => togglePublished(t._id, false)}
                    title="Unpublish"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-400 hover:bg-red-50 h-8 w-8 p-0"
                  onClick={() => deleteTestimonial(t._id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}