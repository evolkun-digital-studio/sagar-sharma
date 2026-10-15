import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger, registerGsap, scrollToTarget } from "./core";
import { principles } from "./data";

registerGsap();

/**
 * Leadership principles as a pinned, full-screen film sequence.
 * Each principle owns a photograph; scrolling wipes the next shot up from the bottom
 * while the current one pushes in, and the text lines cut out and in through masks.
 * Without motion it renders as a plain stack of full-screen slides.
 *
 * Photography — free under the Unsplash License (no attribution required; credits kept here).
 * For production, download each (≈2400px) into src/assets/principles/ and swap to imports.
 *   01 Circuit board macro — Vishnu Mohanan           unsplash.com/photos/pfR18JNEMv8
 *   02 High-rises from below — Jason Mavrommatis      unsplash.com/photos/u2fjgmZfgGQ
 *   03 Woman before a large screen — Chris Yang       unsplash.com/photos/h54xsHoAj8k
 *   04 Machine cutting metal, sparks — Cemrecan Yurtman unsplash.com/photos/thdb7o0nLyc
 *   05 City at night from above — Polina Kuzovkova    unsplash.com/photos/zd8v_Ig3ndg
 */
const PHOTOS = [
  { id: "photo-1592659762303-90081d34b277", alt: "Close-up of a dark circuit board" },
  { id: "photo-1526024810354-94dffa336fc6", alt: "High-rise buildings seen from street level" },
  { id: "photo-1568560750703-48defd62fc19", alt: "A person standing in front of a large screen" },
  { id: "photo-1735494033576-9c882e80504c", alt: "A machine cutting metal in a shower of sparks" },
  { id: "photo-1603793510575-a8cf24361baa", alt: "A city at night seen from above" },
];

