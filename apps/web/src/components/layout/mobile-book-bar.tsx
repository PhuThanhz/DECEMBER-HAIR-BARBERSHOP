"use client";

import { site } from "@/content/site";
import { useDictionary } from "@/i18n/dictionary-provider";
import { useActiveSection } from "@/lib/active-section";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/**
 * Thanh đặt lịch cố định ở đáy màn hình — chỉ trên điện thoại (header ẩn nút Rezervovat ở < sm).
 * Ẩn ở hero và khi đang ở section Booking/Contact (đã có nút đặt lịch ngay đó).
 * Phase 2: điền site.bookingUrl → nút mở thẳng hệ thống booking.
 */
export function MobileBookBar() {
  const { dict } = useDictionary();
  const { id } = useActiveSection();
  const hidden = id === "top" || id === "booking" || id === "contact";
  const external = Boolean(site.bookingUrl);

  return (
    <div
      className={cn(
        "bg-ink/70 fixed inset-x-0 bottom-0 z-[60] backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-500 ease-[var(--ease-luxe)] sm:hidden",
        "pb-[env(safe-area-inset-bottom)]",
        hidden ? "translate-y-full" : "translate-y-0",
      )}
      aria-hidden={hidden}
    >
      <a
        href={external ? site.bookingUrl : "#booking"}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        tabIndex={hidden ? -1 : undefined}
        onClick={(e) => {
          if (external) return;
          e.preventDefault();
          scrollToId("booking");
        }}
        className="text-ivory active:text-gold flex w-full items-center justify-between px-5 py-3"
      >
        <span className="text-ivory/55 text-[10px] tracking-[0.24em] uppercase">
          {dict.common.est}
        </span>
        <span className="bg-ivory text-ink rounded-xl px-5 py-3 text-[14px] leading-none font-medium">
          {dict.common.book}
        </span>
      </a>
    </div>
  );
}
