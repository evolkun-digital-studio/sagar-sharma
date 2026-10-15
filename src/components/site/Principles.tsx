import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "./core";
import { principles } from "./data";

registerGsap();

/** Six principles, shown one at a time like intertitles in a silent film. */
export function Principles() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const sec = root.current!;
      const q = gsap.utils.selector(sec);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sec.classList.add("is-pinned");
        const items = q(".pr-item");
        const n = items.length;
        gsap.set(items, { autoAlpha: 0 });
        gsap.set(items[0], { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { duration: 1, ease: "power2.inOut" },
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${window.innerHeight * Math.max(1, n - 1) * 0.85}`,
            pin: true,
            scrub: 1,
          },
        });
        // the first card resolves out of a blur as the section arrives
        gsap.from(items[0].firstElementChild, {
          filter: "blur(14px)",
          autoAlpha: 0,
          letterSpacing: "0.04em",
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: sec, start: "top 55%" },
        });
        for (let i = 0; i < n - 1; i++) {
          const at = 0.8 + i * 1.6 + 0.5;
          tl.to(items[i], { autoAlpha: 0, filter: "blur(14px)", yPercent: -12, letterSpacing: "0.03em" }, at).fromTo(
            items[i + 1],
            { autoAlpha: 0, filter: "blur(14px)", yPercent: 12, letterSpacing: "0.03em" },
            { autoAlpha: 1, filter: "blur(0px)", yPercent: 0, letterSpacing: "-0.02em" },
            at + 0.55,
          );
        }
        tl.to({}, { duration: 0.6 });

        return () => sec.classList.remove("is-pinned");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="principles" className="relative overflow-hidden bg-bone text-film">
      <style>{`
        #principles.is-pinned { height: 100svh; }
        #principles.is-pinned .pr-stack { position: relative; flex: 1; }
        #principles.is-pinned .pr-item { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; margin: 0; }
        #principles.is-pinned .pr-meta { display: flex; }
        #principles:not(.is-pinned) .pr-item { text-align: left; }
      `}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(36,41,46,.06) 0%, transparent 60%)" }}
      />

      <div className="relative flex h-full flex-col px-5 pt-24 pb-8 md:px-[5vw] md:pt-28 md:pb-10">
        <ol className="pr-stack mt-12 space-y-12">
          {principles.map((p) => (
            <li key={p} className="pr-item text-center">
              <p className="serif max-w-[16ch] text-[clamp(30px,4.4vw,68px)] leading-[1.06] italic">{p}</p>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}