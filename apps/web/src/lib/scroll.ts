"use client";

/**
 * Cuộn gốc của trình duyệt (không smooth-scroll JS) — con lăn chuột phản hồi tức thì.
 * Chỉ khi bấm link điều hướng mới cuộn mượt bằng `behavior: "smooth"`.
 */
export function scrollToId(id: string) {
  if (id === "top") return window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Khoá cuộn trang khi mở menu / lightbox (bù độ rộng thanh cuộn để layout không giật). */
export function lockScroll(locked: boolean) {
  const root = document.documentElement;
  if (locked) {
    root.style.paddingRight = `${window.innerWidth - root.clientWidth}px`;
    root.style.overflow = "hidden";
  } else {
    root.style.paddingRight = "";
    root.style.overflow = "";
  }
}
