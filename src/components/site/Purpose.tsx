import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import stillUrl from "@/assets/sagar-still.webp";
import { gsap, SplitText, registerGsap, revealLines, NO_REDUCE } from "./core";
import { RevealLines } from "./Chapter";

registerGsap();

export function Purpose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);

        // the still opens from a narrow slit to the full frame
        gsap
          .timeline({
            scrollTrigger: { trigger: q(".still"), start: "top 95%", end: "center 55%", scrub: 1 },
          })
          .fromTo(
            q(".still"),
            { clipPath: "inset(46% 22% 46% 22%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none" },
            0,
          )
          .fromTo(q(".still img"), { scale: 1.25 }, { scale: 1.05, ease: "none" }, 0);
        gsap.to(q(".still img"), {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: q(".still"),
            start: "center 55%",
            end: "bottom top",
            scrub: true,
          },
        });
        const stopSub = revealLines(q(".still-sub")[0] as HTMLElement, {
          start: "top 72%",
          duration: 1.2,
        });

        // reading scrub on the statement paragraph
        let split: SplitText | null = null;
        let dead = false;
        document.fonts.ready.then(() => {
          if (dead) return;
          split = SplitText.create(q(".scrub"), { type: "words" });
          gsap.fromTo(
            split.words,
            { opacity: 0.15 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: q(".scrub"),
                start: "top 80%",
                end: "bottom 55%",
                scrub: true,
              },
            },
          );
        });
        return () => {
          dead = true;
          stopSub();
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="purpose" className="surface-paper section-pad relative">
      <div className="wrap">
        <RevealLines as="h3" className="t-h1 mx-auto max-w-[24ch] text-center text-balance">
          Technology should never exist for its own sake.
        </RevealLines>

        <figure className="still relative mt-20 aspect-[4/3] overflow-hidden bg-ink sm:aspect-[21/9] md:mt-32">
          <img
            src={stillUrl}
            alt="Sagar Sharma at his desk, city skyline through the window behind him"
            className="h-full w-full object-cover object-[62%_50%]"
            style={{ filter: "saturate(0.85)" }}
            loading="lazy"
          />
          <figcaption className="absolute inset-x-0 bottom-[7%] px-5 text-center text-[15px] leading-snug text-mist">
            <span className="still-sub inline-block">
              “Design for the decade, not the quarter.”
            </span>
          </figcaption>
        </figure>

        <div className="grid-12 mt-24 gap-y-14 md:mt-36">
          <p className="scrub t-h2 col-span-12 font-normal md:col-span-8">
            Technology should solve business problems. Every system should reduce complexity. Every
            architecture should support growth. Every decision should create long-term value.
          </p>
          {/* <div className="col-span-12 space-y-6 text-[15px] leading-[1.7] text-graphite md:col-span-3 md:col-start-10 md:pt-3">
            <p>
              For over a decade I've helped organizations build scalable architecture, enterprise
              software, AI systems and secure digital infrastructure that enables long-term growth.
            </p>
            <p>
              The organizations that endure are not the ones with the most sophisticated stack. They
              are the ones whose technology choices stay coherent as the business evolves.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}
