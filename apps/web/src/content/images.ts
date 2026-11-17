/** Ảnh render nội thất — public/images/space. Alt text: dict.images[key]. */
export const spaceImages = {
  reception: { key: "reception", src: "/images/space/space-01-reception.jpg", w: 1600, h: 1066 },
  floor: { key: "floor", src: "/images/space/space-02-floor.jpg", w: 1600, h: 1066 },
  chair: { key: "chair", src: "/images/space/space-03-chair.jpg", w: 1600, h: 1066 },
  washCorner: {
    key: "washCorner",
    src: "/images/space/space-04-wash-corner.jpg",
    w: 1600,
    h: 1066,
  },
  washLounge: {
    key: "washLounge",
    src: "/images/space/space-05-wash-lounge.jpg",
    w: 1600,
    h: 1066,
  },
  lounge: { key: "lounge", src: "/images/space/space-06-lounge.jpg", w: 1600, h: 900 },
  stations: { key: "stations", src: "/images/space/space-07-stations.jpg", w: 1600, h: 900 },
  overview: { key: "overview", src: "/images/space/space-08-overview.jpg", w: 1600, h: 900 },
} as const;

export type SpaceImage = (typeof spaceImages)[keyof typeof spaceImages];
export type ImageKey = SpaceImage["key"];

/** Video nền (đã làm sạch, nén, bỏ âm thanh). Nguồn gốc trong sources/. */
/**
 * Film section "Pro ty, kdo si všímají detailů" — 2 bản Veo 3 riêng cho máy tính (16:9) và điện thoại (9:16).
 * Prompt Veo 3 & thông số xuất file: apps/web/docs/film-veo-prompts.md.
 * ready = false → hiển thị ảnh tĩnh thay thế.
 */
export const filmVideo = {
  ready: true,
  /** Phim kể chuyện (phố mưa → tiệm sáng) phát 1 lần rồi dừng ở khung cuối; đổi true nếu video lặp liền mạch. */
  loop: false,
  // Nguồn: sources/17112026.mp4 (Veo, 16:9, 10s) — đã nén, bỏ tiếng. Chưa có bản 9:16 riêng nên điện thoại dùng chung (cắt giữa cửa).
  desktop: "/videos/film.mp4",
  mobile: "/videos/film.mp4",
  posterDesktop: "/videos/film-poster.jpg",
  posterMobile: "/videos/film-poster.jpg",
} as const;

export const heroVideo = {
  // Veo: dao cạo, khăn nóng, kéo vàng — 1 cảnh liền, đã nén & nối vòng lặp liền mạch (9s, không tiếng)
  src: "/videos/hero-veo.mp4",
  poster: "/videos/hero-veo-poster.jpg",
} as const;
