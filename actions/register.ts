// actions/register.ts
"use server"

import { actionClient } from "@/lib/safe-action"
import { registerSchema } from "@/lib/validations/auth"
import { auth } from "@/lib/auth"

export const registerAction = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    // ✅ parsedInput è già validato e tipizzato — nessun safeParse manuale
    // ✅ nextCookies() in lib/auth.ts gestisce i cookie automaticamente
    // ✅ callbackURL: dopo il click sul link di verifica,
    //    Better Auth reindirizza a /login invece che alla homepage
    await auth.api.signUpEmail({
      body: { name, email, password },
      query: { callbackURL: "/login" },
    })

    // Nessun return { success: true } manuale — next-safe-action lo gestisce
  })