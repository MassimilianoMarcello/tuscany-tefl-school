"use client"

// components/auth/change-password-form.tsx
// ✅ Change password richiede sessione attiva — gestito client-side con authClient
//    Non usa server action perché Better Auth verifica la sessione dai cookie
//    revokeOtherSessions: true — invalida tutte le altre sessioni per sicurezza

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { changePasswordSchema, ChangePasswordFormData } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordRequirements } from "./password-requirements"

export function ChangePasswordForm() {
  const router = useRouter()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ChangePasswordFormData) {
    setError(null)
    setSuccess(false)

    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      // ✅ Invalida tutte le altre sessioni attive per sicurezza
      revokeOtherSessions: true,
    })

    if (error) {
      // Mappa gli errori di Better Auth in messaggi italiani
      if (error.message?.includes("CREDENTIAL_ACCOUNT_NOT_FOUND")) {
        setError("Nessuna password associata a questo account. Usa Google per accedere.")
      } else if (error.message?.includes("invalid_password") || error.status === 400) {
        setError("La password attuale non è corretta.")
      } else {
        setError("Si è verificato un errore. Riprova più tardi.")
      }
      return
    }

    setSuccess(true)
    form.reset()

    // ✅ revokeOtherSessions ha invalidato le altre sessioni —
    //    questa sessione rimane attiva ma facciamo refresh per sicurezza
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {success && (
        <Alert className="border-green-500 text-green-700 bg-green-50">
          <AlertDescription>
            Password aggiornata con successo. Le altre sessioni attive sono state disconnesse.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Password attuale */}
          <FormField
            name="currentPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password attuale</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      placeholder="La tua password attuale"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nuova password */}
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nuova password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      placeholder="Minimo 8 caratteri"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <PasswordRequirements value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conferma nuova password */}
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conferma nuova password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ripeti la nuova password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : (
              "Aggiorna password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}