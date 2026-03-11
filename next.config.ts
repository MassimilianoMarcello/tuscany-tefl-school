// next.config.ts
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client-runtime-utils"],
}

export default withNextIntl(nextConfig)
