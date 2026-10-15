import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger, registerGsap, NO_REDUCE } from "./core";
import { ChapterMark } from "./Chapter";
import { principles } from "./data";

registerGsap();

const pad = (n: number) => String(n).padStart(2, "0");
/** timeline units: hold on the first principle, then a 2-unit step per change */
const HOLD = 1;
const STEP = 2;
const SWAP = 0.6; // when the incoming lines start rising, inside a step

/** Six principles, shown one at a time, pinned. */
export function Principles() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const sec = root.current!;
      const q = gsap.utils.selector(sec);
      const mm = gsap.matchMedia();

      mm.add(NO_REDUCE, () => {
        sec.classList.add("is-pinned");
        const items = q(".pr-item");
        const n = items.length;
        const total = HOLD + (n - 1) * STEP + 1;
        let tl: gsap.core.Timeline | null = null;
        let splits: SplitText[] = [];
        let dead = false;
        let current = 0;

        // pin synchronously so later sections measure the right spacing;
        // the line splits (which wait for fonts) are driven from its progress
        const st = ScrollTrigger.create({
          trigger: sec,
          start: "top top",
          end: () => `+=${window.innerHeight * n * 0.8}`,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!tl) return;
            gsap.to(tl, { progress: self.progress, duration: 0.5, ease: "none", overwrite: true });
            const t = self.progress * total;
            const idx = Math.min(n - 1, Math.max(0, Math.floor((t - HOLD - SWAP) / STEP) + 1));
            if (idx !== current) {
              current = idx;
              setActive(idx);
            }
          },
        });

        document.fonts.ready.then(() => {
          if (dead) return;
          splits = items.map((item) =>
            SplitText.create(item.querySelector("p")!, { type: "lines", mask: "lines", linesClass: "split-line" }),
          );
          items.forEach((item, i) => {
            gsap.set(item, { autoAlpha: 1 });
            if (i > 0) gsap.set(splits[i].lines, { yPercent: 125 });
          });
          tl = gsap.timeline({ paused: true, defaults: { ease: "power1.inOut" } });
          for (let i = 0; i < n - 1; i++) {
            const at = HOLD + i * STEP;
            tl.to(splits[i].lines, { yPercent: -125, duration: 0.8, stagger: 0.06 }, at).fromTo(
              splits[i + 1].lines,
              { yPercent: 125 },
              { yPercent: 0, duration: 0.8, stagger: 0.06 },
              at + SWAP,
            );
          }
          tl.to({}, { duration: 1 });
          tl.progress(st.progress);
          ScrollTrigger.refresh();
        });

        return () => {
          dead = true;
          st.kill();
          tl?.kill();
          splits.forEach((s) => s.revert());
          gsap.set(items, { clearProps: "visibility" });
          sec.classList.remove("is-pinned");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="principles" className="surface-ink relative overflow-hidden">
      <style>{`
        #principles.is-pinned { height: 100svh; }
        #principles.is-pinned .pr-stack { position: relative; flex: 1; margin: 0; padding: 0; }
        #principles.is-pinned .pr-text { font-size: var(--t-h1); line-height: 0.98; letter-spacing: -0.04em; max-width: 18ch; }
        #principles.is-pinned .pr-item { position: absolute; inset: 0; display: flex; align-items: center; }
        #principles.is-pinned .pr-item:not(:first-child) { visibility: hidden; }
        #principles.is-pinned .pr-bar { display: flex; }
      `}</style>

      <div className="wrap flex h-full flex-col pt-24 pb-8 md:pt-28 md:pb-10">
        <ChapterMark label="Principles" />

        <ol className="pr-stack mt-14 space-y-10 pb-24 md:space-y-14">
          {principles.map((p) => (
            <li key={p} className="pr-item w-full">
              <div className="grid-12 w-full">
                <p className="pr-text t-h2 col-span-12 md:col-span-9 md:col-start-2">{p}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="pr-bar t-small hidden items-center justify-between gap-6 text-mist-mute">
          <span>Leadership philosophy</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" aria-hidden>
              {principles.map((_, i) => (
                <span
                  key={i}
                  className={`block h-px w-3 transition-colors sm:w-6 duration-500 ${
                    i === active ? "bg-signal" : i < active ? "bg-mist-mute" : "bg-hair-dark"
                  }`}
                />
              ))}
            </div>
            <span className="t-mono whitespace-nowrap" aria-live="polite">
              {pad(active + 1)} / {pad(principles.length)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
