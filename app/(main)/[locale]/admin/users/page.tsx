// app/[locale]/admin/users/page.tsx
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import { verifyAdmin } from "@/lib/dal"
import { UsersTable } from "@/components/admin/users-table"

export default async function AdminUsersPage() {
  const t = await getTranslations("admin.users")
  const session = await verifyAdmin()

  // ✅ Carica utenti con il provider (email o google) dalla tabella account
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      accounts: {
        select: { providerId: true },
        take: 1,
      },
    },
  })

  const usersWithProvider = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user as unknown as { role: "USER" | "ADMIN" }).role,
    createdAt: user.createdAt,
    provider: user.accounts[0]?.providerId ?? null,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <UsersTable users={usersWithProvider} currentUserId={session.user.id} />
    </div>
  )
}