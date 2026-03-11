// lib/safe-action.ts
// ✅ Client centrale di next-safe-action.
//    Creato una volta, importato in tutte le actions.
//    handleServerError: mappa gli errori interni a messaggi user-friendly
//    senza mai esporre stack trace o dettagli tecnici al client.

import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // Errori di business noti — mappati a messaggi italiani
    if (e.message === "EMAIL_ALREADY_EXISTS") {
      return "Questa email è già registrata"
    }
    if (e.message === "INVALID_CREDENTIALS") {
      return "Email o password non corretti"
    }
    // Errori inattesi — non esporre mai dettagli interni
    console.error("[safe-action] Errore server non gestito:", e)
    return "Si è verificato un errore. Riprova più tardi."
  },
})