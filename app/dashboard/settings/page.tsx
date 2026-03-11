// app/dashboard/settings/page.tsx
import { ChangePasswordForm } from "@/components/auth/change-password-form"

export default function SettingsPage() {
  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Cambia password</h2>
        <p className="text-sm text-muted-foreground">
          Aggiorna la tua password. Le altre sessioni attive verranno disconnesse.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  )
}