import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { philosophy } from "./data";

registerGsap();

/**
 * TECHNOLOGY PHILOSOPHY — five principles set as columns that step down
 * from left to right, each hung from a hairline. On narrow screens the
 * columns become hairline-separated rows.
 */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const trigger = () => ({ trigger: q(".ph-list")[0], start: "top 80%" });

      mm.add(NO_REDUCE, () => {
        gsap.from(q(".ph-title"), {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: trigger(),
        });
        gsap.from(q(".ph-body"), {
          yPercent: 100,
          duration: 1.2,
          stagger: 0.09,
          delay: 0.12,
          ease: "expo.out",
          scrollTrigger: trigger(),
        });
      });

      // The rule draws down the column on desktop, across the row below.
      mm.add(`${NO_REDUCE} and (min-width: 1024px)`, () => {
        gsap.from(q(".ph-rule"), {
          scaleY: 0,
          duration: 1.5,
          stagger: 0.09,
          ease: "expo.inOut",
          scrollTrigger: trigger(),
        });
      });
      mm.add(`${NO_REDUCE} and (max-width: 1023px)`, () => {
        gsap.from(q(".ph-rule"), {
          scaleX: 0,
          duration: 1.4,
          stagger: 0.09,
          ease: "expo.inOut",
          scrollTrigger: trigger(),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="surface-paper section-pad relative"
    >
      <div className="wrap">
        <div className="grid-12 mt-14 gap-y-10 md:mt-20">
          <RevealLines as="h3" className="t-h1 col-span-12 max-w-[16ch] md:col-span-8">
            Principles behind every system I build.
          </RevealLines>
          <p className="col-span-12 max-w-[38ch] self-end text-[15px] leading-[1.7] text-graphite md:col-span-3 md:col-start-10">
            Every technology decision should create long-term business value, scalability, security,
            and operational excellence.
          </p>
        </div>

        <ul
          className="ph-list dim-group mt-20 grid grid-cols-1 lg:grid-cols-5 lg:items-start lg:gap-x-6 md:mt-28"
          aria-label="Technology principles"
        >
          {philosophy.map((p, i) => (
            <li
              key={p.title}
              style={{ "--i": i } as React.CSSProperties}
              className="dim-item group relative grid grid-cols-1 gap-x-6 gap-y-4 py-8 md:grid-cols-12 md:gap-y-0 lg:mt-[calc(var(--i)*3.4vw)] lg:block lg:py-0 lg:pt-6 lg:pr-2 lg:pb-2 lg:pl-6"
            >
              {/* base hairline, drawn by GSAP */}
              <span
                aria-hidden
                className="ph-rule absolute top-0 left-0 h-px w-full origin-left bg-hair lg:h-full lg:w-px lg:origin-top"
              />
              {/* ink hairline, drawn by CSS on hover */}
              <span
                aria-hidden
                className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-expo group-hover:scale-x-100 lg:h-full lg:w-px lg:origin-top lg:scale-x-100 lg:scale-y-0 lg:group-hover:scale-y-100"
              />

              <h3 className="overflow-hidden pb-[0.12em] font-medium leading-[1.12] tracking-[-0.02em] text-ink md:col-span-5 text-[clamp(22px,1.9vw,30px)]">
                <span className="ph-title block">{p.title}</span>
              </h3>
              <p className="overflow-hidden text-[15px] leading-[1.65] text-graphite md:col-span-6 md:col-start-7 lg:mt-5 lg:max-w-[26ch]">
                <span className="ph-body block">{p.body}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
