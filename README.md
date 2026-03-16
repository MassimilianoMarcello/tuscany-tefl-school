# 🏛️ Tuscany TEFL School — Digital Transformation

**Status: 🚧 In Development**

A complete redesign of a real TEFL school's legacy website. The goal is to improve the course enrollment experience, modernize the authentication system, and give the client full autonomy over content management — without needing a developer for day-to-day changes.

> The client has since had their site rebuilt by another agency at [tesolteflcert.com](https://tesolteflcert.com/), but this project continues as a portfolio piece demonstrating full-stack capabilities with real-world integrations.

---

## 🚀 Tech Stack

| Area | Technology | Motivation |
|------|-----------|-----------|
| Framework | Next.js 16 (App Router) | Server Components, Server Actions, built-in routing |
| Auth | Better Auth | See migration notes below |
| Database | PostgreSQL via Neon | Serverless-ready, zero infrastructure management |
| ORM | Prisma 7 | Type-safe queries, native Better Auth adapter |
| CMS | Sanity v3 | Headless, client-manageable content, embedded Studio |
| UI | shadcn/ui + Tailwind CSS v4 | Accessible components, lives in the codebase |
| Validation | Zod v4 | Shared schemas between client and server |
| Server Actions | next-safe-action | Typed actions, centralized error handling |
| Email | Resend | Transactional emails for verification, reset, and enrollment |
| i18n | next-intl | Italian / English with locale prefix routing |
| Rich Text | @portabletext/react | Sanity PortableText rendering |
| Address | Geoapify API | Street-level address autocomplete |
| Phone | react-phone-number-input | International prefix + IP-based country detection |
| Country/City | country-state-city | Cascading country → city dropdowns with flags |
| Payments | Stripe (planned) | Webhook-based enrollment confirmation |

---

## The Migration: Auth.js → Better Auth

The first version of this project used Auth.js (NextAuth v5). After building a complete authentication flow including 2FA, I ran into two concrete problems:

**Session renewal after 2FA validation** — after completing the second factor, the session was not being renewed correctly. The token state after 2FA completion was inconsistent and required manual workarounds that felt brittle.

**Documentation** — Auth.js documentation is fragmented across versions, spread across multiple sites, and in several cases contradicted itself between v4 and v5. Debugging edge cases meant reading GitHub issues rather than official docs.

Better Auth solves both: session management is handled by the library with explicit, predictable behavior, and the documentation is centralized and version-specific. The Prisma adapter works out of the box with zero configuration beyond pointing it at the database.

> For recruiters: see `lib/auth.ts` for the Better Auth configuration and `lib/safe-action.ts` for how server-side errors are handled centrally without try/catch in every action.

---

## 🏗️ Architectural Decisions

**Zod schemas are centralized** — `lib/validations/auth.ts` and `lib/apply-schema.ts` export schemas imported by both React forms (client-side validation) and server actions (server-side validation). One change propagates everywhere with no risk of drift. The apply schema has no `"use server"` directive so it can be shared between Client Component and Server Action without hydration issues.

**next-safe-action wraps all server actions** — instead of `return { success: false, error: "..." }` written manually in every action, errors bubble up to a single `handleServerError` in `lib/safe-action.ts`. Actions are smaller and error handling is consistent.

**Sanity handles content, Prisma handles logic** — course descriptions, photos, and copy live in Sanity and are client-editable. Dates, available seats, pricing, and bookings live in Prisma. This means the client can update content without touching anything that affects business logic.

**Admin content management without the full Studio** — the admin dashboard uses Sanity write API directly via `lib/sanity.write-client.ts`. API routes in `app/api/sanity/` handle CRUD for courses, testimonials, and FAQs. Admins can approve reviews, create/edit courses with image picker, and toggle FAQ visibility — all without leaving the app.

**getCommonTopPageByIdentifier** — hero banners are fetched by a `pageIdentifier` slug instead of `_id`, making page components independent of Sanity document IDs. This means the CMS structure can be reorganized without breaking the frontend.

**Role field added early** — `User.role` (USER / ADMIN) was added to the Prisma schema before building any admin functionality. Adding roles after middleware, access control, and admin UI are already built is significantly more expensive.

**Promise.allSettled on homepage** — if one Sanity query fails, the page still renders with the data that did load rather than throwing a 500.

**SanityImage wrapper** — a custom `components/ui/sanity-image.tsx` wraps Next.js `<Image>` with `unoptimized` and delegates all resizing, format conversion, and quality to the Sanity CDN via `urlFor()`. This avoids double processing (Next.js optimizer + Sanity CDN) on the 90%+ of images that come from Sanity. The wrapper also auto-generates blur placeholders at 20px width.

**Hotspot-aware image queries** — Sanity GROQ queries fetch `photo { asset->, hotspot, crop }` instead of `"photo": photo.asset->url`, preserving the focal point metadata set in Studio. `urlFor()` reads hotspot and crop automatically, so subject-focused images are never incorrectly cropped regardless of container aspect ratio.

**CSS-only scroll animations** — scroll-triggered animations are implemented with a `useInView` hook (IntersectionObserver) and an `AnimateIn` wrapper component using Tailwind transition utilities. No animation library dependency — the bundle stays lean and animations are fully accessible (respects `prefers-reduced-motion` via Tailwind's `transition-*` classes).

**Section dividers as a design system** — `components/ui/section-dividers.tsx` centralizes all SVG transitions between sections. Each divider encodes the relationship between the two sections it connects (diagonal drop, soft wave, gold band pause) using only brand color tokens. Moving sections in the wrapper requires only swapping the divider component, not rewriting CSS.

---

## 🔧 Technical Challenges

**Session cookies not set in Server Actions** — Better Auth requires a `nextCookies()` plugin to correctly set session cookies when called from Next.js Server Actions. Without it, login and register appeared to succeed but no session was created. Resolved by adding the plugin to `lib/auth.ts`.

**Email verification silently not triggering** — `sendVerificationEmail` was never being called despite the config appearing correct. Root cause was two issues combined: using `await` instead of `void` on the Resend call (Better Auth does not expect the email function to block), and using a custom sender domain that had not been verified on Resend.

**Zod schema duplication** — `registerSchema` and `loginSchema` were defined twice — once in the form and once in the server action. Resolved by centralizing all schemas in `lib/validations/auth.ts`.

**Error handling across the server/client boundary** — Better Auth throws errors with natural language messages like "Email not verified". Solved by mapping known error messages to typed codes in `handleServerError`, so the client switches on those codes instead of parsing strings.

**Next.js root layout conflict with Sanity Studio** — embedding the Studio at `/studio` requires its own `<html>` and `<body>` tags, but the root layout also provides them. Resolved with route groups: `app/(main)/[locale]/` handles the public/authenticated app with its own layout, while `app/studio/` has a dedicated passthrough layout that lets NextStudio manage its own DOM.

**Hydration mismatch with sticky navbar** — the navbar `lang` and `className` attributes set in the locale layout didn't match the root layout's bare `<html>` and `<body>`. Resolved by making `app/layout.tsx` a pure passthrough (`return children`) with no HTML wrapping.

**`overflow-x-hidden` breaking sticky positioning** — applying `overflow-x-hidden` on a parent container creates a new scroll context, which silently prevents `position: sticky` from working on any descendant. Discovered when the courses preview sticky panel stopped scrolling. Resolved by removing the overflow constraint from the page wrapper.

**Sanity image double processing** — the original implementation passed `.width(960).height(1200)` to `urlFor()`, which caused Sanity to crop server-side before delivery. This made `objectPosition` in CSS ineffective because the subject was already cut from the image. Resolved by removing the height constraint from the URL builder and letting CSS handle the crop via `object-fit` and `object-position`.

---

## ✨ Features

### Public Website
- Full internationalization (Italian / English) — locale prefix routing, `getTranslations()` server-side, `useTranslations()` client-side
- Homepage: hero with CMS-driven banner, about section, feature section, courses preview, parallax, testimonials
- Courses: list page with grid, detail page with rich text description, pricing, and discount
- Teachers: list with photo cards, detail page with full rich text bio
- Reviews: public list + submission form (saves to Sanity as `published: false`) + admin moderation
- FAQ: accordion grouped by category, content from Sanity
- About Us: polymorphic sections from Sanity `page` document
- Course Calendar: upcoming courses filtered server-side by `startDate >= today`
- Work in Italy: dynamic content sections from Sanity
- Footer: quick links, information, newsletter signup, WhatsApp CTA, social links

### Course Application Form
- Multi-section: course selection, personal info, education, health, motivation
- Address autocomplete via Geoapify API (street-level suggestions)
- Country dropdown with flags, city dropdown dynamically populated by country
- Postcode live validation with format hints per country (IT, US, UK, CA, DE, FR, ES, AU, NL, BE, CH, AT, PT, BR, JP)
- Phone input with international prefix, country auto-detected from user IP via `ipapi.co`
- Server Action saves to PostgreSQL, Resend sends confirmation to applicant + notification to admin

### Authentication
- Register, login, logout with Better Auth
- Email verification with Resend (including resend and expired token handling)
- Password validation with real-time requirements UI
- Forgot password / reset password flow
- Google OAuth
- Change password from dashboard settings
- Role-based access control: USER / ADMIN

### Admin Panel
- Stats dashboard (users, admin count)
- User management with role toggle
- Content Management with 3 tabs:
  - **Reviews**: approve/reject/delete with filter by pending/published/all
  - **Courses**: create/edit/delete with full form, image picker from Sanity library, inline published/featured toggles
  - **FAQ**: toggle visibility per question grouped by category
- Direct link to Sanity Studio for advanced operations

### Sanity CMS
- Embedded Studio at `/studio` — no separate deployment
- All schemas: `defineType`/`defineField` (Sanity v3)
- `published` field for moderation, `featured` for homepage preview
- `pageIdentifier` slug for per-page hero images
- Rich text on course descriptions, FAQ answers, teacher bios
- Image hotspot + crop + alt text on all image fields
- Hotspot metadata preserved in GROQ queries (`asset->, hotspot, crop`) for correct focal point rendering

### Design System & UI
- **Editorial aesthetic** — DM Serif Display for display headings, Geist Sans for body and UI. Typography establishes cultural identity (language school in Tuscany) without external brand assets
- **Brand token system** — all colors defined as CSS custom properties in `globals.css` via Tailwind v4 `@theme`. Zero hardcoded hex values in components
- **Section dividers** — SVG-based transitions between sections (diagonal cut, soft wave, gold band) encoded in `components/ui/section-dividers.tsx`. Each divider reflects the relationship between the sections it connects
- **Alternating light/dark sections** — page wrapper orchestrates a strict chiaro/scuro rhythm: Hero (light) → Feature (dark) → About (light) → Parallax (dark) → Courses (light) → Testimonials (dark)
- **Scroll-triggered animations** — `useInView` hook with IntersectionObserver + `AnimateIn` wrapper component. Supports `fadeUp`, `fadeDown`, `fadeLeft`, `fadeRight`, `fade`, `scale` variants with configurable delay, duration, and threshold. No animation library dependency
- **Navbar overhaul** — two-level header: brand-blue top bar with secondary links (collapses on scroll), white main bar with gold bottom border (consistent with divider system). Fullscreen mobile overlay replaces Sheet component
- **SanityImage wrapper** — `components/ui/sanity-image.tsx` unifies all Sanity image rendering with automatic blur placeholder, `unoptimized` flag to prevent double processing, and hotspot-aware cropping

---

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL=

# Auth
BETTER_AUTH_SECRET=
NEXT_PUBLIC_BASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email
RESEND_API_KEY=
ADMIN_EMAIL=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_WRITE_TOKEN=

# Address autocomplete
NEXT_PUBLIC_GEOAPIFY_API_KEY=
```

---

## 🚀 Running Locally

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Set up the database
npx prisma migrate dev
npx prisma generate

# Start the dev server
pnpm dev
```

App: http://localhost:3000  
Studio: http://localhost:3000/studio

---

## 📋 Roadmap

- [x] Authentication (register, login, OAuth, email verification, password reset)
- [x] Admin panel (stats, user management)
- [x] Content management panel (courses, testimonials, FAQs via Sanity API)
- [x] Homepage — full editorial restyling (serif display typography, alternating light/dark sections, section dividers, scroll animations)
- [x] Navbar — brand-blue top bar, gold border, scroll-hide behavior, fullscreen mobile overlay
- [x] Footer — dark editorial layout consistent with landing system
- [x] SanityImage wrapper — hotspot-aware, single-pass CDN optimization
- [x] Scroll-triggered animation system (useInView + AnimateIn, no library dependency)
- [x] Courses list + detail
- [x] Teachers list + detail
- [x] Reviews + submission form + moderation
- [x] FAQ with accordion and categories
- [x] About Us with polymorphic sections
- [x] Course Calendar
- [x] Work in Italy page
- [x] Course Application form (address autocomplete, postcode validation, phone prefix detection)
- [x] Sanity Studio embedded
- [x] i18n (Italian + English)
- [ ] Contact page
- [ ] Booking system (spots available per course)
- [ ] Stripe deposit payment
- [ ] Deploy on Vercel
- [ ] E2E tests with Playwright on critical paths
- [ ] Rate limiting on auth and email endpoints (Upstash)

---

## Why This Is in My Portfolio

This project solves real business problems for a real client:

- Evaluated two auth solutions and made a documented technical decision based on concrete problems encountered, not preference
- Debugged non-obvious issues — session cookies in Server Actions, email verification timing, `overflow-x-hidden` breaking sticky positioning — by reading source code and documentation rather than guessing
- Identified a scalability issue early (role management) and addressed it before it became expensive
- Separated concerns between content (Sanity) and business logic (Prisma) so the client has autonomy without touching code
- Typed end-to-end — from Zod schema to server action to form, types are inferred not written manually
- Built a custom admin content panel using Sanity write API, giving non-technical users full control without exposing the raw CMS
- Rebuilt the frontend design system from scratch — typography, color tokens, animation, section rhythm — prioritizing editorial quality and consistency over speed

---

Built by Massimiliano Marcello  
GitHub: [@MassimilianoMarcello](https://github.com/MassimilianoMarcello)