"use client";

import Link from "next/link";
import { useDictionary } from "@/i18n/dictionary-provider";

export default function NotFound() {
  const { dict, locale } = useDictionary();
  return (
    <section className="bg-espresso text-ivory flex min-h-svh flex-col items-center justify-center gap-6">
      <p className="font-display text-gold text-8xl font-normal">404</p>
      <p className="text-ivory/60">{dict.notFound.text}</p>
      <Link
        href={`/${locale}`}
        className="text-[11px] tracking-[0.3em] uppercase underline underline-offset-8"
      >
        {dict.notFound.back}
      </Link>
    </section>
  );
}
