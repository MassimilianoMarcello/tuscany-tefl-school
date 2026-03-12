// actions/update-role.ts
"use server"

import * as z from "zod/v4"
import { actionClient } from "@/lib/safe-action"
import { verifyAdmin } from "@/lib/dal"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["USER", "ADMIN"]),
})

export const updateRoleAction = actionClient
  .inputSchema(updateRoleSchema)
  .action(async ({ parsedInput: { userId, role } }) => {
    // ✅ Verifica che chi chiama sia ADMIN — doppia protezione oltre al layout
    await verifyAdmin()

    // ✅ $executeRaw bypassa i tipi Prisma per il campo role gestito da Better Auth
    await prisma.$executeRaw`UPDATE "user" SET role = ${role}::"Role" WHERE id = ${userId}`

    revalidatePath("/admin/users")
  })