const img = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=entropy&w=${w}&h=${h}&q=70`;
const wide = (id: string) =>
  [
    [1280, 720],
    [1920, 1080],
    [2560, 1440],
  ]
    .map(([w, h]) => `${img(id, w, h)} ${w}w`)
    .join(", ");
const tall = (id: string) =>
  [
    [750, 1334],
    [1080, 1920],
  ]
    .map(([w, h]) => `${img(id, w, h)} ${w}w`)
    .join(", ");

// timeline layout (in timeline seconds): hold, then one 1s cut every STEP
const HOLD = 0.6;
const STEP = 1.6;
const CUT = 1;
const GRADE = "[filter:grayscale(1)_contrast(1.12)_brightness(0.58)]";
const pad = (n: number) => String(n).padStart(2, "0");

export function Principles() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const jumpTo = useRef<(i: number) => void>(() => {});
  const n = principles.length;

  useGSAP(
    () => {
      const sec = root.current!;
      const q = gsap.utils.selector(sec);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sec.classList.add("is-pinned");
        const slides = q(".pr-slide") as HTMLElement[];
        const pics = q(".pr-img") as HTMLElement[];
        const fills = q(".pr-fill") as HTMLElement[];
        const splits = (q(".pr-text") as HTMLElement[]).map((el) =>
          SplitText.create(el, { type: "lines", mask: "lines" }),
        );

        // initial frame: first shot visible, the rest waiting below their clip
        gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(pics, { scale: 1.05 });
        splits.slice(1).forEach((s) => gsap.set(s.lines, { yPercent: 110 }));

        const total = HOLD + (n - 2) * STEP + CUT + HOLD;
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${window.innerHeight * n * 0.9}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const t = self.progress * total;
              let k = 0;
              for (let i = 0; i < n - 1; i++) if (t >= HOLD + i * STEP + CUT / 2) k = i + 1;
              setIdx(k);
              fills.forEach((f, i) => {
                const start = i === 0 ? 0 : HOLD + (i - 1) * STEP;
                const end = i === n - 1 ? total : HOLD + i * STEP + CUT;
                gsap.set(f, { scaleX: gsap.utils.clamp(0, 1, (t - start) / (end - start)) });
              });
            },
          },
        });

        for (let i = 0; i < n - 1; i++) {
          const at = HOLD + i * STEP;
          tl.to(slides[i + 1], { clipPath: "inset(0% 0% 0% 0%)", duration: CUT }, at)
            .fromTo(
              pics[i + 1],
              { scale: 1.25 },
              { scale: 1.05, duration: CUT, ease: "power3.out" },
              at,
            )
            .to(pics[i], { scale: 1.14, duration: CUT }, at)
            .to(
              splits[i].lines,
              { yPercent: -110, duration: 0.5, stagger: 0.04, ease: "power3.in" },
              at,
            )
            .to(
              splits[i + 1].lines,
              { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "expo.out" },
              at + 0.45,
            );
        }
        tl.to({}, { duration: HOLD });

        // index links scroll to the moment each shot has fully landed
        jumpTo.current = (i: number) => {
          const st = tl.scrollTrigger as ScrollTrigger;
          const t = i === 0 ? 0 : HOLD + (i - 1) * STEP + CUT + 0.05;
          scrollToTarget(st.start + (st.end - st.start) * (t / total));
        };

        return () => {
          splits.forEach((s) => s.revert());
          sec.classList.remove("is-pinned");
          jumpTo.current = () => {};
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="principles"
      aria-label="Leadership philosophy"
      className="relative overflow-hidden bg-[#0e0f11] text-[#ededea]"
    >
      <style>{`
        #principles.is-pinned { height: 100svh; }
        #principles.is-pinned .pr-stage { position: absolute; inset: 0; }
        #principles.is-pinned .pr-slide { position: absolute; inset: 0; min-height: 0; }
        #principles.is-pinned .pr-hud { display: flex; }
        #principles.is-pinned .pr-num { display: none; }
      `}</style>

      {/* ── slides: a plain stack without motion, a stacked film when pinned ── */}
      <ol className="pr-stage">
        {principles.map((p, i) => {
          const photo = PHOTOS[i % PHOTOS.length];
          return (
            <li key={p} className="pr-slide relative min-h-[100svh] overflow-hidden bg-[#0e0f11]">
              <picture>
                <source media="(min-width: 768px)" srcSet={wide(photo.id)} sizes="100vw" />
                <img
                  className={`pr-img absolute inset-0 h-full w-full object-cover will-change-transform ${GRADE}`}
                  src={img(photo.id, 1080, 1920)}
                  srcSet={tall(photo.id)}
                  sizes="100vw"
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              {/* legibility: floor + left falloff */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,17,.92)_0%,rgba(14,15,17,.35)_45%,rgba(14,15,17,.1)_100%)] md:bg-[linear-gradient(to_right,rgba(14,15,17,.85)_0%,rgba(14,15,17,.35)_55%,rgba(14,15,17,.15)_100%)]"
              />

              <div className="absolute inset-x-0 bottom-0 px-5 pb-28 md:px-[5vw] md:pb-[14svh]">
                <p className="pr-num mb-6 font-mono text-[13px] tabular-nums text-[#9a9fa7] md:mb-8">
                  {pad(i + 1)} / {pad(n)}
                </p>
                <p className="pr-text max-w-[20ch] text-[38px] leading-[1.08] font-semibold tracking-[-0.025em] md:text-[48px] xl:text-[64px] text-balance">
                  {p}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* ── heads-up display, only while pinned ── */}
      <div className="pr-hud pointer-events-none absolute inset-0 z-10 hidden flex-col justify-between px-5 pt-24 pb-8 md:px-[5vw] md:pt-28 md:pb-10">
        <div className="flex items-center justify-between gap-6 text-[14px]">
          <h2 className="text-[#9a9fa7]">Leadership philosophy</h2>
          {/* <span className="font-mono text-[13px] tabular-nums text-[#ededea]" aria-live="polite">
              {pad(idx + 1)} / {pad(n)}
            </span> */}
        </div>

        <div className="flex items-end justify-between gap-10">
          {/* progress: one segment per principle */}
          <div className="flex w-full max-w-[420px] gap-1.5" aria-hidden>
            {principles.map((p) => (
              <span
                key={p}
                className="relative h-[2px] flex-1 overflow-hidden bg-[rgba(237,237,234,0.18)]"
              >
                <span
                  className="pr-fill absolute inset-0 origin-left scale-x-0"
                  style={{ background: "#FFF" }}
                />
              </span>
            ))}
          </div>

          {/* index: jump to any principle */}
          <ol className="pointer-events-auto hidden max-w-[340px] space-y-1.5 text-right text-[15px] lg:block">
            {principles.map((p, i) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => jumpTo.current(i)}
                  className={`transition-colors duration-500 hover:text-[#ededea] ${
                    i === idx ? "text-[#ededea]" : "text-[#9a9fa7]/70"
                  }`}
                >
                  {p}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
