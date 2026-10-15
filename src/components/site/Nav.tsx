import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { getLenis, onReady, prefersReducedMotion } from "./core";
import { Roll } from "./Roll";
import { chapters, person } from "./data";

const ease = [0.7, 0, 0.2, 1] as const;

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => onReady(() => setReady(true)), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !open);
  });

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reduce = typeof window !== "undefined" && prefersReducedMotion();

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-120%" : "0%", opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[60] text-bone ${open ? "" : "mix-blend-difference"}`}
      >
        <nav className="flex items-center justify-between px-5 py-5 text-[14px] md:px-[5vw] md:py-7" aria-label="Primary">
          <a href="#top" className="roll-host font-medium">
            <Roll>{person.name}</Roll>
          </a>
          <span className="hidden text-bone/60 md:block">
            {person.role}, {person.org}
          </span>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="index" className="roll-host flex items-center gap-3">
            <Roll>{open ? "Close" : "Index"}</Roll>
            <span className="relative block h-2.5 w-5">
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1/2 -rotate-45" : "top-full"}`} />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="index"
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduce ? 0 : 1, ease }}
            className="fixed inset-0 z-[55] flex flex-col bg-bone px-5 pt-24 pb-8 text-film md:px-[5vw] md:pt-32 md:pb-10"
          >
            <div className="grid flex-1 grid-cols-1 gap-12 md:grid-cols-12">
              <ul className="group/menu md:col-span-8">
                {chapters.map((c, i) => (
                  <li key={c.href} className="overflow-hidden">
                    <motion.a
                      href={c.href}
                      onClick={() => setOpen(false)}
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "105%" }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-baseline gap-5 py-1 transition-opacity duration-500 group-hover/menu:opacity-30 hover:!opacity-100"
                    >
                      <span className="display text-[clamp(32px,4.4vw,64px)]">{c.label}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col justify-end gap-8 text-[14px] md:col-span-3 md:col-start-10"
              >
                <div>
                  <p className="text-signal">Find me</p>
                  <ul className="mt-3 space-y-1">
                    <li>
                      <a className="draw-line" href={person.linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    </li>
                    <li>
                      <a className="draw-line" href={`mailto:${person.email}`}>
                        {person.email}
                      </a>
                    </li>
                  </ul>
                </div>
                <p className="text-ash">
                  {person.role}
                  <br />
                  {person.org}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
