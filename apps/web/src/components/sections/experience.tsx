"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { SplitReveal } from "@/components/motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { useDictionary } from "@/i18n/dictionary-provider";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/cn";

/**
 * Chương 03 — Nghi thức: tiêu đề lớn, 4 dải ảnh bo góc mềm với chú thích trên tấm kính.
 * Desktop: dải đang chọn (hover/bấm/focus) giãn rộng thấy trọn ảnh + mô tả; dải khác thu hẹp & tối đi.
 */
const ritualImages = [
  "/images/space/space-03-chair.jpg",
  "/images/hair/craft-razor-shave.jpg",
  "/images/space/space-04-wash-corner.jpg",
  "/images/space/space-06-lounge.jpg",
];

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const { dict } = useDictionary();
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".exp-card", {
          yPercent: 8,
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: ".exp-grid", start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Section
      ref={ref}
      id="experience"
      theme="light"
      className="bg-travertine text-ink pt-24 pb-28 lg:pt-28 lg:pb-32"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-6 md:px-10 lg:min-h-0 lg:flex-1 lg:px-16">
        <div className="flex shrink-0 flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SplitReveal
              as="h2"
              className="font-display max-w-4xl text-[clamp(2.4rem,4.8vw,5rem)] leading-[0.95] font-normal"
            >
              {dict.experience.title}
            </SplitReveal>
          </div>
        </div>

        {/* Desktop: 4 dải ảnh — dải đang chọn giãn rộng (thấy trọn ảnh + mô tả), các dải khác thu hẹp */}
        <ol className="exp-grid -mx-6 mt-8 flex snap-x snap-mandatory scroll-px-6 [scrollbar-width:none] gap-3 overflow-x-auto px-6 pb-2 md:-mx-10 md:mt-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:min-h-0 lg:flex-1 lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {dict.experience.items.map((e, i) => {
            const on = i === active;
            return (
              <li
                key={e.title}
                onPointerEnter={() => setActive(i)}
                className="exp-card bg-espresso relative h-[60svh] max-h-[580px] w-[82vw] shrink-0 snap-start overflow-hidden rounded-[28px] sm:w-[55vw] lg:h-auto lg:max-h-none lg:w-auto lg:min-w-0 lg:shrink lg:[flex-grow:var(--grow)] lg:basis-0 lg:transition-[flex-grow] lg:duration-[900ms] lg:ease-[var(--ease-luxe)]"
                style={{ "--grow": on ? 3.4 : 1 } as CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  aria-controls={`exp-desc-${i}`}
                  className="absolute inset-0 z-10 hidden text-left lg:block lg:cursor-pointer"
                >
                  <span className="sr-only">{e.title}</span>
                </button>
                <Image
                  src={ritualImages[i]!}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)]",
                    on ? "lg:scale-100" : "lg:scale-110",
                  )}
                />
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-t transition-opacity duration-700",
                    "from-ink/85 via-ink/25 to-transparent",
                  )}
                />
                <div
                  aria-hidden
                  className={cn(
                    "bg-ink/30 pointer-events-none absolute inset-0 hidden transition-opacity duration-700 lg:block",
                    on ? "opacity-0" : "opacity-100",
                  )}
                />
                <span className="font-display text-ivory/90 absolute top-5 left-6 text-lg italic tabular-nums">
                  0{i + 1}
                </span>
                <div className="text-ivory pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <div>
                    <h3
                      className={cn(
                        "font-display leading-tight font-normal transition-[font-size] duration-700",
                        on
                          ? "text-[clamp(1.6rem,2.6vw,2.8rem)]"
                          : "text-[clamp(1.5rem,2vw,2rem)] lg:text-[clamp(1.1rem,1.4vw,1.4rem)]",
                      )}
                    >
                      {e.title}
                    </h3>
                    <p
                      id={`exp-desc-${i}`}
                      className={cn(
                        "text-ivory/80 mt-2 max-w-md text-sm leading-relaxed transition-opacity duration-700",
                        on ? "lg:opacity-100 lg:delay-300" : "lg:hidden",
                      )}
                    >
                      {e.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
