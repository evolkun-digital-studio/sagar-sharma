import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Linkedin, Mail } from "lucide-react";
import { gsap, registerGsap, scrollToTarget, NO_REDUCE } from "./core";
import { ChapterMark, RevealLines } from "./Chapter";
import { Roll } from "./Roll";
import { person } from "./data";
import { DubaiClock, Skyline } from "./Dubai";

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
            .timeline({
              scrollTrigger: { trigger: q(".ct-rows")[0], start: "top 88%" },
              delay: i * 0.08,
            })
            .from(
              row.querySelector(".ct-rule"),
              { scaleX: 0, duration: 1.4, ease: "expo.inOut" },
              0,
            )
            .from(
              row.querySelectorAll(".ct-in"),
              { yPercent: 125, duration: 1.2, stagger: 0.08, ease: "expo.out" },
              0.2,
            );
        });
        gsap.fromTo(
          q(".ct-giant"),
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: q(".ct-foot"),
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          },
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
    <section ref={root} id="contact" className="relative overflow-hidden surface-white">
      <div className="px-5 pt-24 md:px-[5vw] md:pt-32">
        <RevealLines
          as="h3"
          className="display mt-14 max-w-[28ch] text-[clamp(30px,3.6vw,46px)] md:mt-20"
        >
          Let's build technology that lasts.
        </RevealLines>

        <div className="ct-rows mt-20 grid grid-cols-1 justify-items-center gap-14 md:mt-32 md:grid-cols-12 md:gap-8">
          <div className="ct-row ct-contact-item md:col-span-4">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              <a
                href={`mailto:${person.email}`}
                className="ct-contact-link"
                aria-label={`Email ${person.name} at ${person.email}`}
              >
                <Mail aria-hidden="true" />
                <span className="draw-line pb-1 text-[clamp(16px,1.2vw,19px)] leading-none">
                  {person.email}
                </span>
              </a>
              {/* <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Email address copied" : "Copy email address"}
                className="t-mono relative h-8 w-[88px] cursor-pointer overflow-hidden rounded-full border border-hair text-mute transition-colors duration-500 hover:border-ink hover:text-ink"
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
              </button> */}
            </div>
          </div>
          <div className="ct-row ct-contact-item md:col-span-4">
            <a
              href={person.linkedin}
              target="_blank"
              rel="noreferrer"
              className="ct-contact-link"
              aria-label={`Open ${person.name}'s LinkedIn profile`}
            >
              <Linkedin aria-hidden="true" />
              <span className="draw-line pb-1 text-[clamp(16px,1.2vw,19px)] leading-none">
                {person.linkedinLabel}
              </span>
            </a>
          </div>
          <div className="ct-row ct-contact-item md:col-span-4">
            <a
              href={`mailto:${person.email}?subject=Conversation%20request`}
              className="ct-contact-link"
              aria-label={`Schedule a conversation with ${person.name}`}
            >
              <CalendarDays aria-hidden="true" />
              <span className="draw-line pb-1 text-[clamp(16px,1.2vw,19px)] leading-none">
                Schedule a conversation
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="wrap mt-24 md:mt-36">
        <Skyline />
        <div className="t-small flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-hair pt-5 text-mute">
          <DubaiClock />
          <span lang="ar" dir="rtl" className="text-[15px] text-ink">
            دبي
          </span>
          <span>United Arab Emirates</span>
        </div>
      </div>

      <footer className="ct-foot mt-16 md:mt-24">
        <div className="wrap">
          <div className="t-small flex flex-col gap-3 border-t border-hair pt-6 text-mute md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {person.name}
            </p>
            <p>
              {person.role}, {person.org}
            </p>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="roll-host cursor-pointer self-start text-ink md:self-auto"
            >
              <Roll>Back to top</Roll>
            </button>
          </div>
        </div>
        <div className="overflow-hidden pt-8 pb-[clamp(28px,4vw,56px)]">
          <p
            ref={giant}
            aria-hidden
            className="ct-giant display mx-auto w-max text-[7vw] whitespace-nowrap text-ink/90"
            style={{ lineHeight: 0.8 }}
          >
            {person.name}
          </p>
        </div>
      </footer>
    </section>
  );
}
