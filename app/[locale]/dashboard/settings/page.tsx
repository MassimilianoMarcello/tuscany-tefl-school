// app/[locale]/dashboard/settings/page.tsx
import { getTranslations } from "next-intl/server"
import { ChangePasswordForm } from "@/components/auth/change-password-form"

export default async function SettingsPage() {
  const t = await getTranslations("settings")

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <ChangePasswordForm />
    </div>
  )
}