import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <SidebarProvider>
      <AppSidebar user={session?.user} />
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