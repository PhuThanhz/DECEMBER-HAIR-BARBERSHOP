import { cn } from "@/lib/cn";
import { LogoD, type LogoDTone } from "./logo-d";

/** Logo ngang: chữ D (SVG) + "ecember" serif + dòng phụ "Barber Shop". */
export function Wordmark({
  tone = "gold",
  className,
  showSub = true,
}: {
  tone?: LogoDTone;
  className?: string;
  showSub?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-end gap-0.5 leading-none", className)}>
      <LogoD tone={tone} className="h-[1.15em] w-auto" strandWidth={4} />
      <span className="flex flex-col">
        <span className="font-display text-[1em] font-normal tracking-[0.02em]">ecember</span>
        {showSub && (
          <span className="mt-1 self-end text-[0.24em] font-medium tracking-[0.42em] uppercase opacity-70">
            Barber Shop
          </span>
        )}
      </span>
    </span>
  );
}
