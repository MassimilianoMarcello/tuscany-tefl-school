"use client"

// components/navbar.tsx
import { useState, useEffect, useLayoutEffect as reactUseLayoutEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Menu, LogOut, Settings, LayoutDashboard, Shield, Globe, X } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { UserWithRole } from "@/types/prisma"

const useLayoutEffect =
  typeof window !== "undefined" ? reactUseLayoutEffect : () => {}

interface NavbarProps {
  locale: string
}

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
  const [mounted, setMounted] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const t = useTranslations("navigation")
  const user = session?.user as UserWithRole | undefined

  useLayoutEffect(() => { setMounted(true) }, [])

  async function handleLogout() {
    await authClient.signOut()
    router.push(`/${locale}/login`)
    router.refresh()
  }

  if (!mounted || isPending) {
    return <div className="h-7 w-7 rounded-full bg-white/20 animate-pulse" />
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/login`}
          className="text-[10px] uppercase tracking-widest font-bold text-white/70 hover:text-white transition-colors"
        >
          {t("signIn")}
        </Link>
        <Link
          href={`/${locale}/register`}
          className="text-[10px] uppercase tracking-widest font-bold bg-brand-gold text-brand-blue px-3 py-1.5 hover:bg-white transition-colors"
        >
          {t("register")}
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full ring-1 ring-white/30 hover:ring-brand-gold transition-all focus:outline-none">
          <Avatar className="h-7 w-7 cursor-pointer">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-brand-azure text-brand-blue text-[10px] font-black">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-none border-brand-blue/20">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-bold text-brand-blue text-sm">{user?.name ?? "User"}</span>
          <span className="text-xs text-muted-foreground font-normal truncate">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wide">
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t("dashboard")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/dashboard/settings`} className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wide">
            <Settings className="h-3.5 w-3.5" />
            {t("settings")}
          </Link>
        </DropdownMenuItem>
        {user?.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/admin`}
                className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wide text-brand-green"
              >
                <Shield className="h-3.5 w-3.5" />
                {t("adminPanel")}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wide text-destructive focus:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Navbar principale ────────────────────────────────────────────────────────
export function Navbar({ locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [topBarVisible, setTopBarVisible] = useState(true)
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
    let lastY = window.scrollY
    function handleScroll() {
      const currentY = window.scrollY
      setScrolled(currentY > 60)
      setTopBarVisible(currentY < 40 || currentY < lastY)
      lastY = currentY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Blocca scroll body quando mobile menu è aperto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

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

      {/* ── Top bar — brand-blue, scompare allo scroll ────────── */}
      <div
        className={cn(
          "hidden md:flex items-center justify-between px-8 bg-brand-blue transition-all duration-300 overflow-hidden",
          topBarVisible ? "py-1.5 opacity-100 max-h-10" : "py-0 opacity-0 max-h-0"
        )}
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/50">
          <Phone className="h-3 w-3" />
          <span>+39 055 849 5765</span>
        </div>
        <div className="flex items-center gap-5">
          {secondaryLinks.slice(0, 4).map((link) => (
            <Link
              key={link.href}
              href={localHref(link.href)}
              className="text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-brand-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-3 bg-white/10" />
          <button
            onClick={handleLanguageSwitch}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-brand-gold transition-colors"
          >
            <Globe className="h-3 w-3" />
            {t("switchLanguage")}
          </button>
          <div className="w-px h-3 bg-white/10" />
          <UserMenu locale={locale} />
        </div>
      </div>

      {/* ── Main bar ──────────────────────────────────────────── */}
      <div
        className={cn(
          "w-full transition-all duration-300 border-b-[3px] border-brand-gold",
       scrolled
      ? "bg-white shadow-[0_4px_24px_rgba(31,61,75,0.08)]"
      : "bg-white"

        )}
      >
        <div className="flex items-center justify-between px-6 py-2 max-w-7xl mx-auto">

          {/* Logo */}
          <Link href={localHref("/")} className="shrink-0">
            <Image
              src="/assets/Tuscany_logo6.webp"
              alt="Tuscany TEFL School"
              width={180}
              height={54}
              className={cn(
                "w-auto object-contain transition-all duration-300",
                scrolled ? "h-10" : "h-12"
              )}
              priority
            />
          </Link>

          {/* ── Desktop nav ───────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {mainLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      href={localHref(link.href)}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "uppercase text-[10px] font-black tracking-widest text-brand-blue hover:text-brand-green bg-transparent hover:bg-transparent focus:bg-transparent rounded-none"
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* More dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="uppercase text-[10px] font-black tracking-widest text-brand-blue hover:text-brand-green bg-transparent hover:bg-transparent rounded-none"
                  >
                    {t("more")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-56 p-2 rounded-none">
                      {secondaryLinks.map((link) => (
                        <li key={link.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={localHref(link.href)}
                              className="block px-3 py-2 text-[10px] uppercase tracking-widest font-bold text-brand-blue hover:bg-brand-bg hover:text-brand-green transition-colors"
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

            {/* CTA */}
            <div className="flex items-center gap-2 ml-4 border-l border-brand-blue/10 pl-4">
              <Link
                href={localHref("/our_courses")}
                className="text-[10px] uppercase tracking-widest font-black text-brand-blue border-2 border-brand-gold px-4 py-2 hover:bg-brand-gold transition-colors duration-200"
              >
                {t("datesAndPrices")}
              </Link>
              <Link
                href={localHref("/apply")}
                className="text-[10px] uppercase tracking-widest font-black text-white bg-brand-green px-4 py-2 hover:bg-brand-green-dark transition-colors duration-200"
              >
                {t("applyNow")}
              </Link>
            </div>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────── */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-brand-blue hover:text-brand-green transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Mobile menu — fullscreen overlay ─────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-[100] lg:hidden flex flex-col transition-all duration-300",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Header mobile — brand-blue */}
        <div className="bg-brand-blue px-6 py-4 flex items-center justify-between border-b-[3px] border-brand-gold shrink-0">
          <Image
            src="/assets/Tuscany_logo6.webp"
            alt="Tuscany TEFL School"
            width={140}
            height={42}
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Chiudi menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body mobile — scrollabile */}
        <div className="bg-brand-bg flex-1 overflow-y-auto">
          <div className="px-6 py-8 flex flex-col gap-1">

            {/* Main links */}
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-blue/30 mb-3">
              Menu
            </p>
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={localHref(link.href)}
                onClick={() => setMobileOpen(false)}
                className="block py-3 border-b border-brand-blue/5 text-xs uppercase tracking-widest font-black text-brand-blue hover:text-brand-green transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Secondary links */}
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-blue/30 mt-6 mb-3">
              More
            </p>
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={localHref(link.href)}
                onClick={() => setMobileOpen(false)}
                className="block py-3 border-b border-brand-blue/5 text-xs uppercase tracking-widest font-bold text-brand-blue/70 hover:text-brand-green transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* CTA mobile */}
            <div className="flex flex-col gap-3 mt-8">
              <Link
                href={localHref("/our_courses")}
                onClick={() => setMobileOpen(false)}
                className="text-center text-[10px] uppercase tracking-widest font-black text-brand-blue border-2 border-brand-gold px-6 py-4 hover:bg-brand-gold transition-colors"
              >
                {t("datesAndPrices")}
              </Link>
              <Link
                href={localHref("/apply")}
                onClick={() => setMobileOpen(false)}
                className="text-center text-[10px] uppercase tracking-widest font-black text-white bg-brand-green px-6 py-4 hover:bg-brand-green-dark transition-colors"
              >
                {t("applyNow")}
              </Link>
            </div>

            {/* Language switch */}
            <button
              onClick={() => { handleLanguageSwitch(); setMobileOpen(false) }}
              className="flex items-center gap-2 mt-6 text-[10px] uppercase tracking-widest font-bold text-brand-blue/50 hover:text-brand-green transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {t("switchLanguage")}
            </button>

            {/* Phone */}
            <div className="flex items-center gap-2 mt-4 text-[10px] uppercase tracking-widest text-brand-blue/30">
              <Phone className="h-3 w-3" />
              <span>+39 055 849 5765</span>
            </div>

            {/* Auth mobile — in fondo */}
            <MobileAuth locale={locale} onClose={() => setMobileOpen(false)} />

          </div>
        </div>
      </div>

    </header>
  )
}

// ─── Auth mobile — estratto ───────────────────────────────────────────────────
function MobileAuth({ locale, onClose }: { locale: string; onClose: () => void }) {
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
      <div className="flex flex-col gap-2 mt-8 pt-6 border-t border-brand-blue/10">
        <Link
          href={`/${locale}/login`}
          onClick={onClose}
          className="text-center text-[10px] uppercase tracking-widest font-black text-brand-blue border-2 border-brand-blue/20 px-6 py-4 hover:border-brand-blue transition-colors"
        >
          {t("signIn")}
        </Link>
        <Link
          href={`/${locale}/register`}
          onClick={onClose}
          className="text-center text-[10px] uppercase tracking-widest font-black text-brand-blue bg-brand-gold px-6 py-4 hover:bg-white transition-colors"
        >
          {t("register")}
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-8 pt-6 border-t border-brand-blue/10">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={user?.image ?? undefined} />
          <AvatarFallback className="bg-brand-blue text-white text-xs font-black">
            {getInitials(user?.name, user?.email)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-black text-brand-blue">{user?.name}</p>
          <p className="text-[10px] text-brand-blue/40 truncate">{user?.email}</p>
        </div>
      </div>

      <Link
        href={`/${locale}/dashboard`}
        onClick={onClose}
        className="flex items-center gap-2 py-2.5 text-xs uppercase tracking-widest text-brand-blue/70 hover:text-brand-green transition-colors"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        {t("dashboard")}
      </Link>
      <Link
        href={`/${locale}/dashboard/settings`}
        onClick={onClose}
        className="flex items-center gap-2 py-2.5 text-xs uppercase tracking-widest text-brand-blue/70 hover:text-brand-green transition-colors"
      >
        <Settings className="h-3.5 w-3.5" />
        {t("settings")}
      </Link>
      {user?.role === "ADMIN" && (
        <Link
          href={`/${locale}/admin`}
          onClick={onClose}
          className="flex items-center gap-2 py-2.5 text-xs uppercase tracking-widest text-brand-green transition-colors"
        >
          <Shield className="h-3.5 w-3.5" />
          {t("adminPanel")}
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 py-2.5 text-xs uppercase tracking-widest text-destructive w-full mt-1"
      >
        <LogOut className="h-3.5 w-3.5" />
        {t("signOut")}
      </button>
    </div>
  )
}