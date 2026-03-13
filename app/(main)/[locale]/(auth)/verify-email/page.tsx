// app/[locale]/(auth)/verify-email/page.tsx
import { getTranslations } from "next-intl/server"
import { Mail, XCircle } from "lucide-react"
import { ResendVerificationButton } from "@/components/auth/resend-verification-button"
import { AuthFeedback } from "@/components/auth/auth-feedback"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface VerifyEmailPageProps {
  searchParams: Promise<{
    error?: string
    email?: string
    resent?: string
  }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { error, email, resent } = await searchParams
  const t = await getTranslations("auth.verifyEmail")

  if (error === "invalid_token") {
    return (
      <AuthFeedback
        type="error"
        title={t("invalidTokenTitle")}
        description={t("invalidTokenDescription")}
        icon={XCircle}
        action={{ label: t("backToLogin"), href: "/login" }}
      />
    )
  }

  if (resent === "true") {
    return (
      <AuthCard title={t("resentTitle")} description={t("resentDescription")} icon={Mail}>
        <div className="flex flex-col gap-3 pt-2">
          {email && <ResendVerificationButton email={email} />}
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">{t("backToLogin")}</Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title={t("title")} description={t("description")} icon={Mail}>
      <div className="flex flex-col gap-3 pt-2">
        {email && <ResendVerificationButton email={email} />}
        <Button variant="outline" asChild className="w-full">
          <Link href="/login">{t("backToLogin")}</Link>
        </Button>
      </div>
    </AuthCard>
  )
}
