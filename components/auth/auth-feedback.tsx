// components/auth/auth-feedback.tsx
//  Componente riutilizzabile per stati success/error dopo azioni auth.
//    Usato da: verify-email, reset-password, forgot-password, ecc.

import { LucideIcon, CheckCircle, XCircle } from "lucide-react"
import { AuthCard } from "./auth-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthFeedbackProps {
  type: "success" | "error"
  title: string
  description: string
  icon?: LucideIcon
  action?: {
    label: string
    href: string
  }
}

export function AuthFeedback({
  type,
  title,
  description,
  icon,
  action,
}: AuthFeedbackProps) {
  const DefaultIcon = type === "success" ? CheckCircle : XCircle

  return (
    <AuthCard
      title={title}
      description={description}
      icon={icon ?? DefaultIcon}
    >
      <div className="flex flex-col items-center gap-4 pt-2">
        <div
          className={
            type === "success"
              ? "flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10"
              : "flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
          }
        >
          <DefaultIcon
            className={
              type === "success"
                ? "h-8 w-8 text-green-500"
                : "h-8 w-8 text-destructive"
            }
          />
        </div>

        {action && (
          <Button asChild className="w-full">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </AuthCard>
  )
}