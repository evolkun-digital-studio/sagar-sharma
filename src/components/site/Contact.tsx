import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, registerGsap, scrollToTarget, NO_REDUCE } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { Roll } from "./Roll";
import { person } from "./data";

registerGsap();

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const giant = useRef<HTMLParagraphElement>(null);
  const [copied, setCopied] = useState(false);

  // footer name spans 96% of the viewport width
  useEffect(() => {
    const fit = () => {
      const g = giant.current;
      if (!g) return;
      g.style.fontSize = "100px";
      g.style.fontSize = `${(100 * document.documentElement.clientWidth * 0.96) / g.scrollWidth}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);
        q(".ct-row").forEach((row, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: q(".ct-rows")[0], start: "top 88%" }, delay: i * 0.08 })
            .from(row.querySelector(".ct-rule"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
            .from(row.querySelectorAll(".ct-in"), { yPercent: 125, duration: 1.2, stagger: 0.08, ease: "expo.out" }, 0.2);
        });
        gsap.fromTo(
          q(".ct-giant"),
          { yPercent: 100 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: q(".ct-foot"), start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
      return () => mm.revert();
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
    <section ref={root} id="contact" className="surface-ink relative overflow-hidden">
      <div className="wrap pt-(--section-pad)">
        <ChapterMark label="Contact" />
        <RevealLines as="h3" className="t-display mt-14 max-w-[11ch] md:mt-20">
          Let's build technology that lasts.
        </RevealLines>

        <div className="ct-rows grid-12 mt-20 gap-y-12 md:mt-32">
          <div className="ct-row relative col-span-12 pt-6 md:col-span-6">
            <span aria-hidden className="ct-rule absolute inset-x-0 top-0 h-px origin-left bg-hair-dark" />
            <div className="overflow-hidden">
              <p className="ct-in t-small text-mist-mute">Email</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="overflow-hidden pb-[0.14em]">
                <a href={`mailto:${person.email}`} className="ct-in t-h2 draw-line inline-block pb-1">
                  {person.email}
                </a>
              </div>
              <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Email address copied" : "Copy email address"}
                className="t-mono relative h-8 w-[88px] cursor-pointer overflow-hidden rounded-full border border-hair-dark text-mist-mute transition-colors duration-500 hover:border-mist hover:text-mist"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "y" : "n"}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {copied ? "Copied" : "Copy"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
          <div className="ct-row relative col-span-12 pt-6 md:col-span-3">
            <span aria-hidden className="ct-rule absolute inset-x-0 top-0 h-px origin-left bg-hair-dark" />
            <div className="overflow-hidden">
              <p className="ct-in t-small text-mist-mute">LinkedIn</p>
            </div>
            <div className="mt-4 overflow-hidden pb-[0.14em]">
              <a href={person.linkedin} target="_blank" rel="noreferrer" className="ct-in t-h3 draw-line inline-block pb-1">
                {person.linkedinLabel}
              </a>
            </div>
          </div>
          <div className="ct-row relative col-span-12 pt-6 md:col-span-3">
            <span aria-hidden className="ct-rule absolute inset-x-0 top-0 h-px origin-left bg-hair-dark" />
            <div className="overflow-hidden">
              <p className="ct-in t-small text-mist-mute">Meetings</p>
            </div>
            <div className="mt-4 overflow-hidden pb-[0.14em]">
              <a
                href={`mailto:${person.email}?subject=Conversation%20request`}
                className="ct-in t-h3 draw-line inline-block pb-1"
              >
                Schedule a conversation
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="ct-foot mt-32 md:mt-48">
        <div className="wrap">
          <div className="t-small flex flex-col gap-3 border-t border-hair-dark pt-6 text-mist-mute md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {person.name}
            </p>
            <p>
              {person.role}, {person.org}
            </p>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="roll-host cursor-pointer self-start text-mist md:self-auto"
            >
              <Roll>Back to top</Roll>
            </button>
          </div>
        </div>
        <div className="overflow-hidden pt-8">
          <p
            ref={giant}
            aria-hidden
            className="ct-giant mx-auto w-max text-[12vw] font-medium tracking-[-0.045em] whitespace-nowrap text-mist"
            style={{ lineHeight: 0.8 }}
          >
            {person.name}
          </p>
        </div>
      </footer>
    </section>
  );
}
