// app/(auth)/forgot-password/sent/page.tsx
// Pagina mostrata dopo aver inviato la richiesta di reset.
// Stessa UX di verify-email — sempre successo anche se l'email non esiste
// (protezione contro email enumeration)

import { Mail } from "lucide-react"
import { AuthFeedback } from "@/components/auth/auth-feedback"

export default function ForgotPasswordSentPage() {
  return (
    <AuthFeedback
      type="success"
      title="Controlla la tua email"
      description="Se l'indirizzo è associato a un account, riceverai un link per reimpostare la password. Il link scade tra 1 ora."
      icon={Mail}
      action={{
        label: "Torna al login",
        href: "/login",
      }}
    />
  )
}