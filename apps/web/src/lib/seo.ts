import type { Metadata } from "next";
import { site } from "@/content/site";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

export function buildMetadata(locale: Locale, dict: Dictionary): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · ${site.name}` },
    description: dict.meta.description,
    applicationName: site.name,
    keywords: [
      "barber shop",
      "barbershop Praha",
      "pánské holičství",
      "holení",
      "head spa",
      "December",
    ],
    openGraph: {
      type: "website",
      locale: localeMeta[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og),
      url: `/${locale}`,
      siteName: site.name,
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    icons: {
      icon: [
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/brand/apple-touch-icon.png",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

/** JSON-LD cho Google Local Business. */
export function localBusinessJsonLd(dict: Dictionary) {
  return {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    name: site.name,
    description: dict.meta.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: site.address,
    priceRange: "CZK",
    image: `${site.url}/images/space/space-01-reception.jpg`,
    openingHours: ["Mo-Fr 09:00-21:00", "Sa-Su 08:30-21:30"],
    // WhatsApp là kênh liên hệ, không phải hồ sơ mạng xã hội → không đưa vào sameAs
    sameAs: site.socials.filter((s) => s.label !== "WhatsApp").map((s) => s.href),
  };
}
