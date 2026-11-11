"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

interface SplitRevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  /** Bắt đầu ngay (không chờ scroll) — vd. tiêu đề hero; chỉ chạy khi `play` = true. */
  immediate?: boolean;
  play?: boolean;
}

/** Tách chữ bằng GSAP SplitText, từng dòng/chữ trồi lên từ dưới mặt nạ. */
export function SplitReveal({
  as: Tag = "div",
  children,
  className,
  type = "lines",
  delay = 0,
  stagger,
  immediate = false,
  play = true,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!play) return;
      const el = ref.current!;
      gsap.set(el, { visibility: "visible" });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: type === "lines" ? "lines" : `lines,${type}`,
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets =
              type === "lines" ? self.lines : type === "words" ? self.words : self.chars;
            return gsap.from(targets, {
              yPercent: 115,
              rotate: type === "chars" ? 4 : 0,
              duration: type === "chars" ? 1.4 : 1.5,
              ease: "expo.out",
              delay,
              stagger: stagger ?? (type === "chars" ? 0.035 : type === "words" ? 0.04 : 0.1),
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref, dependencies: [play] },
  );

  return (
    <Tag ref={ref} className={className} style={play ? undefined : { visibility: "hidden" }}>
      {children}
    </Tag>
  );
}
