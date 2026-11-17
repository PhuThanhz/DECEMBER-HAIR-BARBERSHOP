"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/layout/section";
import { featureStyles } from "@/content/hair";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useBookingSelection } from "@/lib/booking-selection";
import { cn } from "@/lib/cn";
import { scrollToId } from "@/lib/scroll";
import { ctaGlass, ctaGold, glassDark } from "@/components/ui/cta";

/** Thời gian mỗi kiểu tóc được hiển thị khi tự chạy (giây). */
const AUTOPLAY_S = 7;
const ease = [0.22, 1, 0.36, 1] as const;
const curtain = [0.76, 0, 0.24, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Chương 02 — 5 kiểu tóc signature dạng "bìa tạp chí" (cao đúng 1 màn hình):
 * tên kiểu tóc khổ lớn chạy ngang phía sau, ảnh chân dung khung vòm đứng phía trước che một phần chữ.
 * Trái: lời dẫn + thông số. Phải: mục lục 5 kiểu (ảnh nhỏ) + nút đặt lịch.
 * Đổi kiểu: chữ mọc lên từng ký tự, ảnh mở như rèm, nền đổi màu. Tự chạy (không hiện vạch tiến độ).
 */
export function Styles() {
  const { dict } = useDictionary();
  const { selectBooking } = useBookingSelection();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const s = featureStyles[active] ?? featureStyles[0];
  const info = dict.styles.items[s.id];
  const feat = dict.features.items[s.id];
  const paused = userPaused || hovering || focusWithin || !inView;

  // Tự chuyển kiểu sau AUTOPLAY_S giây (dừng khi hover/focus/ngoài màn hình/giảm chuyển động)
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(
      () => setActive((i) => (i + 1) % featureStyles.length),
      AUTOPLAY_S * 1000,
    );
    return () => window.clearTimeout(t);
  }, [active, paused]);

  const specs = [
    [dict.features.hold, feat.hold],
    [dict.features.maintenance, feat.maintenance],
    [dict.features.faces, feat.faces],
    [dict.features.duration, feat.duration],
  ] as const;

  const book = () => {
    selectBooking({ kind: "style", id: s.id, title: info.name, meta: info.tags });
    scrollToId("booking");
  };

  return (
    <Section
      ref={ref}
      id="styles"
      theme="dark"
      fit={false}
      className="bg-espresso text-ivory overflow-hidden py-24 lg:pt-28 lg:pb-24"
    >
      <div
        className="mx-auto flex w-full max-w-[1600px] flex-col px-6 md:px-10 lg:px-16"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
        }}
      >
        {/* Hàng tiêu đề */}
        <div className="flex shrink-0 flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.4rem,4.8vw,5rem)] leading-[0.95] font-normal">
            {dict.styles.title}
          </h2>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              className={cn(ctaGlass, "px-4 py-2.5 text-[13px] motion-reduce:hidden")}
            >
              {userPaused ? dict.styles.play : dict.styles.pause}
            </button>
            <p
              className="font-display text-ivory/50 text-sm italic tabular-nums"
              aria-live="polite"
            >
              <span className="text-gold">{pad(active + 1)}</span> / {pad(featureStyles.length)}
            </p>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-6 lg:h-[calc(100svh-14rem)] lg:max-h-[860px] lg:min-h-[560px] lg:grid-cols-12 lg:gap-10">
          {/* Trái: tên kiểu tóc khổ lớn (chữ mọc lên từng ký tự) ở trên, lời dẫn + thông số ở dưới.
              Tên KHÔNG đè lên ảnh — owner thấy chữ che mặt người mẫu rất kỳ. */}
          <div className="relative z-20 order-2 lg:order-1 lg:col-span-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={s.id}
                className="flex h-full flex-col justify-between gap-8"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
              >
                <div>
                  <motion.p
                    className="font-display text-gold text-lg italic tabular-nums"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.1 } }}
                  >
                    {pad(active + 1)}
                  </motion.p>
                  <h3 className="font-display mt-2 text-[clamp(2.6rem,4.4vw,4.8rem)] leading-[0.92] font-light text-balance">
                    {info.name.split(" ").map((word, w, words) => {
                      const before = words.slice(0, w).join(" ").length;
                      return (
                        <span key={w} className="inline-block whitespace-nowrap">
                          {[...word].map((ch, i) => (
                            <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
                              <motion.span
                                className="inline-block"
                                initial={{ y: "105%" }}
                                animate={{ y: 0 }}
                                transition={{
                                  duration: 0.9,
                                  ease,
                                  delay: 0.1 + (before + i) * 0.03,
                                }}
                              >
                                {ch}
                              </motion.span>
                            </span>
                          ))}
                          {w < words.length - 1 && " "}
                        </span>
                      );
                    })}
                  </h3>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.35 } }}
                >
                  <p className="font-display text-gold text-[clamp(1.25rem,1.6vw,1.6rem)] leading-snug italic">
                    {feat.kicker}
                  </p>
                  <p className="text-ivory/70 mt-3 text-sm leading-relaxed">{feat.description}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                    {specs.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-ivory/50 text-[12px]">{k}</dt>
                        <dd className="mt-1 text-[14px]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Giữa: khung CỐ ĐỊNH 3:4 cho mọi kiểu — cả 5 ảnh đều là chân dung dọc nên cùng kích thước,
              phủ kín khung (cover), không viền mờ. */}
          <div className="relative z-10 order-1 lg:order-2 lg:col-span-6 lg:min-h-0">
            <div className="bg-ink relative mx-auto aspect-[3/4] h-[52svh] max-w-full overflow-hidden rounded-[28px] lg:h-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={s.id}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.9 } }}
                  transition={{ duration: 1.1, ease: curtain }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.18 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.6, ease }}
                  >
                    <Image
                      src={s.image.src}
                      alt={info.name}
                      fill
                      sizes="(min-width: 1024px) 34vw, 90vw"
                      loading="eager"
                      className="object-cover"
                      style={{ objectPosition: s.focus }}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              {/* Tải sẵn ảnh các kiểu còn lại → đổi kiểu không bị khung trống */}
              <span
                aria-hidden
                className="pointer-events-none absolute size-px overflow-hidden opacity-0"
              >
                {featureStyles.map((it) => (
                  <Image
                    key={it.id}
                    src={it.image.src}
                    alt=""
                    width={1}
                    height={1}
                    sizes="(min-width: 1024px) 34vw, 90vw"
                    loading="eager"
                  />
                ))}
              </span>
              <span
                className={cn(
                  glassDark,
                  "text-ivory absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl px-4 py-2 text-[12px] font-medium whitespace-nowrap",
                )}
              >
                {info.tags}
              </span>
            </div>
          </div>

          {/* Phải: mục lục 5 kiểu + đặt lịch */}
          <div className="relative z-20 order-3 flex flex-col justify-between gap-8 lg:col-span-3">
            <ol className="flex [scrollbar-width:none] gap-2 overflow-x-auto lg:flex-col lg:gap-1.5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
              {featureStyles.map((it, i) => {
                const on = i === active;
                return (
                  <li key={it.id} className="shrink-0">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(i)}
                      className={cn(
                        "group relative flex w-full items-center gap-4 rounded-2xl p-2 pr-4 text-left transition-[opacity,background-color,border-color] duration-500",
                        "focus-visible:outline-gold focus-visible:outline-2 focus-visible:-outline-offset-2",
                        on ? "bg-ivory/[0.06] opacity-100" : "opacity-50 hover:opacity-85",
                      )}
                    >
                      <span
                        className={cn(
                          "bg-ink relative h-14 w-11 shrink-0 overflow-hidden rounded-xl transition-all duration-300",
                        )}
                      >
                        <Image
                          src={it.image.src}
                          alt=""
                          fill
                          sizes="44px"
                          className="object-cover"
                          style={{ objectPosition: it.focus }}
                        />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "font-display block text-xs italic tabular-nums transition-colors",
                            on ? "text-gold" : "text-ivory/50",
                          )}
                        >
                          {pad(i + 1)}
                        </span>
                        <span
                          className={cn(
                            "font-display block text-base leading-tight transition-colors xl:text-lg",
                            on ? "text-ivory font-medium" : "text-ivory/80",
                          )}
                        >
                          {dict.styles.items[it.id].name}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <button type="button" onClick={book} className={cn(ctaGold, "lg:self-end")}>
              {dict.styles.cta}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
