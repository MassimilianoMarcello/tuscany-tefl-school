import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // ✅ Logga sempre per debug
    console.error("[safe-action] errore:", e.message)
   if (e.message === "Email not verified") {
    return "EMAIL_NOT_VERIFIED"  // ← codice che puoi intercettare
  }
    // Errori di business noti
    if (e.message === "EMAIL_ALREADY_EXISTS") {
      return "Questa email è già registrata"
    }
    if (e.message === "INVALID_CREDENTIALS") {
      return "Email o password non corretti"
    }

    // ✅ Passa il messaggio originale di Better Auth invece di nasconderlo
    //    così onError nel form può leggere il 403 o "verify" e fare il redirect
    return e.message ?? "Si è verificato un errore. Riprova più tardi."
  },
})