import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, prefersReducedMotion } from "./core";
import { RevealLines } from "./Chapter";
import { focusAreas, industries } from "./data";

registerGsap();

export function Group() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      q(".ix-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
          .from(row.querySelector(".ix-rule"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
          .from(row.querySelector(".ix-name"), { yPercent: 105, duration: 1.4, ease: "expo.out" }, 0.15)
          .from(row.querySelector(".ix-body"), { autoAlpha: 0, y: 14, duration: 1.1, ease: "power3.out" }, 0.35);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="group" className="relative bg-bone px-5 py-24 text-film md:px-[5vw] md:py-32">
      <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12">
        <RevealLines as="h3" className="display max-w-[12ch] text-[clamp(34px,4.6vw,72px)] md:col-span-8">
          One architecture across five industries.
        </RevealLines>
        <p className="max-w-[38ch] self-end text-[14px] leading-[1.72] text-ash md:col-span-3 md:col-start-10">
          As Chief Technology Officer of SR18 Group, I lead technology strategy for every business in the group:
          enterprise architecture, cybersecurity, AI and digital transformation, held to one standard.
        </p>
      </div>

      <ul className="group/ix mt-20 md:mt-32" aria-label="SR18 Group industries">
        {industries.map((ind) => (
          <li
            key={ind.name}
            className="ix-row relative transition-opacity duration-700 group-hover/ix:opacity-25 hover:!opacity-100"
          >
            <span className="ix-rule absolute inset-x-0 top-0 h-px origin-left bg-rule" />
            <div className="grid grid-cols-1 items-baseline gap-3 py-7 md:grid-cols-12 md:gap-8 md:py-9">
              <div className="overflow-hidden md:col-span-7">
                <h4 className="ix-name display text-[clamp(32px,4.8vw,80px)]">
                  <span className="inline-block transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] md:hover:translate-x-[2vw]">
                    {ind.name}
                  </span>
                </h4>
              </div>
              <p className="ix-body max-w-[40ch] text-[14px] leading-[1.72] text-ash md:col-span-4 md:col-start-9">{ind.body}</p>
            </div>
          </li>
        ))}
        <li aria-hidden className="h-px bg-rule" />
      </ul>

      <div className="mt-16 grid grid-cols-1 gap-4 md:mt-24 md:grid-cols-12">
        <h4 className="text-[12px] text-signal md:col-span-2">Focus areas</h4>
        <p className="serif text-[clamp(18px,1.6vw,24px)] leading-[1.38] text-film/90 md:col-span-10">
          {focusAreas.join(", ")}.
        </p>
      </div>
    </section>
  );
}
