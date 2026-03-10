"use server";

import { z } from "zod";

import { auth } from "@/lib/auth";
import { passwordSchema } from "@/lib/validations/password";

type ActionResult = { success: true } | { success: false; error: string };

const registerSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  email: z.email("Email non valida"),
  password: passwordSchema,
});

export async function registerAction(data: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await auth.api.signUpEmail({
      body: parsed.data,
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Qualcosa è andato storto",
    };
  }
}

const loginSchema = z.object({
  email: z.email("Email non valida"),
  password: z.string().min(1, "Inserisci la password"),
});

export async function loginAction(data: unknown): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await auth.api.signInEmail({
      body: parsed.data,
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Credenziali non valide",
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await auth.api.signOut()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Errore durante il logout",
    }
  }
}
