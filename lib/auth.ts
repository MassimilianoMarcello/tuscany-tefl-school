// lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { prisma } from "./prisma"
import { resend } from "./resend"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    // Blocca il login finché l'email non è verificata
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    // ✅ void invece di await — Better Auth non aspetta la risposta email
    // ✅ token aggiunto come parametro (richiesto dalla firma corretta)
    sendVerificationEmail: async ({ user, url, token }, request) => {

      void resend.emails.send({
        // ✅ In sviluppo usa sempre onboarding@resend.dev
        // In produzione sostituisci con il tuo dominio verificato su Resend
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Verifica il tuo indirizzo email",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Benvenuto su Tuscany TEFL School</h2>
            <p>Clicca il link qui sotto per verificare il tuo indirizzo email:</p>
            <a
              href="${url}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 6px;
                margin: 16px 0;
              "
            >
              Verifica email
            </a>
            <p style="color: #666; font-size: 14px;">
              Il link scade tra 24 ore. Se non hai creato un account, ignora questa email.
            </p>
          </div>
        `,
      })
    },
  },

  plugins: [nextCookies()],
})