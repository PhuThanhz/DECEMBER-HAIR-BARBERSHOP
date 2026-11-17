import type { SiteConfig } from "@december/types";

/**
 * Thông tin tiệm (không phụ thuộc ngôn ngữ). ⚠️ Giá trị TODO là placeholder — thay bằng thông tin thật.
 * Văn bản hiển thị nằm trong src/i18n/dictionaries/{cs,en}.ts
 */
export const site: SiteConfig = {
  name: "December Barber",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://decemberbarber.cz", // TODO
  phone: "+420 777 000 000", // TODO
  whatsapp: "https://wa.me/420777000000", // TODO
  /**
   * Link hệ thống đặt lịch online (phase 2). Để trống → các nút "Rezervovat" cuộn tới section #booking.
   * Khi có booking thật, điền URL vào đây là mọi nút đặt lịch đều mở trang đó.
   */
  bookingUrl: "", // TODO
  email: "hello@decemberbarber.cz", // TODO
  address: "Václavské náměstí 1, 110 00 Praha 1", // TODO
  mapEmbedUrl:
    "https://www.google.com/maps?q=V%C3%A1clavsk%C3%A9+n%C3%A1m%C4%9Bst%C3%AD+1,+110+00+Praha+1&z=16&output=embed", // TODO
  mapLink: "https://maps.google.com/?q=50.0813,14.4268", // TODO
  hours: [
    { key: "weekdays", open: "9:00", close: "21:00" },
    { key: "weekend", open: "8:30", close: "21:30" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" }, // TODO
    { label: "Facebook", href: "https://facebook.com" }, // TODO
    { label: "WhatsApp", href: "https://wa.me/420777000000" }, // TODO: cùng số với site.whatsapp
  ],
};

export const telHref = `tel:${site.phone.replace(/\s/g, "")}`;

/** Các section có trong menu — nhãn lấy từ dict.nav[id]. */
export const navIds = ["styles", "experience", "menu", "space", "contact"] as const;
export type NavId = (typeof navIds)[number];

/** Tiệm đã khai trương chưa — false: dòng trạng thái hiện "sắp khai trương"; true: hiện mở/đóng theo giờ Praha. */
export const isOpened = false; // TODO: bật khi khai trương
