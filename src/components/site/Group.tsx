import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE, isFinePointer } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { focusAreas, industries } from "./data";

registerGsap();

/**
 * Photography — free under the Unsplash License (no attribution required; credits kept here).
 * For production, download each photo (~1600px wide), save to src/assets/group/ and swap
 * the `src` strings for imports so the site doesn't depend on a third-party CDN.
 *   Technology  · Server racks in a data center — imgix          unsplash.com/photos/klWUhr-wPJ8
 *   Gaming      · LAN arena, 1337Camp — Ella Don                  unsplash.com/photos/GVbd5btrqeA
 *   Real Estate · Geometric facade, Tirana — Aldo Vukaj           unsplash.com/photos/w-nBFVS928I
 *   Textile     · Stacked fabric rolls — Bernd Dittrich           unsplash.com/photos/rEb9iHOF638
 *   Beverages   · Bottles on a conveyor — Seyed A. M. Tabatabaee  unsplash.com/photos/LEbJ9opJeik
 */
const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

const PHOTOS: Record<string, { id: string; alt: string; focus?: string }> = {
  Technology: {
    id: "photo-1506399558188-acca6f8cbf41",
    alt: "Rows of server racks in a data center",
  },
  Gaming: {
    id: "photo-1633545495735-25df17fb9f31",
    alt: "A gaming arena with rows of desks and chairs",
  },
  "Real Estate": {
    id: "photo-1774276982082-629a21fc321e",
    alt: "A modern building with a geometric facade",
  },
  Textile: { id: "photo-1771098206650-81d713e2e2b9", alt: "Stacked rolls of fabric" },
  Beverages: {
    id: "photo-1780145180040-0beda1df60e6",
    alt: "Bottles moving along a factory conveyor belt",
  },
};

const srcSet = (id: string) => [640, 1080, 1600].map((w) => `${UNSPLASH(id, w)} ${w}w`).join(", ");

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const SIGNAL = { background: "var(--signal, #E5534B)" };

