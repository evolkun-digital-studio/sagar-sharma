import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { focusAreas, industries } from "./data";

registerGsap();

/**
 * Shared hairline grid: five industry cards and one quiet "focus areas" cell.
 * Hover wipes a paper panel up from the bottom of a card and flips its text to ink.
 */
export function Group() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".gp-cell"), {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".gp-grid")[0], start: "top 82%" },
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
            As Chief Technology Officer of SR18 Group, I lead technology strategy for every business
            in the group: enterprise architecture, cybersecurity, AI and digital transformation,
            held to one standard.
          </p>
        </div>

        <ul
          className="gp-grid mt-20 grid grid-cols-1 border-t border-l border-hair-dark sm:grid-cols-2 md:mt-28 lg:grid-cols-3"
          aria-label="SR18 Group industries"
        >
          {industries.map((ind) => (
            <li
              key={ind.name}
              className="gp-cell group relative flex overflow-hidden min-h-65 border-r border-b border-hair-dark md:min-h-80"
            >
              {/* paper panel that wipes up on hover */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom translate-y-full bg-paper transition-transform duration-700 ease-expo group-hover:translate-y-0"
              />
              <div className="relative flex flex-1 flex-col justify-between gap-12 p-6 md:p-8">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="t-h2 text-mist transition-colors duration-500 group-hover:text-ink">
                    {ind.name}
                  </h3>
                  <span
                    aria-hidden
                    className="t-h3 -translate-x-2 text-ink opacity-0 transition-[opacity,translate] duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    →
                  </span>
                </div>
                <p className="max-w-[34ch] text-[15px] leading-[1.6] text-mist-mute transition-colors duration-500 group-hover:text-graphite">
                  {ind.body}
                </p>
              </div>
            </li>
          ))}

          <li className="gp-cell relative flex min-h-65 border-r border-b border-hair-dark md:min-h-80">
            <div className="flex flex-1 flex-col justify-between gap-12 p-6 md:p-8">
              <h3 className="t-small font-normal text-mist-mute">Focus areas</h3>
              <ul className="space-y-1 text-[15px] leading-[1.6] text-mist">
                {focusAreas.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
