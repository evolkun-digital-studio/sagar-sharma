import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, NO_REDUCE } from "./core";

registerGsap();

/**
 * A strip of eight-pointed stars (two overlapped squares), the geometry behind
 * a great deal of Gulf ornament. Wipes open from the left as it scrolls in.
 */
export function StarBand({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 2,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 92%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <div aria-hidden className={`bg-white py-8 md:py-10 ${className}`}>
      <div
        ref={ref}
        className="h-16 w-full text-gold"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
        }}
      >
        <svg width="100%" height="100%" className="block opacity-70">
          <defs>
            <pattern id="gulf-star" width="64" height="64" patternUnits="userSpaceOnUse" x="0" y="0">
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="14" y="14" width="36" height="36" />
                <rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)" />
                <path d="M0 32h14M50 32h14M32 0v14M32 50v14" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gulf-star)" />
        </svg>
      </div>
    </div>
  );
}

/** A single-line skyline: Emirates Towers, Burj Khalifa, Museum of the Future, Burj Al Arab, Dubai Frame. */
export function Skyline({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const paths = ref.current!.querySelectorAll("path, ellipse");
        gsap.from(paths, {
          drawSVG: 0,
          duration: 2.4,
          stagger: 0.12,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 90%" },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 1200 170"
      preserveAspectRatio="xMidYMax meet"
      className={`block h-auto w-full text-gold ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* ground and low-rise */}
      <path vectorEffect="non-scaling-stroke" d="M0 160H1200" />
      <path
        vectorEffect="non-scaling-stroke"
        d="M60 160V128H92V160M110 160V112L134 104V160M232 160V136H268V160M268 148H300V160M324 160V122H352V160M384 160V138H416V160"
      />
      {/* Emirates Towers */}
      <path vectorEffect="non-scaling-stroke" d="M440 160V70L454 36L468 70V160" />
      <path vectorEffect="non-scaling-stroke" d="M482 160V98L496 68L510 98V160" />
      {/* Burj Khalifa */}
      <path
        vectorEffect="non-scaling-stroke"
        d="M556 160V132H566V104H576V78H584V54H590V30H594L600 2L606 30H610V54H616V78H624V104H634V132H644V160"
      />
      {/* Museum of the Future */}
      <ellipse vectorEffect="non-scaling-stroke" cx="740" cy="104" rx="30" ry="42" />
      <ellipse vectorEffect="non-scaling-stroke" cx="740" cy="104" rx="9" ry="26" />
      <path vectorEffect="non-scaling-stroke" d="M722 160V146M758 160V146" />
      {/* Burj Al Arab */}
      <path vectorEffect="non-scaling-stroke" d="M860 160V46L866 8L872 46C912 66 934 108 936 160" />
      {/* Dubai Frame */}
      <path vectorEffect="non-scaling-stroke" d="M1010 160V80H1060V160M1020 160V90H1050V160" />
      {/* mid-rise */}
      <path
        vectorEffect="non-scaling-stroke"
        d="M960 160V126H984V160M1090 160V118H1116V160M1128 160V140H1160V160"
      />
    </svg>
  );
}
