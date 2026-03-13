// app/[locale]/admin/layout.tsx
import { verifyAdmin } from "@/lib/dal"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ verifyAdmin fa redirect a /dashboard se l'utente non è ADMIN
  const session = await verifyAdmin()

  return (
    <SidebarProvider>
      <AdminSidebar user={session.user} />
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