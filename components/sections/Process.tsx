"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { process } from "@/lib/content";
import { useDesktop } from "@/lib/hooks";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";

export function Process() {
  const desktop = useDesktop();
  const reduced = useReducedMotion();
  return desktop && !reduced ? <Horizontal /> : <Stacked />;
}

function Heading() {
  return (
    <>
      <FadeIn>
        <p className="eyebrow mb-6">04 — {process.label}</p>
      </FadeIn>
      <RevealText as="h2" text={process.title} className="display text-6xl md:text-[7vw]" />
    </>
  );
}

/** Desktop: the page pins and the steps slide sideways. */
function Horizontal() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="process"
      ref={section}
      className="relative"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-stretch will-change-transform" style={{ x }}>
          <div className="flex w-[42vw] shrink-0 flex-col justify-center px-10">
            <Heading />
            <p className="mt-8 max-w-xs text-bone/60">Four steps. No surprises.</p>
          </div>
          {process.steps.map((step, i) => (
            <article
              key={step.title}
              className="relative flex w-[46vw] shrink-0 flex-col justify-between border-l border-line px-12 py-10"
            >
              <span className="display text-[13vw] leading-none text-amber/25">0{i + 1}</span>
              <div className="mt-16 max-w-md">
                <h3 className="display text-6xl">{step.title}</h3>
                <p className="mt-6 text-lg leading-relaxed text-bone/70">{step.text}</p>
              </div>
            </article>
          ))}
          <div className="w-[12vw] shrink-0" />
        </motion.div>

        <div className="absolute inset-x-10 bottom-10 flex items-center gap-6">
          <span className="eyebrow">Discover</span>
          <div className="relative h-px flex-1 bg-line">
            <motion.div className="absolute inset-0 origin-left bg-amber" style={{ scaleX: progress }} />
          </div>
          <span className="eyebrow">Deliver</span>
        </div>
      </div>
    </section>
  );
}

/** Phones and reduced motion: a simple vertical stack. */
function Stacked() {
  return (
    <section id="process" className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-10">
      <div className="mb-16">
        <Heading />
      </div>
      <ol>
        {process.steps.map((step, i) => (
          <li key={step.title} className="border-t border-line py-10">
            <FadeIn delay={0.05 * i}>
              <div className="flex items-baseline gap-6">
                <span className="display text-5xl text-amber/40">0{i + 1}</span>
                <h3 className="display text-5xl">{step.title}</h3>
              </div>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-bone/70">{step.text}</p>
            </FadeIn>
          </li>
        ))}
      </ol>
    </section>
  );
}
