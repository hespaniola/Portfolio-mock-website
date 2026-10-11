"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { about, media, site } from "@/lib/content";
import { useDesktop } from "@/lib/hooks";
import { Counter } from "@/components/ui/Counter";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { Parallax } from "@/components/ui/Parallax";
import { RevealText } from "@/components/ui/RevealText";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const desktop = useDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Oversized background word drifts sideways at its own pace.
  const span = reduced ? 0 : desktop ? 25 : 10;
  const wordX = useTransform(scrollYProgress, [0, 1], [`${span / 2}%`, `${-span / 2}%`]);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-24 md:py-40">
      <motion.p
        aria-hidden
        className="display pointer-events-none absolute left-0 top-16 whitespace-nowrap text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(236,230,220,0.08)]"
        style={{ x: wordX }}
      >
        {site.location} — {site.location}
      </motion.p>

      <div className="relative mx-auto grid max-w-[1600px] gap-16 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-raise">
              <Parallax speed={22} className="absolute -inset-y-[14%] inset-x-0">
                <Media src={media.portrait} alt={`Portrait of ${site.name}`} sizes="(min-width: 768px) 40vw, 100vw" />
              </Parallax>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="eyebrow mt-5 flex justify-between">
              <span>{site.name}</span>
              <span>{site.location}</span>
            </p>
          </FadeIn>
        </div>

        <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
          <FadeIn>
            <p className="eyebrow mb-6">05 — {about.label}</p>
          </FadeIn>
          <RevealText as="h2" text={about.title} className="display text-5xl md:text-7xl" />
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-bone/70">
            {about.bio.map((p, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.1}>
                <p>{p}</p>
              </FadeIn>
            ))}
          </div>

          <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-line pt-10">
            {about.stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.1}>
                <dd className="display text-5xl tabular-nums md:text-7xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-3 text-xs uppercase tracking-[0.2em] text-bone-dim">{s.label}</dt>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
