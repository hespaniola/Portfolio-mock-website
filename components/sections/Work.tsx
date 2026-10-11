"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { projects, work, type Project } from "@/lib/content";
import { dur, ease } from "@/lib/motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { Parallax } from "@/components/ui/Parallax";
import { RevealText } from "@/components/ui/RevealText";
import { ProjectOverlay } from "@/components/ProjectDetail";

// Asymmetric placement on a 12-column grid (desktop). Phones get one column.
const layout = [
  { tile: "md:col-span-7", frame: "aspect-[4/3]", speed: 6 },
  { tile: "md:col-start-9 md:col-span-4 md:mt-48", frame: "aspect-[3/4]", speed: 14 },
  { tile: "md:col-start-2 md:col-span-4 md:-mt-24", frame: "aspect-[3/4]", speed: 10 },
  { tile: "md:col-start-7 md:col-span-6 md:mt-32", frame: "aspect-[16/11]", speed: 6 },
  { tile: "md:col-span-8", frame: "aspect-[16/9]", speed: 8 },
  { tile: "md:col-start-10 md:col-span-3 md:mt-56", frame: "aspect-[4/5]", speed: 16 },
];

export function Work() {
  const pathname = usePathname();
  const [origin, setOrigin] = useState<string | null>(null);
  const match = pathname.match(/^\/work\/([^/]+)/);
  const openSlug = match?.[1] ?? null;
  const openProject = projects.find((p) => p.slug === openSlug) ?? null;

  const open = (e: MouseEvent, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setOrigin(slug);
    // Shallow URL update: the homepage stays mounted underneath the overlay.
    window.history.pushState({ overlay: true }, "", `/work/${slug}`);
  };

  const close = () => {
    if (window.history.state?.overlay) window.history.back();
    else window.history.pushState(null, "", "/#work");
  };

  const goTo = (slug: string) => {
    // Moving between projects inside the overlay is a plain crossfade.
    setOrigin(null);
    window.history.replaceState({ overlay: true }, "", `/work/${slug}`);
  };

  return (
    <LayoutGroup>
      <section id="work" className="relative mx-auto max-w-[1600px] px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-48">
        <header className="mb-20 grid gap-10 md:mb-32 md:grid-cols-12">
          <div className="md:col-span-7">
            <FadeIn>
              <p className="eyebrow mb-6">01 — {work.label}</p>
            </FadeIn>
            <RevealText as="h2" text={work.title} className="display text-6xl md:text-[8vw]" />
          </div>
          <FadeIn className="self-end md:col-span-4 md:col-start-9" delay={0.2}>
            <p className="max-w-sm text-lg leading-relaxed text-bone/70">{work.intro}</p>
          </FadeIn>
        </header>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-12 md:gap-y-0">
          {projects.map((p, i) => (
            <Tile
              key={p.slug}
              project={p}
              index={i}
              hideMedia={openSlug === p.slug && origin === p.slug}
              returning={origin === p.slug && openSlug !== p.slug}
              onSettled={() => setOrigin((o) => (o === p.slug && !openSlug ? null : o))}
              onOpen={open}
            />
          ))}
        </ul>
      </section>

      <AnimatePresence>
        {openProject && (
          <ProjectOverlay
            key="overlay"
            project={openProject}
            shared={origin === openProject.slug}
            onClose={close}
            onNavigate={goTo}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

function Tile({
  project,
  index,
  hideMedia,
  returning,
  onSettled,
  onOpen,
}: {
  project: Project;
  index: number;
  hideMedia: boolean;
  returning: boolean;
  onSettled: () => void;
  onOpen: (e: MouseEvent, slug: string) => void;
}) {
  const l = layout[index % layout.length];
  return (
    <li className={l.tile}>
      <FadeIn delay={(index % 2) * 0.15}>
        <a
          href={`/work/${project.slug}`}
          onClick={(e) => onOpen(e, project.slug)}
          data-cursor="View"
          className="group block"
          aria-label={`${project.title}, ${project.category}, ${project.year}`}
        >
          <div className={`relative ${l.frame} bg-ink-raise`}>
            {!hideMedia && (
              <motion.div
                layoutId={`media-${project.slug}`}
                className="absolute inset-0 overflow-hidden"
                // Sit above the closing overlay while flying back into the grid.
                style={{ zIndex: returning ? 75 : 0 }}
                transition={{ duration: dur.slow, ease }}
                onLayoutAnimationComplete={returning ? onSettled : undefined}
              >
                <Parallax speed={l.speed} className="absolute -inset-y-[10%] inset-x-0">
                  <div className="absolute inset-0 transition-transform duration-[1600ms] ease-[var(--ease-cine)] group-hover:scale-[1.07]">
                    <Media src={project.image} alt="" sizes="(min-width: 768px) 60vw, 100vw" />
                  </div>
                </Parallax>
              </motion.div>
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-100"
            />
            <span className="eyebrow absolute left-5 top-5 z-[1] text-bone/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            {/* Title slides up into view on hover (always visible on touch) */}
            <div className="absolute inset-x-5 bottom-5 z-[1] overflow-hidden">
              <h3 className="display translate-y-0 text-3xl transition-transform duration-[900ms] ease-[var(--ease-cine)] md:text-5xl [@media(hover:hover)]:translate-y-[110%] [@media(hover:hover)]:group-hover:translate-y-0">
                {project.title}
              </h3>
            </div>
          </div>
          <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4 text-sm">
            <span className="text-bone/90">{project.title}</span>
            <span className="flex gap-6 text-bone-dim">
              <span>{project.category}</span>
              <span className="tabular-nums">{project.year}</span>
            </span>
          </div>
        </a>
      </FadeIn>
    </li>
  );
}
