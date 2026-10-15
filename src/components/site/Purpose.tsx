import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import stillUrl from "@/assets/sagar-sharma.jpeg"; 
import { gsap, registerGsap, NO_REDUCE } from "./core"; 

registerGsap();

/**
 * PURPOSE — a two-act editorial chapter.
 * Act 1: a quiet split-screen portrait becomes a full-bleed image on scroll.
 * Act 2: a concise, readable statement on a warm paper canvas.
 * The desktop film sequence is progressive enhancement: mobile and
 * reduced-motion layouts remain legible without pinned scrolling.
 */
export function Purpose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      // Subtle typography reveals across breakpoints.
      mm.add(NO_REDUCE, () => {
        const lines = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll("[data-purpose-line]"),
        );
        const details = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll("[data-purpose-detail]"),
        );

        gsap.from(lines, {
          yPercent: 110,
          stagger: 0.085,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.querySelector("[data-purpose-frame]"),
            start: "top 82%",
            once: true,
          },
        });

        gsap.from(details, {
          autoAlpha: 0,
          y: 34,
          stagger: 0.14,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section.querySelector("[data-purpose-after]"),
            start: "top 76%",
            once: true,
          },
        });
      });

      // On desktop, the still expands into a cinematic full-screen canvas.
      // CSS sticky provides the pinning, avoiding a second GSAP pin spacer.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const scene = section.querySelector<HTMLElement>("[data-purpose-scene]");
        const imageFrame = section.querySelector<HTMLElement>("[data-purpose-photo]");
        const image = section.querySelector<HTMLElement>("[data-purpose-image]");
        const intro = section.querySelector<HTMLElement>("[data-purpose-intro]");
        const quote = section.querySelector<HTMLElement>("[data-purpose-quote]");

        if (!scene || !imageFrame || !image || !intro || !quote) return;

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(image, { scale: 1.13 }, { scale: 1, duration: 1 }, 0)
          .to(
            imageFrame,
            {
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              duration: 1,
            },
            0,
          )
          .to(
            intro,
            {
              autoAlpha: 0,
              yPercent: -12,
              duration: 0.28,
            },
            0.17,
          )
          .fromTo(
            quote,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.26,
              ease: "power2.out",
            },
            0.67,
          );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="purpose"
      aria-labelledby="purpose-heading"
      className="relative isolate overflow-clip bg-[#E7E9EC] text-[#181A18]"
    >
      {/* ACT I — The image slowly takes over the entire viewport. */}
      <div data-purpose-scene className="relative lg:h-[225svh]">
        <div
          data-purpose-frame
          className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#161916] text-[#F5F4EE] lg:sticky lg:top-0 lg:block lg:h-[100svh]"
        >
          <div
            data-purpose-intro
            className="relative z-20 w-full px-6 pt-28 pb-1 sm:px-10 sm:pt-36 lg:absolute lg:top-[20%] lg:left-[6.5%] lg:w-[72%] lg:p-0"
          >
           
            <h2
              id="purpose-heading"
              className="font-sans text-[clamp(1.5rem,5vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[clamp(1.75rem,4vw,2.5rem)] lg:text-[clamp(2rem,2.8vw,3.25rem)]"
            >
              <span className="block overflow-hidden pb-[0.07em]">
                <span data-purpose-line className="block whitespace-nowrap">
                  Technology
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.07em]">
                <span data-purpose-line className="block whitespace-nowrap">
                  isn&apos;t the point.
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.15em]">
                <span
                  data-purpose-line
                  className="block whitespace-nowrap font-semibold text-[#B8BFB3]"
                >
                  Progress is.
                </span>
              </span>
            </h2>

            <p className="mt-8 max-w-[32ch] text-[14px] leading-[1.75] text-[#B9BEB5] sm:mt-10 sm:text-[15px] lg:mt-9">
              Technology should never exist for its own sake. It should make the complicated feel
              clear, and what comes next possible.
            </p>
          </div>

          <figure
            data-purpose-photo
            className="relative z-10 mt-16 h-[66svh] w-full shrink-0 overflow-hidden bg-[#242925] sm:mt-20 sm:h-[75svh] lg:absolute lg:top-[10%] lg:right-[5.25%] lg:mt-0 lg:h-[80%] lg:w-[41%]"
          >
            <img
              data-purpose-image
              src={stillUrl}
              alt="Sagar Sharma presenting on stage at a technology conference"
              className="h-full w-full object-cover object-[56%_50%]"
              style={{ filter: "saturate(0.85) contrast(1.04)" }}
              loading="lazy"
              decoding="async"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0D0B]/85 via-[#0A0D0B]/15 to-transparent"
            />

            <figcaption
              data-purpose-quote
              className="absolute inset-x-0 bottom-0 z-10 px-6 pb-1 pt-5 text-[#F5F4EE] sm:px-10 sm:pb-14 lg:px-[8%] lg:pb-[3%] lg:motion-safe:opacity-0"
            >
              <p className="max-w-[44ch] font-sans text-[clamp(1.125rem,1.8vw,1.75rem)] font-semibold leading-[1.3] tracking-[-0.015em] ">
                “Design for the decade, not the quarter.”
              </p>
              <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.22em] text-[#D5D7D0] sm:mt-8 sm:text-[11px]">
                Sagar Sharma 
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ACT II — A quiet editorial landing after the photographic reveal. */}
      <div
        data-purpose-after
        className="mx-auto max-w-[1680px] px-6 py-16 sm:px-10 sm:py-20 lg:px-[6.5%] lg:py-[clamp(72px,7vw,112px)]"
      >
        <div className="grid grid-cols-1 gap-8 pt-10 sm:pt-12 lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:pt-14">
          <h3
            data-purpose-detail
            className="text-[clamp(1.375rem,2.2vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.02em] lg:col-span-7"
          >
            Less complexity.
            <br />
            More possibility.
            <br />
            <span className="text-[#8A9084]">Built to last.</span>
          </h3>

          <p
            data-purpose-detail
            className="max-w-[40ch] text-[15px] leading-[1.7] text-[#555A53] sm:text-[16px] lg:col-span-4 lg:col-start-9 lg:pb-[0.4em]"
          >
            Technology should solve business problems. Every system should reduce complexity. Every
            architecture should support growth. Every decision should create long-term value.
          </p>
        </div>
      </div>
    </section>
  );
}
