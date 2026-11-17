import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans, Spectral } from "next/font/google";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBookBar } from "@/components/layout/mobile-book-bar";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { DictionaryProvider } from "@/i18n/dictionary-provider";
import { buildMetadata } from "@/lib/seo";
import "../globals.css";

// latin-ext: đủ dấu tiếng Séc (č, ř, ž, ů…)
// Spectral: serif biên tập nét sắc, ít uốn lượn, dễ đọc — thay Bodoni Moda (owner thấy quá mềm, khó đọc)
const display = Spectral({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
  display: "swap",
});

// Cinzel: chữ hoa La Mã khắc đá, sắc nét — CHỈ dùng cho wordmark "DECEMBER" ở Hero
const wordmark = Cinzel({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-wordmark-face",
  display: "swap",
});

// Plus Jakarta Sans: font sans hình học hiện đại, sắc nét, thanh thoát và vững vàng
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
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
    <html lang={locale} className={`${display.variable} ${wordmark.variable} ${jakarta.variable}`}>
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
            <main id="main">{children}</main>
            <Footer />
            <MobileBookBar />
          </Providers>
        </DictionaryProvider>
      </body>
    </html>
  );
}
