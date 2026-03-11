// middleware.ts
import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { routing } from "./i18n/routing"

// ✅ Middleware next-intl — gestisce il routing delle locale
//    es. / → /it, /en/login → /en/login
const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
  const session = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Ignora le route API di Better Auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Estrai la locale dal path — es. /it/login → "it", /en/dashboard → "en"
  const pathnameWithoutLocale = pathname.replace(/^\/(it|en)/, "") || "/"

  // ✅ Route protette senza sessione → redirect al login con locale corretta
  if (!session) {
    if (
      pathnameWithoutLocale.startsWith("/dashboard") ||
      pathnameWithoutLocale.startsWith("/admin")
    ) {
      // Determina la locale dall'URL o usa quella di default
      const locale = pathname.match(/^\/(it|en)/)?.[1] ?? routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  // ✅ Utente loggato che visita pagine auth → redirect alla dashboard
  if (session) {
    const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
    if (authRoutes.some((route) => pathnameWithoutLocale.startsWith(route))) {
      const locale = pathname.match(/^\/(it|en)/)?.[1] ?? routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  // ✅ Per tutto il resto, lascia gestire next-intl
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Applica a tutti i path tranne file statici e API Better Auth
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}