"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// The intro only plays on the first full page load of the homepage.
// A module-level flag survives client-side navigation but not a refresh.
let introPlayed = false;

type IntroState = { done: boolean; finish: () => void; shouldPlay: boolean };

const IntroContext = createContext<IntroState>({ done: true, finish: () => {}, shouldPlay: false });

export function IntroProvider({ children, isHome }: { children: ReactNode; isHome: boolean }) {
  const [shouldPlay] = useState(() => isHome && !introPlayed);
  const [done, setDone] = useState(!shouldPlay);

  const finish = useCallback(() => {
    introPlayed = true;
    setDone(true);
  }, []);

  return (
    <IntroContext.Provider value={{ done, finish, shouldPlay }}>{children}</IntroContext.Provider>
  );
}

export const useIntro = () => useContext(IntroContext);
