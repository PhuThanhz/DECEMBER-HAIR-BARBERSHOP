"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setActiveSection } from "@/lib/active-section";
import { useIntro } from "./intro-context";

/**
 * Điều phối chuyển cảnh giữa các section (gắn 1 lần cho cả trang):
 * Theo dõi section ở vùng giữa viewport (42%) → cập nhật header & rail chính xác kể cả khi scrollToId.
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
          start: "top 84px",
          end: "bottom 84px",
          onToggle: (self) => {
            if (self.isActive)
              setActiveSection({
                id: section.id || "top",
                theme: section.dataset.theme as "light" | "dark",
              });
          },
        });
      });

      // Chuyển cảnh "màn phủ": mép thẳng, section sau trượt lên phủ section trước; nội dung section
      // trước trôi chậm lại (parallax nhẹ) → có chiều sâu mà không lộ khe/góc, không làm tối.
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sections.forEach((prev) => {
          const next = prev.nextElementSibling as HTMLElement | null;
          if (next?.dataset.transition !== "rise") return;
          const stage = prev.querySelector<HTMLElement>(":scope > .section-stage");
          if (!stage) return;
          gsap.fromTo(
            stage,
            { yPercent: 0 },
            {
              // Chỉ trôi chậm nhẹ — không làm mờ/tối (owner thấy section bị "tối thui" như lỗi)
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: "top top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        // Vào section mới: nội dung hiện dần & trồi nhẹ lên theo cuộn (scrub, cuộn ngược thì đảo lại).
        // Nhẹ nhàng — không ghim, không làm tối hẳn (bắt đầu từ 50% chứ không từ 0).
        sections.forEach((section) => {
          if (section.dataset.transition !== "rise") return;
          const stage = section.querySelector<HTMLElement>(":scope > .section-stage");
          if (!stage) return;
          gsap.fromTo(
            stage,
            { opacity: 0.5, y: 56 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top 40%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      ScrollTrigger.refresh();

      // Ảnh/font tải xong, autoplay đổi nội dung… làm chiều cao trang thay đổi sau lần refresh đầu.
      // Dùng debounce 150ms để gộp nhiều lần thay đổi chiều cao, tránh giật lag khi cuộn
      let timer: ReturnType<typeof setTimeout> | undefined;
      let lastH = document.body.scrollHeight;
      const ro = new ResizeObserver(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - lastH) < 4) return;
        lastH = h;
        clearTimeout(timer);
        timer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      });
      ro.observe(document.body);
      return () => {
        ro.disconnect();
        clearTimeout(timer);
      };
    },
    { dependencies: [done, pathname], revertOnUpdate: true },
  );

  return null;
}
