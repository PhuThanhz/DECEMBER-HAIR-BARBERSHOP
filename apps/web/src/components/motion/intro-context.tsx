"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/** Báo cho các section biết preloader đã kết thúc → bắt đầu animation hero. */
const IntroContext = createContext<{ done: boolean; finish: () => void }>({
  done: false,
  finish: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  return (
    <IntroContext.Provider value={{ done, finish: () => setDone(true) }}>
      {children}
    </IntroContext.Provider>
  );
}

export const useIntro = () => useContext(IntroContext);
