"use client"

// components/admin-sidebar.tsx
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { LayoutDashboard, Users, LogOut, ShieldCheck } from "lucide-react"

interface AdminSidebarProps {
  user?: {
    id: string
    name: string
    email: string
    image?: string | null
  } | null
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("admin")

  const navItems = [
    { label: t("nav.overview"), href: `/${locale}/admin`, icon: LayoutDashboard },
    { label: t("nav.users"), href: `/${locale}/admin/users`, icon: Users },
  ]

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(`/${locale}/login`)
          router.refresh()
        },
      },
    })
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="font-semibold text-base">{t("title")}</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.label")}</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <a href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}