"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { contact, site, socials } from "@/lib/content";
import { ease } from "@/lib/motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealText } from "@/components/ui/RevealText";

const field =
  "peer w-full border-b border-line bg-transparent pb-3 pt-7 text-lg text-bone outline-none transition-colors duration-500 placeholder:text-transparent focus:border-amber";
const label =
  "pointer-events-none absolute left-0 top-7 origin-left text-bone-dim transition-transform duration-500 ease-[var(--ease-cine)] peer-focus:-translate-y-6 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75";

export function Contact({ id = "contact", page = false }: { id?: string; page?: boolean }) {
  const [type, setType] = useState(contact.form.types[0]);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  // Placeholder submit: wire this to a form service or API route later.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    setTimeout(() => setState("sent"), 1200);
  };

  return (
    <section id={id} className={`relative mx-auto max-w-[1600px] px-6 md:px-10 ${page ? "pb-32 pt-40 md:pt-48" : "py-24 md:py-40"}`}>
      <FadeIn>
        <p className="eyebrow mb-8">{page ? contact.label : `07 — ${contact.label}`}</p>
      </FadeIn>
      <RevealText
        as={page ? "h1" : "h2"}
        by="line"
        lines={contact.headline}
        className="display text-[17vw] leading-[0.88] md:text-[13vw]"
        lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-amber-soft"
        play={page ? true : undefined}
        delay={page ? 0.4 : 0}
      />

      <div className="mt-20 grid gap-16 md:mt-32 md:grid-cols-12">
        <FadeIn className="space-y-10 md:col-span-4">
          <p className="max-w-xs text-lg leading-relaxed text-bone/70">{contact.intro}</p>
          <div className="space-y-2">
            <a href={`mailto:${site.email}`} className="link-line display text-3xl md:text-4xl">
              {site.email}
            </a>
            <p className="text-bone-dim">{site.phone}</p>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-line text-bone/80 hover:text-bone">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn className="md:col-span-7 md:col-start-6" delay={0.15}>
          <AnimatePresence mode="wait">
            {state === "sent" ? (
              <motion.p
                key="done"
                className="display text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                role="status"
              >
                {contact.form.success}
              </motion.p>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                className="space-y-10"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease }}
              >
                <div className="grid gap-10 md:grid-cols-2">
                  <div className="relative">
                    <input id={`${id}-name`} name="name" required placeholder=" " className={field} autoComplete="name" />
                    <label htmlFor={`${id}-name`} className={label}>{contact.form.name}</label>
                  </div>
                  <div className="relative">
                    <input id={`${id}-email`} name="email" type="email" required placeholder=" " className={field} autoComplete="email" />
                    <label htmlFor={`${id}-email`} className={label}>{contact.form.email}</label>
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-5 text-bone-dim">{contact.form.type}</legend>
                  <div className="flex flex-wrap gap-3">
                    {contact.form.types.map((t) => (
                      <label
                        key={t}
                        className={`rounded-full border px-5 py-2 text-sm transition-colors duration-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-amber ${
                          type === t ? "border-amber bg-amber text-ink" : "border-line text-bone/80 hover:border-bone/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={t}
                          checked={type === t}
                          onChange={() => setType(t)}
                          className="sr-only"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="relative">
                  <textarea id={`${id}-message`} name="message" rows={4} required placeholder=" " className={`${field} resize-none`} />
                  <label htmlFor={`${id}-message`} className={label}>{contact.form.message}</label>
                </div>

                <div className="flex justify-end pt-4">
                  <Magnetic strength={0.4}>
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-amber text-sm font-semibold uppercase tracking-[0.2em] text-ink md:h-44 md:w-44"
                    >
                      <span className="absolute inset-0 translate-y-full rounded-full bg-bone transition-transform duration-700 ease-[var(--ease-cine)] group-hover:translate-y-0" />
                      <span className="relative">{state === "sending" ? "Sending" : contact.form.submit}</span>
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  );
}
