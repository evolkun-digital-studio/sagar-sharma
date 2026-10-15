import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { getLenis, onReady, prefersReducedMotion } from "./core";
import { Roll } from "./Roll";
import { chapters, person } from "./data";

const curtain = [0.7, 0, 0.2, 1] as const;
const expo = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => onReady(() => setReady(true)), []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !open);
  });

  useEffect(() => {
    if (!open) return;
    const l = getLenis();
    l?.stop();
    const links = () => Array.from(overlay.current?.querySelectorAll<HTMLElement>("a[href]") ?? []);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      // trap focus between the toggle button and the overlay links
      const items = links();
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!e.shiftKey && active === last) {
        e.preventDefault();
        button.current?.focus();
      } else if (e.shiftKey && active === button.current) {
        e.preventDefault();
        last?.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => links()[0]?.focus({ preventScroll: true }), 120);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      l?.start();
      button.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const reduce = typeof window !== "undefined" && prefersReducedMotion();

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? "-120%" : "0%", opacity: ready ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.9, ease: expo }}
        className={`fixed inset-x-0 top-0 z-[60] ${open ? "text-ink" : "text-mist mix-blend-difference"}`}
      >
        <nav className="wrap t-small grid grid-cols-[1fr_auto] items-center py-5 md:py-7 lg:grid-cols-[1fr_auto_1fr]" aria-label="Primary">
          <a href="#top" inert={open} className="roll-host justify-self-start font-medium">
            <Roll>{person.name}</Roll>
          </a>
          <span className={`hidden lg:block ${open ? "text-graphite" : "text-mist"}`}>
            {person.role}, {person.org}
          </span>
          <button
            ref={button}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="index"
            className="roll-host flex cursor-pointer items-center gap-3 justify-self-end"
          >
            <Roll>{open ? "Close" : "Index"}</Roll>
            <span aria-hidden className="relative block h-2.5 w-5">
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1/2 -rotate-45" : "top-full"}`} />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlay}
            id="index"
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: reduce ? 0 : 1, ease: curtain }}
            className="surface-paper fixed inset-0 z-[55] overflow-y-auto"
          >
            <div className="wrap grid-12 min-h-full content-between gap-y-12 pt-28 pb-8 md:pt-32 md:pb-10">
              <ul className="dim-group col-span-12 md:col-span-8">
                {chapters.map((c, i) => (
                  <li key={c.href} className="dim-item overflow-hidden">
                    <motion.a
                      href={c.href}
                      onClick={() => setOpen(false)}
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "105%" }}
                      transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : 0.25 + i * 0.06, ease: expo }}
                      className="t-h1 block pb-[0.08em] text-[length:clamp(36px,min(5.6vw,9svh),104px)]"
                    >
                      {c.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 }}
                className="t-small col-span-12 flex flex-col justify-end gap-8 md:col-span-3 md:col-start-10"
              >
                <div>
                  <p className="text-(--fg-2)">Find me</p>
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
                <p className="text-(--fg-2)">
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
