"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useDesktop } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  /** Total travel in percent of the element's own height. Negative moves against scroll. */
  speed?: number;
  className?: string;
};

/** Moves its content at a different speed than the page. Lighter on phones. */
export function Parallax({ children, speed = 12, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const desktop = useDesktop();
  const amount = reduced ? 0 : desktop ? speed : speed * 0.4;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-amount / 2}%`, `${amount / 2}%`]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
