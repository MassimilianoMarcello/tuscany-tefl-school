// app/dashboard/layout.tsx
// ✅ Livello 2 di protezione — verifySession() valida la sessione nel DB.
//    Se la sessione non è valida, redirect a /login.
//    Questo protegge anche da CVE-2025-29927 che bypassa il middleware.

import { verifySession } from "@/lib/dal"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ verifySession fa redirect a /login se la sessione non è valida
  const session = await verifySession()

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}