import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SectionRail } from "@/components/layout/section-rail";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { DictionaryProvider } from "@/i18n/dictionary-provider";
import { buildMetadata } from "@/lib/seo";
import "../globals.css";

// latin-ext: đủ dấu tiếng Séc (č, ř, ž, ů…)
// Playfair Display: serif tương phản cao, nét đậm sắc — tiêu đề mạnh & sang hơn Cormorant
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return buildMetadata(locale, await getDictionary(locale));
}

export const viewport: Viewport = { themeColor: "#2b211c", colorScheme: "light" };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${playfair.variable} ${manrope.variable}`}>
      <body className="grain">
        <DictionaryProvider dict={dict} locale={locale}>
          <Providers>
            <a
              href="#main"
              className="focus:bg-ivory sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:p-3"
            >
              {dict.common.skip}
            </a>
            <Header />
            <SectionRail />
            <main id="main">{children}</main>
            <Footer />
          </Providers>
        </DictionaryProvider>
      </body>
    </html>
  );
}
