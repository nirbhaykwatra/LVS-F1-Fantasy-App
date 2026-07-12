"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (blobARef.current) {
          blobARef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        }
        if (blobBRef.current) {
          blobBRef.current.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
        }
        if (gridRef.current) {
          gridRef.current.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
        }
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <div
        ref={blobARef}
        className="absolute -top-1/3 -left-1/4 h-[60vmax] w-[60vmax] will-change-transform"
      >
        <div className="h-full w-full animate-[aurora_16s_ease-in-out_infinite] rounded-full bg-brand/30 blur-3xl dark:bg-brand/20" />
      </div>

      <div
        ref={blobBRef}
        className="absolute top-1/3 -right-1/4 h-[55vmax] w-[55vmax] will-change-transform"
      >
        <div
          className="h-full w-full animate-[aurora_20s_ease-in-out_infinite] rounded-full bg-brand/20 blur-3xl dark:bg-brand/10"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <div className="absolute inset-0 animate-[pulse-glow_6s_ease-in-out_infinite] bg-stripes opacity-[0.08] text-brand" />

      <div
        ref={gridRef}
        className="absolute inset-0 animate-[drift_9s_linear_infinite] bg-grid text-foreground/[0.05] will-change-transform"
      />
    </div>
  );
}
