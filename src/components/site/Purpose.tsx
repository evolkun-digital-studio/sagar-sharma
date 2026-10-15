import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE } from "./core";
import { RevealLines } from "./Chapter";

registerGsap();

/** The statement, split into the four commitments it makes. Wording is unchanged. */
const commitments = [
  { subject: "Technology", claim: "should solve business problems." },
  { subject: "Every system", claim: "should reduce complexity." },
  { subject: "Every architecture", claim: "should support growth." },
  { subject: "Every decision", claim: "should create long-term value." },
];

export function Purpose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);
        // hairlines draw in from the left as each column arrives
        q(".pu-rule").forEach((rule) => {
          gsap.from(rule, {
            scaleX: 0,
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: rule, start: "top 90%" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="purpose" className="surface-paper section-pad relative font-open">
      <div className="wrap">
        <p className="text-center text-[14px] leading-none font-medium tracking-[0.01em] text-mute">
          Purpose
        </p>

        <RevealLines
          as="h2"
          className="mx-auto mt-8 max-w-[22ch] text-center text-[clamp(1.75rem,3.6vw,3.75rem)] leading-[1.12] font-medium tracking-[-0.025em] text-balance text-ink md:mt-10 md:max-w-none md:text-nowrap"
        >
          Technology should never exist for its own sake.
        </RevealLines>

        <ul className="mt-20 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-28 lg:grid-cols-4">
          {commitments.map((c, i) => (
            <li key={c.subject} className="relative pt-6">
              <span
                aria-hidden
                className="pu-rule absolute inset-x-0 top-0 h-px origin-left bg-hair"
              />
              <RevealLines
                as="p"
                delay={i * 0.08}
                className="text-[15px] leading-[1.5] font-medium text-mute"
              >
                {c.subject}
              </RevealLines>
              <RevealLines
                as="p"
                delay={0.1 + i * 0.08}
                className="mt-4 max-w-[16ch] text-[clamp(1.375rem,1.9vw,1.875rem)] leading-[1.25] font-medium tracking-[-0.018em] text-ink"
              >
                {c.claim}
              </RevealLines>
            </li>
          ))}
        </ul>

        <RevealLines
          as="p"
          className="mx-auto mt-24 max-w-[34ch] text-center text-[clamp(1.0625rem,1.35vw,1.375rem)] leading-[1.5] font-normal text-graphite md:mt-32"
        >
          “Design for the decade, not the quarter.”
        </RevealLines>
      </div>
    </section>
  );
}
