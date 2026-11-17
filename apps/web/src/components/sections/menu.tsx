"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Section } from "@/components/layout/section";
import { Reveal, SplitReveal } from "@/components/motion";
import { ctaDark, glassDark, glassLight } from "@/components/ui/cta";
import { spaceImages } from "@/content/images";
import { formatPrice, serviceCategories, services, type ServiceId } from "@/content/services";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useBookingSelection } from "@/lib/booking-selection";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";

type Filter = "all" | (typeof serviceCategories)[number];
const filters: Filter[] = ["all", ...serviceCategories];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Menu dịch vụ kiểu "bảng giá barbershop":
 * - Tab danh mục sáng sủa, thanh lịch.
 * - Danh sách dịch vụ 1 cột (tên đầy đủ, không cắt chữ): tên · giá, thời gian, mô tả; dòng chọn nổi lên như tấm kính.
 * - Cột xem trước bên phải: Khung ảnh rõ nét, thấy trọn vẹn bố cục (full view),
 *   ánh sáng tự nhiên, không bị che tối, kèm thông tin chi tiết và nút đặt lịch trực tiếp.
 */
export function Menu() {
  const { dict, locale } = useDictionary();
  const { selection, selectBooking } = useBookingSelection();
  const [filter, setFilter] = useState<Filter>("all");
  // `pinned` = dòng đã bấm chọn; `hovered` = dòng đang rê chuột (chỉ chuột, desktop) — xem trước tạm thời.
  const [pinned, setPinned] = useState<ServiceId>(services[0].id);
  const [hovered, setHovered] = useState<ServiceId | null>(null);
  const active = hovered ?? pinned;
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const list = useMemo(
    () => services.filter((s) => filter === "all" || s.category === filter),
    [filter],
  );
  const current = services.find((s) => s.id === active) ?? services[0];

  const handleBook = (item: typeof current) => {
    const copy = dict.menu.items[item.id];
    const priceText = formatPrice(item.price, locale, dict.menu.onRequest);
    selectBooking({
      kind: "service",
      id: item.id,
      title: copy.name,
      meta: `${item.durationMin} ${dict.menu.minutes} · ${priceText}`,
    });
    scrollToId("booking");
  };

  const selectFilter = (f: Filter) => {
    setFilter(f);
    setHovered(null);
    const first = services.find((s) => f === "all" || s.category === f);
    if (first) setPinned(first.id);
  };

  // Điều hướng tab bằng phím mũi tên trái/phải, Home/End (mẫu WAI-ARIA tabs, tự kích hoạt)
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % filters.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + filters.length) % filters.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = filters.length - 1;
    if (next < 0) return;
    e.preventDefault();
    selectFilter(filters[next] ?? "all");
    tabRefs.current[next]?.focus();
  };

  return (
    <Section
      id="menu"
      theme="light"
      fit={false}
      className="bg-bone text-ink overflow-clip py-24 lg:pt-28 lg:pb-28"
      background={
        <>
          {/* Ảnh toàn cảnh tiệm, rửa sáng & mờ — gợi không gian mà không tranh chỗ bảng giá */}
          <Image
            src={spaceImages.overview.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.32] blur-[1.5px] saturate-[0.85]"
          />
          <div className="from-bone via-bone/45 to-bone/90 absolute inset-0 bg-gradient-to-b" />
        </>
      }
    >
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col px-6 md:px-10 lg:min-h-0 lg:flex-1 lg:px-16">
        <div className="flex shrink-0 flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SplitReveal
              as="h2"
              className="font-display text-ink text-[clamp(2.6rem,5.2vw,5.4rem)] leading-[0.95] font-normal"
            >
              {dict.menu.title}
            </SplitReveal>
          </div>
          <Reveal className="md:text-right">
            <p className="text-ink/75 max-w-sm text-sm leading-relaxed">{dict.menu.lead}</p>
          </Reveal>
        </div>

        {/* Tabs danh mục */}
        <LayoutGroup>
          <div
            role="tablist"
            aria-label={dict.menu.title}
            className={cn(
              glassLight,
              "mt-8 flex w-fit max-w-full shrink-0 [scrollbar-width:none] overflow-x-auto rounded-2xl p-1 md:mt-10 [&::-webkit-scrollbar]:hidden",
            )}
          >
            {filters.map((f, i) => (
              <button
                key={f}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`menu-tab-${f}`}
                role="tab"
                type="button"
                aria-selected={filter === f}
                aria-controls="menu-panel"
                tabIndex={filter === f ? 0 : -1}
                onClick={() => selectFilter(f)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={cn(
                  "focus-visible:outline-leather relative shrink-0 rounded-xl px-4 py-2.5 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 md:px-5",
                  filter === f ? "text-ink" : "text-ink/55 hover:text-ink",
                )}
              >
                {filter === f && (
                  <motion.span
                    layoutId="menu-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-white shadow-[0_1px_3px_rgba(23,18,15,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]"
                    transition={{ duration: 0.5, ease }}
                  />
                )}
                <span className="relative">{dict.menu.categories[f]}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12 xl:grid-cols-[1.42fr_1fr] xl:gap-14">
          {/* Danh sách dịch vụ */}
          <div
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`menu-tab-${filter}`}
            className="flex flex-col"
          >
            <ul onPointerLeave={() => setHovered(null)} className="flex flex-col gap-1.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((s, index) => {
                  const copy = dict.menu.items[s.id];
                  const isActive = s.id === active;
                  const isChosen = selection?.kind === "service" && selection.id === s.id;
                  const priceText = formatPrice(s.price, locale, dict.menu.onRequest);
                  return (
                    <motion.li
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.35, ease }}
                    >
                      {/* Bấm dòng = chọn (không đặt lịch). Desktop: xem trước ở card phải; mobile: mở rộng tại chỗ. */}
                      <button
                        type="button"
                        aria-expanded={isActive}
                        onPointerEnter={(e) => {
                          if (e.pointerType === "mouse") setHovered(s.id);
                        }}
                        onClick={() => {
                          setPinned(s.id);
                          setHovered(null);
                        }}
                        className={cn(
                          "group relative grid w-full grid-cols-[2.25rem_1fr] items-start gap-x-3 rounded-2xl border px-4 py-5 text-left transition-[background-color,border-color,box-shadow] duration-300 md:px-5",
                          "focus-visible:outline-leather focus-visible:outline-2 focus-visible:-outline-offset-2",
                          isActive
                            ? "border-white/70 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_24px_rgba(43,33,28,0.08)] backdrop-blur-xl"
                            : "border-transparent hover:bg-white/30",
                        )}
                      >
                        {/* Số thứ tự */}
                        <span
                          className={cn(
                            "pt-1.5 font-sans text-xs font-semibold tracking-[0.2em] transition-colors",
                            isActive ? "text-leather" : "text-ink/40 group-hover:text-leather",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          {/* Tên · giá */}
                          <div className="flex items-baseline justify-between gap-4">
                            <span
                              className={cn(
                                "font-display min-w-0 text-xl font-normal transition-colors md:text-2xl",
                                isActive
                                  ? "text-leather font-medium"
                                  : "text-ink group-hover:text-leather",
                              )}
                            >
                              {copy.name}
                            </span>
                            <span
                              className={cn(
                                "font-display shrink-0 text-lg whitespace-nowrap tabular-nums",
                                isActive ? "text-leather font-semibold" : "text-ink/90",
                              )}
                            >
                              {priceText}
                            </span>
                          </div>

                          {/* Thời gian · Signature · đã chọn */}
                          <p className="text-leather mt-1.5 flex flex-wrap items-center gap-x-3 font-sans text-[10px] font-semibold tracking-[0.2em] uppercase">
                            <span>
                              {s.durationMin} {dict.menu.minutes}
                            </span>
                            {"signature" in s && s.signature && (
                              <span className="text-ink/60">{dict.menu.signature}</span>
                            )}
                            {isChosen && <span className="text-ink">{dict.common.selected}</span>}
                          </p>
                          {/* Mô tả — hiện ở mọi kích thước để danh sách đầy đặn, cân với cột ảnh */}
                          <p
                            className={cn(
                              "text-ink/65 mt-2 line-clamp-2 text-[13px] leading-relaxed",
                              isActive && "max-lg:line-clamp-none",
                            )}
                          >
                            {copy.description}
                          </p>
                        </div>
                      </button>

                      {/* Mobile: nút đặt lịch hiện dưới dòng đang chọn (anh em với nút dòng, không lồng nhau) */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="expand"
                            id={`menu-item-${s.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.35, ease }}
                            className="overflow-hidden lg:hidden"
                          >
                            <div className="pt-2 pr-4 pb-4 pl-[calc(1rem+2.25rem+0.75rem)]">
                              <button
                                type="button"
                                onClick={() => handleBook(s)}
                                className={ctaDark}
                              >
                                {dict.common.book}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>

          {/* Cột hình ảnh xem trước — Khung hình chuẩn tỷ lệ 4:3, thấy trọn vẹn, sáng rõ, không bị che tối */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              {/* Tải sẵn ảnh mọi dịch vụ */}
              <div
                aria-hidden
                className="pointer-events-none absolute size-px overflow-hidden opacity-0"
              >
                {services.map((s) => (
                  <Image
                    key={s.id}
                    src={s.image}
                    alt=""
                    width={1}
                    height={1}
                    sizes="40vw"
                    loading="eager"
                  />
                ))}
              </div>

              {/* Card xem trước cao cấp với ảnh trọn vẹn */}
              <div
                className={cn(
                  glassLight,
                  "relative flex flex-col overflow-hidden rounded-[28px] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_48px_rgba(43,33,28,0.12)]",
                )}
              >
                {/* Khung ảnh chính — Tỷ lệ 4:3 chuẩn, không bị cắt xén, không phủ gradient đen */}
                <div className="bg-bone relative aspect-[4/3] w-full overflow-hidden rounded-[22px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      className="absolute inset-0 size-full"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <Image
                        src={current.image}
                        alt={dict.menu.items[current.id].name}
                        fill
                        loading="eager"
                        sizes="(min-width: 1280px) 500px, 400px"
                        className="object-cover object-center"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Huy hiệu danh mục & thời gian góc trên */}
                  <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between">
                    <span
                      className={cn(
                        glassDark,
                        "text-ivory rounded-lg px-3 py-1.5 text-[11px] font-medium",
                      )}
                    >
                      {dict.menu.categories[current.category]}
                    </span>
                    <span
                      className={cn(
                        glassDark,
                        "text-ivory rounded-lg px-3 py-1.5 text-[11px] font-medium tabular-nums",
                      )}
                    >
                      {current.durationMin} {dict.menu.minutes}
                    </span>
                  </div>
                </div>

                {/* Phần thông tin dịch vụ bên dưới ảnh */}
                <div className="flex flex-col justify-between p-5 md:p-6">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-ink text-2xl leading-tight font-normal">
                        {dict.menu.items[current.id].name}
                      </h3>
                      <span className="font-display text-leather shrink-0 text-2xl font-semibold tabular-nums">
                        {formatPrice(current.price, locale, dict.menu.onRequest)}
                      </span>
                    </div>

                    <p className="text-ink/75 mt-3 text-sm leading-relaxed">
                      {dict.menu.items[current.id].description}
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => handleBook(current)}
                      className={cn(ctaDark, "w-full py-4")}
                    >
                      {dict.common.book}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
