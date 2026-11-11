"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/layout/section";
import { LogoD } from "@/components/brand/logo-d";
import { Magnetic, SplitReveal } from "@/components/motion";
import { featureStyles } from "@/content/hair";
import { useDictionary } from "@/i18n/dictionary-provider";
import { setActiveSection, useActiveSection } from "@/lib/active-section";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToId } from "@/lib/scroll";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

const AUTOPLAY_SECONDS = 6;
const curtain = [0.76, 0, 0.24, 1] as const;
const luxe = [0.22, 1, 0.36, 1] as const;

/**
 * Section "Kiểu tóc" — 5 kiểu tóc signature trong MỘT section:
 * - Mỗi kiểu có bảng màu riêng; chọn kiểu → nền & chữ của cả section chuyển màu mượt.
 * - Ảnh lớn mở như rèm, ảnh chi tiết chồng góc, tên kiểu tóc chạy ngang phía sau.
 * - Tự chuyển kiểu sau 6s (thanh tiến độ trên thumbnail), dừng khi hover hoặc khi section ra khỏi màn hình.
 */
export function Styles() {
  const ref = useRef<HTMLElement>(null);
  const { dict } = useDictionary();
  const active = useActiveSection();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  const feature = featureStyles[index]!;
  const { bg, ink, accent, theme } = feature.palette;
  const copy = dict.features.items[feature.id];
  const name = dict.styles.items[feature.id].name;
  const total = featureStyles.length;
  const go = (i: number) => setIndex((i + total) % total);

  // Header/rail đổi màu chữ theo bảng màu hiện tại khi đang ở section này
  useEffect(() => {
    if (active.id === "styles" && active.theme !== theme) setActiveSection({ id: "styles", theme });
  }, [active, theme]);

  // Chỉ tự chạy khi section đang hiển thị
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".st-ticker",
          { xPercent: 0 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
        gsap.from(".st-thumb", {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ref.current?.querySelector(".st-thumbs"),
            start: "top 92%",
            once: true,
          },
        });
      });
    },
    { scope: ref },
  );

  const specs = [
    [dict.features.hold, copy.hold],
    [dict.features.maintenance, copy.maintenance],
    [dict.features.faces, copy.faces],
    [dict.features.duration, copy.duration],
  ] as const;

  const content = [
    <p key="k" className="font-display text-xl italic md:text-2xl" style={{ color: accent }}>
      {copy.kicker}
    </p>,
    <h3
      key="n"
      className="font-display mt-2 text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.92] font-medium"
    >
      {name}
    </h3>,
    <p key="d" className="mt-7 max-w-md text-base leading-relaxed opacity-80 md:text-lg">
      {copy.description}
    </p>,
    <dl
      key="s"
      className="mt-9 grid grid-cols-2 gap-x-8 border-t"
      style={{ borderColor: `${ink}2e` }}
    >
      {specs.map(([label, value]) => (
        <div key={label} className="border-b py-4" style={{ borderColor: `${ink}2e` }}>
          <dt className="text-[10px] tracking-[0.28em] uppercase opacity-60">{label}</dt>
          <dd className="font-display mt-1 text-lg md:text-xl">{value}</dd>
        </div>
      ))}
    </dl>,
  ];

  return (
    <Section
      ref={ref}
      id="styles"
      theme={theme}
      className="overflow-hidden pt-24 pb-24 transition-[background-color,color] duration-[1200ms] ease-[var(--ease-luxe)] md:pt-32 md:pb-32"
      style={{ backgroundColor: bg, color: ink }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Dải tên kiểu tóc chạy ngang theo cuộn */}
      <div
        aria-hidden
        className="pointer-events-none overflow-hidden whitespace-nowrap opacity-[0.12]"
      >
        <div className="st-ticker font-display flex w-max items-center gap-10 text-[clamp(4rem,11vw,11rem)] leading-none italic">
          {[...featureStyles, ...featureStyles].map((f, i) => (
            <span key={i} className="flex items-center gap-10">
              {dict.styles.items[f.id].name}
              <LogoD tone="ivory" strandsOnly strandWidth={4} className="h-[0.5em] w-auto" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        {/* Tiêu đề section */}
        <div className="-mt-6 flex flex-col justify-between gap-6 md:-mt-10 md:flex-row md:items-end">
          <div>
            <p
              className="flex items-center gap-4 text-[11px] font-medium tracking-[0.32em] uppercase transition-colors duration-1000"
              style={{ color: accent }}
            >
              <span
                className="h-px w-10 transition-colors duration-1000"
                style={{ backgroundColor: accent }}
              />
              {dict.styles.eyebrow}
            </p>
            <SplitReveal
              as="h2"
              className="font-display mt-6 text-[clamp(2.6rem,5vw,4.8rem)] leading-[1]"
            >
              {dict.styles.title}
            </SplitReveal>
          </div>
          <p className="max-w-sm text-sm leading-relaxed opacity-75">{dict.styles.lead}</p>
        </div>

        {/* Sân khấu chính */}
        <div className="mt-14 grid items-center gap-14 md:mt-20 md:grid-cols-12 md:gap-10">
          {/* Ảnh */}
          <div className="relative md:col-span-6">
            <div
              aria-hidden
              className="absolute -inset-[10%] rounded-full blur-3xl transition-[background] duration-1000"
              style={{ background: `radial-gradient(circle, ${accent}55 0%, transparent 65%)` }}
            />
            <div
              className="arch relative aspect-[4/5] overflow-hidden"
              style={{ backgroundColor: `${ink}14` }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={feature.id}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.6 } }}
                  transition={{ duration: 1.1, ease: curtain }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.8, ease: luxe }}
                  >
                    <Image
                      src={feature.image.src}
                      alt={name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-[50%_25%]"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Ảnh chi tiết */}
            <div className="absolute -right-3 -bottom-8 w-[40%] md:-right-10 md:-bottom-12">
              <div
                className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-2xl transition-[outline-color] duration-1000"
                style={{ outline: `8px solid ${bg}` }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={feature.id}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.7 } }}
                    transition={{ duration: 1, ease: curtain, delay: 0.25 }}
                  >
                    <Image
                      src={feature.detail.src}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Số thứ tự */}
            <p className="font-display absolute -top-8 left-0 text-sm tracking-[0.2em] tabular-nums">
              <span style={{ color: accent }} className="transition-colors duration-1000">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="opacity-50"> / {String(total).padStart(2, "0")}</span>
            </p>
          </div>

          {/* Nội dung */}
          <div className="relative md:col-span-5 md:col-start-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={feature.id}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
                  exit: { opacity: 0, y: -16, transition: { duration: 0.35 } },
                }}
              >
                {content.map((child, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 28 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: luxe } },
                    }}
                  >
                    {child}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-6">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => scrollToId("contact")}
                  className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full px-8 py-4 text-[12px] font-semibold tracking-[0.24em] uppercase transition-colors duration-1000"
                  style={{ backgroundColor: accent, color: bg }}
                >
                  <span className="relative z-10">{dict.features.cta}</span>
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </Magnetic>
              <div className="flex gap-2">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    aria-label={dir < 0 ? "Previous" : "Next"}
                    onClick={() => go(index + dir)}
                    className="flex size-12 items-center justify-center rounded-full border transition-colors duration-500 hover:bg-current/10"
                    style={{ borderColor: `${ink}55` }}
                  >
                    {dir < 0 ? "←" : "→"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails + thanh tiến độ tự chuyển */}
        <div
          role="tablist"
          aria-label={dict.styles.eyebrow}
          className="st-thumbs -mx-6 mt-20 flex snap-x [scrollbar-width:none] gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:mt-28 md:grid md:grid-cols-5 md:overflow-visible md:px-0"
        >
          {featureStyles.map((f, i) => {
            const selected = i === index;
            return (
              <button
                key={f.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => go(i)}
                className="st-thumb group relative w-40 shrink-0 snap-start text-left md:w-auto"
              >
                <span
                  className={cn(
                    "relative block aspect-[4/3] overflow-hidden rounded-2xl transition-opacity duration-700",
                    selected ? "opacity-100" : "opacity-60 group-hover:opacity-90",
                  )}
                >
                  <Image
                    src={f.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 18vw, 160px"
                    className="object-cover object-[50%_25%] transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-3 left-3 size-3 rounded-full ring-2 ring-white/80"
                    style={{ backgroundColor: f.palette.bg }}
                  />
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-3">
                  <span
                    className={cn(
                      "font-display text-lg transition-opacity",
                      selected ? "opacity-100" : "opacity-60",
                    )}
                  >
                    {dict.styles.items[f.id].name}
                  </span>
                  <span className="text-[10px] tabular-nums opacity-50">0{i + 1}</span>
                </span>
                <span
                  className="mt-2 block h-px w-full overflow-hidden"
                  style={{ backgroundColor: `${ink}26` }}
                >
                  {selected && !reduced && (
                    <span
                      key={`${f.id}-${index}`}
                      className="block h-full origin-left"
                      style={{
                        backgroundColor: accent,
                        animation: `st-progress ${AUTOPLAY_SECONDS}s linear forwards`,
                        animationPlayState: paused || !inView ? "paused" : "running",
                      }}
                      onAnimationEnd={() => go(index + 1)}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
