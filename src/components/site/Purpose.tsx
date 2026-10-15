import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE } from "./core";
import { RevealLines } from "./Chapter";

registerGsap();

/** The statement, split into the four commitments it makes. Wording is unchanged. */
const commitments = [
  { subject: "Technology", verb: "should solve", object: "business problems." },
  { subject: "Every system", verb: "should reduce", object: "complexity." },
  { subject: "Every architecture", verb: "should support", object: "growth." },
  { subject: "Every decision", verb: "should create", object: "long-term value." },
];

export function Purpose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);
        // hairlines draw in from the left as each row arrives
        q(".pu-rule").forEach((rule) => {
          gsap.from(rule, {
            scaleX: 0,
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: rule, start: "top 92%" },
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
        <p className="text-center text-[14px] leading-none font-medium text-mute">Purpose</p>

        <RevealLines
          as="h2"
          className="mx-auto mt-8 max-w-[22ch] text-center text-[clamp(1.75rem,3.6vw,3.75rem)] leading-[1.12] font-medium tracking-[-0.025em] text-balance text-ink md:mt-10 md:max-w-none md:text-nowrap"
        >
          Technology should never exist for its own sake.
        </RevealLines>

        {/* four commitments, one per row: the subject sits left, the claim reads large */}
        <ul className="dim-group mt-20 border-b border-hair md:mt-28">
          {commitments.map((c, i) => (
            <li key={c.subject} className="dim-item shift-host relative">
              <span
                aria-hidden
                className="pu-rule absolute inset-x-0 top-0 h-px origin-left bg-hair"
              />
              <div className="grid-12 items-baseline gap-y-3 py-8 md:py-12">
                <RevealLines
                  as="p"
                  delay={i * 0.06}
                  className="col-span-12 text-[15px] leading-normal font-medium text-mute md:col-span-3"
                >
                  {c.subject}
                </RevealLines>
                <div className="shift col-span-12 md:col-span-9">
                  <RevealLines
                    as="p"
                    delay={0.1 + i * 0.06}
                    className="text-[clamp(1.75rem,3.8vw,3.5rem)] leading-[1.12] font-medium tracking-[-0.025em] text-ink"
                  >
                    <span className="text-mute">{c.verb}</span> {c.object}
                  </RevealLines>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid-12 mt-16 md:mt-20">
          <RevealLines
            as="p"
            className="col-span-12 max-w-[34ch] text-[clamp(1.0625rem,1.35vw,1.375rem)] leading-normal font-normal text-graphite md:col-span-9 md:col-start-4"
          >
            “Design for the decade, not the quarter.”
          </RevealLines>
        </div>
      </div>
    </section>
  );
}
