export const locales = ["cs", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "cs";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const localeMeta: Record<Locale, { label: string; intl: string; og: string }> = {
  cs: { label: "Čeština", intl: "cs-CZ", og: "cs_CZ" },
  en: { label: "English", intl: "en-GB", og: "en_GB" },
};
