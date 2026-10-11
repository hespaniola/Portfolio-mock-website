"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

// Weighted, smooth scrolling site-wide. Lenis falls back to native
// scrolling on its own when the visitor prefers reduced motion.
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
        respectReducedMotion: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
