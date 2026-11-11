"use client";

import Link from "next/link";
import { locales } from "@/i18n/config";
import { useDictionary } from "@/i18n/dictionary-provider";
import { cn } from "@/lib/cn";

/** CS / EN — ngôn ngữ đang chọn sáng hơn và có gạch chân vàng. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, dict } = useDictionary();
  return (
    <nav aria-label={dict.common.language} className={cn("flex items-center gap-2", className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-2.5 w-px bg-current opacity-30" />}
          <Link
            href={`/${l}`}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "relative tracking-[0.24em] uppercase transition-opacity duration-500",
              l === locale ? "opacity-100" : "opacity-45 hover:opacity-100",
            )}
          >
            {l}
            {l === locale && <span className="bg-gold absolute -bottom-1 left-0 h-px w-full" />}
          </Link>
        </span>
      ))}
    </nav>
  );
}
