// i18n/routing.ts
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // Lingue supportate
  locales: ["it", "en"],

  // Lingua di default — usata quando l'URL non ha prefisso
  // es. /login → /it/login
  defaultLocale: "it",

  // ✅ localePrefix: "always" — ogni URL ha sempre il prefisso lingua
  //    /it/login, /en/login, /it/dashboard, /en/dashboard
  localePrefix: "always",
})
