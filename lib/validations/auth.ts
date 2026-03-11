// lib/validations/auth.ts
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

// ✅ Change password — richiede password attuale + nuova + conferma
//    Validazione extra: la nuova password deve essere diversa da quella attuale
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Inserisci la password attuale" }),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Le password non coincidono",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    error: "La nuova password deve essere diversa da quella attuale",
    path: ["newPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>