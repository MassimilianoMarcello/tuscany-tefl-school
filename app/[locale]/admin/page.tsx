// app/[locale]/admin/page.tsx
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { Users, UserCheck, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const t = await getTranslations("admin.overview")

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalUsers, newThisMonth, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: firstOfMonth } } }),
    prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM "user" WHERE role = 'ADMIN'`.then(r => Number(r[0].count)),
  ])

  const stats = [
    { label: t("totalUsers"), value: totalUsers, icon: Users },
    { label: t("newThisMonth"), value: newThisMonth, icon: UserCheck },
    { label: t("admins"), value: admins, icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}