/**
 * Domain types dùng chung giữa apps/web và apps/api (NestJS — giai đoạn sau).
 * Văn bản hiển thị (tên dịch vụ, mô tả…) được dịch ở tầng i18n, không nằm trong domain model.
 */

export type Locale = "cs" | "en";

export type ServiceCategory = "cut" | "beard" | "care";

export interface Service {
  id: string;
  category: ServiceCategory;
  /** Giá CZK. `null` = theo yêu cầu. */
  price: number | null;
  /** Thời lượng, phút. */
  durationMin: number;
  image?: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar?: string;
  specialties: ServiceCategory[];
}

export interface Testimonial {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface OpeningHours {
  key: "weekdays" | "weekend";
  open: string;
  close: string;
}

export interface SiteConfig {
  name: string;
  url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbedUrl: string;
  mapLink: string;
  hours: OpeningHours[];
  socials: { label: string; href: string }[];
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
