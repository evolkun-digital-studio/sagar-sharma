import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, registerGsap, prefersReducedMotion } from "./core";

registerGsap();

/** Chapter heading: roman numeral, title, and a hairline that draws across. */
export function ChapterMark({ n, label, dark = false }: { n: string; label: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 88%" } });
      tl.from(q(".cm-rule"), { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0).from(
        q(".cm-t"),
        { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "expo.out" },
        0.2,
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`flex items-baseline gap-5 text-[13px] ${dark ? "text-smoke" : "text-ash"}`}>
      <span className="overflow-hidden">
        <span className="cm-t serif inline-block min-w-[2.2em] text-[14px] tracking-[0.04em] text-signal">{n}</span>
      </span>
      <h2 className="overflow-hidden">
        <span className={`cm-t inline-block ${dark ? "text-bone" : "text-film"}`}>{label}</span>
      </h2>
      <span className={`cm-rule h-px flex-1 origin-left self-center ${dark ? "bg-rule-dark" : "bg-rule"}`} />
    </div>
  );
}

/** Serif text whose lines rise out of masks when scrolled into view. */
export function RevealLines({
  children,
  className = "",
  as: Tag = "p",
  start = "top 85%",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "h2" | "h3" | "div";
  start?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      let split: SplitText | null = null;
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        split = SplitText.create(ref.current, { type: "lines", mask: "lines", linesClass: "line-mask" });
        gsap.from(split.lines, {
          yPercent: 105,
          duration: 1.5,
          stagger: 0.09,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start },
        });
      });
      return () => split?.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
