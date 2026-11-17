"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * true (một lần, không quay lại false) khi phần tử đã vào gần viewport (trong `rootMargin`).
 * Dùng để hoãn việc tải tài nguyên nặng (ảnh tải sẵn, thư viện bản đồ…) cho tới khi người dùng cuộn gần tới.
 */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = "800px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}
