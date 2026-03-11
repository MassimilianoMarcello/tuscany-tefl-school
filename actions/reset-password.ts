// actions/reset-password.ts
"use server"

import * as z from "zod/v4"
import { actionClient } from "@/lib/safe-action"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { auth } from "@/lib/auth"

export const resetPasswordAction = actionClient
  // ✅ bindArgsSchemas: il token viene dall'URL, non dal form.
  //    Viene validato separatamente e passato come primo argomento bound.
  .bindArgsSchemas<[token: z.ZodString]>([z.string().min(1)])
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput: { password }, bindArgsParsedInputs: [token] }) => {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    })
  })