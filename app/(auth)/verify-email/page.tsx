// app/(auth)/verify-email/page.tsx
// Pagina mostrata subito dopo la registrazione.
//    L'utente viene reindirizzato qui da register-form onSuccess.

import { Mail } from "lucide-react"
import { AuthFeedback } from "@/components/auth/auth-feedback"

export default function VerifyEmailPage() {
  return (
    <AuthFeedback
      type="success"
      title="Controlla la tua email"
      description="Ti abbiamo inviato un link di verifica. Clicca il link nell'email per attivare il tuo account."
      icon={Mail}
      action={{
        label: "Torna al login",
        href: "/login",
      }}
    />
  )
}
