"use client"
// components/admin/content/image-picker.tsx
import { useState, useEffect } from "react"
import Image from "next/image"

interface SanityImage {
  _id: string
  url: string
  originalFilename?: string
  width?: number
  height?: number
}

interface ImagePickerProps {
  value: string | null
  onChange: (id: string, url: string) => void
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [images, setImages] = useState<SanityImage[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch("/api/sanity/images")
      .then((r) => r.json())
      .then((data) => { setImages(data); setLoading(false) })
  }, [])

  const selected = images.find((img) => img._id === value)

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-brand-blue">Course Photo</label>

      {/* Preview selezionata */}
      {selected ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-brand-green">
          <Image src={selected.url} alt={selected.originalFilename ?? ""} fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full h-24 border-2 border-dashed border-brand-azure rounded-lg flex items-center justify-center text-brand-blue/50 hover:border-brand-blue hover:text-brand-blue transition-colors text-sm"
        >
          {open ? "Close gallery" : "Select photo from library"}
        </button>
      )}

      {/* Galleria */}
      {open && !selected && (
        <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 max-h-64 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400 py-4 text-sm">Loading images...</p>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-400 py-4 text-sm">No images found in Sanity.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.map((img) => (
                <button
                  key={img._id}
                  type="button"
                  onClick={() => { onChange(img._id, img.url); setOpen(false) }}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-green transition-all"
                >
                  <Image src={img.url} alt={img.originalFilename ?? ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}