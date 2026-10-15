import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, setLenis, scrollToTarget, prefersReducedMotion } from "./core";

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in lockstep. */
export function SmoothScroll() {
  useEffect(() => {
    registerGsap();

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // route in-page anchors through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href")!;
      if (href === "#") return;
      const el = href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (el === null) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, "", href);
    };
    document.addEventListener("click", onClick);

    // fonts change line metrics -> re-measure triggers
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
