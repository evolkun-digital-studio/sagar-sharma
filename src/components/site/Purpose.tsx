
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import stillUrl from "@/assets/sagar-still.webp";
import { gsap, registerGsap } from "./core";

registerGsap();

export function Purpose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const track = section.querySelector<HTMLElement>(
        "[data-purpose-track]"
      );
      const intro = section.querySelector<HTMLElement>(
        "[data-purpose-intro]"
      );
      const frame = section.querySelector<HTMLElement>(
        "[data-purpose-frame]"
      );
      const image = section.querySelector<HTMLImageElement>(
        "[data-purpose-image]"
      );
      const quote = section.querySelector<HTMLElement>(
        "[data-purpose-quote]"
      );
      const closing = section.querySelector<HTMLElement>(
        "[data-purpose-closing]"
      );

      if (
        !track ||
        !intro ||
        !frame ||
        !image ||
        !quote ||
        !closing
      ) {
        return;
      }

      const mm = gsap.matchMedia();

      // Shared, understated typography animations.
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const lines = gsap.utils.toArray<HTMLElement>(
            "[data-purpose-line]",
            section
          );

          const closingTitle =
            closing.querySelector<HTMLElement>(
              "[data-closing-title]"
            );

          const principles = gsap.utils.toArray<HTMLElement>(
            "[data-purpose-principle]",
            closing
          );

          gsap.fromTo(
            lines,
            { yPercent: 108 },
            {
              yPercent: 0,
              duration: 1.25,
              stagger: 0.09,
              ease: "power4.out",
              scrollTrigger: {
                trigger: track,
                start: "top 85%",
                once: true,
              },
            }
          );

          if (closingTitle) {
            gsap.fromTo(
              closingTitle,
              {
                y: 48,
                autoAlpha: 0,
              },
              {
                y: 0,
                autoAlpha: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: closingTitle,
                  start: "top 85%",
                  once: true,
                },
              }
            );
          }

          principles.forEach((item) => {
            gsap.fromTo(
              item,
              {
                autoAlpha: 0,
                y: 25,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.95,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 90%",
                  once: true,
                },
              }
            );
          });
        }
      );

      // Desktop: image expands into the viewport.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(image, { scale: 1.12 });
          gsap.set(quote, {
            autoAlpha: 0,
            y: 25,
          });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1: let the introductory statement leave.
          timeline.to(
            intro,
            {
              autoAlpha: 0,
              yPercent: -9,
              duration: 0.25,
            },
            0.08
          );

          // Phase 2: expand photography from right to center.
          timeline.to(
            frame,
            {
              left: "3%",
              top: "6%",
              width: "94%",
              height: "88%",
              borderRadius: "3px",
              duration: 0.62,
            },
            0.25
          );

          timeline.to(
            image,
            {
              scale: 1.02,
              duration: 0.65,
            },
            0.25
          );

          // Phase 3: the quotation emerges in the full frame.
          timeline.to(
            quote,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.22,
              ease: "power2.out",
            },
            0.72
          );
        }
      );

      // Mobile: no sticky scene or artificial scroll distance.
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            frame,
            {
              clipPath: "inset(0% 0% 12% 0%)",
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top 90%",
                end: "top 40%",
                scrub: 0.8,
              },
            }
          );

          gsap.fromTo(
            image,
            { scale: 1.1 },
            {
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="purpose"
      className="relative isolate overflow-clip bg-[#F6F6F3] text-[#181917]"
    >
      {/* THE CINEMATIC CANVAS */}
      <div
        data-purpose-track
        className="relative lg:h-[215svh] lg:motion-reduce:h-svh"
      >
        <div className="relative isolate lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">

          {/* INTRODUCTORY TYPOGRAPHY */}
          <div
            data-purpose-intro
            className="
              relative z-10
              px-5 pt-28
              sm:px-10 sm:pt-36
              lg:absolute lg:left-[5.5%] lg:top-[21%]
              lg:w-[47%] lg:p-0
            "
          >
            <h2
              aria-label="Technology should never exist for its own sake."
              className="
                max-w-[15ch]
                text-[clamp(2.6rem,10.8vw,4.3rem)]
                font-normal
                leading-[1.015]
                tracking-[-0.065em]
                lg:max-w-none
                lg:text-[clamp(3.8rem,6.1vw,7.25rem)]
                lg:leading-[0.99]
              "
            >
              {[
                "Technology",
                "should never",
                "exist for its",
                "own sake.",
              ].map((line) => (
                <span
                  key={line}
                  className="block overflow-hidden pb-[0.07em]"
                  aria-hidden="true"
                >
                  <span
                    data-purpose-line
                    className="block"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <p
              className="
                mt-9 max-w-[30ch]
                text-[15px] leading-[1.7]
                tracking-[-0.012em]
                text-[#72746F]
                lg:mt-14 lg:text-[17px]
              "
            >
              The point isn&apos;t more technology.
              It&apos;s making what matters possible.
            </p>
          </div>

          {/* EXPANDING PHOTOGRAPH */}
          <figure
            data-purpose-frame
            className="
              relative isolate
              mx-5 mt-16
              aspect-[4/5]
              overflow-hidden rounded-[3px]
              bg-[#20221F]
              sm:mx-10 sm:aspect-[16/10]
              lg:absolute
              lg:left-[53%] lg:top-[16%]
              lg:m-0 lg:h-[70%] lg:w-[42%]
              lg:aspect-auto lg:rounded-[14px]
            "
          >
            <img
              data-purpose-image
              src={stillUrl}
              alt="Sagar Sharma working at his desk, overlooking the city"
              loading="lazy"
              decoding="async"
              className="
                absolute inset-0
                h-full w-full
                object-cover object-[62%_50%]
                will-change-transform
              "
              style={{
                filter:
                  "saturate(0.85) contrast(1.04)",
              }}
            />

            {/* Contrast only where the quote needs it. */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute inset-x-0 bottom-0
                h-[62%]
                bg-gradient-to-t
                from-black/65 via-black/20
                to-transparent
              "
            />

            {/* QUOTE BECOMES VISIBLE AS THE IMAGE EXPANDS */}
            <figcaption
              data-purpose-quote
              className="
                absolute bottom-[8%] left-[7%]
                z-10
                max-w-[82%]
                text-white
                lg:bottom-[10%] lg:left-[6%]
                lg:opacity-0
                lg:motion-reduce:opacity-100
              "
            >
              <p
                className="
                  max-w-[20ch]
                  text-[clamp(1.75rem,3.35vw,3.7rem)]
                  font-normal
                  leading-[1.12]
                  tracking-[-0.045em]
                  text-balance
                "
              >
                Design for the decade,
                <br />
                not the quarter.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* THE PHILOSOPHY / CLOSING COMPOSITION */}
      <div
        data-purpose-closing
        className="
          relative mx-auto
          max-w-[1600px]
          px-5 pb-32 pt-28
          sm:px-10
          md:pb-44 md:pt-40
          lg:px-[5.5%]
          lg:pb-56 lg:pt-48
        "
      >
        <div className="grid grid-cols-12 gap-x-8 gap-y-16">

          {/* The central belief */}
          <div className="col-span-12 lg:col-span-7">
            <h3
              data-closing-title
              className="
                max-w-[12ch]
                text-[clamp(2.9rem,6.1vw,6.9rem)]
                font-normal
                leading-[1.035]
                tracking-[-0.06em]
                text-balance
              "
            >
              Technology should solve{" "}
              <span className="text-[#9D9F99]">
                business problems.
              </span>
            </h3>
          </div>

          {/* Supporting beliefs */}
          <div
            className="
              col-span-12
              flex flex-col gap-11
              md:max-w-[30rem]
              lg:col-span-4 lg:col-start-9
              lg:gap-16 lg:pt-8
            "
          >
            <p
              data-purpose-principle
              className="
                max-w-[29ch]
                text-[clamp(19px,1.9vw,26px)]
                font-normal
                leading-[1.36]
                tracking-[-0.035em]
              "
            >
              Every system should reduce complexity.
            </p>

            <p
              data-purpose-principle
              className="
                max-w-[29ch]
                text-[clamp(19px,1.9vw,26px)]
                font-normal
                leading-[1.36]
                tracking-[-0.035em]
              "
            >
              Every architecture should support growth.
            </p>

            <p
              data-purpose-principle
              className="
                max-w-[29ch]
                text-[clamp(19px,1.9vw,26px)]
                font-normal
                leading-[1.36]
                tracking-[-0.035em]
              "
            >
              Every decision should create long-term value.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
