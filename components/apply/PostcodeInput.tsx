"use client"

// components/apply/PostcodeInput.tsx
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"
import { validatePostcode } from "@/lib/apply-schema"

// Format hints per country
const POSTCODE_HINTS: Record<string, { example: string; placeholder: string }> = {
  "United States":    { example: "e.g. 90210 or 90210-1234", placeholder: "ZIP code" },
  "United Kingdom":   { example: "e.g. SW1A 1AA",            placeholder: "Postcode" },
  "Italy":            { example: "e.g. 50123",               placeholder: "CAP" },
  "Germany":          { example: "e.g. 10115",               placeholder: "PLZ" },
  "France":           { example: "e.g. 75001",               placeholder: "Code postal" },
  "Spain":            { example: "e.g. 28001",               placeholder: "Código postal" },
  "Canada":           { example: "e.g. K1A 0A9",             placeholder: "Postal code" },
  "Australia":        { example: "e.g. 2000",                placeholder: "Postcode" },
  "Netherlands":      { example: "e.g. 1234 AB",             placeholder: "Postcode" },
  "Belgium":          { example: "e.g. 1000",                placeholder: "Code postal" },
  "Switzerland":      { example: "e.g. 8001",                placeholder: "PLZ" },
  "Austria":          { example: "e.g. 1010",                placeholder: "PLZ" },
  "Portugal":         { example: "e.g. 1000-001",            placeholder: "Código postal" },
  "Brazil":           { example: "e.g. 01310-100",           placeholder: "CEP" },
  "Japan":            { example: "e.g. 100-0001",            placeholder: "郵便番号" },
}

interface Props {
  value: string
  country: string
  onChange: (v: string) => void
  onBlur: () => void
  error?: string
}

export function PostcodeInput({ value, country, onChange, onBlur, error }: Props) {
  const [touched, setTouched] = useState(false)

  const hint = POSTCODE_HINTS[country]
  const hasPattern = !!hint
  const isValid = value.length > 0 && validatePostcode(value, country)
  const isInvalid = touched && value.length > 0 && !validatePostcode(value, country)

  return (
    <div>
      <Label className="text-brand-blue font-semibold flex items-center gap-2">
        Post Code *
        {hint && (
          <span className="text-brand-blue/40 text-xs font-normal">
            {hint.example}
          </span>
        )}
      </Label>

      <div className="relative mt-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setTouched(true)
            onBlur()
          }}
          placeholder={hint?.placeholder ?? "Postcode / ZIP"}
          className={`
            rounded-none pr-9
            ${isValid
              ? "border-brand-green focus-visible:ring-brand-green"
              : isInvalid
              ? "border-red-400 focus-visible:ring-red-400"
              : "border-brand-azure focus-visible:ring-brand-blue"}
          `}
        />

        {/* Live feedback icon */}
        {value.length > 0 && hasPattern && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle2 className="h-4 w-4 text-brand-green" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400" />
            )}
          </div>
        )}
      </div>

      {/* Live hint while typing — shown before blur */}
      {!touched && value.length > 0 && hasPattern && !isValid && (
        <p className="text-brand-blue/50 text-xs mt-1">
          Format: {hint.example}
        </p>
      )}

      {/* Error after blur */}
      {(isInvalid || error) && (
        <p className="text-red-500 text-xs mt-1">
          {error ?? `Invalid format for ${country}. Expected: ${hint?.example}`}
        </p>
      )}
    </div>
  )
}