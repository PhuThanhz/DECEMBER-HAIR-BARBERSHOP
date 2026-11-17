"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { useIntro } from "@/components/motion";
import { scrollToId } from "@/lib/scroll";
import { navIds, site, type NavId } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useActiveSection } from "@/lib/active-section";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { LanguageSwitch } from "./language-switch";
import { MenuOverlay } from "./menu-overlay";

/**
 * Header biên tập (không thanh khối, không nút khối):
 *  - Trái: mục lục chương đánh số bằng serif · Giữa: logo · Phải: ngôn ngữ, "Rezervovat" dạng chữ, Menu.
 *  - Trong suốt trên Hero; khi cuộn: nền mờ nhẹ + một đường kẻ mảnh, không đổ bóng.
 *  - Tự đổi màu sáng/tối theo section bên dưới.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { done } = useIntro();
  const { dict, locale } = useDictionary();
  const active = useActiveSection();
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const dark = !scrolled || active.theme === "dark";

  useGSAP(
    () => {
      if (!done) return;
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ delay: 0.05 })
          .from(".hd-logo", { y: -16, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.1)
          .from(
            ".hd-item",
            { y: -12, opacity: 0, duration: 0.85, stagger: 0.04, ease: "expo.out" },
            0.2,
          );
      });

      const initialScrolled = window.scrollY > 60;
      setScrolled(initialScrolled);
      let isPastThreshold = initialScrolled;

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const nextScrolled = self.scroll() > 60;
          if (nextScrolled !== isPastThreshold) {
            isPastThreshold = nextScrolled;
            setScrolled(nextScrolled);
          }
        },
      });
      return () => st.kill();
    },
    { scope: ref, dependencies: [done] },
  );

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  const navLink = (id: NavId, i: number) => {
    const on = active.id === id;
    return (
      <li key={id} className="hd-item">
        <a
          href={`#${id}`}
          onClick={go(id)}
          aria-current={on ? "true" : undefined}
          className={cn(
            "group font-display relative flex items-baseline gap-1.5 py-2 text-[15px] leading-none transition-colors duration-500 xl:text-base",
            on ? "text-gold" : "opacity-80 hover:opacity-100",
          )}
        >
          <span className="font-sans text-[9px] tracking-[0.1em] tabular-nums opacity-50">
            {String(i + 1).padStart(2, "0")}
          </span>
          {dict.nav[id]}
        </a>
      </li>
    );
  };

  return (
    <>
      <header
        ref={ref}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding,color] duration-700 ease-[var(--ease-luxe)]",
          dark ? "text-ivory" : "text-ink",
          scrolled ? "px-3 pt-3 md:px-5" : "px-0 pt-0",
        )}
      >
        <div
          className={cn(
            "mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-2xl border px-5 transition-[height,background-color,border-color,box-shadow,backdrop-filter] duration-700 ease-[var(--ease-luxe)] md:px-8",
            !scrolled && "h-20 border-transparent lg:h-24",
            // Thanh kính nổi khi cuộn — nền mờ đều, không để ánh video lọt vệt
            scrolled &&
              (dark
                ? "bg-ink/55 h-16 border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-2xl backdrop-saturate-150"
                : "h-16 border-transparent bg-white/60 shadow-[0_8px_32px_rgba(23,18,15,0.08)] backdrop-blur-2xl backdrop-saturate-150"),
          )}
        >
          {/* Trái: mục lục chương (desktop) · chọn ngôn ngữ (mobile) */}
          <div className="justify-self-start">
            <nav aria-label={dict.footer.explore} className="hidden lg:block">
              <ul className="flex items-center gap-6 xl:gap-8">{navIds.map(navLink)}</ul>
            </nav>
            <LanguageSwitch className="hd-item text-[10px] font-medium lg:hidden" />
          </div>

          {/* Giữa: logo */}
          <Link
            href={`/${locale}`}
            onClick={go("top")}
            aria-label={`${site.name} — top`}
            className="hd-logo flex items-center justify-self-center"
          >
            <span
              className={cn(
                "block text-[21px] transition-transform duration-700 ease-[var(--ease-luxe)] md:text-[26px]",
                scrolled ? "scale-[0.86]" : "scale-100",
              )}
            >
              <Wordmark tone={dark ? "gold" : "ink"} />
            </span>
          </Link>

          {/* Phải: ngôn ngữ · đặt lịch (chữ) · menu */}
          <div className="flex items-center gap-6 justify-self-end xl:gap-8">
            <LanguageSwitch className="hd-item hidden text-[10px] font-medium lg:flex" />
            <a
              href="#booking"
              onClick={go("booking")}
              className={cn(
                "hd-item hidden rounded-xl px-4 py-2.5 text-[13px] leading-none font-medium transition-colors duration-300 sm:inline-flex",
                dark ? "bg-ivory text-ink hover:bg-white" : "bg-ink text-ivory hover:bg-espresso",
              )}
            >
              {dict.common.book}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label={dict.common.menu}
              className="hd-item group flex items-center gap-3 py-2"
            >
              <span className="font-display hidden text-[15px] leading-none sm:inline xl:text-base">
                {dict.common.menu}
              </span>
              <span className="flex w-7 flex-col items-end gap-[6px]">
                <span className="h-px w-full origin-right bg-current transition-transform duration-500 group-hover:scale-x-75" />
                <span className="h-px w-full origin-right scale-x-50 bg-current transition-transform duration-500 group-hover:scale-x-100" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
