"use client";

import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { services } from "@/lib/content";
import { dur, ease } from "@/lib/motion";
import { useFinePointer } from "@/lib/hooks";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { RevealText } from "@/components/ui/RevealText";

// Smooth, non-overshooting follow for the preview card.
const follow = { stiffness: 120, damping: 24, mass: 0.7 };

export function Services() {
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const x = useSpring(useMotionValue(0), follow);
  const y = useSpring(useMotionValue(0), follow);

  useEffect(() => setMounted(true), []);

  const track = (e: React.PointerEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <section id="services" className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-40">
      <header className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
        <div className="md:col-span-8">
          <FadeIn>
            <p className="eyebrow mb-6">02 — {services.label}</p>
          </FadeIn>
          <RevealText as="h2" text={services.title} className="display text-6xl md:text-[8vw]" />
        </div>
      </header>

      <LayoutGroup>
        <ul onPointerMove={fine ? track : undefined} onPointerLeave={() => fine && setActive(null)}>
          {services.items.map((item, i) => {
            const isActive = active === i;
            return (
              <motion.li
                key={item.title}
                layout="position"
                transition={{ duration: dur.base, ease }}
                className="border-t border-line last:border-b"
              >
                <FadeIn delay={i * 0.08} distance={24}>
                  <button
                    type="button"
                    className="group grid w-full grid-cols-12 items-baseline gap-4 py-8 text-left md:py-10"
                    onPointerEnter={() => fine && setActive(i)}
                    onClick={() => !fine && setActive(isActive ? null : i)}
                    aria-expanded={isActive}
                  >
                    <span className="col-span-2 text-sm tabular-nums text-bone-dim md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`display col-span-9 text-4xl transition-[color,transform] duration-700 ease-[var(--ease-cine)] md:col-span-8 md:text-7xl ${
                        isActive ? "translate-x-0 text-bone md:translate-x-6" : "text-bone/55"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      aria-hidden
                      className={`col-span-1 justify-self-end text-2xl text-amber transition-transform duration-700 ease-[var(--ease-cine)] md:col-span-3 ${
                        isActive ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        transition={{ duration: dur.base, ease, delay: 0.1 }}
                        className="grid grid-cols-12 gap-4 pb-10"
                      >
                        <p className="col-span-12 max-w-xl text-lg leading-relaxed text-bone/70 md:col-span-6 md:col-start-2 md:pl-6">
                          {item.description}
                        </p>
                        {/* Phones get the image inline instead of following the cursor */}
                        {!fine && (
                          <div className="relative col-span-12 mt-4 aspect-[4/3] overflow-hidden">
                            <Media src={item.image} alt="" sizes="100vw" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FadeIn>
              </motion.li>
            );
          })}
        </ul>
      </LayoutGroup>

      {fine &&
        mounted &&
        createPortal(
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
            style={{ x, y }}
          >
            <motion.div
              className="relative translate-x-10 -translate-y-1/2 aspect-[4/5] w-[22vw] max-w-[340px] overflow-hidden"
              initial={false}
              animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.85 : 1 }}
              transition={{ duration: 0.7, ease }}
            >
              {services.items.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.15 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <Media src={item.image} alt="" sizes="340px" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </section>
  );
}
