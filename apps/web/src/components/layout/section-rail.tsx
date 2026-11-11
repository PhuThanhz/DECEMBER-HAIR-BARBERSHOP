"use client";

import { useEffect, useState } from "react";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useActiveSection } from "@/lib/active-section";
import { cn } from "@/lib/cn";

/** Thanh chỉ mục dọc bên phải (desktop): số thứ tự section hiện tại + nhãn + vạch tiến độ. */
export function SectionRail() {
  const { id, theme } = useActiveSection();
  const { dict } = useDictionary();
  const [items, setItems] = useState<{ id: string; label?: string }[]>([]);

  useEffect(() => {
    // Danh sách section chỉ đọc được từ DOM sau khi mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(
      Array.from(document.querySelectorAll<HTMLElement>("main section[data-rail]")).map((s) => ({
        id: s.id,
        label: s.dataset.label,
      })),
    );
  }, []);

  const index = items.findIndex((it) => it.id === id);
  const visible = index >= 0;
  const label = items[index]?.label ?? (dict.nav as Record<string, string>)[id] ?? "";

  return (
    <aside
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-1/2 right-8 z-40 hidden -translate-y-1/2 flex-col items-center gap-5 transition-[opacity,color] duration-700 xl:flex",
        visible ? "opacity-100" : "opacity-0",
        theme === "dark" ? "text-ivory" : "text-ink",
      )}
    >
      <span
        key={id}
        className="font-display text-sm tabular-nums"
        style={{ animation: "rail-in 0.8s var(--ease-luxe)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="flex flex-col gap-2">
        {items.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              "block w-px transition-all duration-700 ease-[var(--ease-luxe)]",
              i === index ? "bg-gold h-8" : "h-3 bg-current opacity-25",
            )}
          />
        ))}
      </span>
      <span
        key={`${id}-label`}
        className="text-[10px] tracking-[0.3em] uppercase [writing-mode:vertical-rl]"
        style={{ animation: "rail-in 0.8s var(--ease-luxe)" }}
      >
        {label}
      </span>
    </aside>
  );
}
