"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** % dịch chuyển theo trục Y trên toàn quãng cuộn. Âm = đi lên nhanh hơn. */
  speed?: number;
  /** Phóng to nhẹ phần tử con để parallax không lộ mép. */
  scale?: number;
}

/** Bọc ảnh: khung giữ nguyên, nội dung trượt chậm hơn tốc độ cuộn. */
export function Parallax({ children, className, speed = 12, scale = 1.18 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const inner = ref.current!.firstElementChild as HTMLElement;
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          inner,
          { yPercent: -speed / 2, scale },
          {
            yPercent: speed / 2,
            scale,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 will-change-transform">{children}</div>
    </div>
  );
}
