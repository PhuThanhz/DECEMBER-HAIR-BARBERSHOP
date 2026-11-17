"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Map as MapLibreMap } from "maplibre-gl";
import { cn } from "@/lib/cn";

/** Bản đồ vector miễn phí, không cần API key, cho phép dùng thương mại (OpenStreetMap). */
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

/**
 * Bản đồ thương hiệu (MapLibre GL + OpenFreeMap) — thay iframe Google Maps:
 * - Không "bắt" cuộn trang: tắt zoom bằng con lăn; trên điện thoại một ngón vẫn cuộn trang,
 *   hai ngón để phóng to. Desktop kéo để di chuyển, nút +/− để phóng to.
 * - Ghim là phần tử React (portal) nên đặt được logo D.
 * - Thư viện chỉ tải khi component mount (dynamic import) → không nặng lần tải đầu.
 */
export function BrandMap({
  center,
  zoom = 16,
  pin,
  fallback,
  label,
  className,
}: {
  /** [kinh độ, vĩ độ] */
  center: [number, number];
  zoom?: number;
  pin: ReactNode;
  /** Hiển thị khi trình duyệt không hỗ trợ WebGL. */
  fallback: ReactNode;
  /** Nhãn trợ năng cho vùng bản đồ. */
  label: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinEl, setPinEl] = useState<HTMLElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [lng, lat] = center;

  useEffect(() => {
    let map: MapLibreMap | undefined;
    let cancelled = false;
    const host = containerRef.current;
    if (!host) return;

    // Chỉ tải MapLibre (JS + worker + style + tiles) khi bản đồ sắp vào màn hình —
    // trước đây toàn bộ được tải ngay lúc mở trang dù bản đồ nằm ở cuối.
    const init = async () => {
      try {
        const { Map, Marker, NavigationControl, setWorkerUrl } = await import("maplibre-gl");
        // Worker được chép sẵn vào public/vendor (scripts/copy-maplibre-worker.mjs)
        setWorkerUrl("/vendor/maplibre-gl-worker.mjs");
        const container = containerRef.current;
        if (cancelled || !container) return;
        const coarse = window.matchMedia("(pointer: coarse)").matches;

        map = new Map({
          container,
          style: STYLE_URL,
          center: [lng, lat],
          zoom,
          minZoom: 12,
          maxZoom: 19,
          scrollZoom: false,
          dragRotate: false,
          pitchWithRotate: false,
          touchPitch: false,
          // Điện thoại: một ngón để cuộn trang, không kéo bản đồ
          dragPan: !coarse,
          attributionControl: { compact: true },
        });
        map.touchZoomRotate.disableRotation();
        map.keyboard.disableRotation();
        map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");

        const el = document.createElement("div");
        new Marker({ element: el, anchor: "bottom" }).setLngLat([lng, lat]).addTo(map);
        setPinEl(el);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        void init();
      },
      { rootMargin: "800px" },
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, [lng, lat, zoom]);

  return (
    <div className={cn("brand-map relative size-full", className)}>
      {failed ? (
        fallback
      ) : (
        <div ref={containerRef} role="region" aria-label={label} className="size-full" />
      )}
      {pinEl && createPortal(pin, pinEl)}
    </div>
  );
}
