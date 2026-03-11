"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const COOLDOWN_SECONDS = 60

interface ResendVerificationButtonProps {
  email: string
}

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const t = useTranslations("auth.resendVerification")
  const [pending, setPending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function handleResend() {
    setPending(true)
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/login",
    })
    setPending(false)
    setCooldown(COOLDOWN_SECONDS)
  }

  return (
    <Button onClick={handleResend} disabled={pending || cooldown > 0} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("sending")}
        </>
      ) : cooldown > 0 ? (
        t("cooldown", { seconds: cooldown })
      ) : (
        t("button")
      )}
    </Button>
  )
}