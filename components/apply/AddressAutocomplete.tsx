"use client"

// components/apply/AddressAutocomplete.tsx
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin } from "lucide-react"

export type AddressResult = {
  address: string
  city: string
  postCode: string
  country: string
}

interface Props {
  onSelect: (result: AddressResult) => void
  error?: string
}

type GeoapifyFeature = {
  properties: {
    formatted?: string
    street?: string
    address_line1?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    postcode?: string
    country?: string
  }
}

export function AddressAutocomplete({ onSelect, error }: Props) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const search = async (value: string) => {
    if (value.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    setLoading(true)
    try {
      const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
      const params = new URLSearchParams({
        text: value,
        limit: "8",
        type: "street",   // solo strade — l'utente aggiunge il numero
        format: "geojson",
        apiKey: key ?? "",
      })

      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?${params}`
      )
      const data = await res.json()
      setSuggestions(data.features ?? [])
      setOpen(true)
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(value), 300)
  }

  const handleSelect = (feature: GeoapifyFeature) => {
    const p = feature.properties
    // Use street name only — user will add the number
    const street = p.street ?? p.address_line1 ?? p.formatted ?? ""
    const city = p.city ?? p.town ?? p.village ?? p.municipality ?? ""
    const postCode = p.postcode ?? ""
    const country = p.country ?? ""

    setQuery(street)
    setOpen(false)
    setSuggestions([])
    onSelect({ address: street, city, postCode, country })
  }

  return (
    <div ref={containerRef} className="relative">
      <Label className="text-brand-blue font-semibold mb-1 block">
        Street *{" "}
        <span className="text-brand-blue/40 text-xs font-normal">
          type the street name, then add the number
        </span>
      </Label>

      <div className="relative">
        <Input
          value={query}
          onChange={handleChange}
          placeholder="e.g. Via Roma"
          className="rounded-none border-brand-azure focus-visible:ring-brand-blue pr-9"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-brand-blue/40" />
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-brand-azure shadow-lg mt-1 max-h-72 overflow-y-auto">
          {suggestions.map((feature, i) => {
            const p = feature.properties
            const street = p.street ?? p.address_line1 ?? ""
            const city = p.city ?? p.town ?? p.village ?? p.municipality ?? ""
            const country = p.country ?? ""

            return (
              <li
                key={i}
                onMouseDown={() => handleSelect(feature)}
                className="flex items-start gap-2 px-4 py-3 cursor-pointer hover:bg-brand-bg border-b border-brand-azure/30 last:border-0"
              >
                <MapPin className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                <div className="text-sm text-brand-blue leading-snug">
                  <span className="font-semibold">{street}</span>
                  {city || country ? (
                    <span className="text-brand-blue/50 ml-1">
                      — {[city, country].filter(Boolean).join(", ")}
                    </span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}