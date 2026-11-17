"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import { SplitReveal } from "@/components/motion";
import { Section } from "@/components/layout/section";
import { ctaGlass, glassDark } from "@/components/ui/cta";
import { Segmented } from "@/components/ui/segmented";
import { spaceImages, type ImageKey, type SpaceImage } from "@/content/images";
import { useDictionary } from "@/i18n/dictionary-provider";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/scroll";

/** Khu vực của từng ảnh — dùng làm nhãn và bộ lọc (dict.space.filters). */
const zoneOf: Record<ImageKey, "floor" | "green" | "lounge"> = {
  reception: "lounge",
  floor: "floor",
  chair: "lounge",
  washCorner: "green",
  washLounge: "green",
  lounge: "lounge",
  stations: "floor",
  overview: "floor",
};

/** Danh sách đầy đủ 8 không gian kiến trúc December Barber. */
const allImages: SpaceImage[] = [
  spaceImages.reception,
  spaceImages.overview,
  spaceImages.stations,
  spaceImages.washCorner,
  spaceImages.floor,
  spaceImages.washLounge,
  spaceImages.chair,
  spaceImages.lounge,
];

/** Màu chất liệu cho 3 điểm nhấn (theo thứ tự dict.space.hotspots): da bò · travertine · ánh sáng ấm. */
const materialColors = ["#B98A6E", "#D9CBB8", "#D9C27A"];

const ease = [0.22, 1, 0.36, 1] as const;
/** Nhịp "lướt": bật nhanh rồi hãm êm. */
const flickEase = [0.16, 1, 0.3, 1] as const;
const FLICK_S = 1.05;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Chuyển ảnh kiểu "lướt" (flick) theo hướng: ảnh mới quét vào bằng clip-path từ phía trước,
 * bên trong trượt nhẹ (parallax) — ảnh cũ lùi về phía sau và tối đi. Không phóng to ảnh (giữ nét).
 * `dir` = 1 (tới) | -1 (lui).
 */
const flickFrame: Variants = {
  enter: (dir: number) => ({
    clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    zIndex: 2,
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    zIndex: 2,
    transition: { duration: FLICK_S, ease: flickEase },
  },
  exit: { zIndex: 1, transition: { duration: FLICK_S } },
};
const flickImage: Variants = {
  enter: (dir: number) => ({ x: `${dir * 9}%`, filter: "brightness(1)" }),
  center: { x: "0%", filter: "brightness(1)", transition: { duration: FLICK_S, ease: flickEase } },
  exit: (dir: number) => ({
    x: `${dir * -6}%`,
    filter: "brightness(0.55)",
    transition: { duration: FLICK_S, ease: flickEase },
  }),
};
const fadeFrame: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};
/** Ngưỡng vuốt (px) trên sân khấu ảnh và lightbox. */
const SWIPE_THRESHOLD = 50;
/** Thời gian mỗi ảnh được hiển thị khi tự chạy (giây). */
const AUTOPLAY_S = 2.5;

type FilterKey = "all" | "floor" | "green" | "lounge";
const filterOptions: FilterKey[] = ["all", "lounge", "floor", "green"];

const noopSubscribe = () => () => {};

/**
 * Không gian — "sân khấu" kiểu Apple:
 * một ảnh lớn bo góc mềm chuyển cảnh mờ-phóng chậm, chú thích & nút điều hướng trên tấm kính nổi,
 * dock ảnh nhỏ bên dưới để chọn nhanh. Vuốt / phím mũi tên / nút.
 * Tự chạy mỗi AUTOPLAY_S giây, kể cả khi rê chuột/focus (owner muốn ảnh luôn chạy); chỉ dừng khi
 * ngoài màn hình, khi mở lightbox hoặc khi người dùng bật giảm chuyển động.
 * (Từng dừng khi ảnh lớn được focus — sau khi đóng lightbox focus trả về ảnh nên bị kẹt dừng.) Đổi ảnh thủ công → đếm lại từ đầu.
 * Bấm ảnh lớn → xem toàn màn hình (lightbox).
 */
