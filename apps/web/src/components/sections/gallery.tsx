"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@december/ui";
import { SplitReveal } from "@/components/motion";
import { lockScroll } from "@/lib/scroll";
import { spaceImages, type SpaceImage } from "@/content/images";
import { gsap, useGSAP } from "@/lib/gsap";
import { useDictionary } from "@/i18n/dictionary-provider";
import { Section } from "@/components/layout/section";

const columns: SpaceImage[][] = [
  [spaceImages.reception, spaceImages.washLounge, spaceImages.lounge],
  [spaceImages.stations, spaceImages.chair],
  [spaceImages.washCorner, spaceImages.floor, spaceImages.overview],
];
/** Cột giữa dùng ảnh dọc để tạo nhịp; tỉ lệ khung theo cột. */
const portrait = ["4 / 5", "1 / 1"];
const speeds = [-6, 8, -10];
const flat = columns.flat();

/** Lưới ảnh 3 cột chạy lệch tốc độ khi cuộn + lightbox. */
export function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const { dict } = useDictionary();

  useGSAP(
    () => {
      gsap
        .matchMedia()
        .add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
          gsap.utils.toArray<HTMLElement>(".gal-col").forEach((col, i) => {
            gsap.fromTo(
              col,
              { yPercent: -speeds[i]! },
              {
                yPercent: speeds[i]!,
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
        });
    },
    { scope: ref },
  );

  useEffect(() => {
    if (open === null) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % flat.length));
      if (e.key === "ArrowLeft")
        setOpen((o) => (o === null ? o : (o - 1 + flat.length) % flat.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = open === null ? null : flat[open]!;

  return (
    <Section
      ref={ref}
      id="space"
      theme="dark"
      className="bg-ink text-ivory overflow-hidden py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow className="text-gold">{dict.space.eyebrow}</Eyebrow>
            <SplitReveal
              as="h2"
              className="font-display mt-8 text-[clamp(3rem,6vw,6rem)] leading-[0.95] font-normal"
            >
              {dict.space.title}
            </SplitReveal>
          </div>
          <p className="text-ivory/50 max-w-xs text-sm">{dict.space.hint}</p>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3 md:gap-6">
          {columns.map((col, ci) => (
            <div key={ci} className="gal-col flex flex-col gap-4 md:gap-6">
              {col.map((img) => {
                const idx = flat.indexOf(img);
                return (
                  <button
                    key={img.src}
                    type="button"

                    onClick={() => setOpen(idx)}
                    className="group relative block overflow-hidden"
                    style={{
                      aspectRatio: ci === 1 ? portrait[col.indexOf(img)] : `${img.w} / ${img.h}`,
                    }}
                    aria-label={`${dict.common.view}: ${dict.images[img.key]}`}
                  >
                    <Image
                      src={img.src}
                      alt={dict.images[img.key]}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-luxe)] group-hover:scale-105"
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="bg-ink/95 fixed inset-0 z-[80] flex items-center justify-center p-4 backdrop-blur md:p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={dict.images[current.key]}
          >
            <motion.div
              key={current.src}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={current.src}
                alt={dict.images[current.key]}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            <p className="text-ivory/60 absolute bottom-6 left-1/2 w-[90%] -translate-x-1/2 text-center text-xs tracking-[0.15em]">
              {open! + 1} / {flat.length} — {dict.images[current.key]}
            </p>
            <button
              type="button"
              className="absolute top-6 right-6 text-[11px] tracking-[0.3em] uppercase"
              onClick={() => setOpen(null)}
            >
              {dict.common.close} ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
