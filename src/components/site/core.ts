import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import type Lenis from "lenis";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
  registered = true;
}

export { gsap, ScrollTrigger, SplitText };

/* ---------- smooth scroll handle ---------- */
let lenisRef: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenisRef = l);
export const getLenis = () => lenisRef;

export function scrollToTarget(target: string | HTMLElement | number) {
  const l = lenisRef;
  if (l) {
    l.scrollTo(target as never, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

/* ---------- page-ready signal (fired when the preloader lifts) ---------- */
declare global {
  interface Window {
    __siteReady?: boolean;
  }
}
export function markReady() {
  window.__siteReady = true;
  window.dispatchEvent(new Event("site:ready"));
}
export function onReady(cb: () => void) {
  if (window.__siteReady) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("site:ready", h, { once: true });
  return () => window.removeEventListener("site:ready", h);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