export function Gallery() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [index, setIndex] = useState(0);
  /** Hướng của lần chuyển gần nhất — quyết định ảnh lướt vào từ phải (1) hay trái (-1). */
  const [dir, setDir] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // true sau khi hydrate (document.body sẵn sàng cho portal)
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const { dict } = useDictionary();

  const stageRef = useRef<HTMLButtonElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const images =
    filter === "all" ? allImages : allImages.filter((img) => zoneOf[img.key] === filter);
  const count = images.length;
  const current = images[Math.min(index, count - 1)]!;

  /** Chọn ảnh i và đưa ảnh nhỏ tương ứng vào giữa dock (chỉ cuộn ngang, không kéo trang). */
  const goTo = (i: number) => {
    const next = (i + count) % count;
    if (next === index) return;
    setDir(i > index ? 1 : -1);
    setIndex(next);
    const dock = dockRef.current;
    const thumb = dock?.children[next] as HTMLElement | undefined;
    if (dock && thumb) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      dock.scrollTo({
        left: thumb.offsetLeft - dock.clientWidth / 2 + thumb.clientWidth / 2,
        behavior: reduce ? "auto" : "smooth",
      });
    }
  };
  const step = (dir: 1 | -1) => goTo(index + dir);

  const changeFilter = (k: FilterKey) => {
    setFilter(k);
    setDir(1);
    setIndex(0);
    dockRef.current?.scrollTo({ left: 0 });
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    touchRef.current = t ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touchRef.current;
    const t = e.changedTouches[0];
    touchRef.current = null;
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
  };

  const onStageKey = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  // Chỉ tự chạy khi section đang trong màn hình
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tự chuyển ảnh (index đổi → hẹn giờ lại, nên bấm tay cũng được trọn AUTOPLAY_S giây)
  const paused = open || !inView;
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => goTo(index + 1), AUTOPLAY_S * 1000);
    return () => window.clearTimeout(t);
    // goTo đọc index/count hiện tại — chỉ cần hẹn lại khi chúng hoặc trạng thái dừng đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count, paused]);

  // Lightbox: focus nút Đóng khi mở, trả focus về sân khấu khi đóng
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const stage = stageRef.current;
    return () => stage?.focus({ preventScroll: true });
  }, [open]);

  // Lightbox: Esc / mũi tên / bẫy Tab & khóa cuộn trang
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") {
        setDir(1);
        setIndex((i) => (i + 1) % count);
      } else if (e.key === "ArrowLeft") {
        setDir(-1);
        setIndex((i) => (i - 1 + count) % count);
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>("button"));
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialog.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, count]);

  const zoneLabel = dict.space.filters[zoneOf[current.key]];

  return (
    <Section
      ref={sectionRef}
      id="space"
      theme="dark"
      className="bg-ink text-ivory overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-10"
    >
      {/* Desktop: cả section vừa đúng một màn hình — sân khấu ảnh co giãn lấp phần còn lại */}
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:px-16">
        {/* Tiêu đề & bộ lọc kính */}
        <div className="flex shrink-0 flex-col justify-between gap-6 px-2 sm:px-0 md:flex-row md:items-end">
          <SplitReveal
            as="h2"
            className="font-display text-[clamp(2.4rem,4.2vw,4.4rem)] leading-[0.95] font-normal text-balance"
          >
            {dict.space.title}
          </SplitReveal>
          <Segmented
            label={dict.nav.space}
            layoutId="space-filter"
            value={filter}
            onChange={changeFilter}
            options={filterOptions.map((k) => ({ key: k, label: dict.space.filters[k] }))}
            className="self-start md:self-auto"
          />
        </div>

        {/* Sân khấu ảnh */}
        <div
          className="bg-espresso relative mt-8 aspect-[4/5] overflow-hidden rounded-[28px] sm:aspect-[16/10] md:mt-10 lg:mt-8 lg:aspect-auto lg:min-h-[320px] lg:flex-1"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={current.src}
              custom={dir}
              variants={reduceMotion ? fadeFrame : flickFrame}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 overflow-hidden"
            >
              <motion.div
                custom={dir}
                variants={reduceMotion ? undefined : flickImage}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={dict.images[current.key]}
                  fill
                  sizes="(min-width: 1600px) 1500px, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Toàn bộ ảnh là nút mở lightbox; phím mũi tên đổi ảnh khi đang focus */}
          <button
            ref={stageRef}
            type="button"
            onClick={() => setOpen(true)}
            onKeyDown={onStageKey}
            aria-label={`${dict.common.view}: ${dict.images[current.key]}`}
            className="focus-visible:outline-gold absolute inset-0 z-10 rounded-[28px] focus-visible:outline-2 focus-visible:-outline-offset-4"
          />

          <div
            aria-hidden
            className="from-ink/55 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t to-transparent"
          />

          {/* Chú thích trên tấm kính */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex flex-col gap-3 sm:inset-x-5 sm:bottom-5 sm:flex-row sm:items-end sm:justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.src}
                className={cn(glassDark, "max-w-md rounded-2xl px-4 py-3 sm:px-5 sm:py-4")}
                // Chú thích lướt cùng hướng với ảnh
                initial={{ opacity: 0, x: reduceMotion ? 0 : dir * 28 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease, delay: 0.25 } }}
                exit={{
                  opacity: 0,
                  x: reduceMotion ? 0 : dir * -18,
                  transition: { duration: 0.22 },
                }}
                aria-live="polite"
              >
                <p className="text-gold flex items-center gap-3 text-[11px] font-medium tracking-[0.18em] uppercase">
                  {zoneLabel}
                  <span className="text-ivory/55 tracking-normal tabular-nums">
                    {pad(index + 1)} / {pad(count)}
                  </span>
                </p>
                <p className="font-display mt-1 text-base leading-snug sm:mt-1.5 sm:text-lg md:text-2xl">
                  {dict.images[current.key]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Điều hướng — nút kính chữ thuần */}
            <div className="pointer-events-auto flex gap-2 self-end">
              {(["prev", "next"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => step(d === "next" ? 1 : -1)}
                  className={cn(ctaGlass, "px-4 py-3 text-[13px]")}
                >
                  {dict.common[d]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hàng dưới: dock ảnh nhỏ + 3 chất liệu làm nên không gian (gọn một dòng trên desktop) */}
        <div className="mt-4 flex shrink-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div
            ref={dockRef}
            className="-mx-4 flex min-w-0 snap-x [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0 md:gap-3 [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, i) => {
              const on = img.src === current.src;
              return (
                <button
                  key={img.src}
                  type="button"
                  aria-pressed={on}
                  aria-label={dict.images[img.key]}
                  onClick={() => goTo(i)}
                  className={cn(
                    "bg-espresso relative h-14 w-20 shrink-0 snap-start overflow-hidden rounded-xl transition-[opacity,box-shadow] duration-500 md:h-16 md:w-24",
                    "focus-visible:outline-gold focus-visible:outline-2 focus-visible:outline-offset-2",
                    on
                      ? "opacity-100 shadow-[0_0_0_2px_rgba(246,242,236,0.85)]"
                      : "opacity-45 hover:opacity-85",
                  )}
                >
                  <Image src={img.src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              );
            })}
          </div>

          <ul className="grid shrink-0 gap-4 px-2 sm:grid-cols-3 sm:px-0 lg:flex lg:gap-8">
            {dict.space.hotspots.map((item, idx) => (
              <li key={item.title} className="flex items-baseline gap-3">
                <span
                  className="font-display text-xl leading-none italic tabular-nums"
                  style={{ color: materialColors[idx] }}
                >
                  {pad(idx + 1)}
                </span>
                <span>
                  <span className="font-display block text-base leading-tight">{item.title}</span>
                  <span className="text-ivory/60 mt-0.5 block text-xs leading-snug">
                    {item.desc}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Xem toàn màn hình (Lightbox) — portal ra body vì .section-stage có transform khi chuyển cảnh */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dialogRef}
                className="bg-ink/90 fixed inset-0 z-[80] flex flex-col justify-between p-4 backdrop-blur-2xl md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                role="dialog"
                aria-modal="true"
                aria-label={dict.images[current.key]}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-ivory/70 text-[13px] tabular-nums">
                    {pad(index + 1)} / {pad(count)} · {zoneLabel}
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    className={cn(ctaGlass, "px-5 py-3 text-[13px]")}
                    onClick={() => setOpen(false)}
                  >
                    {dict.common.close}
                  </button>
                </div>

                <div className="relative my-4 flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.src}
                      className="relative h-full w-full"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, ease }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Image
                        src={current.src}
                        alt={dict.images[current.key]}
                        fill
                        sizes="100vw"
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <p className="font-display text-ivory/85 text-base md:text-lg">
                    {dict.images[current.key]}
                  </p>
                  <div className="flex shrink-0 gap-2">
                    {(["prev", "next"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDir(d === "next" ? 1 : -1);
                          setIndex((i) => (i + (d === "next" ? 1 : -1) + count) % count);
                        }}
                        className={cn(ctaGlass, "px-4 py-3 text-[13px]")}
                      >
                        {dict.common[d]}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </Section>
  );
}
