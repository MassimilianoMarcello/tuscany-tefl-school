TEFL School Portfolio Project: Digital Transformation
Status: 🚧 In Development / 🚀 Production Ready

Original Site vs. Revamp: Improving performance, security, and scalability.

📖 Table of Contents
Overview

Tech Stack

The Migration (Auth.js to BetterAuth)

Content Management

Performance & Optimization

Testing Strategy

Documentation & Handover

🌟 Overview
Client: A real TEFL (Teaching English as a Foreign Language) School.

Objective: Complete redesign of the legacy website to enhance user experience, simplify course enrollment, and fix critical authentication bugs.

🛠 Tech Stack
Framework: Next.js 16 (App Router)

Auth: BetterAuth (chosen for session stability and DX)

CMS: Sanity.io (Headless CMS for course management)

Database & ORM: PostgreSQL + Prisma

UI/UX: Tailwind CSS + shadcn/ui

🔐 The Migration (Phase 1: Authentication)
Why BetterAuth?
Issue: The previous version used Auth.js, which led to inconsistent session refreshes and complex JWT management.

Solution: Migrated to BetterAuth for built-in automatic token rotation and seamless integration with Prisma.

Result: A 100% reliable login flow and cleaner server-side session checks.

Note for Recruiters: Look at lib/auth.ts to see how session persistence is handled via database sessions.

📝 Content Management (Phase 2: Sanity.io)
The school's courses and teachers are managed via Sanity.io.

Dynamic Routing: Courses are fetched at build time but updated incrementally via ISR (Incremental Static Regeneration).

Image Optimization: Utilizing the Sanity Image Pipeline to serve WebP formats based on device size.

⚡ Performance & Optimization (Phase 3)
Core Web Vitals: Aiming for a 100/100 Lighthouse score.

Partial Prerendering (PPR): Used to keep the landing page static while making the "Student Dashboard" dynamic.

Database Queries: Optimized via Prisma's select to avoid over-fetching data.

🧪 Testing Strategy (Phase 4)
End-to-End (E2E): Tested with Playwright.

Critical Path: User login -> Course selection -> Enrollment confirmation.

Unit Tests: Zod schemas are tested to ensure strict data validation for course pricing and emails.

📁 How to Run
Bash
# Install dependencies
npm install

# Setup Prisma
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
💡 Why this project is in my portfolio
This isn't just a "pretty website." It solves real-world business problems:

Security: Implemented a robust auth system where others failed.

Performance: Reduced load times by X% compared to the legacy site.

Scalability: The Headless CMS approach allows the client to add hundreds of courses without needing a developer.




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
