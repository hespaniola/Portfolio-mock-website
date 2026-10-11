"use client";

import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { intro, site } from "@/lib/content";
import { ease, easeInOut } from "@/lib/motion";
import { useIntro } from "@/components/providers/IntroProvider";

/**
 * Loading sequence: the name rises letter by letter while a thin line
 * fills, then the whole panel lifts away to reveal the hero.
 */
export function Intro() {
  const { shouldPlay, finish } = useIntro();
  const [visible, setVisible] = useState(shouldPlay);
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    window.scrollTo(0, 0);
    lenis?.stop();
    const hold = reduced ? 600 : 2600;

    const counter = count.current
      ? animate(0, 100, {
          duration: hold / 1000,
          ease: [0.65, 0, 0.35, 1],
          onUpdate: (n) => {
            if (count.current) count.current.textContent = String(Math.round(n)).padStart(3, "0");
          },
        })
      : null;

    const t = setTimeout(() => {
      setVisible(false);
      finish();
    }, hold);
    return () => {
      clearTimeout(t);
      counter?.stop();
    };
  }, [visible, reduced, finish, lenis]);

  useEffect(() => {
    if (!visible) lenis?.start();
  }, [visible, lenis]);

  const letters = site.name.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[85] flex flex-col items-center justify-center bg-ink"
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 1.2, ease: easeInOut }}
        >
          <motion.p
            className="eyebrow mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease, delay: 0.2 }}
          >
            {intro.kicker}
          </motion.p>

          <motion.h1
            className="display px-6 text-center text-[13vw] leading-none md:text-[8vw]"
            aria-label={site.name}
            exit={reduced ? undefined : { y: "-30vh", opacity: 0 }}
            transition={{ duration: 1.1, ease: easeInOut }}
          >
            {letters.map((ch, i) => (
              <span key={i} aria-hidden className="mask">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, ease, delay: 0.35 + i * 0.045 }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <div className="absolute inset-x-6 bottom-10 flex items-end justify-between gap-6 md:inset-x-10">
            <span className="eyebrow">{site.location}</span>
            <div className="relative h-px flex-1 overflow-hidden bg-line">
              <motion.div
                className="absolute inset-0 origin-left bg-amber"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reduced ? 0.6 : 2.6, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <span ref={count} className="eyebrow tabular-nums">
              000
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
