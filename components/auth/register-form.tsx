"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus, Eye, EyeOff,Loader2 } from "lucide-react"
import { registerAction } from "@/actions/register"
import { registerSchema } from "@/lib/validations/auth"
import { AuthCard } from "./auth-card"
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

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ✅ useHookFormAction: connette safe action + RHF in un unico hook.
  //    - Validazione client con Zod (resolver)
  //    - Submit gestito da handleSubmitWithAction
  //    - Errori server in action.result.serverError
  //    - Loading in action.isPending
  //    - Nessun useState per error/isSubmitting
const { form, action, handleSubmitWithAction } = useHookFormAction(
    registerAction,
    zodResolver(registerSchema),
    {
      formProps: {
        defaultValues: {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      },
      actionProps: {
        // ✅ Passa l'email come query param così verify-email
        //    può mostrare il bottone "Reinvia email"
    onSuccess: ({ input }) => {
  router.push(`/verify-email?email=${encodeURIComponent(input.email)}`)
},
      },
    }
  )

  return (
    <AuthCard
      title="Crea un account"
      description="Inserisci i tuoi dati per registrarti"
      icon={UserPlus}
    >
      {action.result?.serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{action.result.serverError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          {/* Nome */}
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Mario Rossi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="mario@esempio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimo 8 caratteri"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <PasswordRequirements value={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conferma Password */}
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conferma password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ripeti la password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ✅ action.isPending sostituisce form.formState.isSubmitting */}
         <Button type="submit" className="w-full" disabled={action.isPending}>
  {action.isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Registrazione...
    </>
  ) : (
    "Registrati"
  )}
</Button>
          <p className="text-center text-sm text-muted-foreground">
            Hai già un account?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Accedi
            </a>
          </p>
        </form>
      </Form>
    </AuthCard>
  )
}