export function Group() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);

        // panels rise in one after another, then the foundation settles
        gsap
          .timeline({ scrollTrigger: { trigger: q(".gp-stage")[0], start: "top 80%" } })
          .from(q(".gp-panel"), {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.4,
            stagger: 0.09,
            ease: "expo.out",
          })
          .from(
            q(".gp-rule"),
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.4,
              stagger: 0.1,
              ease: "expo.inOut",
            },
            0.4,
          )
          .from(
            q(".gp-base-item"),
            { y: 14, autoAlpha: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" },
            0.8,
          );

        // mobile carousel cards
        gsap.from(q(".gp-card"), {
          y: 40,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".gp-rail")[0], start: "top 85%" },
        });

        // the open photo drifts gently under the pointer
        if (isFinePointer()) {
          const panels = q(".gp-panel") as HTMLElement[];
          const offs = panels.map((panel) => {
            const drift = panel.querySelector<HTMLElement>(".gp-drift")!;
            const xTo = gsap.quickTo(drift, "x", { duration: 1.4, ease: "power3" });
            const yTo = gsap.quickTo(drift, "y", { duration: 1.4, ease: "power3" });
            const move = (e: PointerEvent) => {
              const r = panel.getBoundingClientRect();
              xTo(((e.clientX - r.left) / r.width - 0.5) * -24);
              yTo(((e.clientY - r.top) / r.height - 0.5) * -16);
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };
            panel.addEventListener("pointermove", move);
            panel.addEventListener("pointerleave", leave);
            return () => {
              panel.removeEventListener("pointermove", move);
              panel.removeEventListener("pointerleave", leave);
            };
          });
          return () => offs.forEach((off) => off());
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="group" className="surface-white section-pad relative">
      <div className="wrap"> 

        <div className="grid-12 mt-14 gap-y-10 md:mt-20">
          <RevealLines as="h3" className="t-h1 col-span-12 max-w-[22ch] md:col-span-8">
            One architecture across five industries.
          </RevealLines>
          <p className="col-span-12 max-w-[38ch] self-end text-[15px] leading-[1.7] text-graphite md:col-span-3 md:col-start-10">
            As Chief Technology Officer of SR18 Group, I lead technology strategy for every business
            in the group: enterprise architecture, cybersecurity, AI and digital transformation,
            held to one standard.
          </p>
        </div>

        {/* ───────────── desktop: image accordion ───────────── */}
        <div className="gp-stage mt-24 hidden xl:block">
          <ul
            className="flex h-[clamp(520px,72svh,760px)] gap-2"
            aria-label="SR18 Group businesses"
          >
            {industries.map((ind, i) => {
              const on = i === active;
              const photo = PHOTOS[ind.name];
              return (
                <li
                  key={ind.name}
                  className="gp-panel relative min-w-0 basis-0 overflow-hidden bg-[#16181b]"
                  style={{
                    flexGrow: on ? 4.2 : 1,
                    transition: "flex-grow 1s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  {/* photo: drift wrapper (GSAP) → img (CSS grade + zoom) */}
                  {photo && (
                    <div className="gp-drift absolute -inset-4">
                      <img
                        src={UNSPLASH(photo.id, 1080)}
                        srcSet={srcSet(photo.id)}
                        sizes="(min-width: 1280px) 60vw, 100vw"
                        alt={photo.alt}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-cover transition-[filter,scale] duration-[1200ms] ${EASE} ${
                          on
                            ? "scale-100 [filter:grayscale(0.1)_brightness(0.82)_contrast(1.05)]"
                            : "scale-110 [filter:grayscale(1)_brightness(0.42)_contrast(1.1)]"
                        }`}
                      />
                    </div>
                  )}
                  {/* legibility */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e0f11] via-[#0e0f11]/35 to-transparent"
                  />

                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`gp-desc-${i}`}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="absolute inset-0 flex flex-col justify-end p-7 text-left"
                  >
                    {/* collapsed: vertical name */}
                    <span
                      aria-hidden={on}
                      className={`absolute bottom-7 left-6 text-[clamp(16px,1.2vw,20px)] font-semibold tracking-[0] whitespace-nowrap text-mist [writing-mode:vertical-rl] rotate-180 transition-opacity duration-500 ${
                        on ? "opacity-0" : "opacity-100 delay-300"
                      }`}
                    >
                      {ind.name}
                    </span>

                    {/* open: name + description */}
                    <span
                      className={`block w-[min(36ch,100%)] transition-[opacity,translate] duration-700 ${EASE} ${
                        on
                          ? "translate-y-0 opacity-100 delay-300"
                          : "pointer-events-none translate-y-4 opacity-0"
                      }`}
                    >
                      <span className="t-h2 block whitespace-nowrap text-mist">{ind.name}</span>
                      <span
                        id={`gp-desc-${i}`}
                        className="mt-4 block w-[36ch] text-[15px] leading-[1.65] text-mist/80"
                      >
                        {ind.body}
                      </span>
                    </span>
                  </button>

                  {/* open marker */}
                  <span
                    aria-hidden
                    style={SIGNAL}
                    className={`absolute inset-x-0 bottom-0 h-[2px] origin-left transition-transform duration-700 ${EASE} ${
                      on ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* the shared foundation every business stands on */}
        </div>

        {/* ───────────── tablet / mobile: swipe carousel ───────────── */}
        <div className="mt-16 xl:hidden">
          <ul
            className="gp-rail -mx-[max(20px,5vw)] flex snap-x snap-mandatory scroll-px-[max(20px,5vw)] gap-3 overflow-x-auto px-[max(20px,5vw)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="SR18 Group businesses"
          >
            {industries.map((ind) => {
              const photo = PHOTOS[ind.name];
              return (
                <li
                  key={ind.name}
                  className="gp-card relative aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden bg-[#16181b] sm:w-[44vw]"
                >
                  {photo && (
                    <img
                      src={UNSPLASH(photo.id, 800)}
                      srcSet={srcSet(photo.id)}
                      sizes="(min-width: 640px) 44vw, 78vw"
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover [filter:grayscale(0.2)_brightness(0.7)_contrast(1.05)]"
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#0e0f11] via-[#0e0f11]/40 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h4 className="t-h2 text-mist">{ind.name}</h4>
                    <p className="mt-3 max-w-[34ch] text-[15px] leading-[1.6] text-mist/80">
                      {ind.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[13px] text-mute" aria-hidden>
            Swipe to see all five
          </p>

          <div className="mt-12 border-y border-hair py-8">
            <p className="text-[14px] text-mute">Shared foundation</p>
            <ul
              className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2"
              aria-label="Focus areas"
            >
              {focusAreas.map((f) => (
                <li key={f} className="text-[16px] leading-[1.4] text-ink">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
