/**
 * Nút & kính — quy tắc của owner:
 *  - Nút chính: khối ĐẶC kiểu Apple (ngà trên nền tối, mực trên nền sáng), bo góc mềm rounded-xl,
 *    không gradient, không viền vàng, không phát sáng, KHÔNG bo tròn kiểu viên thuốc.
 *  - Kính (glass) CHỈ dùng khi nổi trên ảnh/video (header, chú thích trên ảnh, dock).
 *    Không làm "thẻ kính có viền" trên nền phẳng, không lồng hộp trong hộp — owner thấy rất "AI".
 */

/** Kính nổi trên ảnh/video tối. */
export const glassDark = "bg-ink/35 backdrop-blur-xl backdrop-saturate-150";

/** Kính nổi trên nền sáng (ví dụ thanh tab trên ảnh nền mờ của Menu). */
export const glassLight = "bg-white/50 backdrop-blur-xl backdrop-saturate-150";

const ctaBase =
  "group relative inline-flex w-fit items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 font-sans text-[15px] leading-none font-medium tracking-[-0.005em] whitespace-nowrap transition-[background-color,color,transform] duration-300 ease-[var(--ease-luxe)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

/** Nút chính trên nền tối: khối ngà đặc, chữ mực. */
export const ctaGold = `${ctaBase} bg-ivory text-ink hover:bg-white`;

/** Nút phụ trên nền tối / trên ảnh: kính mờ, chữ ngà. */
export const ctaGlass = `${ctaBase} bg-ivory/[0.1] text-ivory backdrop-blur-xl hover:bg-ivory/[0.18]`;

/** Nút chính trên nền sáng: khối mực đặc, chữ ngà. */
export const ctaDark = `${ctaBase} bg-ink text-ivory hover:bg-espresso`;

/** Liên kết chữ thuần (không gạch chân) — chỉ đổi màu khi hover. */
export const textLink = "transition-colors duration-300 hover:text-gold";
