"use client"

// components/admin/users-table.tsx
import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { updateRoleAction } from "@/actions/update-role"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"

type UserWithProvider = {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  createdAt: Date
  provider: string | null
}

interface UsersTableProps {
  users: UserWithProvider[]
  currentUserId: string
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const t = useTranslations("admin.users")
  const [isPending, startTransition] = useTransition()
  const [pendingId, setPendingId] = useState<string | null>(null)

  function handleRoleToggle(userId: string, currentRole: "USER" | "ADMIN") {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    setPendingId(userId)
    startTransition(async () => {
      await updateRoleAction({ userId, role: newRole })
      setPendingId(null)
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead>{t("email")}</TableHead>
          <TableHead>{t("role")}</TableHead>
          <TableHead>{t("provider")}</TableHead>
          <TableHead>{t("joined")}</TableHead>
          <TableHead>{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {user.provider ?? "email"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {/* ✅ Non permettere all'admin di degradare se stesso */}
              {user.id !== currentUserId && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending && pendingId === user.id}
                  onClick={() => handleRoleToggle(user.id, user.role)}
                >
                  {isPending && pendingId === user.id ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      {t("promoting")}
                    </>
                  ) : user.role === "ADMIN" ? (
                    t("makeUser")
                  ) : (
                    t("makeAdmin")
                  )}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
