import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "cs" ? 1 : 0.8,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}`])) },
  }));
}
