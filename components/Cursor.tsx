"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/hooks";

type Mode = "default" | "link" | "label";

// Critically damped: follows the pointer with weight but never overshoots.
const follow = { stiffness: 380, damping: 42, mass: 0.6 };

/**
 * A soft dot that trails the pointer. Over anything with [data-cursor] it
 * grows and shows that label ("Play", "View"); over links it becomes a ring.
 */
export function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, follow);
  const sy = useSpring(y, follow);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setMode("label");
        setLabel(labelled.dataset.cursor ?? "");
        return;
      }
      if (target?.closest("a, button, input, textarea, select, label, [role='button']")) {
        setMode("link");
        return;
      }
      setMode("default");
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const scale = mode === "label" ? 1 : mode === "link" ? 0.42 : 0.12;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative -ml-12 -mt-12 flex h-24 w-24 items-center justify-center"
        initial={false}
        animate={{ scale, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-bone"
          animate={{ opacity: mode === "link" ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-bone/70"
          animate={{ opacity: mode === "link" ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <motion.span
          className="relative text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink"
          animate={{ opacity: mode === "label" ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
