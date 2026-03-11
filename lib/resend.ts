// lib/resend.ts
// ✅ Client Resend centralizzato — importato da lib/auth.ts
//    Installazione: pnpm add resend

import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "✅ presente" : "❌ mancante")