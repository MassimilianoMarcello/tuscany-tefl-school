import { getTranslations } from "next-intl/server"

export default async function DashboardPage() {
  const t = await getTranslations("dashboard")

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("welcome")}</h1>
      <p className="text-muted-foreground">{t("ready")}</p>
    </div>
  )
}