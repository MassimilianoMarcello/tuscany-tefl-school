// lib/validations/auth.ts
// ✅ Schema centralizzati — importati sia dai form client che dalle server actions.
//    Nessuna duplicazione. Una modifica qui si propaga ovunque.

import * as z from "zod/v4"
import { passwordSchema } from "./password"

export const registerSchema = z
  .object({
    name: z.string().min(2, { error: "Il nome deve avere almeno 2 caratteri" }),
    email: z.email({ error: "Email non valida" }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Le password non coincidono",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.email({ error: "Email non valida" }),
  password: z.string().min(1, { error: "Inserisci la password" }),
})

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Email non valida" }),
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Le password non coincidono",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>