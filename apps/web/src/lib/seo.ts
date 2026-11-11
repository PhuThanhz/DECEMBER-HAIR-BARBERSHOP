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
    icons: { icon: "/brand/logo-d-gold.png", apple: "/brand/logo-d-gold.png" },
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
    sameAs: site.socials.map((s) => s.href),
  };
}
