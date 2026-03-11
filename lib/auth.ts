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
    requireEmailVerification: true,
    // ✅ void invece di await — Better Auth non aspetta la risposta email
    sendResetPassword: async ({ user, url }) => {
      console.log("📧 sendResetPassword chiamata per:", user.email)
      void resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reimposta la tua password",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Reimposta la tua password</h2>
            <p>Hai richiesto di reimpostare la password. Clicca il link qui sotto:</p>
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
              Reimposta password
            </a>
            <p style="color: #666; font-size: 14px;">
              Il link scade tra 1 ora. Se non hai richiesto il reset, ignora questa email.
            </p>
          </div>
        `,
      })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    // ✅ void invece di await — Better Auth non aspetta la risposta email
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("📧 sendVerificationEmail chiamata per:", user.email)
      void resend.emails.send({
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

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
    },
  },

  // ✅ Google OAuth — prompt: "select_account" forza sempre la selezione account
  //    così l'utente può scegliere tra più account Google se ne ha più di uno
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [nextCookies()],
})