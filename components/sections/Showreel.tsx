"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { media, showreel } from "@/lib/content";
import { ease } from "@/lib/motion";
import { useDesktop } from "@/lib/hooks";
import { VideoLayer } from "@/components/ui/VideoLayer";

/** A small window that grows to full width as you scroll into it. */
export function Showreel() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const desktop = useDesktop();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  const from = reduced ? 1 : desktop ? 0.34 : 0.72;
  const scale = useTransform(scrollYProgress, [0.25, 0.85], [from, 1]);
  const captionOpacity = useTransform(scrollYProgress, [0.25, 0.6], [1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.7, 0.95], [30, 0]);

  return (
    <section
      ref={ref}
      aria-label="Showreel"
      className={reduced ? "relative py-24" : "relative h-[200vh] md:h-[240vh]"}
    >
      <div className={reduced ? "relative h-[70vh]" : "sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden"}>
        <motion.div
          className="pointer-events-none absolute inset-x-6 top-1/2 flex -translate-y-1/2 justify-between md:inset-x-10"
          style={{ opacity: captionOpacity }}
        >
          <span className="eyebrow">{showreel.label}</span>
          <span className="eyebrow tabular-nums">{showreel.duration}</span>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          data-cursor="Play"
          aria-label="Play showreel"
          className="relative h-full w-full origin-center overflow-hidden bg-ink-raise will-change-transform"
          style={{ scale }}
        >
          <VideoLayer src={media.showreelVideo} poster={media.showreelPoster} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
          <motion.div
            className="absolute inset-x-6 bottom-10 flex items-end justify-between gap-6 text-left md:inset-x-10 md:bottom-14"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <h2 className="display max-w-3xl text-4xl md:text-7xl">{showreel.title}</h2>
            <span className="hidden shrink-0 items-center gap-3 text-xs uppercase tracking-[0.24em] md:flex">
              <span className="block h-2 w-2 rounded-full bg-amber" /> Play reel
            </span>
          </motion.div>
        </motion.button>
      </div>

      <ReelLightbox open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function ReelLightbox({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis();
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", key);
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-ink/95 p-4 md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Showreel player"
        >
          <motion.video
            className="aspect-video w-full max-w-6xl bg-black"
            src={media.showreelVideo}
            poster={media.showreelPoster}
            controls
            autoPlay
            playsInline
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={onClose}
            className="link-line absolute right-6 top-6 text-xs uppercase tracking-[0.24em] md:right-10 md:top-8"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
