"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster: string;
  className?: string;
  /** Load the file right away instead of waiting for it to approach the viewport. */
  eager?: boolean;
};

/**
 * Muted, looping background video. The poster sits underneath with a slow
 * drift, and the video only fades in once it can actually play, so a slow
 * or missing file still looks intentional.
 */
export function VideoLayer({ src, poster, className, eager = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { margin: "300px 0px" });
  const [load, setLoad] = useState(eager);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (near) setLoad(true);
  }, [near]);

  // Pause when offscreen to save battery.
  useEffect(() => {
    const v = video.current;
    if (!v || !load) return;
    if (near) v.play().catch(() => {});
    else v.pause();
  }, [near, load]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" aria-hidden className="kenburns absolute inset-0 h-full w-full object-cover" />
      {load && (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-[var(--ease-cine)]"
          style={{ opacity: ready ? 1 : 0 }}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
