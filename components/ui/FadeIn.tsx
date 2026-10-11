"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { dur, ease } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; distance?: number };

/** Fades and rises into place as it enters the viewport. */
export function FadeIn({ delay = 0, distance = 40, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: dur.slow, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
