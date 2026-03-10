// components/auth/login-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { LogIn, Eye, EyeOff } from "lucide-react"
import { loginAction } from "@/actions/auth"
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

const loginSchema = z.object({
  email: z.email("Email non valida"),
  password: z.string().min(1, "Inserisci la password"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormData) {
    setError(null)

    const result = await loginAction({
      email: data.email,
      password: data.password,
    })

    if (!result.success) {
      setError(result.error ?? "Qualcosa è andato storto")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <AuthCard
      title="Bentornato"
      description="Accedi al tuo account"
      icon={LogIn}
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        
        <a  href="/forgot-password"
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

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Accesso in corso..." : "Accedi"}
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