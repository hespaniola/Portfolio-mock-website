"use client";

import { packages } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { RevealText } from "@/components/ui/RevealText";
import { TransitionLink } from "@/components/providers/TransitionProvider";

export function Packages() {
  return (
    <section id="packages" className="relative mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-40">
      <header className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12">
        <div className="md:col-span-7">
          <FadeIn>
            <p className="eyebrow mb-6">03 — {packages.label}</p>
          </FadeIn>
          <RevealText as="h2" text={packages.title} className="display text-6xl md:text-[8vw]" />
        </div>
        <FadeIn className="self-end md:col-span-4 md:col-start-9" delay={0.2}>
          <p className="max-w-sm text-lg leading-relaxed text-bone/70">{packages.note}</p>
        </FadeIn>
      </header>

      <div className="grid gap-6 md:grid-cols-3 md:items-center md:gap-0">
        {packages.tiers.map((tier, i) => (
          <FadeIn key={tier.name} delay={i * 0.12} className={tier.featured ? "md:z-10" : ""}>
            <article
              className={`relative flex flex-col p-8 md:p-10 ${
                tier.featured
                  ? "border border-amber/70 bg-ink-raise md:-mx-px md:py-16"
                  : "border border-line"
              } ${i === 0 ? "md:border-r-0" : ""} ${i === 2 ? "md:border-l-0" : ""}`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-8 bg-amber px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-ink md:left-10">
                  Most booked
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="display text-4xl md:text-5xl">{tier.name}</h3>
                <span className="text-sm tabular-nums text-bone-dim">0{i + 1}</span>
              </div>
              <p className="mt-4 min-h-[3.5rem] text-bone/65">{tier.blurb}</p>
              <div className="mt-10 border-t border-line pt-8">
                <span className="eyebrow">{tier.unit}</span>
                <p className={`display mt-2 text-6xl md:text-7xl ${tier.featured ? "text-amber-soft" : ""}`}>
                  {tier.price}
                </p>
              </div>
              <ul className="mt-10 space-y-3 text-sm text-bone/80">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-4">
                    <span aria-hidden className="h-px w-4 bg-amber" />
                    {f}
                  </li>
                ))}
              </ul>
              <TransitionLink
                href="/contact"
                className={`group mt-12 flex items-center justify-between border-t pt-6 text-sm uppercase tracking-[0.2em] ${
                  tier.featured ? "border-amber/40 text-amber-soft" : "border-line text-bone/80"
                }`}
              >
                <span>{packages.cta}</span>
                <span aria-hidden className="transition-transform duration-700 ease-[var(--ease-cine)] group-hover:translate-x-2">
                  →
                </span>
              </TransitionLink>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
