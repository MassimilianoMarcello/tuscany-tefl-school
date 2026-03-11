# Tuscany TEFL School — Digital Transformation

**Status:** 🚧 In Development

A complete redesign of a real TEFL school's legacy website. The goal is to improve the course enrollment experience, modernize the authentication system, and give the client full autonomy over content management — without needing a developer for day-to-day changes.

---

## Tech Stack

| Area | Technology | Motivation |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components, Server Actions, built-in routing |
| Auth | Better Auth | See migration notes below |
| Database | PostgreSQL via Neon | Serverless-ready, zero infrastructure management |
| ORM | Prisma 7 | Type-safe queries, native Better Auth adapter |
| CMS | Sanity.io | Headless, client-manageable content |
| UI | shadcn/ui + Tailwind CSS | Accessible components, lives in the codebase |
| Validation | Zod v4 | Shared schemas between client and server |
| Server Actions | next-safe-action | Typed actions, centralized error handling |
| Email | Resend | Transactional emails for verification and password reset |
| Payments | Stripe (planned) | Webhook-based enrollment confirmation |

---

## The Migration: Auth.js → Better Auth

The first version of this project used Auth.js (NextAuth v5). After building a complete authentication flow including 2FA, I ran into two concrete problems:

**Session renewal after 2FA validation** — after completing the second factor, the session was not being renewed correctly. The token state after 2FA completion was inconsistent and required manual workarounds that felt brittle.

**Documentation** — Auth.js documentation is fragmented across versions, spread across multiple sites, and in several cases contradicted itself between v4 and v5. Debugging edge cases meant reading GitHub issues rather than official docs.

Better Auth solves both: session management is handled by the library with explicit, predictable behavior, and the documentation is centralized and version-specific. The Prisma adapter works out of the box with zero configuration beyond pointing it at the database.

> For recruiters: see `lib/auth.ts` for the Better Auth configuration and `lib/safe-action.ts` for how server-side errors are handled centrally without try/catch in every action.

---

## Architectural Decisions

**Zod schemas are centralized** — `lib/validations/auth.ts` exports schemas imported by both the React form (client-side validation) and the server action (server-side validation). One change propagates everywhere with no risk of drift.

**next-safe-action wraps all server actions** — instead of `return { success: false, error: "..." }` written manually in every action, errors bubble up to a single `handleServerError` in `lib/safe-action.ts`. Actions are smaller and error handling is consistent.

**Sanity handles content, Prisma handles logic** — course descriptions, photos, and copy live in Sanity and are client-editable. Dates, available seats, pricing, and bookings live in Prisma. The two are linked via a `sanityId` field on the `Course` model. This means the client can update content without touching anything that affects business logic.

**Role field added early** — `User.role` (USER / ADMIN) was added to the Prisma schema before building any admin functionality. Adding roles after middleware, access control, and admin UI are already built is significantly more expensive.

---

## Technical Challenges

**Session cookies not set in Server Actions** — Better Auth requires a `nextCookies()` plugin to correctly set session cookies when called from Next.js Server Actions. Without it, login and register appeared to succeed but no session was created, leaving the user in a logged-out state. Resolved by adding the plugin to `lib/auth.ts` and removing manual headers forwarding from every action.

**Email verification silently not triggering** — `sendVerificationEmail` was never being called despite the config appearing correct. Root cause was two issues combined: using `await` instead of `void` on the Resend call (Better Auth does not expect the email function to block), and using a custom sender domain that had not been verified on Resend. Resolved by switching to `void` and using `onboarding@resend.dev` for development.

**Zod schema duplication** — `registerSchema` and `loginSchema` were defined twice — once in the form and once in the server action. A change to a validation rule required updating both files. Resolved by centralizing all schemas in `lib/validations/auth.ts` and importing from there.

---

## Current Status

### ✅ Done
- Authentication — register, login, logout with Better Auth
- Email verification with Resend — including resend and expired token handling
- Password validation with real-time requirements UI
- Session management via `nextCookies()` plugin
- Dashboard layout with shadcn/ui Sidebar
- User role system in schema (USER / ADMIN)
- Prisma schema with all Better Auth models

### 🚧 In Progress
- Forgot password / reset password flow
- Route protection middleware

### 📋 Planned
- Google OAuth
- Admin panel — course and booking management
- Sanity integration — course content and pages
- Stripe — course purchase and webhook enrollment
- Rate limiting on auth endpoints (Upstash)
- Rate limiting on resend verification email endpoint (Upstash)
- E2E tests with Playwright on critical paths

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in: DATABASE_URL, BETTER_AUTH_SECRET, NEXT_PUBLIC_BASE_URL, RESEND_API_KEY

# Set up the database
npx prisma migrate dev
npx prisma generate

# Start the dev server
pnpm dev
```

---

## Why This Is in My Portfolio

This project solves real business problems for a real client:

- **Evaluated two auth solutions** and made a documented technical decision based on concrete problems encountered, not preference
- **Debugged non-obvious issues** — session cookies in Server Actions, email verification timing — by reading source code and documentation rather than guessing
- **Identified a scalability issue early** (role management) and addressed it before it became expensive
- **Separated concerns** between content (Sanity) and business logic (Prisma) so the client has autonomy without touching code
- **Typed end-to-end** — from Zod schema to server action to form, types are inferred not written manually
