import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, registerGsap, revealLines, NO_REDUCE } from "./core";
import { ChapterMark } from "./Chapter";
import { journey } from "./data";

registerGsap();

const YEARS = [2012, 2016, 2019, 2023, new Date().getFullYear()];
const pad = (n: number) => String(n).padStart(2, "0");

/** Four rolling digit columns, like a mechanical counter. */
function Odometer({ value }: { value: number }) {
  const digits = String(value).split("").map(Number);
  return (
    <div
      className="odo flex font-mono text-[72px] leading-none font-light tracking-normal tabular-nums md:text-[clamp(80px,13vw,200px)]"
      aria-label={String(value)}
      role="img"
    >
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
      const mm = gsap.matchMedia();

      // reduced motion: the counter jumps instead of rolling
      const roll = (i: number, instant: boolean) => {
        setActive(i);
        const target = String(YEARS[i]).split("").map(Number);
        q(".odo-strip").forEach((strip, k) => {
          gsap.to(strip, {
            yPercent: -target[k] * 10,
            duration: instant ? 0 : 1.4,
            delay: instant ? 0 : k * 0.07,
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

      const watch = (instant: boolean) => {
        q(".jr-entry").forEach((entry, i) => {
          ScrollTrigger.create({
            trigger: entry,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => roll(i, instant),
            onEnterBack: () => roll(i, instant),
          });
        });
      };

      mm.add(NO_REDUCE, () => {
        watch(false);
        const stops: Array<() => void> = [];
        q(".jr-entry").forEach((entry) => {
          entry.querySelectorAll<HTMLElement>(".jr-in").forEach((el, k) => {
            stops.push(revealLines(el, { start: "top 78%", delay: k * 0.07, duration: 1.2 }));
          });
        });
        gsap.fromTo(
          q(".jr-progress"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".jr-list")[0], start: "top 55%", end: "bottom 55%", scrub: true } },
        );
        return () => stops.forEach((s) => s());
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        watch(true);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="journey" className="surface-paper section-pad relative">
      <div className="wrap">
        <ChapterMark label="Journey" />

        <div className="grid-12 mt-14 md:mt-24">
          <div className="sticky top-0 z-10 col-span-12 -mx-(--gutter) bg-paper px-(--gutter) pt-16 pb-5 md:static md:col-span-6 md:mx-0 md:bg-transparent md:p-0">
            <div className="md:sticky md:top-[16svh]">
              <Odometer value={YEARS[0]} />
              <div className="mt-4 flex items-baseline gap-6 md:mt-6">
                <span className="t-small text-mute">{journey[active].yearsLong}</span>
                <span className="t-mono text-mute" aria-live="polite">
                  {pad(active + 1)} / {pad(journey.length)}
                </span>
              </div>
            </div>
          </div>

          <div className="jr-list relative col-span-12 md:col-span-5 md:col-start-8">
            <span aria-hidden className="absolute top-0 bottom-0 left-0 hidden w-px bg-hair md:block">
              <span className="jr-progress absolute inset-0 origin-top bg-ink" />
            </span>
            {journey.map((j, i) => (
              <article
                key={j.kicker}
                className={`jr-entry flex min-h-[56svh] flex-col justify-center border-t border-hair py-14 transition-opacity duration-700 md:min-h-[72svh] md:border-t-0 md:pl-12 ${
                  active === i ? "opacity-100" : "md:opacity-35"
                }`}
              >
                <p className="jr-in t-small text-mute">{j.yearsLong}</p>
                <h3 className="jr-in t-h2 mt-4">{j.kicker}</h3>
                <p className="jr-in mt-5 text-[17px] leading-[1.5]">
                  {j.role}
                  {j.org && <span className="text-graphite">, {j.org}</span>}
                </p>
                <p className="jr-in mt-4 max-w-[46ch] text-[17px] leading-[1.65] text-graphite">{j.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
