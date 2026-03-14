"use client"

// components/navbar.tsx
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Menu, LogOut, Settings, LayoutDashboard, Shield, Globe } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { UserWithRole } from "@/types/prisma"
import { useLayoutEffect as reactUseLayoutEffect } from "react"

// Links defined inside components to use translations — see mainLinks() and secondaryLinks()

interface NavbarProps {
  locale: string
}

// ─── Helper iniziali avatar ───────────────────────────────────────────────────
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  return email?.[0]?.toUpperCase() ?? "U"
}

// ─── UserMenu desktop ─────────────────────────────────────────────────────────
function UserMenu({ locale }: { locale: string }) {
  const [mounted, setMounted] = useState(false)         // ← aggiungi
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const t = useTranslations("navigation")
  const user = session?.user as UserWithRole | undefined

  useLayoutEffect(() => { setMounted(true) }, [])            // ← aggiungi

  async function handleLogout() {
    await authClient.signOut()
    router.push(`/${locale}/login`)
    router.refresh()
  }

  if (!mounted || isPending) {                          // ← modifica
    return <div className="h-8 w-8 rounded-full bg-brand-azure animate-pulse" />
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="uppercase text-xs font-semibold tracking-wide text-brand-blue hover:text-brand-green"
        >
          <Link href={`/${locale}/login`}>{t("signIn")}</Link>
        </Button>
        <Button
          asChild
          size="sm"
          className="uppercase text-xs font-bold tracking-wide bg-brand-green hover:bg-brand-green-dark text-white"
        >
          <Link href={`/${locale}/register`}>{t("register")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full ring-2 ring-brand-azure hover:ring-brand-green transition-all focus:outline-none">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-brand-blue text-white text-xs font-bold">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold text-brand-blue">{user?.name ?? "User"}</span>
          <span className="text-xs text-muted-foreground font-normal truncate">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            {t("dashboard")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/dashboard/settings`} className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            {t("settings")}
          </Link>
        </DropdownMenuItem>
        {user?.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/admin`}
                className="flex items-center gap-2 cursor-pointer text-brand-green"
              >
                <Shield className="h-4 w-4" />
                {t("adminPanel")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── UserMenu mobile ──────────────────────────────────────────────────────────
function UserMenuMobile({ locale, onClose }: { locale: string; onClose: () => void }) {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const t = useTranslations("navigation")
  const user = session?.user as UserWithRole | undefined

  async function handleLogout() {
    await authClient.signOut()
    onClose()
    router.push(`/${locale}/login`)
    router.refresh()
  }

  if (isPending) return null

  if (!session) {
    return (
      <div className="flex flex-col gap-2 px-3 mt-4">
        <Button
          asChild
          variant="outline"
          className="uppercase text-xs font-bold border-2 border-brand-blue text-brand-blue"
        >
          <Link href={`/${locale}/login`} onClick={onClose}>{t("signIn")}</Link>
        </Button>
        <Button
          asChild
          className="uppercase text-xs font-bold bg-brand-green hover:bg-brand-green-dark text-white"
        >
          <Link href={`/${locale}/register`} onClick={onClose}>{t("register")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="px-3 mt-4 border-t pt-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.image ?? undefined} />
          <AvatarFallback className="bg-brand-blue text-white text-xs font-bold">
            {getInitials(user?.name, user?.email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-brand-blue">{user?.name}</span>
          <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
        </div>
      </div>
      <Link
        href={`/${locale}/dashboard`}
        onClick={onClose}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-brand-bg text-brand-blue transition-colors"
      >
        <LayoutDashboard className="h-4 w-4" /> {t("dashboard")}
      </Link>
      <Link
        href={`/${locale}/dashboard/settings`}
        onClick={onClose}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-brand-bg text-brand-blue transition-colors"
      >
        <Settings className="h-4 w-4" /> {t("settings")}
      </Link>
      {user?.role === "ADMIN" && (
        <Link
          href={`/${locale}/admin`}
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-brand-bg text-brand-green transition-colors"
        >
          <Shield className="h-4 w-4" /> {t("adminPanel")}
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive hover:bg-red-50 transition-colors w-full mt-1"
      >
        <LogOut className="h-4 w-4" /> {t("signOut")}
      </button>
    </div>
  )
}


// Navbar principale
export function Navbar({ locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const t = useTranslations("navigation")

  const mainLinks = [
    { label: t("home"), href: "/" },
    { label: t("ourCourses"), href: "/our_courses" },
    { label: t("ourTeachers"), href: "/our_teachers" },
    { label: t("reviews"), href: "/reviews" },
    { label: t("faq"), href: "/faq" },
  ]

  const secondaryLinks = [
    { label: t("calendar"), href: "/calendar" },
    { label: t("workInItaly"), href: "/work-in-italy" },
    { label: t("internship"), href: "/internship" },
    { label: t("podcast"), href: "/podcast" },
    { label: t("consultationSessions"), href: "/consultation_sessions" },
    { label: t("aboutUs"), href: "/about_us" },
    { label: t("contact"), href: "/contact" },
  ]

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function localHref(href: string) {
    return `/${locale}${href}`
  }

  function handleLanguageSwitch() {
    const newLocale = locale === "it" ? "en" : "it"
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
    router.refresh()
  }

  return (
    <header className="w-full z-50 sticky top-0">

      {/* Top bar azzurro */}
      <div className="hidden md:flex items-center justify-between px-8 py-1.5 text-xs bg-brand-azure text-brand-blue">
        <div className="flex items-center gap-2 font-medium">
          <Phone className="h-3 w-3" />
          <span>Call us: +39 055 849 5765</span>
        </div>
        <div className="flex items-center gap-5 uppercase font-medium tracking-wide">
          {secondaryLinks.slice(0, 4).map((link) => (
            <Link
              key={link.href}
              href={localHref(link.href)}
              className="hover:text-brand-green transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-3 bg-brand-blue/30" />
          <button
            onClick={handleLanguageSwitch}
            className="flex items-center gap-1 w-12 justify-center hover:text-brand-green transition-colors"
          >
            <Globe className="h-3 w-3" />
            {t("switchLanguage")}
          </button>
          <div className="w-px h-3 bg-brand-blue/30" />
          <UserMenu locale={locale} />
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "w-full transition-all duration-300 border-b-4 border-brand-blue",
          scrolled ? "shadow-md bg-brand-bg" : "bg-white"
        )}
      >
        <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">

          {/* Logo */}
          <Link href={localHref("/")} className="shrink-0">
            <Image
              src="/assets/Tuscany_logo6.webp"
              alt="Tuscany TEFL School"
              width={200}
              height={60}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {mainLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      href={localHref(link.href)}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "uppercase text-xs font-semibold tracking-wide text-brand-blue hover:text-brand-green"
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* More — NavigationMenu separato per posizionamento corretto */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="uppercase text-xs font-semibold tracking-wide text-brand-blue hover:text-brand-green">
                    {t("more")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-52 gap-1 p-2">
                      {secondaryLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={localHref(link.href)}
                              className="block rounded-md px-3 py-2 text-sm uppercase tracking-wide text-brand-blue hover:bg-brand-bg hover:text-brand-green transition-colors"
                            >
                              {link.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* CTA + auth */}
            <div className="flex items-center gap-3 ml-4">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="uppercase text-xs font-bold tracking-wide border-2 border-brand-gold text-brand-blue hover:bg-brand-gold transition-colors"
              >
                <Link href={localHref("/our_courses")}>{t("datesAndPrices")}</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="uppercase text-xs font-bold tracking-wide bg-brand-green hover:bg-brand-green-dark text-white"
              >
                <Link href={localHref("/apply")}>{t("applyNow")}</Link>
              </Button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-brand-blue" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>
                  <Image
                    src="/assets/Tuscany_logo6.webp"
                    alt="Tuscany TEFL School"
                    width={140}
                    height={45}
                    className="h-10 w-auto object-contain"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-blue px-3 mb-1">
                  Menu
                </p>
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={localHref(link.href)}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm uppercase tracking-wide text-brand-blue hover:bg-brand-bg hover:text-brand-green transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <p className="text-xs font-bold uppercase tracking-widest text-brand-blue px-3 mt-4 mb-1">
                  More
                </p>
                {secondaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={localHref(link.href)}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm uppercase tracking-wide text-brand-blue hover:bg-brand-bg hover:text-brand-green transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex flex-col gap-2 mt-6 px-3">
                  <Button
                    asChild
                    variant="outline"
                    className="uppercase text-xs font-bold border-2 border-brand-gold text-brand-blue hover:bg-brand-gold"
                  >
                    <Link href={localHref("/our_courses")} onClick={() => setMobileOpen(false)}>
                      Dates & Prices
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="uppercase text-xs font-bold bg-brand-green hover:bg-brand-green-dark text-white"
                  >
                    <Link href={localHref("/apply")} onClick={() => setMobileOpen(false)}>
                      Apply Now
                    </Link>
                  </Button>
                </div>

                <UserMenuMobile locale={locale} onClose={() => setMobileOpen(false)} />

                <button
                  onClick={handleLanguageSwitch}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm uppercase font-semibold text-brand-blue hover:bg-brand-bg transition-colors mt-2 mx-0"
                >
                  <Globe className="h-4 w-4" />
                  {t("switchLanguage")}
                </button>

                <div className="flex items-center gap-2 mt-4 px-3 text-sm text-brand-blue border-t pt-4">
                  <Phone className="h-3 w-3" />
                  <span>+39 055 849 5765</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
const useLayoutEffect = typeof window !== "undefined" ? reactUseLayoutEffect : () => {}
