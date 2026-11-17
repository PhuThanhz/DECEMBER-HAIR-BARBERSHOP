"use client";

import type { ReactNode } from "react";
import { IntroProvider, Preloader, SectionTransitions } from "@/components/motion";
import { BookingSelectionProvider } from "@/lib/booking-selection";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <IntroProvider>
      <BookingSelectionProvider>
        <Preloader />
        <SectionTransitions />
        {children}
      </BookingSelectionProvider>
    </IntroProvider>
  );
}
