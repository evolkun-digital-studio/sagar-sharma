import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { onReady, prefersReducedMotion } from "./core";
import { Roll } from "./Roll";
import { person } from "./data";

const expo = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [inHero, setInHero] = useState(true);
  const { scrollY } = useScroll();

  useEffect(() => onReady(() => setReady(true)), []);

  // the hero is nav-free: the bar only appears once the hero has scrolled away
  const checkHero = (y: number) => {
    const hero = document.getElementById("top");
    setInHero(y < (hero?.offsetHeight ?? window.innerHeight) - 80);
  };

  useEffect(() => {
    checkHero(scrollY.get());
    const onResize = () => checkHero(scrollY.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    checkHero(y);
    setHidden(y > prev && y > 200);
  });

  const reduce = typeof window !== "undefined" && prefersReducedMotion();

  return (
    <motion.header
      inert={inHero}
      initial={false}
      animate={{ y: hidden || inHero ? "-120%" : "0%", opacity: ready && !inHero ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.9, ease: expo }}
      className="fixed inset-x-0 top-0 z-[60] text-mist mix-blend-difference"
    >
      <nav className="wrap t-small flex items-center py-5 md:py-7" aria-label="Primary">
        <a href="#top" className="roll-host font-medium">
          <Roll>{person.name}</Roll>
        </a>
      </nav>
    </motion.header>
  );
}
