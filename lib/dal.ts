// lib/dal.ts — Data Access Layer
// ✅ Livello 2 di protezione — validazione reale della sessione con il DB.
//    Usato nei layout e nelle pagine server-side.
//    cache() di React memoizza il risultato durante lo stesso render pass —
//    più chiamate a verifySession() in un render fanno una sola query al DB.

import "server-only"
import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./auth"

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return session
})

// ✅ Verifica che l'utente sia admin — usato nei layout del pannello admin
export const verifyAdmin = cache(async () => {
  const session = await verifySession()

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return session
})