import { useEffect, useRef } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "./core";

/**
 * A difference-blended dot that trails the pointer. Elements with
 * data-cursor="Label" grow it into a labelled disc.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const el = dot.current!;
    const lab = label.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    let current: HTMLElement | null = null;
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (t === current) return;
      current = t;
      const text = t?.dataset.cursor;
      if (t && text) {
        lab.textContent = text;
        gsap.to(el, { width: 96, height: 96, duration: 0.5, ease: "expo.out" });
        gsap.to(lab, { autoAlpha: 1, scale: 1, duration: 0.4, delay: 0.05 });
      } else if (t) {
        gsap.to(el, { width: 44, height: 44, duration: 0.5, ease: "expo.out" });
        gsap.to(lab, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
      } else {
        gsap.to(el, { width: 10, height: 10, duration: 0.5, ease: "expo.out" });
        gsap.to(lab, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
      }
    };
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: () => void (shown = false) });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="cursor-dot pointer-events-none fixed top-0 left-0 z-[100] flex h-[10px] w-[10px] items-center justify-center rounded-full bg-[#eceae5] opacity-0 mix-blend-difference"
    >
      <span
        ref={label}
        className="text-[12px] font-semibold text-[#0c0c0c] opacity-0"
        
      />
    </div>
  );
}
