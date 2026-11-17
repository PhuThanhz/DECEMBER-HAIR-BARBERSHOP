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
  // Ảnh thật do chủ tiệm cung cấp
  texturedCrop: hair("style-textured-crop", 1024, 1024),
  afroFade: hair("style-afro-fade", 415, 739),
  burstFade: hair("style-burst-fade", 461, 665),
  slickLowFade: hair("style-slick-low-fade", 1500, 2000),
  sidePartFade: hair("style-side-part-fade", 1200, 1800),
  fadeBokeh: hair("craft-fade-bokeh", 866, 577),
  taperClipper: hair("craft-taper-clipper", 1250, 1000),
  clipperDetail: hair("craft-clipper-detail", 1024, 1024),
  razorShave: hair("craft-razor-shave", 1000, 1000),
  beardClipper: hair("craft-beard-clipper", 940, 627),
  neckRazor: hair("craft-neck-razor", 1024, 683),
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
 * Lookbook nhiều mẫu tóc (section <Lookbook/>) — 2 hàng chạy ngược chiều.
 * Tên & nhãn: dict.styles.items[id]. Xen kẽ ảnh thật của tiệm với ảnh minh hoạ.
 */
export const lookbookRows = [
  [
    { id: "lowFadeSlick", image: hairImages.slickLowFade },
    { id: "texturedQuiff", image: hairImages.texturedQuiff },
    { id: "afroFade", image: hairImages.afroFade },
    { id: "pompadourFade", image: hairImages.pompadourFade },
    { id: "texturedCrop", image: hairImages.texturedCrop },
    { id: "buzzCut", image: hairImages.buzzCut },
    { id: "naturalFlow", image: hairImages.naturalFlow },
  ],
  [
    { id: "hardPartFade", image: hairImages.sidePartFade },
    { id: "beardFade", image: hairImages.beardFade },
    { id: "burstFade", image: hairImages.burstFade },
    { id: "slickBack", image: hairImages.slickBack },
    { id: "frenchCrop", image: hairImages.frenchCrop },
    { id: "modernTaper", image: hairImages.modernTaper },
    { id: "sidePart", image: hairImages.sidePart },
  ],
] as const;

/**
 * Chuỗi section "Signature" — mỗi kiểu tóc một section riêng với bảng màu đặc trưng.
 * focus: object-position của ảnh · bg: nền · ink: màu chữ · accent: màu nhấn · theme: để header/rail đổi màu chữ.
 * Nội dung chữ: dict.features.items[id].
 */
export const featureStyles = [
  {
    id: "slickBack",
    image: hairImages.slickLowFade,
    focus: "50% 35%",
    palette: { bg: "#2E211B", ink: "#F6F2EC", accent: "#E4CD89", theme: "dark" },
  },
  {
    id: "sidePart",
    image: hairImages.sidePartFade,
    focus: "50% 30%",
    palette: { bg: "#1C1613", ink: "#F6F2EC", accent: "#D9C27A", theme: "dark" },
  },
  {
    id: "frenchCrop",
    image: hairImages.frenchCrop,
    focus: "50% 30%",
    palette: { bg: "#E6DDD0", ink: "#17120F", accent: "#6B4A3A", theme: "light" },
  },
  {
    id: "beardFade",
    image: hairImages.beardFade,
    focus: "45% 35%",
    palette: { bg: "#222923", ink: "#F3F0EA", accent: "#D9C27A", theme: "dark" },
  },
  {
    id: "modernTaper",
    image: hairImages.modernTaper,
    focus: "50% 35%",
    palette: { bg: "#F4EFE6", ink: "#17120F", accent: "#6B4A3A", theme: "light" },
  },
] as const;

export type FeatureStyleId = (typeof featureStyles)[number]["id"];
