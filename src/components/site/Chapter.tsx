import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, revealLines, NO_REDUCE } from "./core";

registerGsap();

/** Section label: plain text, then a hairline that draws across. */
export function ChapterMark({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(ref);
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 88%" } })
          .from(q(".cm-rule"), { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0)
          .from(q(".cm-t"), { yPercent: 110, duration: 1.1, ease: "expo.out" }, 0.15);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="t-small flex items-center gap-4 text-(--fg-2)">
      <h2 className="overflow-hidden font-normal">
        <span className="cm-t inline-block">{label}</span>
      </h2>
      <span aria-hidden className="cm-rule h-px flex-1 origin-left bg-(--line)" />
    </div>
  );
}

/** Text whose lines rise out of masks when scrolled into view. */
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
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => revealLines(ref.current!, { start, delay }));
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
