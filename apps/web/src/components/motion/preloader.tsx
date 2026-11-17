"use client";

import { useRef, useState } from "react";
import { LogoD } from "@/components/brand/logo-d";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "./intro-context";
import { useDictionary } from "@/i18n/dictionary-provider";

/**
 * Màn mở đầu: các sợi tóc của chữ D được "vẽ" dần, thân chữ hiện lên,
 * wordmark December xuất hiện, lưỡi dao vàng cắt ngang và màn tách đôi mở ra hero.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { finish } = useIntro();
  const { dict } = useDictionary();

  useGSAP(
    () => {
      const el = root.current!;
      const release = () => {
        // Chỉ đánh dấu "đã xem" khi màn mở thật sự (StrictMode chạy effect 2 lần)
        sessionStorage.setItem("december-intro-seen", "1");
        document.documentElement.style.overflow = "";
        finish();
      };

      // Bỏ qua màn intro dài nếu người dùng đã xem trong phiên này hoặc đi thẳng tới #anchor
      const seen = sessionStorage.getItem("december-intro-seen") === "1";
      const hasHash = Boolean(window.location.hash);
      if (seen || hasHash) {
        release();
        setGone(true);
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.documentElement.style.overflow = "hidden";
      if (reduced) {
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.3,
          delay: 0.15,
          onStart: release,
          onComplete: () => setGone(true),
        });
        return;
      }

      const strands = el.querySelectorAll<SVGPathElement>(".logo-d__strand");
      strands.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const counter = { v: 0 };

      gsap
        .timeline({ defaults: { ease: "expo.inOut" } })
        .to(
          strands,
          { strokeDashoffset: 0, duration: 1.15, stagger: { each: 0.045, from: "end" } },
          0.1,
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.45,
            ease: "power2.inOut",
            onUpdate: () => {
              const c = el.querySelector(".pl-count");
              if (c) c.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".logo-d__stem", { opacity: 1, duration: 0.65, ease: "power2.out" }, 0.6)
        .from(
          ".pl-word span",
          { yPercent: 110, duration: 0.8, stagger: 0.03, ease: "expo.out" },
          0.75,
        )
        .from(".pl-sub", { opacity: 0, y: 8, duration: 0.6, ease: "power2.out" }, 1.05)
        .to(".pl-inner", { scale: 0.94, opacity: 0, duration: 0.6, ease: "power3.in" }, 1.55)
        .to(".pl-count", { opacity: 0, duration: 0.4, ease: "power2.in" }, 1.55)
        // Lưỡi dao vàng lướt ngang màn hình
        .fromTo(".pl-cut", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "expo.inOut" }, 1.7)
        // Màn tách đôi: nửa trên lên, nửa dưới xuống, lộ Hero video
        .to(".pl-top", { yPercent: -100, duration: 1.1, onStart: release }, 2.2)
        .to(".pl-bottom", { yPercent: 100, duration: 1.1 }, 2.2)
        .to(".pl-cut", { opacity: 0, scaleY: 0.4, duration: 0.5, ease: "power2.out" }, 2.25)
        .add(() => setGone(true));
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="text-ivory pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center"
    >
      <div className="pl-top bg-espresso absolute inset-x-0 top-0 h-[50.5%]" />
      <div className="pl-bottom bg-espresso absolute inset-x-0 bottom-0 h-[50.5%]" />
      <span
        className="pl-cut bg-gold absolute inset-x-0 top-[calc(50%-0.5px)] h-px origin-left"
        style={{ transform: "scaleX(0)", boxShadow: "0 0 14px 1px rgba(217, 194, 122, 0.55)" }}
      />
      <div className="pl-inner relative z-10 flex flex-col items-center">
        <LogoD
          tone="gold"
          className="h-36 w-auto md:h-44 [&_.logo-d__stem]:opacity-0"
          strandWidth={2.6}
        />
        <p className="pl-word font-display mt-8 flex overflow-hidden text-4xl font-normal tracking-[0.04em] md:text-5xl">
          {"December".split("").map((ch, i) => (
            <span key={i} className="inline-block">
              {ch}
            </span>
          ))}
        </p>
        <p className="pl-sub text-gold/80 mt-3 text-[10px] tracking-[0.5em] uppercase">
          {dict.preloader.sub}
        </p>
      </div>
      <span className="pl-count font-display text-ivory/50 absolute right-8 bottom-8 z-10 text-sm tracking-[0.3em] tabular-nums">
        000
      </span>
    </div>
  );
}
