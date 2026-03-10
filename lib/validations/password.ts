// lib/validations/password.ts
import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Minimo 8 caratteri")
  .refine((val) => /[A-Z]/.test(val), {
    message: "Almeno una lettera maiuscola",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Almeno un numero",
  })
  .refine((val) => /[^A-Za-z0-9]/.test(val), {
    message: "Almeno un simbolo (es. !@#$%)",
  })