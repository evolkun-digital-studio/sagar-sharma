import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "./core";
import { ChapterMark } from "./Chapter";
import { journey } from "./data";

registerGsap();

const YEARS = [2012, 2016, 2019, 2023, new Date().getFullYear()];

/** Four rolling digit columns, like a mechanical counter. */
function Odometer({ value }: { value: number }) {
  const digits = String(value).split("").map(Number);
  return (
    <div className="odo display flex text-[clamp(96px,17vw,280px)] leading-none tabular-nums" aria-label={String(value)} role="img">
      {digits.map((d, i) => (
        <span key={i} className="relative inline-block h-[1em] overflow-hidden" aria-hidden>
          <span className="odo-strip flex flex-col" data-digit={d} style={{ transform: `translateY(${-d * 10}%)` }}>
            {Array.from({ length: 10 }, (_, k) => (
              <span key={k} className="block h-[1em] leading-none">
                {k}
              </span>
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = prefersReducedMotion();

      const roll = (i: number) => {
        setActive(i);
        const target = String(YEARS[i]).split("").map(Number);
        q(".odo-strip").forEach((strip, k) => {
          gsap.to(strip, {
            yPercent: -target[k] * 10,
            duration: reduce ? 0 : 1.5,
            delay: reduce ? 0 : k * 0.07,
            ease: "expo.inOut",
            overwrite: true,
          });
        });
      };
      // strips start positioned by inline transform; hand control to GSAP
      q(".odo-strip").forEach((s) => {
        const d = Number((s as HTMLElement).dataset.digit);
        gsap.set(s, { clearProps: "transform" });
        gsap.set(s, { yPercent: -d * 10 });
      });

      q(".jr-entry").forEach((entry, i) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => roll(i),
          onEnterBack: () => roll(i),
        });
        if (!reduce) {
          gsap.from(entry.querySelectorAll(".jr-in"), {
            y: 36,
            autoAlpha: 0,
            duration: 1.3,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: entry, start: "top 75%" },
          });
        }
      });

      if (!reduce) {
        gsap.fromTo(
          q(".jr-progress"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".jr-list")[0], start: "top 55%", end: "bottom 55%", scrub: true } },
        );
      }
    },
    { scope: root },
  );

  return (
    <section ref={root} id="journey" className="relative bg-bone px-5 pt-24 pb-20 text-film md:px-[5vw] md:pt-32 md:pb-32">
      <ChapterMark n="III" label="Journey" />

      <div className="mt-14 grid grid-cols-1 md:mt-24 md:grid-cols-12 md:gap-8">
        <div className="sticky top-0 z-10 -mx-5 bg-bone px-5 pt-16 pb-5 md:static md:col-span-6 md:mx-0 md:bg-transparent md:p-0">
          <div className="md:sticky md:top-[16svh]">
            <Odometer value={YEARS[0]} />
            <div className="mt-4 flex items-center gap-4 text-[13px] text-ash md:mt-8">
              <span className="tabular-nums text-film">
                {String(active + 1).padStart(2, "0")} / {String(journey.length).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-rule" />
              <span>{journey[active].yearsLong}</span>
            </div>
          </div>
        </div>

        <div className="jr-list relative md:col-span-5 md:col-start-8">
          <span className="absolute top-0 bottom-0 left-0 hidden w-px bg-rule md:block">
            <span className="jr-progress absolute inset-0 origin-top bg-film" />
          </span>
          {journey.map((j, i) => (
            <article
              key={j.kicker}
              className={`jr-entry flex min-h-[64svh] flex-col justify-center border-t border-rule py-14 transition-opacity duration-700 md:min-h-[78svh] md:border-t-0 md:pl-12 ${
                active === i ? "opacity-100" : "md:opacity-35"
              }`}
            >
              <p className="jr-in text-[13px] text-ash">{j.yearsLong}</p>
            <h3 className="jr-in serif mt-4 text-[clamp(32px,3vw,48px)] leading-[1.04]">{j.kicker}</h3>
              <p className="jr-in mt-5 text-[15px] text-film">
                {j.role}
                {j.org && <span className="text-ash">, {j.org}</span>}
              </p>
              <p className="jr-in mt-4 max-w-[46ch] text-[15px] leading-[1.72] text-ash">{j.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
