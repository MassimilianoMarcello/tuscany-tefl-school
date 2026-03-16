"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Facebook, Youtube, Phone, MessageCircle } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

export function Footer() {
  const locale = useLocale()
  const t = useTranslations("footer")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email:", email)
    setSubmitted(true)
    setEmail("")
  }

  const quickLinks = [
    { label: t("links.courses"), href: `/${locale}/our_courses` },
    { label: t("links.teachers"), href: `/${locale}/our_teachers` },
    { label: t("links.aboutUs"), href: `/${locale}/about_us` },
    { label: t("links.faq"), href: `/${locale}/faq` },
    { label: t("links.datesAndPrices"), href: `/${locale}/our_courses#dates` },
    { label: t("links.application"), href: `/${locale}/apply` },
    { label: t("links.testimonials"), href: `/${locale}/reviews` },
    { label: t("links.accredited"), href: `/${locale}/accredited` },
  ]

  const infoLinks = [
    { label: t("links.workInItaly"), href: `/${locale}/work_in_italy` },
    { label: t("links.internship"), href: `/${locale}/internship` },
    { label: t("links.podcast"), href: `/${locale}/podcast` },
    { label: t("links.consultation"), href: `/${locale}/consultation` },
    { label: t("links.contact"), href: `/${locale}/contact` },
  ]

  const legalLinks = [
    { label: "Privacy Policy", href: `/${locale}/privacy` },
    { label: "Site Map", href: `/${locale}/sitemap` },
    { label: "Accessibility", href: `/${locale}/accessibility` },
  ]

  return (
    <footer className="w-full bg-brand-blue">
      {/* Fascia gold top */}
      <div className="h-[6px] w-full bg-brand-gold" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Col 1 — Brand / Contact */}
        <div className="flex flex-col gap-6">
   <div style={{ backgroundColor: '#fefefe', padding: '10px' }}>
  <Image
    src="/assets/Tuscany_logo6.webp"
    alt="TEFL Tuscany logo"
    width={160}
    height={48}
    className="object-contain "
    style={{ width: "auto" }}
  />
</div>

          <address className="not-italic flex flex-col gap-1">
            <p className="text-white font-bold text-sm">Centro Studi Mugello srl</p>
            <p className="text-white/80 text-xs">Via degli Argini, 8/14</p>
            <p className="text-white/80 text-xs">Borgo San Lorenzo (FI) Italy</p>
            <p className="text-white/50 text-xs mt-1">P.IVA: 04603520489</p>
          </address>

          <div className="flex flex-col gap-2">
            <a
              href="tel:+390558495765"
              className="flex items-center gap-2 text-white/80 hover:text-brand-gold transition-colors text-sm"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              +39 055 849 5765
            </a>
            <a
              href="tel:+18437551560"
              className="flex items-center gap-2 text-white/80 hover:text-brand-gold transition-colors text-sm"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              +1 (843) 755-1560
            </a>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
              Mon–Fri 9am to 5pm
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/tefltuscany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="h-9 w-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC4Iq349wLtnznhw_BfO1Dhw"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="h-9 w-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              <Youtube className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/393928537513"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="h-9 w-9 border border-white/20 flex items-center justify-center text-white/60 hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold border-b border-brand-gold/30 pb-3">
            {t("quickLinks")}
          </p>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/60 hover:text-brand-gold text-xs uppercase tracking-widest font-bold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Information + Legal */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold border-b border-brand-gold/30 pb-3">
            {t("information")}
          </p>
          <ul className="flex flex-col gap-2">
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/60 hover:text-brand-gold text-xs uppercase tracking-widest font-bold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold border-b border-brand-gold/30 pb-3">
              Legal
            </p>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white/70 text-xs uppercase tracking-widest transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Col 4 — Newsletter */}
        <div className="flex flex-col gap-4">
          <p className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold border-b border-brand-gold/30 pb-3">
            {t("newsletter")}
          </p>
          <p className="text-white/60 text-sm font-light leading-relaxed">
            {t("newsletterSub")}
          </p>

          {submitted ? (
            <p className="text-brand-gold font-bold text-sm uppercase tracking-widest">
              {t("newsletterSuccess")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="w-full px-4 py-3 bg-white/5 text-white placeholder-white/30 border border-white/20 focus:outline-none focus:border-brand-gold text-sm transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 bg-brand-gold text-brand-blue font-black uppercase tracking-widest text-xs hover:bg-white transition-colors"
              >
                {t("subscribe")}
              </button>
            </form>
          )}

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/393928537513"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-3 bg-[#25D366] text-white font-black px-4 py-3 hover:bg-[#1ebd57] transition-colors text-xs uppercase tracking-widest"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            {t("whatsapp")}
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5 px-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-white/20 text-[10px] uppercase tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} TEFL Tuscany — Centro Studi Mugello srl. All rights reserved.
        </p>
        <a
          href="https://massdev.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/20 hover:text-brand-gold text-[10px] uppercase tracking-widest transition-colors"
        >
          Designed & built by massdev.dev
        </a>
      </div>
    </footer>
  )
}