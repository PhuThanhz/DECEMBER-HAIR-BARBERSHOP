"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Eyebrow } from "@december/ui";
import { Section } from "@/components/layout/section";
import { LogoD } from "@/components/brand/logo-d";
import { Reveal, SplitReveal } from "@/components/motion";
import { formatPrice, serviceCategories, services, type ServiceId } from "@/content/services";
import { useDictionary } from "@/i18n/dictionary-provider";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";

type Filter = "all" | (typeof serviceCategories)[number];
const filters: Filter[] = ["all", ...serviceCategories];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Menu dịch vụ kiểu "bảng giá barbershop":
 * - Tab danh mục với viên vàng trượt theo (Motion layoutId), danh sách lọc có animation.
 * - Mỗi dòng: tên serif · đường chấm nối · giá; hover → khung ảnh vòm bên phải đổi ảnh (desktop, sticky).
 * - Mobile: ảnh nhỏ hình vòm ngay trong từng dòng.
 */
export function Menu() {
  const { dict, locale } = useDictionary();
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<ServiceId>(services[0].id);

  const list = useMemo(
    () => services.filter((s) => filter === "all" || s.category === filter),
    [filter],
  );
  const current = services.find((s) => s.id === active) ?? services[0];

  return (
    <Section id="menu" theme="dark" className="bg-espresso text-ivory overflow-clip py-32 md:py-44">
      <LogoD
        tone="gold"
        strandsOnly
        strandWidth={1.2}
        aria-hidden
        className="pointer-events-none absolute top-0 -left-[10vw] h-[90%] w-auto opacity-[0.08]"
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Eyebrow className="text-gold">{dict.menu.eyebrow}</Eyebrow>
            <SplitReveal
              as="h2"
              className="font-display mt-8 text-[clamp(3rem,6vw,6rem)] leading-[0.95] font-normal"
            >
              {dict.menu.title}
            </SplitReveal>
          </div>
          <Reveal className="text-ivory/60 max-w-sm leading-relaxed">{dict.menu.lead}</Reveal>
        </div>

        {/* Tabs */}
        <LayoutGroup>
          <div
            role="tablist"
            aria-label={dict.menu.title}
            className="mt-14 flex flex-wrap gap-2 md:mt-20"
          >
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                type="button"
                aria-selected={filter === f}
                onClick={() => {
                  setFilter(f);
                  const first = services.find((s) => f === "all" || s.category === f);
                  if (first) setActive(first.id);
                }}
                className={cn(
                  "relative rounded-full border px-5 py-2.5 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors duration-500",
                  filter === f
                    ? "border-gold text-ink"
                    : "border-ivory/20 text-ivory/70 hover:border-ivory/50 hover:text-ivory",
                )}
              >
                {filter === f && (
                  <motion.span
                    layoutId="menu-pill"
                    className="bg-gold absolute inset-0 rounded-full"
                    transition={{ duration: 0.6, ease }}
                  />
                )}
                <span className="relative">{dict.menu.categories[f]}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div className="mt-12 grid gap-16 lg:grid-cols-[1.25fr_1fr]">
          {/* Danh sách */}
          <ul className="border-ivory/15 border-t">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((s, i) => {
                const copy = dict.menu.items[s.id];
                const isActive = s.id === active;
                return (
                  <motion.li
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease, delay: i * 0.04 },
                    }}
                    exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
                    className="border-ivory/15 border-b"
                  >
                    <button
                      type="button"
                      onPointerEnter={() => setActive(s.id)}
                      onFocus={() => setActive(s.id)}
                      onClick={() => scrollToId("contact")}
                      className="group relative grid w-full grid-cols-[3.5rem_1fr] gap-x-4 py-6 text-left md:grid-cols-[3rem_1fr] md:py-7"
                    >
                      {/* vệt sáng khi hover */}
                      <span
                        aria-hidden
                        className={cn(
                          "bg-ivory/[0.04] absolute inset-y-0 -right-4 -left-4 origin-left transition-transform duration-700 ease-[var(--ease-luxe)]",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                      {/* Mobile: ảnh vòm nhỏ */}
                      <span className="arch relative row-span-2 block h-[4.5rem] w-14 overflow-hidden md:hidden">
                        <Image src={s.image} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="text-gold relative row-span-2 hidden pt-2 font-sans text-[11px] tracking-[0.2em] md:block">
                        {String(services.indexOf(s) + 1).padStart(2, "0")}
                      </span>

                      <span className="relative flex items-baseline gap-3">
                        <span
                          className={cn(
                            "font-display text-2xl font-normal transition-all duration-700 ease-[var(--ease-luxe)] md:text-4xl",
                            isActive && "text-gold md:translate-x-2 md:italic",
                          )}
                        >
                          {copy.name}
                        </span>
                        {"signature" in s && s.signature && (
                          <span className="border-gold/50 text-gold hidden shrink-0 rounded-full border px-2 py-0.5 text-[9px] tracking-[0.2em] uppercase sm:inline">
                            {dict.menu.signature}
                          </span>
                        )}
                        <span
                          aria-hidden
                          className="border-ivory/25 mb-2 flex-1 border-b border-dotted"
                        />
                        <span className="font-display shrink-0 text-xl md:text-3xl">
                          {formatPrice(s.price, locale, dict.menu.onRequest)}
                        </span>
                      </span>
                      <span className="text-ivory/55 relative mt-2 flex justify-between gap-6 text-sm">
                        <span>{copy.description}</span>
                        <span className="text-ivory/40 shrink-0 text-[11px] tracking-[0.2em] uppercase">
                          {s.durationMin} {dict.menu.minutes}
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          {/* Khung ảnh sticky (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="arch bg-cocoa relative aspect-[4/5] max-h-[72vh] w-full overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.3 } }}
                    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <Image
                      src={current.image}
                      alt={dict.menu.items[current.id].name}
                      fill
                      sizes="40vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="from-ink/80 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    className="absolute inset-x-0 bottom-0 p-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.25, ease } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                  >
                    <p className="text-gold text-[11px] tracking-[0.3em] uppercase">
                      {dict.menu.categories[current.category]} · {current.durationMin}{" "}
                      {dict.menu.minutes}
                    </p>
                    <p className="font-display mt-2 text-4xl font-normal">
                      {dict.menu.items[current.id].name}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
