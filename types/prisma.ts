import type { User as PrismaUser } from "@prisma/client"

export type UserWithRole = PrismaUser & {
  role: "USER" | "ADMIN"
}
