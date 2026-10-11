"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ElementType } from "react";
import { dur, ease } from "@/lib/motion";

type Props = {
  /** Explicit lines. Each renders on its own line. */
  lines?: string[];
  /** Or a single string; words wrap naturally. */
  text?: string;
  /** Animate each word, or each whole line. */
  by?: "word" | "line";
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Control playback directly; otherwise plays when scrolled into view. */
  play?: boolean;
};

/** Masked slide-up reveal, staggered by word or line. */
export function RevealText({
  lines,
  text,
  by = "word",
  as: Tag = "p",
  className,
  lineClassName,
  delay = 0,
  stagger,
  duration = dur.slow,
  play,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const show = play ?? inView;
  const rows = lines ?? [text ?? ""];
  const step = stagger ?? (by === "line" ? 0.12 : 0.045);
  let i = 0;

  return (
    <Tag ref={ref} className={className} aria-label={rows.join(" ")}>
      {rows.map((row, r) => {
        const units = by === "line" ? [row] : row.split(" ");
        return (
          <span key={r} aria-hidden className={`${lines ? "block" : "inline"} ${lineClassName ?? ""}`}>
            {units.map((unit, u) => {
              const idx = i++;
              return (
                <span key={u} className="mask">
                  <motion.span
                    className="inline-block will-change-transform"
                    initial={{ y: "110%" }}
                    animate={{ y: show ? "0%" : "110%" }}
                    transition={{ duration, ease, delay: delay + idx * step }}
                  >
                    {unit}
                    {by === "word" && u < units.length - 1 ? " " : ""}
                  </motion.span>
                </span>
              );
            })}
            {!lines && r < rows.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}
