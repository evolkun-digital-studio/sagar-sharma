import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { focusAreas, industries } from "./data";

registerGsap();

export function Group() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);
        q(".ix-row").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
            .from(row.querySelector(".ix-rule"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
            .from(row.querySelector(".ix-name"), { yPercent: 125, duration: 1.2, ease: "expo.out" }, 0.2)
            .from(row.querySelector(".ix-body"), { yPercent: 125, duration: 1.2, ease: "expo.out" }, 0.3);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="group" className="surface-ink section-pad relative">
      <div className="wrap">
        <ChapterMark label="The Group" />

        <div className="grid-12 mt-14 gap-y-10 md:mt-20">
          <RevealLines as="h3" className="t-h1 col-span-12 max-w-[12ch] md:col-span-8">
            One architecture across five industries.
          </RevealLines>
          <p className="col-span-12 max-w-[38ch] self-end text-[15px] leading-[1.7] text-mist-mute md:col-span-3 md:col-start-10">
            As Chief Technology Officer of SR18 Group, I lead technology strategy for every business in the group:
            enterprise architecture, cybersecurity, AI and digital transformation, held to one standard.
          </p>
        </div>

        <ul className="dim-group mt-20 md:mt-32" aria-label="SR18 Group industries">
          {industries.map((ind) => (
            <li key={ind.name} className="ix-row dim-item shift-host draw-host group relative">
              <span aria-hidden className="ix-rule absolute inset-x-0 top-0 h-px origin-left bg-hair-dark" />
              <div className="grid-12 items-center gap-y-3 py-8 md:py-11">
                <div className="col-span-12 overflow-hidden pb-[0.14em] md:col-span-6">
                  <h3 className="ix-name t-h2">
                    <span className="shift draw-line pb-1">{ind.name}</span>
                  </h3>
                </div>
                <div className="col-span-12 overflow-hidden md:col-span-4 md:col-start-8">
                  <p className="ix-body max-w-[40ch] text-[15px] leading-[1.6] text-mist-mute transition-colors duration-500 group-hover:text-mist">
                    {ind.body}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="t-h3 col-span-1 col-start-12 hidden justify-self-end text-mist opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"
                >
                  →
                </span>
              </div>
            </li>
          ))}
          <li aria-hidden className="h-px bg-hair-dark" />
        </ul>

        <div className="grid-12 mt-16 gap-y-4 md:mt-24">
          <h3 className="t-small col-span-12 font-normal text-mist-mute md:col-span-2">Focus areas</h3>
          <p className="t-h3 col-span-12 text-mist md:col-span-10">{focusAreas.join(", ")}.</p>
        </div>
      </div>
    </section>
  );
}
