// proxy.ts
import { routing } from "@/i18n/routing"
import createMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const handleI18n = createMiddleware(routing)

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
const protectedRoutes = ["/dashboard", "/admin"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Escludi /studio da tutto — Sanity gestisce la propria autenticazione
  if (pathname.startsWith("/studio")) {
    return NextResponse.next()
  }

  // Estrai locale dal path (es. /it/dashboard → /dashboard)
  const pathnameWithoutLocale = pathname.replace(/^\/(it|en)/, "") || "/"

  const session = getSessionCookie(request)

  // Redirect a login se tenta di accedere a route protette senza sessione
  if (protectedRoutes.some((r) => pathnameWithoutLocale.startsWith(r)) && !session) {
    const locale = pathname.split("/")[1] || routing.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  // Redirect a dashboard se già loggato tenta di accedere a route auth
  if (authRoutes.some((r) => pathnameWithoutLocale.startsWith(r)) && session) {
    const locale = pathname.split("/")[1] || routing.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return handleI18n(request)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|icons|.*\\..*).*)",
  ],
}