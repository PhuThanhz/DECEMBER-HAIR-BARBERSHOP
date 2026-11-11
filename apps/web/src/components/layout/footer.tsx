"use client";

import { LogoD } from "@/components/brand/logo-d";
import { navIds, site, telHref } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { LanguageSwitch } from "./language-switch";

export function Footer() {
  const { dict } = useDictionary();
  return (
    <footer
      data-theme="dark"
      className="bg-ink text-ivory relative -mt-16 overflow-hidden rounded-t-[4rem] pt-28 md:-mt-24 md:rounded-t-[7rem]"
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 md:grid-cols-12 md:px-10 lg:px-16">
        <div className="md:col-span-4">
          <LogoD tone="gold" className="h-16 w-auto" strandWidth={3.5} />
          <p className="text-ivory/50 mt-6 max-w-xs text-sm leading-relaxed">
            {dict.meta.description}
          </p>
        </div>
        <nav className="md:col-span-2 md:col-start-6" aria-label={dict.footer.explore}>
          <p className="text-gold text-[11px] tracking-[0.28em] uppercase">{dict.footer.explore}</p>
          <ul className="text-ivory/70 mt-5 space-y-2 text-sm">
            {navIds.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:text-ivory transition-colors">
                  {dict.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="text-gold text-[11px] tracking-[0.28em] uppercase">{dict.footer.contact}</p>
          <address className="text-ivory/70 mt-5 space-y-2 text-sm not-italic">
            <p>{site.address}</p>
            <p>
              <a href={telHref} className="hover:text-ivory">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-ivory">
                {site.email}
              </a>
            </p>
          </address>
        </div>
        <div className="md:col-span-2">
          <p className="text-gold text-[11px] tracking-[0.28em] uppercase">{dict.footer.follow}</p>
          <ul className="text-ivory/70 mt-5 space-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ivory transition-colors"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitch className="mt-8 text-[11px]" />
        </div>
      </div>

      <p
        aria-hidden
        className="font-display text-ivory/[0.06] mt-20 text-center text-[24vw] leading-[0.75] font-normal tracking-[-0.03em] whitespace-nowrap select-none"
      >
        December
      </p>
      <div className="border-ivory/10 border-t">
        <div className="text-ivory/40 mx-auto flex max-w-[1440px] flex-col justify-between gap-2 px-6 py-6 text-[11px] tracking-[0.2em] uppercase md:flex-row md:px-10 lg:px-16">
          <span>
            © {new Date().getFullYear()} {site.name} · {dict.footer.rights}
          </span>
          <span>{dict.common.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
