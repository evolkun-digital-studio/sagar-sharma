import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, registerGsap, prefersReducedMotion, scrollToTarget } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { Roll } from "./Magnetic";
import { person } from "./data";

registerGsap();

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const giant = useRef<HTMLParagraphElement>(null);
  const [copied, setCopied] = useState(false);

  // footer name spans the full width exactly
  useEffect(() => {
    const fit = () => {
      const g = giant.current;
      if (!g) return;
      g.style.fontSize = "100px";
      g.style.fontSize = `${(100 * window.innerWidth * 0.78) / g.scrollWidth}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".ct-row"), {
        y: 30,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: q(".ct-rows"), start: "top 88%" },
      });
      gsap.fromTo(
        q(".ct-giant"),
        { yPercent: 100 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: q(".ct-foot"), start: "top bottom", end: "bottom bottom", scrub: true } },
      );
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section ref={root} id="contact" className="relative overflow-hidden bg-bone text-film">
      <div className="px-5 pt-24 md:px-[5vw] md:pt-32">
        <ChapterMark label="Contact" />
        <RevealLines as="h3" className="display mt-14 max-w-[11ch] text-[clamp(40px,6vw,96px)] md:mt-20">
          Let's build technology that lasts.
        </RevealLines>

        <div className="ct-rows mt-20 grid grid-cols-1 gap-12 md:mt-32 md:grid-cols-12 md:gap-8">
          <div className="ct-row md:col-span-6">
            <p className="text-[12px] text-signal">Email</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-3">
              <a href={`mailto:${person.email}`} className="draw-line serif pb-1 text-[clamp(24px,2.6vw,42px)] leading-none">
                {person.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className="relative h-8 w-[84px] cursor-pointer overflow-hidden rounded-full border border-rule text-[12px] text-ash transition-colors hover:border-signal hover:text-signal"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "y" : "n"}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {copied ? "Copied" : "Copy"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
          <div className="ct-row md:col-span-3">
            <p className="text-[12px] text-signal">LinkedIn</p>
            <a href={person.linkedin} target="_blank" rel="noreferrer" className="draw-line serif mt-3 inline-block pb-1 text-[clamp(20px,1.6vw,28px)] leading-none">
              {person.linkedinLabel}
            </a>
          </div>
          <div className="ct-row md:col-span-3">
            <p className="text-[12px] text-signal">Meetings</p>
            <a
              href={`mailto:${person.email}?subject=Conversation%20request`}
              className="draw-line serif mt-3 inline-block pb-1 text-[clamp(20px,1.6vw,28px)] leading-none"
            >
              Schedule a conversation
            </a>
          </div>
        </div>
      </div>

      <footer className="ct-foot mt-32 md:mt-48">
        <div className="mx-5 flex flex-col gap-3 border-t border-rule pt-6 text-[12px] text-ash md:mx-[5vw] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {person.name}</p>
          <p>
            {person.role}, {person.org}
          </p>
          <button type="button" onClick={() => scrollToTarget(0)} className="roll-host self-start text-film md:self-auto">
            <Roll>Back to top</Roll>
          </button>
        </div>
        <div className="overflow-hidden pt-8">
          <p
            ref={giant}
            aria-hidden
            className="ct-giant display mx-auto w-max text-[12vw] whitespace-nowrap text-film"
            style={{ lineHeight: 0.8, marginBottom: "-0.04em" }}
          >
            {person.name}
          </p>
        </div>
      </footer>
    </section>
  );
}
