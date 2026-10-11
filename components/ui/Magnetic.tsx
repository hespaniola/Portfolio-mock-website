"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useFinePointer } from "@/lib/hooks";

const settle = { stiffness: 160, damping: 26, mass: 0.8 }; // no overshoot

/** Pulls its child gently toward the pointer. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const x = useSpring(useMotionValue(0), settle);
  const y = useSpring(useMotionValue(0), settle);

  const move = (e: React.PointerEvent) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} className={className} style={{ x, y }} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}
