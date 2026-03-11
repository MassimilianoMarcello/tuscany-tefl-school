// i18n/request.ts
// ✅ Caricato lato server ad ogni richiesta — carica il file JSON corretto
//    in base alla locale dell'URL. cache() memoizza il risultato
//    per evitare di rileggere il file più volte nello stesso render pass.

import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale viene dall'URL — es. "it" o "en"
  let locale = await requestLocale

  // Fallback alla defaultLocale se la locale non è supportata
  if (!locale || !routing.locales.includes(locale as "it" | "en")) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    // Carica il file JSON corrispondente — messages/it.json o messages/en.json
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
