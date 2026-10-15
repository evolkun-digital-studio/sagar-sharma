import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import stillUrl from "@/assets/sagar-still.webp";
import { gsap, SplitText, registerGsap, prefersReducedMotion } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";

registerGsap();

export function Purpose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // the still opens from a narrow slit to full letterbox
      gsap
        .timeline({ scrollTrigger: { trigger: q(".still"), start: "top 95%", end: "center 55%", scrub: 1 } })
        .fromTo(q(".still"), { clipPath: "inset(46% 22% 46% 22%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
        .fromTo(q(".still img"), { scale: 1.4 }, { scale: 1.05, ease: "none" }, 0);
      gsap.to(q(".still img"), {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: q(".still"), start: "center 55%", end: "bottom top", scrub: true },
      });
      gsap.from(q(".still-sub"), {
        autoAlpha: 0,
        filter: "blur(6px)",
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: q(".still"), start: "center 60%" },
      });

      // reading scrub on the manifesto paragraph
      let split: SplitText | null = null;
      document.fonts.ready.then(() => {
        split = SplitText.create(q(".scrub"), { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: q(".scrub"), start: "top 80%", end: "bottom 55%", scrub: true },
          },
        );
      });
      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="purpose" className="relative bg-bone px-5 pt-24 pb-32 text-film md:px-[5vw] md:pt-32 md:pb-48">
      <ChapterMark n="I" label="Purpose" />

      <RevealLines as="h3" className="display mt-16 max-w-[13ch] text-[clamp(42px,6.6vw,104px)] md:mt-24">
        Technology should never exist for its own sake.
      </RevealLines>

      <figure className="still relative mt-20 aspect-[4/3] overflow-hidden bg-film sm:aspect-[21/9] md:mt-32">
        <img
          src={stillUrl}
          alt="Sagar Sharma at his desk, city skyline through the window behind him"
          className="h-full w-full object-cover object-[62%_50%]"
          loading="lazy"
        />
        <figcaption className="still-sub serif absolute inset-x-0 bottom-[7%] text-center text-[clamp(15px,1.6vw,24px)] text-bone italic [text-shadow:0_1px_12px_rgba(0,0,0,.6)]">
          “Design for the decade, not the quarter.”
        </figcaption>
      </figure>

      <div className="mt-24 grid grid-cols-1 gap-14 md:mt-36 md:grid-cols-12">
        <p className="scrub serif text-[clamp(26px,2.8vw,46px)] leading-[1.14] md:col-span-8">
          Technology should solve business problems. Every system should reduce complexity. Every architecture should
          support growth. Every decision should create long-term value.
        </p>
        <div className="space-y-6 text-[15px] leading-[1.72] text-ash md:col-span-3 md:col-start-10 md:pt-3">
          <p>
            For over a decade I've helped organizations build scalable architecture, enterprise software, AI systems and
            secure digital infrastructure that enables long-term growth.
          </p>
          <p>
            The organizations that endure are not the ones with the most sophisticated stack. They are the ones whose
            technology choices stay coherent as the business evolves.
          </p>
        </div>
      </div>
    </section>
  );
}
