// app/layout.tsx
// ✅ Root layout minimalista — il layout reale è in app/[locale]/layout.tsx
//    Questo serve solo come entry point richiesto da Next.js

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
