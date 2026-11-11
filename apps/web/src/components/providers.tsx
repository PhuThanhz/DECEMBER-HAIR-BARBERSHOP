"use client";

import type { ReactNode } from "react";
import { IntroProvider, Preloader, SectionTransitions } from "@/components/motion";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <IntroProvider>
      <Preloader />
      <SectionTransitions />
      {children}
    </IntroProvider>
  );
}
