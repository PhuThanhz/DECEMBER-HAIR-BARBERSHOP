"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoD } from "@/components/brand/logo-d";
import { Wordmark } from "@/components/brand/wordmark";
import { Magnetic, useIntro } from "@/components/motion";
import { scrollToId } from "@/lib/scroll";
import { navIds, site, telHref, type NavId } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useActiveSection } from "@/lib/active-section";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { LanguageSwitch } from "./language-switch";
import { MenuOverlay } from "./menu-overlay";

const leftNav: NavId[] = ["styles", "menu", "space"];
const rightNav: NavId[] = ["experience", "contact"];

/**
 * Header sang trọng 2 tầng:
 *  - Thanh thông tin (giờ mở cửa · năm thành lập · SĐT · CS/EN) — thu gọn khi cuộn.
 *  - Thanh chính: nav trái · logo giữa · nav phải + nút đặt lịch.
 *  - Đường kẻ vàng dưới đáy chạy theo tiến độ cuộn trang.
 *  - Tự đổi màu sáng/tối theo section bên dưới; ẩn khi cuộn xuống, hiện khi cuộn lên.
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
          .timeline({ delay: 0.4 })
          .from(".hd-line", { scaleX: 0, duration: 1.6, ease: "expo.inOut" })
          .from(".hd-logo", { y: -20, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.3)
          .from(
            ".hd-item",
            { y: -14, opacity: 0, duration: 1.1, stagger: 0.05, ease: "expo.out" },
            0.5,
          );
      });

      setScrolled(window.scrollY > 60);
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          setScrolled(self.scroll() > 60);
          gsap.set(".hd-progress", { scaleX: self.progress });
          if (openRef.current) return;
          gsap.to(ref.current, {
            yPercent: self.direction === 1 && self.scroll() > 500 ? -100 : 0,
            duration: 0.7,
            ease: "power3.out",
            overwrite: "auto",
          });
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

  const navLink = (id: NavId) => (
    <li key={id} className="hd-item">
      <a
        href={`#${id}`}
        onClick={go(id)}
        aria-current={active.id === id ? "true" : undefined}
        className="group relative block py-2 text-[11px] font-medium tracking-[0.26em] uppercase"
      >
        {dict.nav[id]}
        <span
          className={cn(
            "bg-gold absolute bottom-0 left-1/2 h-px -translate-x-1/2 transition-all duration-700 ease-[var(--ease-luxe)]",
            active.id === id ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      </a>
    </li>
  );

  return (
    <>
      <header
        ref={ref}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[color,background-color,backdrop-filter] duration-700 ease-[var(--ease-luxe)]",
          dark ? "text-ivory" : "text-ink",
          scrolled && (dark ? "bg-ink/60 backdrop-blur-xl" : "bg-ivory/70 backdrop-blur-xl"),
        )}
      >
        {/* Thanh thông tin */}
        <div
          className={cn(
            "hidden overflow-hidden transition-[height,opacity] duration-700 ease-[var(--ease-luxe)] lg:block",
            scrolled ? "h-0 opacity-0" : "h-10 opacity-100",
          )}
        >
          <div className="mx-auto grid h-10 max-w-[1600px] grid-cols-3 items-center px-10 text-[10px] tracking-[0.28em] uppercase opacity-70">
            <span className="hd-item">{dict.hours.short}</span>
            <span className="hd-item text-gold text-center">{dict.common.est}</span>
            <span className="hd-item flex items-center justify-end gap-6">
              <a href={telHref} className="transition-opacity hover:opacity-60">
                {site.phone}
              </a>
              <LanguageSwitch />
            </span>
          </div>
          <div className="hd-line mx-10 h-px origin-center bg-current opacity-15" />
        </div>

        {/* Thanh chính */}
        <div
          className={cn(
            "mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 transition-[height] duration-700 ease-[var(--ease-luxe)] md:px-10",
            scrolled ? "h-16" : "h-20 lg:h-24",
          )}
        >
          <div className="flex items-center gap-10">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label={dict.common.menu}
              className="hd-item group flex items-center gap-3"
            >
              <span className="flex w-7 flex-col gap-[5px]">
                <span className="h-px w-full bg-current transition-transform duration-500 group-hover:scale-x-75" />
                <span className="h-px w-full origin-left scale-x-60 bg-current transition-transform duration-500 group-hover:scale-x-100" />
              </span>
              <span className="hidden text-[11px] font-medium tracking-[0.26em] uppercase sm:inline">
                {dict.common.menu}
              </span>
            </button>
            <ul className="hidden items-center gap-8 xl:flex">{leftNav.map(navLink)}</ul>
          </div>

          <Link
            href={`/${locale}`}
            onClick={go("top")}
            aria-label={`${site.name} — top`}
            className="hd-logo relative flex items-center justify-center"
          >
            <span
              className={cn(
                "block text-[22px] transition-[opacity,transform] duration-700 ease-[var(--ease-luxe)] md:text-[28px]",
                scrolled ? "pointer-events-none scale-75 opacity-0" : "scale-100 opacity-100",
              )}
            >
              <Wordmark tone={dark ? "gold" : "ink"} />
            </span>
            <LogoD
              tone={dark ? "gold" : "ink"}
              strandWidth={4}
              className={cn(
                "absolute h-9 w-auto transition-[opacity,transform] duration-700 ease-[var(--ease-luxe)]",
                scrolled ? "scale-100 opacity-100" : "scale-125 opacity-0",
              )}
            />
          </Link>

          <div className="flex items-center justify-end gap-8">
            <ul className="hidden items-center gap-8 xl:flex">{rightNav.map(navLink)}</ul>
            <LanguageSwitch className={cn("hd-item text-[11px] lg:hidden", "font-medium")} />
            <Magnetic>
              <a
                href="#contact"
                onClick={go("contact")}
                className={cn(
                  "hd-item group relative hidden overflow-hidden rounded-full border px-6 py-3 text-[11px] font-semibold tracking-[0.24em] uppercase sm:inline-flex",
                  dark ? "border-gold/70 text-ivory" : "border-ink text-ink",
                )}
              >
                <span className="group-hover:text-ink relative z-10 transition-colors duration-500">
                  {dict.common.book}
                </span>
                <span className="bg-gold absolute inset-0 translate-y-full rounded-full transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-y-0" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Tiến độ cuộn */}
        <div className="relative h-px">
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              scrolled ? "opacity-100" : "opacity-0",
              dark ? "bg-ivory/10" : "bg-ink/10",
            )}
          />
          <div className="hd-progress bg-gold absolute inset-0 origin-left scale-x-0" />
        </div>
      </header>
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
