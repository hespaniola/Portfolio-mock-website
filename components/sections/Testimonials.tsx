import { testimonials } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";

/** Slow, endless marquee of client quotes. Hover pauses it. */
export function Testimonials() {
  const items = [...testimonials.items, ...testimonials.items];
  return (
    <section aria-label={testimonials.label} className="relative py-16 md:py-24">
      <FadeIn className="mx-auto mb-16 max-w-[1600px] px-6 md:px-10">
        <p className="eyebrow">06 — {testimonials.label}</p>
      </FadeIn>
      <FadeIn>
        <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <ul className="marquee-track flex w-max">
            {items.map((t, i) => (
              <li
                key={i}
                aria-hidden={i >= testimonials.items.length}
                className="flex w-[85vw] shrink-0 flex-col justify-between border-l border-line px-8 md:w-[52vw] md:px-14"
              >
                <blockquote className="display text-3xl leading-[1.15] md:text-5xl">
                  <span className="text-amber">“</span>
                  {t.quote}
                  <span className="text-amber">”</span>
                </blockquote>
                <p className="mt-10 text-sm">
                  <span className="text-bone">{t.name}</span>
                  <span className="text-bone-dim"> — {t.role}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </section>
  );
}
