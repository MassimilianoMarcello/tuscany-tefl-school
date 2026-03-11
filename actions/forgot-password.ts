// actions/forgot-password.ts
"use server"

import { actionClient } from "@/lib/safe-action"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { auth } from "@/lib/auth"

export const forgotPasswordAction = actionClient
  .inputSchema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    // ✅ Better Auth non restituisce errore se l'email non esiste —
    //    protezione contro email enumeration. Rispondiamo sempre con successo.
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/reset-password",
      },
    })
  })