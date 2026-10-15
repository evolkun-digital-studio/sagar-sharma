import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, registerGsap, prefersReducedMotion } from "./core";

registerGsap();

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
