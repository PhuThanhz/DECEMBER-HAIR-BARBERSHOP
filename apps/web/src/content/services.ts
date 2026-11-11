import type { Service, ServiceCategory } from "@december/types";
import type { Locale } from "@/i18n/config";
import { localeMeta } from "@/i18n/config";
import { hairImages } from "./hair";
import { spaceImages } from "./images";

export const serviceCategories = [
  "cut",
  "beard",
  "care",
] as const satisfies readonly ServiceCategory[];

/** TODO: cập nhật bảng giá thật (CZK). Tên & mô tả: dict.menu.items[id]. */
export const services = [
  {
    id: "signature-cut",
    category: "cut",
    price: 690,
    durationMin: 45,
    image: hairImages.scissorCut.src,
    signature: true,
  },
  { id: "skin-fade", category: "cut", price: 650, durationMin: 45, image: hairImages.clipper.src },
  { id: "buzz-cut", category: "cut", price: 390, durationMin: 20, image: hairImages.razorLine.src },
  { id: "junior-cut", category: "cut", price: 450, durationMin: 30, image: hairImages.shears.src },
  {
    id: "beard-sculpt",
    category: "beard",
    price: 450,
    durationMin: 30,
    image: hairImages.beardScissors.src,
  },
  {
    id: "hot-towel-shave",
    category: "beard",
    price: 490,
    durationMin: 30,
    image: hairImages.hotShave.src,
  },
  {
    id: "cut-and-beard",
    category: "beard",
    price: 990,
    durationMin: 75,
    image: hairImages.beardTrim.src,
    signature: true,
  },
  {
    id: "head-spa",
    category: "care",
    price: 590,
    durationMin: 40,
    image: spaceImages.washCorner.src,
  },
  {
    id: "colour",
    category: "care",
    price: null,
    durationMin: 90,
    image: spaceImages.washLounge.src,
  },
  {
    id: "december-ritual",
    category: "care",
    price: 1490,
    durationMin: 90,
    image: hairImages.chair.src,
    signature: true,
  },
] as const satisfies readonly (Service & { signature?: boolean })[];

export type ServiceId = (typeof services)[number]["id"];

export const formatPrice = (price: number | null, locale: Locale, onRequest: string) =>
  price === null
    ? onRequest
    : new Intl.NumberFormat(localeMeta[locale].intl, {
        style: "currency",
        currency: "CZK",
        maximumFractionDigits: 0,
      }).format(price);
