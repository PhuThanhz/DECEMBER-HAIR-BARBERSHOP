import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "./cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16", className)}
      {...props}
    />
  );
}
