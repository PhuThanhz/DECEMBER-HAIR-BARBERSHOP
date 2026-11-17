import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  id: string;
  /** Màu nền → header & rail đổi màu chữ tương ứng. */
  theme: "light" | "dark";
  /**
   * "rise" (mặc định): nối liền section trước bằng mép thẳng, phẳng — chồng 1px để không lộ khe.
   * "none": section đầu trang.
   */
  transition?: "rise" | "none";
  /** Hiện trên thanh chỉ mục bên phải (desktop). */
  rail?: boolean;
  /** Nhãn hiển thị trên thanh chỉ mục (mặc định lấy dict.nav[id]). */
  label?: string;
  /**
   * Desktop (lg+): section cao đúng 1 màn hình (100svh, sàn 680px) và .section-stage là flex-col
   * để phần thân dùng `flex-1 min-h-0` lấp đầy khung. Mobile: cao tự nhiên theo nội dung.
   */
  fit?: boolean;
  /** Lớp nền phía sau nội dung (ảnh mờ…), phủ kín cả phần đệm của section, không bị parallax. */
  background?: ReactNode;
}

/**
 * Khung chuẩn cho mọi section. Chuyển giữa các section là mép thẳng, phẳng (owner muốn đơn giản).
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    id,
    theme,
    transition = "rise",
    rail = true,
    label,
    fit = true,
    background,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      data-theme={theme}
      data-transition={transition}
      data-rail={rail ? "" : undefined}
      data-label={label}
      className={cn(
        "relative isolate w-full",
        // Chồng 1px lên section trước → không lộ vạch nền tối do chiều cao lẻ pixel
        transition === "rise" && "-mt-px",
        fit && "lg:flex lg:h-svh lg:min-h-[680px] lg:flex-col",
        className,
      )}
      {...props}
    >
      {background && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {background}
        </div>
      )}
      <div
        className={cn(
          "section-stage relative z-10 h-full w-full",
          fit && "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col",
        )}
      >
        {children}
      </div>
    </section>
  );
});
