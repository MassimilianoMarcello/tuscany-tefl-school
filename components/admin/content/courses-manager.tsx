"use client"
// components/admin/content/courses-manager.tsx
import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImagePicker } from "./image-picker"
import { Pencil, Trash2, Plus, Eye, EyeOff, Star } from "lucide-react"
import { format } from "date-fns"

interface Course {
  _id: string
  name: string
  hours: number
  level: string
  price: number
  discount?: number
  startDate: string
  endDate: string
  completionTimeWeeks: number
  description?: string
  published: boolean
  featured: boolean
  photoId?: string
  photoUrl?: string
}

const emptyForm = {
  name: "",
  hours: "",
  level: "Beginner",
  price: "",
  discount: "",
  startDate: "",
  endDate: "",
  completionTimeWeeks: "",
  description: "",
  published: false,
  featured: false,
  photoId: "",
  photoUrl: "",
}

export function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCourses() }, [])

  async function fetchCourses() {
    setLoading(true)
    const res = await fetch("/api/sanity/courses")
    setCourses(await res.json())
    setLoading(false)
  }

  function handleEdit(course: Course) {
    setEditing(course._id)
    setForm({
      name: course.name,
      hours: String(course.hours),
      level: course.level,
      price: String(course.price),
      discount: String(course.discount ?? ""),
      startDate: course.startDate,
      endDate: course.endDate,
      completionTimeWeeks: String(course.completionTimeWeeks),
      description: course.description ?? "",
      published: course.published,
      featured: course.featured,
      photoId: course.photoId ?? "",
      photoUrl: course.photoUrl ?? "",
    })
    setShowForm(true)
  }

  function handleNew() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    const method = editing ? "PATCH" : "POST"
    const body = editing ? { id: editing, ...form } : form

    await fetch("/api/sanity/courses", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setShowForm(false)
    setEditing(null)
    await fetchCourses()
    setSaving(false)
  }

  async function toggleField(id: string, field: "published" | "featured", value: boolean) {
    await fetch("/api/sanity/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    })
    setCourses((prev) =>
      prev.map((c) => (c._id === id ? { ...c, [field]: value } : c))
    )
  }

  async function deleteCourse(id: string) {
    if (!confirm("Delete this course?")) return
    await fetch("/api/sanity/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setCourses((prev) => prev.filter((c) => c._id !== id))
  }

  if (loading) return <p className="text-gray-400 py-8 text-center">Loading...</p>

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleNew}
          className="bg-brand-green hover:bg-brand-green-dark text-white gap-2"
        >
          <Plus className="h-4 w-4" /> New Course
        </Button>
      </div>

      {/* Form create/edit */}
      {showForm && (
        <div className="bg-white border border-brand-azure rounded-xl p-6 space-y-4">
          <h3 className="font-black text-brand-blue text-lg">
            {editing ? "Edit Course" : "New Course"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-brand-blue">Course Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
                placeholder="e.g. TEFL Advanced Course"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-blue">Hours</label>
              <input
                type="number"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-blue">Level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-blue">Price (€)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-blue">Discount (%)</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-blue">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-blue">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-blue">Completion (weeks)</label>
              <input
                type="number"
                value={form.completionTimeWeeks}
                onChange={(e) => setForm({ ...form, completionTimeWeeks: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-brand-blue">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-blue resize-none"
                placeholder="Course description..."
              />
            </div>

            <div className="md:col-span-2">
              <ImagePicker
                value={form.photoId || null}
                onChange={(id, url) => setForm({ ...form, photoId: id, photoUrl: url })}
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 accent-brand-green"
                />
                <span className="text-sm font-semibold text-brand-blue">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 accent-brand-gold"
                />
                <span className="text-sm font-semibold text-brand-blue">Featured on Homepage</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-blue hover:bg-brand-blue-dark text-white"
            >
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Course"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowForm(false); setEditing(null) }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Lista corsi */}
      {courses.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No courses found.</p>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4"
            >
              {/* Foto */}
              <div className="shrink-0">
                {course.photoUrl ? (
                  <Image
                    src={course.photoUrl}
                    alt={course.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-brand-azure/30 flex items-center justify-center text-brand-blue text-xs font-bold">
                    No img
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-brand-blue">{course.name}</span>
                  <Badge className="bg-brand-azure text-brand-blue text-xs">{course.level}</Badge>
                  <Badge className={course.published ? "bg-brand-green text-white" : "bg-gray-100 text-gray-500"}>
                    {course.published ? "Published" : "Draft"}
                  </Badge>
                  {course.featured && (
                    <Badge className="bg-brand-gold text-brand-blue">⭐ Featured</Badge>
                  )}
                </div>
                <div className="flex gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                  <span>{course.hours}h</span>
                  <span>€{course.price}{course.discount ? ` (-${course.discount}%)` : ""}</span>
                  <span>{format(new Date(course.startDate), "dd/MM/yyyy")} → {format(new Date(course.endDate), "dd/MM/yyyy")}</span>
                  <span>{course.completionTimeWeeks} weeks</span>
                </div>
              </div>

              {/* Azioni */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleField(course._id, "published", !course.published)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title={course.published ? "Unpublish" : "Publish"}
                >
                  {course.published
                    ? <EyeOff className="h-4 w-4 text-gray-400" />
                    : <Eye className="h-4 w-4 text-brand-green" />
                  }
                </button>
                <button
                  onClick={() => toggleField(course._id, "featured", !course.featured)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title={course.featured ? "Remove from featured" : "Add to featured"}
                >
                  <Star className={`h-4 w-4 ${course.featured ? "text-brand-gold fill-brand-gold" : "text-gray-300"}`} />
                </button>
                <button
                  onClick={() => handleEdit(course)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4 text-brand-blue" />
                </button>
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}