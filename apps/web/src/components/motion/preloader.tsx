"use client";

import { useRef, useState } from "react";
import { LogoD } from "@/components/brand/logo-d";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "./intro-context";
import { useDictionary } from "@/i18n/dictionary-provider";

/**
 * Màn mở đầu: các sợi tóc của chữ D được "vẽ" dần, thân chữ hiện lên,
 * wordmark December xuất hiện, rồi màn trượt lên mở ra hero.
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

      sessionStorage.setItem("december-intro-seen", "1");
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
        .to(
          el,
          { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut", onStart: release },
          1.75,
        )
        .add(() => setGone(true));
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="bg-espresso text-ivory fixed inset-0 z-[100] flex items-center justify-center"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="pl-inner flex flex-col items-center">
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
      <span className="pl-count font-display text-ivory/50 absolute right-8 bottom-8 text-sm tracking-[0.3em] tabular-nums">
        000
      </span>
    </div>
  );
}
