"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { projects, type Project } from "@/lib/content";
import { dur, ease } from "@/lib/motion";
import { Media } from "@/components/ui/Media";
import { TransitionLink } from "@/components/providers/TransitionProvider";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: dur.slow, ease, delay },
});

function nextOf(project: Project) {
  const i = projects.findIndex((p) => p.slug === project.slug);
  return projects[(i + 1) % projects.length];
}

function Body({ project, base = 0.5 }: { project: Project; base?: number }) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  return (
    <div className="mx-auto max-w-[1600px] px-6 md:px-10">
      <div className="grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <motion.div className="md:col-span-8" {...rise(base)}>
          <p className="eyebrow mb-6">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} — {project.category}
          </p>
          <h1 className="display text-6xl md:text-[7.5vw]">{project.title}</h1>
        </motion.div>
        <motion.dl
          className="grid grid-cols-2 gap-x-8 gap-y-6 self-end text-sm md:col-span-4"
          {...rise(base + 0.1)}
        >
          {[
            ["Client", project.client],
            ["Location", project.location],
            ["Year", project.year],
            ["Category", project.category],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-line pt-3">
              <dt className="eyebrow mb-1">{k}</dt>
              <dd className="text-bone/90">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="grid gap-12 border-t border-line py-16 md:grid-cols-12 md:py-24">
        <motion.p className="display text-3xl leading-tight text-bone md:col-span-6 md:text-5xl" {...rise(base + 0.2)}>
          {project.summary}
        </motion.p>
        <motion.div className="space-y-6 text-lg leading-relaxed text-bone/70 md:col-span-5 md:col-start-8" {...rise(base + 0.3)}>
          {project.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
          <div className="grid grid-cols-2 gap-8 pt-6 text-sm">
            <div>
              <p className="eyebrow mb-3">Deliverables</p>
              <ul className="space-y-1.5 text-bone/85">
                {project.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Credits</p>
              <ul className="space-y-1.5">
                {project.credits.map((c) => (
                  <li key={c.role}>
                    <span className="text-bone-dim">{c.role}</span>
                    <br />
                    <span className="text-bone/85">{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Full-screen project view opened from the homepage grid. */
export function ProjectOverlay({
  project,
  shared,
  onClose,
  onNavigate,
}: {
  project: Project;
  shared: boolean;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const lenis = useLenis();
  const scroller = useRef<HTMLDivElement>(null);
  const next = nextOf(project);

  useEffect(() => {
    lenis?.stop();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", key);
    };
  }, [lenis, onClose]);

  const goNext = () => {
    scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
    onNavigate(next.slug);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: dur.slow } }}
    >
      <motion.div
        className="absolute inset-0 bg-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.7, ease } }}
        transition={{ duration: 0.6, ease }}
      />
      <div ref={scroller} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain">
        <motion.div
          className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 md:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="display text-2xl">Selected Work</span>
          <button type="button" onClick={onClose} className="link-line text-xs uppercase tracking-[0.24em]">
            Close
          </button>
        </motion.div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.article
            key={project.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="relative h-[62svh] w-full md:h-[78svh]">
              <motion.div
                layoutId={shared ? `media-${project.slug}` : undefined}
                className="absolute inset-0 overflow-hidden"
                transition={{ duration: dur.slow, ease }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <Media src={project.image} alt={project.title} priority />
              </motion.div>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink" />
            </div>

            <motion.div exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              <Body project={project} />

              <button
                type="button"
                onClick={goNext}
                data-cursor="Next"
                className="group block w-full border-t border-line px-6 py-20 text-left md:px-10 md:py-32"
              >
                <span className="eyebrow mb-4 block">Next project</span>
                <span className="display block text-5xl transition-transform duration-[900ms] ease-[var(--ease-cine)] group-hover:translate-x-4 md:text-[8vw]">
                  {next.title}
                </span>
              </button>
            </motion.div>
          </motion.article>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** Standalone page version, for direct visits and refreshes. */
export function ProjectPage({ project }: { project: Project }) {
  const next = nextOf(project);
  return (
    <article>
      <div className="relative h-[62svh] w-full overflow-hidden md:h-[78svh]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <Media src={project.image} alt={project.title} priority />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink" />
      </div>
      <Body project={project} base={0.3} />
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 border-t border-line px-6 py-20 md:flex-row md:items-end md:justify-between md:px-10 md:py-32">
        <TransitionLink href={`/work/${next.slug}`} data-cursor="Next" className="group block">
          <span className="eyebrow mb-4 block">Next project</span>
          <span className="display block text-5xl transition-transform duration-[900ms] ease-[var(--ease-cine)] group-hover:translate-x-4 md:text-[8vw]">
            {next.title}
          </span>
        </TransitionLink>
        <TransitionLink href="/#work" className="link-line self-start text-xs uppercase tracking-[0.24em] md:self-end">
          All work
        </TransitionLink>
      </div>
    </article>
  );
}
