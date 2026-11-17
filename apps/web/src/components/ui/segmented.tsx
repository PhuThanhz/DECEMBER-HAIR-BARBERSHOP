"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { glassDark, glassLight } from "./cta";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Bộ chọn phân đoạn kiểu Apple (segmented control) bằng kính:
 * "ngón cái" kính trượt dưới mục đang chọn (motion layoutId) — thay cho tab gạch chân.
 * Tràn ngang thì cuộn gốc (mobile), không xuống dòng.
 */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
  layoutId,
  label,
  tone = "dark",
  className,
}: {
  options: readonly { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
  layoutId: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex max-w-full [scrollbar-width:none] overflow-x-auto rounded-2xl p-1 [&::-webkit-scrollbar]:hidden",
        dark ? glassDark : glassLight,
        className,
      )}
    >
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.key)}
            className={cn(
              "relative shrink-0 rounded-xl px-4 py-2.5 text-[13px] leading-none font-medium whitespace-nowrap transition-colors duration-300 md:px-5",
              "focus-visible:outline-gold focus-visible:outline-2 focus-visible:-outline-offset-2",
              dark
                ? on
                  ? "text-ivory"
                  : "text-ivory/60 hover:text-ivory"
                : on
                  ? "text-ink"
                  : "text-ink/55 hover:text-ink",
            )}
          >
            {on && (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                className={cn(
                  "absolute inset-0 rounded-xl",
                  dark
                    ? "border-ivory/20 bg-ivory/[0.14] border shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "bg-white shadow-[0_1px_3px_rgba(23,18,15,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]",
                )}
                transition={{ duration: 0.5, ease }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
