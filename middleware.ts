// middleware.ts
// ✅ Livello 1 di protezione — controllo ottimistico del cookie.
//    NON valida la sessione nel DB — è solo un redirect veloce.
//    La validazione reale avviene nei layout server-side (livello 2).
//
// ⚠️  CVE-2025-29927: il middleware può essere bypassato con header manipolati.
//    Per questo la validazione nel layout è OBBLIGATORIA, non opzionale.

import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function middleware(request: NextRequest) {
  const session = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // ✅ Route protette senza sessione → redirect al login
  if (!session) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // ✅ Utente loggato che visita pagine auth → redirect alla dashboard
  if (session) {
    const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Applica il middleware a tutte le route tranne:
    // - file statici Next.js (_next)
    // - favicon
    // - API routes di Better Auth
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
}