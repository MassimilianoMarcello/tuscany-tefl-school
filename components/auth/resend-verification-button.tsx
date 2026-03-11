"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const COOLDOWN_SECONDS = 60

interface ResendVerificationButtonProps {
  email: string
}

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [pending, setPending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // ✅ Countdown — decrementa ogni secondo finché cooldown > 0
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
    // ✅ Avvia il cooldown dopo l'invio
    setCooldown(COOLDOWN_SECONDS)
  }

  const isDisabled = pending || cooldown > 0

  return (
    <Button onClick={handleResend} disabled={isDisabled} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Invio in corso...
        </>
      ) : cooldown > 0 ? (
        // ✅ Mostra il countdown visibile — l'utente sa quanto aspettare
        `Riprova tra ${cooldown}s`
      ) : (
        "Reinvia email di verifica"
      )}
    </Button>
  )
}