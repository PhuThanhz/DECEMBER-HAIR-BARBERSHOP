"use client";

import { useSyncExternalStore } from "react";

/**
 * Store nhỏ (không cần thư viện) lưu section đang ở dưới header:
 * - id: để header gạch chân mục nav & thanh chỉ mục hiển thị số thứ tự
 * - theme: header tự đổi màu chữ sáng/tối theo nền section
 */
export interface ActiveSection {
  id: string;
  theme: "light" | "dark";
}

let state: ActiveSection = { id: "top", theme: "dark" };
const listeners = new Set<() => void>();

export function setActiveSection(next: ActiveSection) {
  if (next.id === state.id && next.theme === state.theme) return;
  state = next;
  listeners.forEach((l) => l());
}

export function useActiveSection() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
