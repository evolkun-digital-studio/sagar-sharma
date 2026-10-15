import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, prefersReducedMotion } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { expertise, writing } from "./data";

registerGsap();

export function Practice() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".pc-cell"), {
        y: 40,
        autoAlpha: 0,
        duration: 1.2,
        stagger: { each: 0.07, grid: "auto", from: "start" },
        ease: "expo.out",
        scrollTrigger: { trigger: q(".pc-grid"), start: "top 82%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="practice" className="relative bg-bone px-5 pt-24 pb-20 text-film md:px-[5vw] md:pt-32 md:pb-28">
      <ChapterMark n="V" label="Practice" />
      <RevealLines as="h3" className="display mt-16 max-w-[14ch] text-[clamp(40px,5.2vw,88px)] md:mt-24">
        Eight disciplines that compound.
      </RevealLines>

      <ul className="pc-grid mt-20 grid grid-cols-1 gap-x-8 sm:grid-cols-2 md:mt-28 lg:grid-cols-4">
        {expertise.map((e) => (
          <li key={e.title} className="pc-cell group relative pt-6 pb-12">
            <span className="absolute inset-x-0 top-0 h-px bg-rule" />
            <span className="absolute top-0 left-0 h-px w-0 bg-film transition-[width] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full" />
            <h4 className="text-[16px] font-medium tracking-[-0.01em]">{e.title}</h4>
            <p className="mt-3 max-w-[34ch] text-[14px] leading-[1.72] text-ash">{e.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Writing() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      q(".wr-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
          .from(row.querySelector(".wr-rule"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
          .from(row.querySelector(".wr-title"), { yPercent: 105, duration: 1.3, ease: "expo.out" }, 0.15);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="writing" className="relative bg-bone px-5 pt-20 pb-32 text-film md:px-[5vw] md:pt-28 md:pb-44">
      <ChapterMark n="VI" label="Writing" />
      <ul className="group/wr mt-16 md:mt-24">
        {writing.map((w, i) => (
          <li key={w.title} className="wr-row relative transition-opacity duration-700 group-hover/wr:opacity-30 hover:!opacity-100">
            <span className="wr-rule absolute inset-x-0 top-0 h-px origin-left bg-rule" />
            <a href="#" data-cursor="Read" className="group grid grid-cols-1 items-baseline gap-2 py-8 md:grid-cols-12 md:gap-8 md:py-10">
              <span className="text-[13px] text-ash tabular-nums md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <span className="overflow-hidden md:col-span-8">
                <span className="wr-title serif block text-[clamp(26px,2.8vw,44px)] leading-[1.1]">
                  <span className="inline-block transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] md:group-hover:translate-x-4">
                    {w.title}
                  </span>
                </span>
              </span>
              <span className="text-[13px] text-ash md:col-span-3 md:text-right">{w.tag}</span>
            </a>
          </li>
        ))}
        <li aria-hidden className="h-px bg-rule" />
      </ul>
    </section>
  );
}
