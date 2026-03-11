// app/(auth)/verify-email/page.tsx
// Gestisce quattro stati:
// 1. ?error=invalid_token  — token scaduto o non valido
// 2. ?resent=true          — arriva dal login, Better Auth ha già reinviato la mail
// 3. ?email=...            — appena registrato, mostra bottone reinvia
// 4. nessun parametro      — accesso diretto

import { Mail, XCircle } from "lucide-react"
import { ResendVerificationButton } from "@/components/auth/resend-verification-button"
import { AuthFeedback } from "@/components/auth/auth-feedback"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface VerifyEmailPageProps {
  searchParams: Promise<{
    error?: string
    email?: string
    resent?: string
  }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { error, email, resent } = await searchParams

  // ✅ Token scaduto o non valido
  if (error === "invalid_token") {
    return (
      <AuthFeedback
        type="error"
        title="Link non valido"
        description="Il link di verifica è scaduto o non è valido. Richiedi un nuovo link."
        icon={XCircle}
        action={{
          label: "Torna al login",
          href: "/login",
        }}
      />
    )
  }

  // ✅ Arriva dal login — Better Auth ha già reinviato la mail automaticamente
  if (resent === "true") {
    return (
      <AuthCard
        title="Email non verificata"
        description="Abbiamo inviato un nuovo link di verifica al tuo indirizzo. Controlla la casella email."
        icon={Mail}
      >
        <div className="flex flex-col gap-3 pt-2">
          {email && <ResendVerificationButton email={email} />}
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Torna al login</Link>
          </Button>
        </div>
      </AuthCard>
    )
  }

  // ✅ Appena registrato
  return (
    <AuthCard
      title="Controlla la tua email"
      description="Ti abbiamo inviato un link di verifica. Clicca il link nell'email per attivare il tuo account."
      icon={Mail}
    >
      <div className="flex flex-col gap-3 pt-2">
        {email && <ResendVerificationButton email={email} />}
        <Button variant="outline" asChild className="w-full">
          <Link href="/login">Torna al login</Link>
        </Button>
      </div>
    </AuthCard>
  )
}
