// app/layout.tsx
// ✅ Root layout con html e body — richiesto da Next.js
//    app/(main)/[locale]/layout.tsx sovrascrive questo per le pagine normali
import type { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
