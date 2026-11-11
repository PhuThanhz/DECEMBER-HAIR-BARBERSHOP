"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setActiveSection } from "@/lib/active-section";
import { useIntro } from "./intro-context";

/**
 * Điều phối chuyển cảnh giữa các section (gắn 1 lần cho cả trang):
 * 1. [data-transition=rise] — góc bo lớn phẳng dần + trượt nhẹ khi section đi lên.
 * 2. .section-shade — section phía trước tối dần khi bị section sau che.
 * 3. Theo dõi section ở dưới header → cập nhật store (header đổi màu, rail đổi số).
 */
export function SectionTransitions() {
  const { done } = useIntro();
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!done) return;
      const sections = gsap.utils.toArray<HTMLElement>(
        "main section[data-theme], footer[data-theme]",
      );

      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 60px",
          end: "bottom 60px",
          onToggle: (self) => {
            if (self.isActive)
              setActiveSection({
                id: section.id || "top",
                theme: section.dataset.theme as "light" | "dark",
              });
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sections.forEach((section) => {
          if (section.dataset.transition === "rise") {
            const radius = getComputedStyle(section).borderTopLeftRadius;
            gsap.fromTo(
              section,
              { borderTopLeftRadius: radius, borderTopRightRadius: radius },
              {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "top 15%",
                  scrub: true,
                },
              },
            );
          }
          const next = section.nextElementSibling as HTMLElement | null;
          const shade = section.querySelector<HTMLElement>(":scope > .section-shade");
          if (shade && next?.dataset.transition === "rise") {
            gsap.to(shade, {
              opacity: 0.55,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
            });
          }
        });
      });
      ScrollTrigger.refresh();
    },
    { dependencies: [done, pathname], revertOnUpdate: true },
  );

  return null;
}
