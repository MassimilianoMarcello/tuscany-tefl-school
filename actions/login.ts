// actions/login.ts
"use server"

import { actionClient } from "@/lib/safe-action"
import { loginSchema } from "@/lib/validations/auth"
import { auth } from "@/lib/auth"

export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    await auth.api.signInEmail({
      body: { email, password },
    })
  })