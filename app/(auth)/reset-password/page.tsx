// app/(auth)/reset-password/page.tsx
// Better Auth reindirizza qui dopo il click sul link nell'email con:
// - ?token=VALID_TOKEN  → mostra il form
// - ?error=INVALID_TOKEN → token scaduto o non valido

import { XCircle } from "lucide-react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthFeedback } from "@/components/auth/auth-feedback"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; error?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token, error } = await searchParams

  // ✅ Token scaduto o non valido
  if (error === "INVALID_TOKEN" || (!token && !error)) {
    return (
      <AuthFeedback
        type="error"
        title="Link non valido"
        description="Il link per reimpostare la password è scaduto o non è valido. Richiedi un nuovo link."
        icon={XCircle}
        action={{
          label: "Richiedi nuovo link",
          href: "/forgot-password",
        }}
      />
    )
  }

  // ✅ Token valido — mostra il form passando il token come prop
  return <ResetPasswordForm token={token!} />
}