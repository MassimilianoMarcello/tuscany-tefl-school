"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale } from "next-intl"
import { UserPlus, Eye, EyeOff, Loader2 } from "lucide-react"
import { registerAction } from "@/actions/register"
import { registerSchema } from "@/lib/validations/auth"
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
import { PasswordRequirements } from "./password-requirements"

export function RegisterForm() {
  const router = useRouter()
  const t = useTranslations("auth.register")
  const locale = useLocale()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    registerAction,
    zodResolver(registerSchema),
    {
      formProps: {
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
      },
      actionProps: {
        onSuccess: ({ input }) => {
          router.push(`/${locale}/verify-email?email=${encodeURIComponent(input.email)}`)
        },
      },
    }
  )

  return (
    <AuthCard title={t("title")} description={t("description")} icon={UserPlus}>
      {action.result?.serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{action.result.serverError}</AlertDescription>
        </Alert>
      )}

      <GoogleButton label={t("googleButton")} />

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
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("namePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
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
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
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

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("confirmPasswordPlaceholder")}
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

          <Button type="submit" className="w-full" disabled={action.isPending}>
            {action.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              {t("login")}
            </a>
          </p>
        </form>
      </Form>
    </AuthCard>
  )
}
