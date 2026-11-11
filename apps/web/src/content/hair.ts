/** Ảnh tạm từ Unsplash — xem public/images/hair/CREDITS.md. Thay bằng ảnh thật của tiệm. */
const hair = (name: string, w: number, h: number) => ({ src: `/images/hair/${name}.jpg`, w, h });

export const hairImages = {
  // Chân dung kiểu tóc (lookbook)
  texturedQuiff: hair("style-textured-quiff", 1400, 2137),
  pompadourFade: hair("style-pompadour-fade", 1400, 1974),
  buzzCut: hair("style-buzz-cut", 1400, 2100),
  frenchCrop: hair("style-french-crop", 1400, 2100),
  slickBack: hair("style-slick-back", 1400, 2097),
  sidePart: hair("style-side-part", 1400, 2100),
  beardFade: hair("style-beard-fade", 1400, 2100),
  naturalFlow: hair("style-natural-flow", 1400, 2100),
  modernTaper: hair("style-modern-taper", 1400, 2100),
  // Cảnh tay nghề (menu dịch vụ)
  razorLine: hair("craft-razor-line", 1400, 2097),
  beardTrim: hair("craft-beard-trim", 1400, 2100),
  shears: hair("craft-shears", 1400, 2100),
  hotShave: hair("craft-hot-shave", 1400, 933),
  beardScissors: hair("craft-beard-scissors", 1400, 2108),
  scissorCut: hair("craft-scissor-cut", 1400, 1750),
  clipper: hair("craft-clipper", 1400, 933),
  chair: hair("craft-chair", 1400, 933),
} as const;

/** Lookbook — tên & nhãn: dict.styles.items[id]. */
export const hairStyles = [
  { id: "texturedQuiff", image: hairImages.texturedQuiff },
  { id: "pompadourFade", image: hairImages.pompadourFade },
  { id: "frenchCrop", image: hairImages.frenchCrop },
  { id: "beardFade", image: hairImages.beardFade },
  { id: "slickBack", image: hairImages.slickBack },
  { id: "buzzCut", image: hairImages.buzzCut },
  { id: "sidePart", image: hairImages.sidePart },
  { id: "modernTaper", image: hairImages.modernTaper },
  { id: "naturalFlow", image: hairImages.naturalFlow },
] as const;

export type HairStyleId = (typeof hairStyles)[number]["id"];

/**
 * Chuỗi section "Signature" — mỗi kiểu tóc một section riêng với bảng màu đặc trưng.
 * bg: nền · ink: màu chữ · accent: màu nhấn · theme: để header/rail đổi màu chữ.
 * Nội dung chữ: dict.features.items[id].
 */
export const featureStyles = [
  {
    id: "texturedQuiff",
    image: hairImages.texturedQuiff,
    detail: hairImages.scissorCut,
    palette: { bg: "#1f3a2e", ink: "#eef3ea", accent: "#c9d98a", theme: "dark" },
  },
  {
    id: "modernTaper",
    image: hairImages.modernTaper,
    detail: hairImages.clipper,
    palette: { bg: "#5b1f26", ink: "#f8ebe6", accent: "#f2b29b", theme: "dark" },
  },
  {
    id: "beardFade",
    image: hairImages.beardFade,
    detail: hairImages.beardTrim,
    palette: { bg: "#14233a", ink: "#e8f0fa", accent: "#8fc3ea", theme: "dark" },
  },
  {
    id: "slickBack",
    image: hairImages.slickBack,
    detail: hairImages.shears,
    palette: { bg: "#b2552f", ink: "#fff4ea", accent: "#ffd29a", theme: "dark" },
  },
  {
    id: "naturalFlow",
    image: hairImages.naturalFlow,
    detail: hairImages.razorLine,
    palette: { bg: "#d8a93b", ink: "#1d1608", accent: "#1d1608", theme: "light" },
  },
] as const;

export type FeatureStyleId = (typeof featureStyles)[number]["id"];
