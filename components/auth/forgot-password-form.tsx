"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, Loader2 } from "lucide-react"
import { forgotPasswordAction } from "@/actions/forgot-password"
import { forgotPasswordSchema } from "@/lib/validations/auth"
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

export function ForgotPasswordForm() {
  const router = useRouter()
  const t = useTranslations("auth.forgotPassword")

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    forgotPasswordAction,
    zodResolver(forgotPasswordSchema),
    {
      formProps: {
        defaultValues: { email: "" },
      },
      actionProps: {
        onSuccess: ({ input }) => {
          router.push(`/forgot-password/sent?email=${encodeURIComponent(input.email)}`)
        },
      },
    }
  )

  return (
    <AuthCard title={t("title")} description={t("description")} icon={KeyRound}>
      {action.result?.serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{action.result.serverError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
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
            <a href="/login" className="text-primary font-medium hover:underline">
              {t("backToLogin")}
            </a>
          </p>
        </form>
      </Form>
    </AuthCard>
  )
}