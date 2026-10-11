"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site, socials } from "@/lib/content";
import { ease } from "@/lib/motion";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { useIntro } from "@/components/providers/IntroProvider";

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { done } = useIntro();
  const lenis = useLenis();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (open) return;
    if (y > prev && y > 160) setHidden(true);
    else if (y < prev) setHidden(false);
  });

  // Freeze page scroll while the mobile menu is open.
  const froze = useRef(false);
  useEffect(() => {
    if (open) {
      lenis?.stop();
      froze.current = true;
    } else if (froze.current) {
      lenis?.start();
      froze.current = false;
    }
  }, [open, lenis]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: hidden || !done ? "-100%" : "0%", opacity: done ? 1 : 0 }}
        transition={{ duration: 0.8, ease, delay: done && !scrolled ? 0.6 : 0 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/90 to-transparent transition-opacity duration-700"
          style={{ opacity: scrolled ? 1 : 0 }}
        />
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-10">
          <TransitionLink href="/" className="group flex items-baseline gap-3" aria-label={`${site.name}, home`}>
            <span className="display text-2xl">{site.name}</span>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.28em] text-bone-dim lg:inline">
              {site.location}
            </span>
          </TransitionLink>

          <ul className="hidden items-center gap-10 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="link-line text-sm text-bone/80 transition-colors duration-500 hover:text-bone">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-10 items-center gap-3 text-xs uppercase tracking-[0.24em] md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
            transition={{ duration: 0.6, ease }}
          >
            <ul className="space-y-2">
              {nav.map((item, i) => (
                <li key={item.href} className="mask block">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.07 }}
                  >
                    <TransitionLink
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display block text-6xl"
                    >
                      {item.label}
                    </TransitionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-bone-dim"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.4 }}
            >
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
