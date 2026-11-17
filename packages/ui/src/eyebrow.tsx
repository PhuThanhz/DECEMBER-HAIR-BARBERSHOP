import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

/** Nhãn nhỏ viết hoa, giãn chữ — dùng trên tiêu đề section. */
export function Eyebrow({ className, children, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "font-sans text-[11px] font-medium tracking-[0.32em] text-current/70 uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
