// app/studio/[[...tool]]/page.tsx
// ✅ Questa route è FUORI da app/[locale]/ — non ha navbar, intl provider, ecc.
//    Accessibile solo a chi ha accesso al progetto Sanity (autenticazione Sanity)
"use client"

import { NextStudio } from "next-sanity/studio"
import config from "@/sanity.config"

export default function StudioPage() {
  return <NextStudio config={config} />
}