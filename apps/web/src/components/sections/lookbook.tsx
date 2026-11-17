"use client";

import Image from "next/image";
import { SplitReveal } from "@/components/motion";
import { Section } from "@/components/layout/section";
import { lookbookRows } from "@/content/hair";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useBookingSelection } from "@/lib/booking-selection";
import { scrollToId } from "@/lib/scroll";

type Look = (typeof lookbookRows)[number][number];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Lookbook — 14 kiểu tóc trên 2 hàng chạy ngang ngược chiều nhau (CSS thuần, chạy trên compositor).
 * Dừng khi rê chuột hoặc focus bàn phím vào hàng. Giảm chuyển động → hàng đứng yên, cuộn ngang gốc.
 * Bấm một kiểu → chọn kiểu đó cho form đặt lịch và cuộn tới đặt lịch.
 */
export function Lookbook() {
  const { dict } = useDictionary();
  const { selectBooking } = useBookingSelection();

  const pick = (id: Look["id"]) => {
    const look = dict.styles.items[id];
    selectBooking({ kind: "style", id, title: look.name, meta: look.tags });
    scrollToId("booking");
  };

  let n = 0;
  const rows = lookbookRows.map((row) => row.map((item) => ({ ...item, num: ++n })));

  const card = (item: Look & { num: number }, hidden = false) => {
    const look = dict.styles.items[item.id];
    return (
      <li
        key={item.id}
        className="w-[44vw] shrink-0 sm:w-[30vw] md:w-[22vw] lg:w-[15vw] lg:min-w-[210px]"
      >
        <button
          type="button"
          tabIndex={hidden ? -1 : undefined}
          onClick={() => pick(item.id)}
          aria-label={`${dict.styles.cta}: ${look.name}`}
          className="group/card bg-ink border-ivory/15 hover:border-gold/60 focus-visible:outline-gold relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2"
        >
          <Image
            src={item.image.src}
            alt={hidden ? "" : look.name}
            fill
            draggable={false}
            sizes="(min-width: 1024px) 15vw, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 44vw"
            className="object-cover object-[50%_30%] transition-transform duration-1000 ease-[var(--ease-luxe)] select-none group-hover/card:scale-[1.05]"
          />
          <span
            aria-hidden
            className="from-ink/85 pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent"
          />
          <span className="font-display text-ivory/80 absolute top-2.5 left-3 text-xs italic tabular-nums">
            {pad(item.num)}
          </span>
          <span className="absolute inset-x-3 bottom-3 block">
            <span className="font-display text-ivory group-hover/card:text-gold block text-sm leading-snug transition-colors duration-300 sm:text-base">
              {look.name}
            </span>
            <span className="text-ivory/65 mt-0.5 block truncate text-[10px] tracking-[0.14em] uppercase">
              {look.tags}
            </span>
          </span>
        </button>
      </li>
    );
  };

  return (
    <Section
      id="lookbook"
      theme="dark"
      fit={false}
      label={dict.lookbook.title}
      className="bg-ink text-ivory overflow-hidden py-24 lg:py-28"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-end justify-between gap-6 px-6 md:px-10 lg:px-16">
        <SplitReveal
          as="h2"
          className="font-display max-w-3xl text-[clamp(2.4rem,4.8vw,5rem)] leading-[0.95] font-normal text-balance"
        >
          {dict.lookbook.title}
        </SplitReveal>
        <p className="text-ivory/70 max-w-md text-sm leading-relaxed md:text-base">
          {dict.lookbook.lead}
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 md:mt-16 md:gap-5">
        {rows.map((row, r) => (
          <div
            key={r}
            className="group/row flex overflow-hidden motion-reduce:snap-x motion-reduce:[scrollbar-width:none] motion-reduce:overflow-x-auto motion-reduce:px-6 md:motion-reduce:px-10 lg:motion-reduce:px-16 motion-reduce:[&::-webkit-scrollbar]:hidden"
          >
            <div
              // Chỉ đặt animation-name khi cho phép chuyển động; play-state để hover/focus tạm dừng
              className="flex shrink-0 group-focus-within/row:[animation-play-state:paused] group-hover/row:[animation-play-state:paused] motion-safe:[animation-name:marquee]"
              style={{
                animationDuration: `${row.length * 9}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDirection: r % 2 === 1 ? "reverse" : "normal",
              }}
            >
              {/* gap bằng padding-right → hai bản sao nối liền, lặp không giật */}
              <ul className="flex shrink-0 gap-4 pr-4 md:gap-5 md:pr-5">
                {row.map((item) => card(item))}
              </ul>
              <ul
                aria-hidden
                inert
                className="flex shrink-0 gap-4 pr-4 motion-reduce:hidden md:gap-5 md:pr-5"
              >
                {row.map((item) => card(item, true))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
