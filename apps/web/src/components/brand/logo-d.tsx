import { forwardRef, useId, type SVGProps } from "react";

/**
 * Chữ "D" của December — vẽ lại bằng SVG từ logo gốc (sources/logo.png, hệ toạ độ 960×960).
 * Gồm: thân chữ (fill) + 8 "sợi tóc" lượn tạo thành vòm chữ D (stroke).
 * Mỗi sợi có class `logo-d__strand`, thân có `logo-d__stem` → dùng GSAP để vẽ nét (stroke-dashoffset).
 */

type Pt = [number, number];
type Curve = [Pt, Pt, Pt, Pt, Pt, Pt, Pt, Pt, Pt, Pt];

// Sợi ngoài cùng (vòm tròn của chữ D)
const OUTER: Curve = [
  [452, 217],
  [575, 217],
  [668, 268],
  [698, 372],
  [716, 440],
  [712, 525],
  [690, 592],
  [650, 690],
  [565, 735],
  [462, 735],
];
// Sợi trong cùng (đường cong chữ S — "sợi tóc")
const INNER: Curve = [
  [478, 222],
  [522, 236],
  [538, 292],
  [566, 362],
  [596, 432],
  [652, 482],
  [644, 560],
  [630, 652],
  [548, 724],
  [462, 735],
];

const STRANDS = 8;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function strandPath(t: number) {
  const p = OUTER.map((o, i) => {
    const n = INNER[i]!;
    return [lerp(n[0], o[0], t), lerp(n[1], o[1], t)] as Pt;
  });
  const f = (pt: Pt) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
  return `M ${f(p[0]!)} C ${f(p[1]!)}, ${f(p[2]!)}, ${f(p[3]!)} C ${f(p[4]!)}, ${f(p[5]!)}, ${f(p[6]!)} C ${f(p[7]!)}, ${f(p[8]!)}, ${f(p[9]!)}`;
}

export const STRAND_PATHS = Array.from({ length: STRANDS }, (_, i) =>
  strandPath(i / (STRANDS - 1)),
);

/** Thân chữ D: thanh ngang trên + nét đứng đậm có chân xoè + thanh ngang dưới. */
export const STEM_PATH =
  "M 238 214 L 470 214 L 470 221 L 372 221 C 368 222 367 226 367 236 L 367 676 C 367 708 356 724 340 730 L 466 730 L 466 738 L 224 738 L 224 734 C 248 728 262 712 262 682 L 262 300 C 262 256 286 232 326 221 L 238 221 Z";

export type LogoDTone = "gold" | "silver" | "ivory" | "ink";

const tones: Record<LogoDTone, [string, string, string]> = {
  gold: ["#f1e3b0", "#d9c27a", "#b89a4e"],
  silver: ["#f2f2f3", "#c8c8ca", "#9a9a9e"],
  ivory: ["#ffffff", "#f6f2ec", "#d9cbb8"],
  ink: ["#3a2e27", "#2b211c", "#17120f"],
};

export interface LogoDProps extends SVGProps<SVGSVGElement> {
  tone?: LogoDTone;
  /** Ẩn thân chữ — chỉ còn các sợi (dùng làm hoạ tiết trang trí). */
  strandsOnly?: boolean;
  strandWidth?: number;
  title?: string;
}

export const LogoD = forwardRef<SVGSVGElement, LogoDProps>(function LogoD(
  {
    tone = "gold",
    strandsOnly = false,
    strandWidth = 2.4,
    title = "December",
    className,
    ...props
  },
  ref,
) {
  const id = useId().replace(/:/g, "");
  const [c1, c2, c3] = tones[tone];
  return (
    <svg
      ref={ref}
      viewBox="200 190 540 570"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="45%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
      </defs>
      {!strandsOnly && <path className="logo-d__stem" d={STEM_PATH} fill={`url(#g-${id})`} />}
      <g stroke={`url(#g-${id})`} strokeWidth={strandWidth} strokeLinecap="round">
        {STRAND_PATHS.map((d, i) => (
          <path key={i} className="logo-d__strand" d={d} />
        ))}
      </g>
    </svg>
  );
});
