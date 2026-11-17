"use client";

import Image from "next/image";
import { LogoD } from "@/components/brand/logo-d";
import { spaceImages } from "@/content/images";
import { navIds, site, telHref } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { scrollToId } from "@/lib/scroll";
import { LanguageSwitch } from "./language-switch";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.29A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41" />
    </svg>
  );
}

/** Icon + màu nhận diện chính thức của từng kênh (ô vuông, không bo tròn, không glow). */
const socialIcons: Record<string, { Icon: typeof InstagramIcon; tile: string }> = {
  Instagram: {
    Icon: InstagramIcon,
    tile: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white",
  },
  Facebook: { Icon: FacebookIcon, tile: "bg-[#1877F2] text-white" },
  WhatsApp: { Icon: WhatsAppIcon, tile: "bg-[#25D366] text-white" },
};

const heading = "text-ivory/45 text-sm";
const link = "text-ivory/90 hover:text-gold transition-colors duration-300";

/**
 * Footer: ảnh không gian tiệm phủ mờ làm nền, chữ "December Barber" khổ lớn trong suốt nằm trên ảnh ở đáy.
 * Phía trên: logo + mô tả · khám phá (2 cột) · ghé thăm · mạng xã hội (icon đơn sắc).
 */
export function Footer() {
  const { dict } = useDictionary();

  return (
    <footer data-theme="dark" className="bg-ink text-ivory relative isolate overflow-hidden">
      {/* Ảnh nền mờ: ghế barber & vách travertine, chìm dần về màu mực ở phía trên */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={spaceImages.stations.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_70%] opacity-40"
        />
        <div className="from-ink via-ink/75 to-ink/25 absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-16">
        <div className="border-ivory/10 grid gap-12 border-t pt-20 md:pt-24 lg:grid-cols-12 lg:gap-10">
          {/* Thương hiệu */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <LogoD tone="gold" className="h-14 w-auto" strandWidth={3.5} />
              <div>
                <p className="font-display text-ivory text-xl tracking-wider">DECEMBER</p>
                <p className="text-gold text-[9px] font-semibold tracking-[0.3em] uppercase">
                  Barber
                </p>
              </div>
            </div>
            <p className="text-ivory/60 mt-8 max-w-sm text-[15px] leading-relaxed">
              {dict.meta.description}
            </p>
          </div>

          {/* Khám phá — 2 cột */}
          <nav className="lg:col-span-3 lg:col-start-6" aria-label={dict.footer.explore}>
            <p className={heading}>{dict.footer.explore}</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-[15px]">
              {navIds.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(id);
                    }}
                    className={link}
                  >
                    {dict.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ghé thăm */}
          <div className="lg:col-span-2">
            <p className={heading}>{dict.footer.visit}</p>
            <ul className="mt-6 space-y-4 text-[15px]">
              <li>
                <a href={site.mapLink} target="_blank" rel="noreferrer" className={link}>
                  {site.address}
                </a>
              </li>
              <li>
                <a href={telHref} className={`${link} tabular-nums`}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div className="lg:col-span-2 lg:col-start-11">
            <p className={heading}>{dict.footer.follow}</p>
            <ul className="mt-6 space-y-4 text-[15px]">
              {site.socials.map((s) => {
                const { Icon, tile } = socialIcons[s.label] ?? socialIcons.Instagram!;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`${link} group inline-flex items-center gap-3`}
                    >
                      {/* Khung kép: viền mảnh bao ngoài ô màu, chuyển vàng khi hover */}
                      <span className="border-ivory/25 group-hover:border-gold border p-1 transition-colors duration-300">
                        <span className={`flex size-9 items-center justify-center ${tile}`}>
                          <Icon className="size-[18px]" />
                        </span>
                      </span>
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Chữ thương hiệu khổ lớn, trong suốt trên nền ảnh */}
      <p
        aria-hidden
        className="font-display text-ivory/[0.1] pointer-events-none mt-16 text-center text-[clamp(2.5rem,11.6vw,13rem)] leading-[0.9] font-normal tracking-tight whitespace-nowrap select-none md:mt-24"
      >
        December Barber
      </p>

      {/* Bản quyền — dòng mảnh, không nền */}
      <div className="text-ivory/45 mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-3 px-6 pt-4 pb-6 text-[13px] md:flex-row md:items-center md:px-10 lg:px-16">
        <span>
          © {new Date().getFullYear()} {site.name}. {dict.footer.rights}.
        </span>
        <div className="flex items-center gap-8">
          <LanguageSwitch className="text-[11px]" />
          <button
            type="button"
            onClick={() => scrollToId("top")}
            className="hover:text-gold transition-colors"
          >
            {dict.footer.backToTop}
          </button>
        </div>
      </div>
    </footer>
  );
}
