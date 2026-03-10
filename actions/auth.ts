// actions/auth.ts
"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { passwordSchema } from "@/lib/validations/password"

const registerSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  email: z.email("Email non valida"),
  password: passwordSchema,
})

export async function registerAction(data: unknown) {
  // Valida server-side
  const parsed = registerSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    }
  }

  try {
    await auth.api.signUpEmail({
      body: parsed.data, // usi i dati validati, non quelli raw
    })

    return { success: true }
 } catch (error) {
  const message =
    error instanceof Error ? error.message : "Qualcosa è andato storto"
  return {
    success: false,
    error: message,
  }
}
}