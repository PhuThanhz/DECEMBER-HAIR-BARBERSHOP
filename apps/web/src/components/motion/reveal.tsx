"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Hiệu ứng cho các con trực tiếp lần lượt (stagger) thay vì cả khối. */
  stagger?: number;
  y?: number;
  delay?: number;
}

/** Fade + trượt lên khi phần tử đi vào viewport. */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  stagger,
  y = 40,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const targets = stagger ? Array.from(el.children) : el;
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(targets, {
          y,
          opacity: 0,
          duration: 1.3,
          delay,
          stagger: stagger ?? 0,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
