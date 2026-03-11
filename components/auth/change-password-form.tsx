"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
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
  const t = useTranslations("auth.changePassword")
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
      revokeOtherSessions: true,
    })

    if (error) {
      if (error.message?.includes("CREDENTIAL_ACCOUNT_NOT_FOUND")) {
        setError(t("errorNoCredential"))
      } else if (error.message?.includes("invalid_password") || error.status === 400) {
        setError(t("errorInvalidPassword"))
      } else {
        setError(t("errorGeneric"))
      }
      return
    }

    setSuccess(true)
    form.reset()
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {success && (
        <Alert className="border-green-500 text-green-700 bg-green-50">
          <AlertDescription>{t("success")}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="currentPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("currentPassword")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      placeholder={t("currentPasswordPlaceholder")}
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

          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPassword")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      placeholder={t("newPasswordPlaceholder")}
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

          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder={t("confirmPasswordPlaceholder")}
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

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}