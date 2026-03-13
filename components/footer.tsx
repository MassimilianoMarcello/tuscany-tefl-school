"use client"
// components/footer.tsx
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Facebook, Youtube, Mail } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

export function Footer() {
  const locale = useLocale()
  const t = useTranslations("footer")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: collegare a Resend o newsletter service
    console.log("Email:", email)
    setSubmitted(true)
    setEmail("")
  }

  return (
    <footer className="w-full bg-brand-blue mt-20">
      {/* Border top gold */}
      <div className="h-4 w-full bg-brand-gold" />

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1 — Contact / About */}
        <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
          <Image
            src="/assets/Tuscany_logo6.webp"
            alt="TEFL Tuscany logo"
            width={200}
            height={60}
            className="object-contain"
          />
          <address className="not-italic text-brand-blue text-sm leading-relaxed space-y-1">
            <p className="font-bold">Centro Studi Mugello srl</p>
            <p>Via degli Argini, 8/14</p>
            <p>Borgo San Lorenzo (FI) Italy</p>
            <p className="text-brand-blue/50 text-xs mt-2">P.IVA: 04603520489</p>
          </address>
          <div className="text-sm text-brand-blue space-y-1">
            <a href="tel:+390558495765" className="block text-brand-blue hover:text-brand-green transition-colors">
              📞 +39 055 849 5765
            </a>
            <a href="tel:+18437551560" className="block text-brand-blue hover:text-brand-green transition-colors">
              📞 +1 (843) 755-1560
            </a>
            <p className="text-brand-blue/50 text-xs">Mon–Fri 9am to 5pm</p>
          </div>
          {/* Social */}
          <div className="flex gap-3 mt-2">
            <a
              href="https://www.facebook.com/tefltuscany"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
            >
              <Facebook className="h-4 w-4 text-brand-blue" />
            </a>
            <a
              href="https://www.youtube.com/channel/UC4Iq349wLtnznhw_BfO1Dhw"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"
            >
              <Youtube className="h-4 w-4 text-brand-blue" />
            </a>
          </div>
        </div>

        {/* Col 2 — Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-brand-gold font-black uppercase tracking-widest text-sm border-b-2 border-brand-gold pb-2">
            {t("quickLinks")}
          </h3>
          <ul className="space-y-2">
            {[
              { label: t("links.courses"), href: `/${locale}/our_courses` },
              { label: t("links.teachers"), href: `/${locale}/our_teachers` },
              { label: t("links.aboutUs"), href: `/${locale}/about_us` },
              { label: t("links.faq"), href: `/${locale}/faq` },
              { label: t("links.datesAndPrices"), href: `/${locale}/our_courses#dates` },
              { label: t("links.application"), href: `/${locale}/apply` },
              { label: t("links.testimonials"), href: `/${locale}/reviews` },
              { label: t("links.accredited"), href: `/${locale}/accredited` },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-brand-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Information */}
        <div className="flex flex-col gap-3">
          <h3 className="text-brand-gold font-black uppercase tracking-widest text-sm border-b-2 border-brand-gold pb-2">
            {t("information")}
          </h3>
          <ul className="space-y-2">
            {[
              { label: t("links.workInItaly"), href: `/${locale}/work_in_italy` },
              { label: t("links.internship"), href: `/${locale}/internship` },
              { label: t("links.podcast"), href: `/${locale}/podcast` },
              { label: t("links.consultation"), href: `/${locale}/consultation` },
              { label: t("links.contact"), href: `/${locale}/contact` },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-brand-gold text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Legal */}
          <div className="mt-6 space-y-1">
            <h3 className="text-brand-gold font-black uppercase tracking-widest text-sm border-b-2 border-brand-gold pb-2 mb-3">
              Legal
            </h3>
            {[
              { label: "Privacy Policy", href: `/${locale}/privacy` },
              { label: "Site Map", href: `/${locale}/sitemap` },
              { label: "Accessibility", href: `/${locale}/accessibility` },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white/50 hover:text-white text-xs transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 4 — Newsletter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-brand-gold font-black uppercase tracking-widest text-sm border-b-2 border-brand-gold pb-2">
            {t("newsletter")}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            {t("newsletterSub")}
          </p>
          {submitted ? (
            <p className="text-brand-gold font-bold text-sm">{t("newsletterSuccess")}</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-brand-gold text-sm"
              />
              <button
                type="submit"
                className="w-full py-3 bg-brand-gold text-brand-blue font-black uppercase tracking-wide rounded-lg hover:bg-brand-azure transition-colors text-sm"
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
            className="mt-4 flex items-center gap-2 bg-[#25D366] text-white font-bold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            <Mail className="h-4 w-4" />
            {t("whatsapp")}
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 px-6 text-center text-white/40 text-xs">
        © {new Date().getFullYear()} TEFL Tuscany — Centro Studi Mugello srl. All rights reserved.
      </div>
    </footer>
  )
}