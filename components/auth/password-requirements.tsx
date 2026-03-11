import { useTranslations } from "next-intl"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordRequirementsProps {
  value: string
}

export function PasswordRequirements({ value }: PasswordRequirementsProps) {
  const t = useTranslations("passwordRequirements")

  const requirements = [
    { label: t("minChars"), test: (v: string) => v.length >= 8 },
    { label: t("uppercase"), test: (v: string) => /[A-Z]/.test(v) },
    { label: t("number"), test: (v: string) => /[0-9]/.test(v) },
    { label: t("symbol"), test: (v: string) => /[^A-Za-z0-9]/.test(v) },
  ]

  if (!value) return null

  return (
    <ul className="space-y-1 mt-2">
      {requirements.map(({ label, test }) => {
        const met = test(value)
        return (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors duration-200",
              met ? "text-green-500" : "text-muted-foreground"
            )}
          >
            {met ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
            {label}
          </li>
        )
      })}
    </ul>
  )
}