"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Map as MapLibreMap } from "maplibre-gl";
import { cn } from "@/lib/cn";

/** Bản đồ vector miễn phí, không cần API key, cho phép dùng thương mại (OpenStreetMap). */
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
/** Ảnh vệ tinh Esri World Imagery (raster, không cần key) — chỉ tải khi chọn chế độ vệ tinh. */
const SATELLITE_TILES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SATELLITE_ID = "satellite";
/** Lớp nhà nổi khối & mặt bằng nhà trong style "liberty". */
const BUILDING_LAYERS = ["building-3d", "building"];

/** Góc nhìn của từng chế độ: 3D nghiêng để thấy nhà nổi khối; vệ tinh nhìn thẳng từ trên xuống. */
const VIEW = {
  "3d": { pitch: 58, bearing: -18 },
  satellite: { pitch: 0, bearing: 0 },
} as const;

export type MapMode = keyof typeof VIEW;

/** Hiện/ẩn ảnh vệ tinh (thêm nguồn ở lần đầu, chèn dưới nhãn chữ để tên phố vẫn đọc được). */
function applyMode(map: MapLibreMap, mode: MapMode) {
  const satellite = mode === "satellite";
  if (satellite && !map.getSource(SATELLITE_ID)) {
    map.addSource(SATELLITE_ID, {
      type: "raster",
      tiles: [SATELLITE_TILES],
      tileSize: 256,
      maxzoom: 19,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    });
    const firstLabel = map.getStyle().layers.find((l) => l.type === "symbol")?.id;
    map.addLayer({ id: SATELLITE_ID, type: "raster", source: SATELLITE_ID }, firstLabel);
  }
  if (map.getLayer(SATELLITE_ID)) {
    map.setLayoutProperty(SATELLITE_ID, "visibility", satellite ? "visible" : "none");
  }
  for (const id of BUILDING_LAYERS) {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", satellite ? "none" : "visible");
  }
}

/**
 * Bản đồ thương hiệu (MapLibre GL + OpenFreeMap) — thay iframe Google Maps:
 * - Hai chế độ (`mode`): "3d" nghiêng với nhà nổi khối, "satellite" ảnh vệ tinh nhìn thẳng.
 * - Không "bắt" cuộn trang: con lăn chỉ zoom sau khi bấm vào bản đồ (rê ra ngoài là tắt); điện thoại một ngón vẫn cuộn trang,
 *   hai ngón để phóng to. Desktop kéo để di chuyển, nút +/− để phóng to.
 * - Ghim là phần tử React (portal) nên đặt được logo D.
 * - Thư viện chỉ tải khi bản đồ sắp vào màn hình (dynamic import).
 */
export function BrandMap({
  center,
  zoom = 16,
  mode = "3d",
  pin,
  fallback,
  label,
  className,
}: {
  /** [kinh độ, vĩ độ] */
  center: [number, number];
  zoom?: number;
  mode?: MapMode;
  pin: ReactNode;
  /** Hiển thị khi trình duyệt không hỗ trợ WebGL. */
  fallback: ReactNode;
  /** Nhãn trợ năng cho vùng bản đồ. */
  label: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [pinEl, setPinEl] = useState<HTMLElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [lng, lat] = center;
  // Chế độ lúc tạo bản đồ (các lần đổi sau do effect bên dưới xử lý)
  const initialMode = useRef(mode);

  useEffect(() => {
    let instance: MapLibreMap | undefined;
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

        instance = new Map({
          container,
          style: STYLE_URL,
          center: [lng, lat],
          zoom,
          ...VIEW[initialMode.current],
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
        instance.touchZoomRotate.disableRotation();
        instance.keyboard.disableRotation();
        instance.addControl(new NavigationControl({ showCompass: false }), "bottom-right");

        // Con lăn chuột: bấm vào bản đồ một lần → cuộn để zoom; rê chuột ra ngoài → cuộn trang như cũ.
        // (Không bật sẵn để cuộn trang lướt qua bản đồ lớn không bị "bắt" lại.)
        const zoomTarget = instance;
        instance.on("mousedown", () => zoomTarget.scrollZoom.enable());
        container.addEventListener("mouseleave", () => zoomTarget.scrollZoom.disable());

        const el = document.createElement("div");
        new Marker({ element: el, anchor: "bottom" }).setLngLat([lng, lat]).addTo(instance);
        setPinEl(el);

        const ready = instance;
        ready.once("load", () => {
          if (!cancelled) setMap(ready);
        });
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
      instance?.remove();
      setMap(null);
    };
  }, [lng, lat, zoom]);

  // Đổi chế độ: lớp vệ tinh / nhà nổi khối + chuyển góc nhìn mượt (tức thì nếu giảm chuyển động)
  useEffect(() => {
    if (!map) return;
    applyMode(map, mode);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) map.jumpTo(VIEW[mode]);
    else map.easeTo({ ...VIEW[mode], duration: 1200 });
  }, [map, mode]);

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
