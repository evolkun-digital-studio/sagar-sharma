import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { getLenis, markReady, prefersReducedMotion } from "./core";
import { person } from "./data";

const SEEN_KEY = "sr18:intro-seen";

const seenThisTab = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};
const rememberSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the intro simply plays again next time */
  }
};

/**
 * Opening title, under 1.8s. The name rises out of a mask while a hairline fills
 * (anime.js), then the ink panel wipes upward onto the hero.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    if (prefersReducedMotion() || seenThisTab()) {
      setGone(true);
      // defer: the hero's WebGL effect runs after this one, and its intro needs it
      const t = window.setTimeout(markReady, 0);
      return () => clearTimeout(t);
    }

    const el = root.current!;
    const lenis = getLenis();
    lenis?.stop();

    const timers: number[] = [];
    const counter = { v: 0 };

    const wipe = () => {
      el.style.transition = "clip-path 1s cubic-bezier(0.7, 0, 0.2, 1)";
      el.style.clipPath = "inset(0 0 100% 0)";
      // hero intro overlaps the last 60% of the wipe
      timers.push(window.setTimeout(markReady, 400));
      timers.push(
        window.setTimeout(() => {
          rememberSeen();
          setGone(true);
          lenis?.start();
        }, 1000),
      );
    };

    const rise = animate(name.current!, { translateY: ["105%", "0%"], duration: 800, delay: 60, ease: "outExpo" });
    const fill = animate(counter, {
      v: 100,
      duration: 800,
      ease: "inOutQuad",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`;
      },
      onComplete: wipe,
    });

    return () => {
      timers.forEach(clearTimeout);
      rise.revert?.();
      fill.revert?.();
      lenis?.start();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="preloader surface-ink pointer-events-auto fixed inset-0 z-[80] flex items-center"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden
    >
      <div className="wrap">
        <p className="t-h2 overflow-hidden pb-[0.12em]">
          <span ref={name} className="inline-block" style={{ transform: "translateY(105%)" }}>
            {person.name}
          </span>
        </p>
        <span className="mt-6 block h-px w-full bg-(--line)">
          <span ref={bar} className="block h-px origin-left bg-mist" style={{ transform: "scaleX(0)" }} />
        </span>
      </div>
      <span ref={count} className="t-mono absolute right-(--gutter) bottom-6 text-mist-mute md:bottom-8">
        000
      </span>
    </div>
  );
}
