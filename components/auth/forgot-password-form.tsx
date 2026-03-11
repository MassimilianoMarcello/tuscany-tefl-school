"use client"

import { useRouter } from "next/navigation"
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

  const { form, action, handleSubmitWithAction } = useHookFormAction(
    forgotPasswordAction,
    zodResolver(forgotPasswordSchema),
    {
      formProps: {
        defaultValues: { email: "" },
      },
      actionProps: {
        // ✅ Andiamo sempre a /forgot-password/sent — anche se l'email non esiste
        //    Better Auth non ci dice se l'email è registrata (protezione enumeration)
        onSuccess: ({ input }) => {
          router.push(
            `/forgot-password/sent?email=${encodeURIComponent(input.email)}`
          )
        },
      },
    }
  )

  return (
    <AuthCard
      title="Password dimenticata"
      description="Inserisci la tua email. Ti manderemo un link per reimpostare la password."
      icon={KeyRound}
    >
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="mario@esempio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={action.isPending}>
            {action.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Invio in corso...
              </>
            ) : (
              "Invia link di reset"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Ricordi la password?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Accedi
            </a>
          </p>
        </form>
      </Form>
    </AuthCard>
  )
}