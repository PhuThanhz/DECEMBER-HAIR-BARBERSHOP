"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Mở ảnh bằng clip-path từ dưới lên (như rèm), kèm zoom-out nhẹ. */
export function ClipReveal({
  children,
  className,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  from?: "bottom" | "left" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const start = {
    bottom: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
    center: "inset(30% 30% 30% 30%)",
  }[from];

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        });
        tl.fromTo(
          ref.current,
          { clipPath: start },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
        ).from(ref.current!.firstElementChild, { scale: 1.3, duration: 2, ease: "expo.out" }, 0.2);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
