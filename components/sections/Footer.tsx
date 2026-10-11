"use client";

import { useLenis } from "lenis/react";
import { footer, nav, site, socials } from "@/lib/content";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { Parallax } from "@/components/ui/Parallax";

export function Footer() {
  const lenis = useLenis();
  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-16 md:grid-cols-12 md:px-10">
        <ul className="space-y-2 text-sm md:col-span-3">
          {nav.map((n) => (
            <li key={n.href}>
              <TransitionLink href={n.href} className="link-line text-bone/70 hover:text-bone">
                {n.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <ul className="space-y-2 text-sm md:col-span-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="link-line text-bone/70 hover:text-bone">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-start gap-2 text-sm md:col-span-3 md:col-start-10 md:items-end">
          <a href={`mailto:${site.email}`} className="link-line text-bone/70 hover:text-bone">
            {site.email}
          </a>
          <button type="button" onClick={toTop} className="link-line text-bone/70 hover:text-bone">
            {footer.back} ↑
          </button>
        </div>
      </div>
      <Parallax speed={-30} className="px-4">
        <p aria-hidden className="display select-none whitespace-nowrap text-center text-[15.5vw] leading-[0.8] text-bone/[0.06]">
          {site.name}
        </p>
      </Parallax>
      <p className="mx-auto max-w-[1600px] px-6 pb-8 pt-4 text-xs text-bone-dim md:px-10">{footer.note}</p>
    </footer>
  );
}
