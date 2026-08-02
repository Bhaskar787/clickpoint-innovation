"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Cpu } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollGrowImageSection() {
  const growSectionRef = useRef<HTMLDivElement>(null);
  const growFrameRef = useRef<HTMLDivElement>(null);
  const growImageRef = useRef<HTMLDivElement>(null);
  const growOverlayRef = useRef<HTMLDivElement>(null);
  const growTextRef = useRef<HTMLDivElement>(null);
  const growLabelRef = useRef<HTMLDivElement>(null);
  const growScrollCueRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (growSectionRef.current && growFrameRef.current) {
        // Initial state before scroll triggers
        gsap.set(growFrameRef.current, {
          scale: 0.45,
          borderRadius: 36,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55)",
        });
        gsap.set(growImageRef.current, { scale: 1.25 });
        gsap.set(growOverlayRef.current, { autoAlpha: 0 });
        gsap.set(growTextRef.current, { autoAlpha: 0, y: 40 });
        gsap.set(growLabelRef.current, { autoAlpha: 0, y: 20 });
        gsap.set(growScrollCueRef.current, { autoAlpha: 0, y: 15 });

        const growTl = gsap.timeline({
          scrollTrigger: {
            trigger: growSectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        growTl
          // 1. Frame grows smoothly from a compact card to 100% full-screen view
          .to(growFrameRef.current, {
            scale: 1,
            borderRadius: 0,
            boxShadow: "0 0px 0px rgba(0,0,0,0)",
            duration: 1,
            ease: "power2.inOut",
          })
          // 2. Parallax counter-scale image inside for depth
          .to(growImageRef.current, { scale: 1, duration: 1, ease: "power1.out" }, "<")
          // 3. Dark gradient overlay fades in for text contrast
          .to(growOverlayRef.current, { autoAlpha: 1, duration: 0.35, ease: "none" }, "-=0.4")
          // 4. Reveal badge & text elements
          .to(growLabelRef.current, { autoAlpha: 1, y: 0, duration: 0.2, ease: "none" }, "-=0.25")
          .to(growTextRef.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: "none" }, "-=0.15")
          .to(growScrollCueRef.current, { autoAlpha: 1, y: 0, duration: 0.2, ease: "none" }, "-=0.1")
          .to({}, { duration: 0.35 }) // Comfortable reading hold
          // 5. Fade out smoothly as user scrolls past
          .to(
            [growTextRef.current, growLabelRef.current, growScrollCueRef.current, growOverlayRef.current],
            { autoAlpha: 0, y: -20, duration: 0.25, ease: "none" }
          );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative">
      <section ref={growSectionRef} className="relative" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink text-white flex items-center justify-center">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 -left-40 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -right-40 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-ember-500/20 rounded-full blur-[120px] pointer-events-none" />

          {/* Top Gradient Overlay */}
          <div className="absolute top-0 inset-x-0 h-32 sm:h-48 bg-gradient-to-b from-ink via-ink/80 to-transparent pointer-events-none z-10" />

          {/* Growing Frame Container */}
          <div
            ref={growFrameRef}
            className="absolute inset-0 overflow-hidden origin-center border border-violet-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.6)]"
            style={{ borderRadius: "2.25rem" }}
          >
            {/* Visual Engineering Pod Canvas */}
            <div
              ref={growImageRef}
              className="w-full h-full object-cover origin-center bg-gradient-to-br from-violet-950 via-slate-900 to-ink relative flex items-center justify-center"
            >
              {/* Dynamic Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]" />
              <div className="absolute inset-0 bg-radial from-violet-600/30 via-transparent to-black/80" />

              {/* Central Abstract Pod Badge */}
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-600/30 border border-violet-400/40 text-violet-300 backdrop-blur-xl shadow-2xl animate-pulse">
                  <Cpu className="h-10 w-10" />
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <span className="rounded-full bg-violet-500/20 border border-violet-400/30 px-4 py-1.5 text-xs font-mono font-semibold text-violet-200 backdrop-blur-md">
                    Autonomous AI Pods
                  </span>
                  <span className="rounded-full bg-ember-500/20 border border-ember-400/30 px-4 py-1.5 text-xs font-mono font-semibold text-ember-200 backdrop-blur-md">
                    250ms Latency SLA
                  </span>
                  <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 text-xs font-mono font-semibold text-blue-200 backdrop-blur-md">
                    Multi-Cloud Mesh
                  </span>
                </div>
              </div>
            </div>

            {/* Dark Gradient Overlay */}
            <div
              ref={growOverlayRef}
              className="absolute inset-0 bg-gradient-to-t from-black/95 via-ink/80 to-black/60 z-10"
            />
          </div>

          {/* Overlay Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-20">
            <div ref={growLabelRef} className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
                Global AI & Product Engineering
              </span>
            </div>

            <div ref={growTextRef} className="max-w-3xl space-y-4">
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Where Human Genius Meets{" "}
                <span className="text-[#f58220]">
                  Autonomous AI
                </span>
              </h2>
              <p className="font-body text-base sm:text-lg text-violet-100/90 font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-2xl mx-auto">
                Our distributed engineering pods operate round-the-clock across 3 continents, shipping production LLM copilots, zero-downtime microservices, and conversion-optimized platforms.
              </p>
            </div>
          </div>

          {/* Scroll Cue */}
          <div
            ref={growScrollCueRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-violet-300/80 pointer-events-none"
          >
            <span className="font-display text-[10px] uppercase tracking-[0.25em] text-violet-400 font-bold">
              Scroll To Expand
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-transparent shadow-sm" />
          </div>
        </div>
      </section>
    </div>
  );
}
