import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

/** Nhãn nhỏ viết hoa, giãn chữ — dùng trên tiêu đề section. */
export function Eyebrow({ className, children, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "flex items-center gap-4 font-sans text-[11px] font-medium tracking-[0.32em] text-current/70 uppercase",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="h-px w-10 bg-current/50" />
      {children}
    </p>
  );
}
