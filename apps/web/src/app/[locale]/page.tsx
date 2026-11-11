import { notFound } from "next/navigation";
import { Contact, Experience, Gallery, Hero, Menu, Styles } from "@/components/sections";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localBusinessJsonLd } from "@/lib/seo";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(dict)) }}
      />
      <Hero />
      <Styles />
      <Menu />
      <Gallery />
      <Experience />
      <Contact />
    </>
  );
}
