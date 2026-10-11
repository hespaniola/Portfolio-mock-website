"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { hero, media } from "@/lib/content";
import { ease } from "@/lib/motion";
import { RevealText } from "@/components/ui/RevealText";
import { VideoLayer } from "@/components/ui/VideoLayer";
import { useIntro } from "@/components/providers/IntroProvider";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Background drifts slower than the page; copy lifts and fades as you leave.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "25%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-30%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] w-full overflow-hidden" aria-label="Introduction">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.18 }}
          animate={{ scale: done ? 1 : 1.18 }}
          transition={{ duration: 2.4, ease }}
        >
          <VideoLayer src={media.heroVideo} poster={media.heroPoster} eager />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/10 to-ink" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,10,9,0.7)_100%)]" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 md:px-10 md:pb-20"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.p
          className="eyebrow mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.3 }}
        >
          {hero.eyebrow}
        </motion.p>
        <RevealText
          as="h1"
          lines={hero.lines}
          play={done}
          delay={0.45}
          stagger={0.07}
          duration={1.2}
          className="display text-[15vw] leading-[0.92] sm:text-[11vw] lg:text-[8.6vw]"
          lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-amber-soft"
        />
        <div className="mt-10 flex items-end justify-between gap-8">
          <motion.p
            className="max-w-md text-base leading-relaxed text-bone/75 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease, delay: 1.1 }}
          >
            {hero.sub}
          </motion.p>

          <motion.div
            className="hidden flex-col items-center gap-4 md:flex"
            initial={{ opacity: 0 }}
            animate={done ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            aria-hidden
          >
            <span className="eyebrow [writing-mode:vertical-rl]">{hero.scrollCue}</span>
            <span className="relative h-16 w-px overflow-hidden bg-line">
              <motion.span
                className="absolute inset-0 origin-top bg-bone"
                animate={reduced ? {} : { y: ["-100%", "100%"] }}
                transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 0.4 }}
              />
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
