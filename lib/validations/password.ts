// lib/validations/password.ts
// ✅ Zod v4: import da "zod/v4" — migrabile incrementalmente senza toccare il resto
import * as z from "zod/v4"

export const passwordSchema = z
  .string()
  .min(8, { error: "Minimo 8 caratteri" })
  .refine((val) => /[A-Z]/.test(val), {
    error: "Almeno una lettera maiuscola",
  })
  .refine((val) => /[0-9]/.test(val), {
    error: "Almeno un numero",
  })
  .refine((val) => /[^A-Za-z0-9]/.test(val), {
    error: "Almeno un simbolo (es. !@#$%)",
  })