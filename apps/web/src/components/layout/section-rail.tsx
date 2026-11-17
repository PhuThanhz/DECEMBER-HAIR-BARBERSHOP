"use client";

import { useEffect, useState } from "react";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useActiveSection } from "@/lib/active-section";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/** Thanh chỉ mục dọc bên phải (desktop): bấm trực tiếp để nhảy giữa các chương. */
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
      aria-label="Section index"
      className={cn(
        "fixed top-1/2 right-7 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 transition-[opacity,color] duration-700 xl:flex",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
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
      <nav className="flex flex-col items-center gap-1.5" aria-label={dict.footer.explore}>
        {items.map((s, i) => {
          const itemLabel = s.label ?? (dict.nav as Record<string, string>)[s.id] ?? s.id;
          const active = i === index;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              aria-label={itemLabel}
              title={itemLabel}
              className="group relative flex items-center justify-center px-2 py-1"
            >
              <span
                className={cn(
                  "pointer-events-none absolute right-full mr-2 translate-x-2 text-[9px] tracking-[0.26em] whitespace-nowrap uppercase opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-80",
                )}
              >
                {itemLabel}
              </span>
              <span
                className={cn(
                  "block w-px transition-all duration-700 ease-[var(--ease-luxe)]",
                  active
                    ? "bg-gold h-8 shadow-[0_0_8px_rgba(217,194,122,0.7)]"
                    : "h-3 bg-current opacity-30 group-hover:h-5 group-hover:opacity-80",
                )}
              />
            </button>
          );
        })}
      </nav>
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
