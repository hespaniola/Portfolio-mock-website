"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** True on devices with a mouse or trackpad. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

/** True at tablet-landscape widths and up. */
export const useDesktop = () => useMediaQuery("(min-width: 768px)");
