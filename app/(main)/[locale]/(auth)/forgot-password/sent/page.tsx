// app/[locale]/(auth)/forgot-password/sent/page.tsx
import { getTranslations } from "next-intl/server"
import { Mail } from "lucide-react"
import { AuthFeedback } from "@/components/auth/auth-feedback"

export default async function ForgotPasswordSentPage() {
  const t = await getTranslations("auth.forgotPasswordSent")

  return (
    <AuthFeedback
      type="success"
      title={t("title")}
      description={t("description")}
      icon={Mail}
      action={{ label: t("backToLogin"), href: "/login" }}
    />
  )
}