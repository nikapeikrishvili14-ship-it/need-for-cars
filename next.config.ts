import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Static HTML export to /out — works on any static host (cPanel)
  output: "export",
  // /en/cars -> /en/cars/index.html, so plain Apache/cPanel serves it without rewrites
  trailingSlash: true,
  images: { unoptimized: true },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
