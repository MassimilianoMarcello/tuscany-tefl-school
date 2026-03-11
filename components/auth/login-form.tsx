"use client"

// components/auth/login-form.tsx
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react"
import { loginAction } from "@/actions/login"
import { loginSchema } from "@/lib/validations/auth"
import { AuthCard } from "./auth-card"
import { GoogleButton } from "./google-button"
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

interface LoginFormProps {
  resetSuccess?: boolean
}

export function LoginForm({ resetSuccess }: LoginFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    loginAction,
    zodResolver(loginSchema),
    {
      formProps: {
        defaultValues: { email: "", password: "" },
      },
      actionProps: {
        onSuccess: () => {
          router.push("/dashboard")
          router.refresh()
        },
        onError: ({ error, input }) => {
          if (error.serverError === "EMAIL_NOT_VERIFIED") {
            router.push(
              `/verify-email?email=${encodeURIComponent(input.email)}&resent=true`
            )
          }
        },
      },
    }
  )

  return (
    <AuthCard title="Bentornato" description="Accedi al tuo account" icon={LogIn}>
      {/* Successo reset password */}
      {resetSuccess && (
        <Alert className="mb-4 border-green-500 text-green-700 bg-green-50">
          <AlertDescription>
            Password aggiornata. Accedi con la nuova password.
          </AlertDescription>
        </Alert>
      )}

      {/* Errore server */}
      {action.result?.serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{action.result.serverError}</AlertDescription>
        </Alert>
      )}

      {/* Bottone Google */}
      <GoogleButton label="Accedi con Google" />

      {/* Separatore */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">oppure</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
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

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Password dimenticata?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="La tua password"
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={action.isPending}>
            {action.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accesso in corso...
              </>
            ) : (
              "Accedi"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Non hai un account?{" "}
            <a href="/register" className="text-primary font-medium hover:underline">
              Registrati
            </a>
          </p>
        </form>
      </Form>
    </AuthCard>
  )
}