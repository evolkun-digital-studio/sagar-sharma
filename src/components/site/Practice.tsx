import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { expertise, writing } from "./data";

registerGsap();

export function Practice() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".pc-cell"), {
          y: 24,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".pc-grid"), start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="practice" className="surface-paper relative pt-(--section-pad) pb-[calc(var(--section-pad)*0.7)]">
      <div className="wrap">
        <ChapterMark label="Practice" />
        <RevealLines as="h3" className="t-h1 mt-14 max-w-[14ch] md:mt-20">
          Eight disciplines that compound.
        </RevealLines>

        <ul className="pc-grid mt-20 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-28 lg:grid-cols-4">
          {expertise.map((e) => (
            <li key={e.title} className="pc-cell group relative pt-6">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-hair" />
              <span
                aria-hidden
                className="absolute top-0 left-0 h-px w-0 bg-ink transition-[width] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full"
              />
              <h3 className="t-h3">{e.title}</h3>
              <p className="mt-3 max-w-[34ch] text-[15px] leading-[1.6] text-graphite">{e.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Writing() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);
        q(".wr-row").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 92%" } })
            .from(row.querySelector(".wr-rule"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
            .from(row.querySelector(".wr-title"), { yPercent: 125, duration: 1.2, ease: "expo.out" }, 0.15);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const anyLinks = writing.some((w) => w.href);

  return (
    <section ref={root} id="writing" className="surface-paper relative pt-[calc(var(--section-pad)*0.5)] pb-(--section-pad)">
      <div className="wrap">
        <ChapterMark label="Writing" />
        <ul className={`${anyLinks ? "dim-group" : ""} mt-14 md:mt-20`}>
          {writing.map((w) => {
            const inner = (
              <div className="grid-12 items-center gap-y-2 py-8 md:py-10">
                <div className="col-span-12 overflow-hidden pb-[0.14em] md:col-span-9">
                  <h3 className="wr-title t-h2">
                    <span className={w.href ? "shift" : "inline-block"}>{w.title}</span>
                  </h3>
                </div>
                <span className="t-small col-span-12 text-mute md:col-span-2 md:col-start-10 md:text-right">
                  {w.href ? w.tag : "Coming soon"}
                </span>
                {w.href && (
                  <span
                    aria-hidden
                    className="t-h3 col-span-1 col-start-12 hidden justify-self-end transition-transform duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 md:block"
                  >
                    ↗
                  </span>
                )}
              </div>
            );
            return (
              <li key={w.title} className={`wr-row relative ${w.href ? "dim-item shift-host group" : ""}`}>
                <span aria-hidden className="wr-rule absolute inset-x-0 top-0 h-px origin-left bg-hair" />
                {w.href ? (
                  <a href={w.href} className="block">
                    {inner}
                  </a>
                ) : (
                  <div>{inner}</div>
                )}
              </li>
            );
          })}
          <li aria-hidden className="h-px bg-hair" />
        </ul>
      </div>
    </section>
  );
}
