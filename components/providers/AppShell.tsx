"use client";

import { MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { IntroProvider } from "./IntroProvider";
import { TransitionProvider } from "./TransitionProvider";
import { Atmosphere } from "@/components/Atmosphere";
import { Cursor } from "@/components/Cursor";
import { Intro } from "@/components/Intro";
import { Nav } from "@/components/Nav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <IntroProvider isHome={pathname === "/"}>
          <TransitionProvider>
            <Atmosphere />
            <Intro />
            <Nav />
            {children}
            <Cursor />
          </TransitionProvider>
        </IntroProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
