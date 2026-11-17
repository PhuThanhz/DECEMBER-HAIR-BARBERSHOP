"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface BookingSelection {
  kind: "style" | "service";
  id: string;
  title: string;
  meta: string;
}

interface BookingSelectionContextValue {
  selection: BookingSelection | null;
  selectBooking: (item: BookingSelection | null) => void;
}

const BookingSelectionContext = createContext<BookingSelectionContextValue>({
  selection: null,
  selectBooking: () => {},
});

/** Lưu lựa chọn kiểu tóc hoặc dịch vụ để điền sẵn khi khách kéo xuống phần đặt lịch. */
export function BookingSelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  return (
    <BookingSelectionContext.Provider value={{ selection, selectBooking: setSelection }}>
      {children}
    </BookingSelectionContext.Provider>
  );
}

export const useBookingSelection = () => useContext(BookingSelectionContext);
