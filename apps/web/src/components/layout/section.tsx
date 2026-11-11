import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  id: string;
  /** Màu nền → header & rail đổi màu chữ tương ứng. */
  theme: "light" | "dark";
  /**
   * "rise": section trồi lên đè lên section trước với góc bo lớn → góc bo phẳng dần khi cuộn.
   * "none": không hiệu ứng chuyển.
   */
  transition?: "rise" | "none";
  /** Hiện trên thanh chỉ mục bên phải (desktop). */
  rail?: boolean;
  /** Nhãn hiển thị trên thanh chỉ mục (mặc định lấy dict.nav[id]). */
  label?: string;
}

/**
 * Khung chuẩn cho mọi section. Hiệu ứng chuyển cảnh được gắn tập trung trong
 * <SectionTransitions/> dựa trên data-attribute, nên section con không cần tự viết animation chuyển.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, theme, transition = "rise", rail = true, label, className, children, ...props },
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
        "relative isolate",
        transition === "rise" && "-mt-16 rounded-t-[4rem] md:-mt-24 md:rounded-t-[7rem]",
        className,
      )}
      {...props}
    >
      {children}
      {/* Lớp tối dần khi section kế tiếp trồi lên che section này */}
      <div
        aria-hidden
        className="section-shade bg-ink pointer-events-none absolute inset-0 z-30 opacity-0"
      />
    </section>
  );
});
