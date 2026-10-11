"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { useAnimate, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ease, easeInOut } from "@/lib/motion";

type Ctx = { navigate: (href: string) => void; scrollToHash: (hash: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {}, scrollToHash: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

const labelFor = (path: string) => {
  if (path === "/") return "Home";
  if (path.startsWith("/work/")) return "Work";
  const seg = path.split("/").filter(Boolean)[0] ?? "";
  return seg.charAt(0).toUpperCase() + seg.slice(1);
};

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [label, setLabel] = useState("");
  const busy = useRef(false);
  const arrival = useRef<{ path: string; resolve: () => void } | null>(null);

  // Resolve the pending navigation once the new route has rendered.
  useEffect(() => {
    if (arrival.current && arrival.current.path === pathname) {
      const { resolve } = arrival.current;
      arrival.current = null;
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }
  }, [pathname]);

  const scrollToHash = useCallback(
    (hash: string, immediate = false) => {
      const el = hash ? document.querySelector<HTMLElement>(hash) : null;
      if (lenis) {
        lenis.scrollTo(el ?? 0, { immediate, force: true, duration: 1.6 });
      } else {
        (el ?? document.body).scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
      }
    },
    [lenis],
  );

  const navigate = useCallback(
    async (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      if (url.pathname === window.location.pathname) {
        scrollToHash(url.hash);
        if (url.hash) history.replaceState(history.state, "", url.pathname + url.hash);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      setLabel(labelFor(url.pathname));

      const curtain = scope.current;
      if (!reduced) curtain.style.opacity = "1";
      const cover = reduced
        ? animate(curtain, { opacity: [0, 1], y: "0%" }, { duration: 0.4 })
        : animate(curtain, { y: ["100%", "0%"] }, { duration: 0.9, ease: easeInOut });
      await cover;

      const arrived = new Promise<void>((resolve) => {
        arrival.current = { path: url.pathname, resolve };
      });
      router.push(url.pathname + url.hash, { scroll: false });
      await arrived;

      if (url.hash) scrollToHash(url.hash, true);
      else if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);

      if (reduced) await animate(curtain, { opacity: 0 }, { duration: 0.4 });
      else await animate(curtain, { y: "-100%" }, { duration: 1, ease, delay: 0.1 });
      animate(curtain, { y: "100%", opacity: 0 }, { duration: 0 });
      busy.current = false;
    },
    [animate, lenis, reduced, router, scope, scrollToHash],
  );

  return (
    <TransitionContext.Provider value={{ navigate, scrollToHash }}>
      {children}
      <div
        ref={scope}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-ink opacity-0"
        style={{ transform: "translateY(100%)" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-amber/60" />
        <span className="display text-5xl text-bone/80 italic md:text-7xl">{label}</span>
      </div>
    </TransitionContext.Provider>
  );
}

type TLinkProps = ComponentProps<typeof Link> & { href: string };

/** A Link that plays the curtain transition between pages. */
export function TransitionLink({ href, onClick, ...rest }: TLinkProps) {
  const { navigate } = usePageTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target === "_blank") return;
    e.preventDefault();
    navigate(href);
  };
  return <Link href={href} onClick={handle} {...rest} />;
}
