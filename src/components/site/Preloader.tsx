import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { gsap, getLenis, markReady, prefersReducedMotion } from "./core";
import { person } from "./data";

/**
 * Opening titles. Two black bars hold the screen while the credits run
 * (anime.js), then they part into a letterbox and open onto the hero (GSAP).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    if (prefersReducedMotion()) {
      setGone(true);
      markReady();
      return;
    }

    const el = root.current!;
    const lenis = getLenis();
    lenis?.stop();

    const q = (s: string) => el.querySelectorAll<HTMLElement>(s);
    const counter = { v: 0 };

    const tl = createTimeline({ defaults: { ease: "outExpo" } });
    tl.add(q(".pl-present span"), { opacity: [0, 1], filter: ["blur(8px)", "blur(0px)"], duration: 900, delay: stagger(22) }, 200)
      .add(q(".pl-present"), { opacity: [1, 0], filter: ["blur(0px)", "blur(6px)"], duration: 600, ease: "inQuad" }, 1500)
      .add(
        q(".pl-name span"),
        { opacity: [0, 1], filter: ["blur(14px)", "blur(0px)"], translateY: ["0.25em", "0em"], duration: 1300, delay: stagger(45) },
        1900,
      )
      .add(q(".pl-role"), { opacity: [0, 1], duration: 800, ease: "outQuad" }, 2500);

    animate(counter, {
      v: 100,
      duration: 3300,
      ease: "inOutSine",
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
      onComplete: () => {
        const top = el.querySelector(".pl-top");
        const bot = el.querySelector(".pl-bot");
        gsap
          .timeline({
            onComplete: () => {
              setGone(true);
              lenis?.start();
            },
          })
          .to(q(".pl-fade"), { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0)
          // part into a 2.39:1 letterbox, hold a beat, then open fully
          .to(top, { yPercent: -82, duration: 1.1, ease: "expo.inOut" }, 0.35)
          .to(bot, { yPercent: 82, duration: 1.1, ease: "expo.inOut" }, 0.35)
          .add(() => markReady(), 0.6)
          .to(top, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 1.85)
          .to(bot, { yPercent: 100, duration: 1, ease: "expo.inOut" }, 1.85);
      },
    });

    return () => {
      tl.revert?.();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="preloader pointer-events-auto fixed inset-0 z-[80]" aria-hidden>
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 bg-film" />
      <div className="pl-bot absolute inset-x-0 bottom-0 h-1/2 bg-film" />

      <div className="pl-fade absolute inset-0 flex flex-col items-center justify-center text-bone">
        <p className="pl-present absolute text-[13px] tracking-[0.02em] text-smoke">
          {"SR18 Group presents".split("").map((c, i) => (
            <span key={i} className="inline-block opacity-0">
              {c === " " ? " " : c}
            </span>
          ))}
        </p>
        <p className="pl-name display text-[clamp(44px,7vw,112px)]">
          {person.name.split("").map((c, i) => (
            <span key={i} className="inline-block opacity-0">
              {c === " " ? " " : c}
            </span>
          ))}
        </p>
        <p className="pl-role mt-5 text-[13px] text-smoke opacity-0">
          {person.role}, {person.org}
        </p>
      </div>

      <div className="pl-fade absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-6 text-[12px] text-smoke tabular-nums md:px-10 md:pb-8">
        <span>A portfolio in chapters</span>
        <span ref={count}>000</span>
      </div>
    </div>
  );
}
