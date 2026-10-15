import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, prefersReducedMotion } from "./core";
import { journey } from "./data";

registerGsap();

const YEAR_LABELS = journey.map(({ years }) => {
  const year = years.match(/\d{4}/)?.[0];
  return year ?? years.toUpperCase();
});

function Arrow({ direction }: { direction: "previous" | "next" }) {
  const next = direction === "next";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={next ? "M5 12h13M14 7l5 5-5 5" : "M19 12H6m4-5-5 5 5 5"} />
    </svg>
  );
}

function RollingYear() {
  return (
    <div className="jr-year" aria-live="polite" aria-atomic="true">
      <span className="sr-only jr-year-accessible">{YEAR_LABELS[0]}</span>
      <div className="jr-year-reel" aria-hidden="true">
        {YEAR_LABELS.map((label) => (
          <span className="jr-year-cell" key={label}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const trackViewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const navigate = useRef<(index: number) => void>(() => undefined);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const section = root.current;
      const viewport = trackViewport.current;
      const trackElement = track.current;
      if (!section || !viewport || !trackElement) return;

      const reduce = prefersReducedMotion();
      const panels = gsap.utils.toArray<HTMLElement>(".jr-panel", section);
      const reel = section.querySelector<HTMLElement>(".jr-year-reel");
      const liveYear = section.querySelector<HTMLElement>(".jr-year-accessible");
      let current = 0;
      let transition: gsap.core.Timeline | null = null;
      let wheelTotal = 0;
      let wheelReset: ReturnType<typeof setTimeout> | undefined;
      let wheelLocked = false;
      let dragging = false;
      let dragStart = 0;
      let dragLast = 0;
      let dragLastTime = 0;
      let dragVelocity = 0;

      const targetX = (index: number) => {
        const overflow = Math.max(0, trackElement.scrollWidth - viewport.clientWidth);
        return -overflow * (index / (journey.length - 1));
      };

      const targetYearY = (index: number) => {
        const cell = reel?.querySelector<HTMLElement>(".jr-year-cell");
        return cell ? -cell.offsetHeight * index : 0;
      };

      const normalizePanels = (visibleIndex: number) => {
        panels.forEach((panel, index) => {
          gsap.set(panel, {
            autoAlpha: index === visibleIndex ? 1 : 0,
            y: 0,
            pointerEvents: index === visibleIndex ? "auto" : "none",
          });
        });
      };

      const goTo = (requestedIndex: number) => {
        const next = gsap.utils.clamp(0, journey.length - 1, requestedIndex);
        if (next === current) {
          gsap.to(trackElement, {
            x: targetX(current),
            duration: reduce ? 0 : 0.55,
            ease: "power3.out",
            overwrite: true,
          });
          return;
        }

        const previous = current;
        current = next;
        transition?.kill();
        gsap.killTweensOf([trackElement, reel, ...panels]);
        normalizePanels(previous);
        setActive(next);
        if (liveYear) liveYear.textContent = YEAR_LABELS[next];

        const outgoing = panels[previous];
        const incoming = panels[next];
        const headingWords = incoming.querySelectorAll<HTMLElement>(".jr-heading-word > span");
        const supporting = incoming.querySelectorAll<HTMLElement>(".jr-supporting");
        const description = incoming.querySelector<HTMLElement>(".jr-description");

        if (reduce) {
          gsap.set(trackElement, { x: targetX(next) });
          if (reel) gsap.set(reel, { y: targetYearY(next) });
          normalizePanels(next);
          gsap.set([headingWords, supporting, description], { clearProps: "all" });
          return;
        }

        gsap.set(incoming, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
        gsap.set(headingWords, { yPercent: 112 });
        gsap.set(supporting, { y: 15, autoAlpha: 0 });
        if (description) gsap.set(description, { y: 10, autoAlpha: 0 });

        transition = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            normalizePanels(next);
            transition = null;
          },
        });

        transition
          .to(outgoing, { y: -12, autoAlpha: 0, duration: 0.3, ease: "power3.in" }, 0)
          .to(trackElement, { x: targetX(next), duration: 0.9, ease: "power3.inOut" }, 0)
          .to(reel, { y: targetYearY(next), duration: 0.95, ease: "expo.inOut" }, 0.02)
          .to(headingWords, { yPercent: 0, duration: 0.72, stagger: 0.045, ease: "expo.out" }, 0.38)
          .to(
            supporting,
            { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" },
            0.48,
          )
          .to(description, { y: 0, autoAlpha: 1, duration: 0.72, ease: "power3.out" }, 0.58);
      };

      navigate.current = goTo;
      normalizePanels(0);
      gsap.set(trackElement, { x: targetX(0) });
      if (reel) gsap.set(reel, { y: targetYearY(0) });

      const resizeObserver = new ResizeObserver(() => {
        gsap.set(trackElement, { x: targetX(current) });
        if (reel) gsap.set(reel, { y: targetYearY(current) });
      });
      resizeObserver.observe(viewport);
      resizeObserver.observe(trackElement);

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if ((event.target as HTMLElement).closest("button")) return;
        dragging = true;
        dragStart = event.clientX;
        dragLast = event.clientX;
        dragLastTime = performance.now();
        dragVelocity = 0;
        transition?.kill();
        gsap.killTweensOf(trackElement);
        viewport.classList.add("is-dragging");
        viewport.setPointerCapture(event.pointerId);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!dragging) return;
        const now = performance.now();
        const elapsed = Math.max(1, now - dragLastTime);
        dragVelocity = (event.clientX - dragLast) / elapsed;
        dragLast = event.clientX;
        dragLastTime = now;
        const delta = event.clientX - dragStart;
        const minimum = targetX(journey.length - 1) - 54;
        const maximum = 54;
        gsap.set(trackElement, { x: gsap.utils.clamp(minimum, maximum, targetX(current) + delta) });
      };

      const finishDrag = (event: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        viewport.classList.remove("is-dragging");
        if (viewport.hasPointerCapture(event.pointerId))
          viewport.releasePointerCapture(event.pointerId);
        const distance = event.clientX - dragStart;
        const shouldMove = Math.abs(distance) > 48 || Math.abs(dragVelocity) > 0.45;
        if (shouldMove) goTo(current + (distance < 0 ? 1 : -1));
        else goTo(current);
      };

      const onWheel = (event: WheelEvent) => {
        const horizontal =
          Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.15 && Math.abs(event.deltaX) > 3;
        if (!horizontal) return;
        const direction = event.deltaX > 0 ? 1 : -1;
        const canMove = direction > 0 ? current < journey.length - 1 : current > 0;
        if (!canMove) return;

        event.preventDefault();
        if (wheelLocked) return;
        wheelTotal += event.deltaX;
        clearTimeout(wheelReset);
        wheelReset = setTimeout(() => (wheelTotal = 0), 180);
        if (Math.abs(wheelTotal) >= 44) {
          goTo(current + (wheelTotal > 0 ? 1 : -1));
          wheelTotal = 0;
          wheelLocked = true;
          setTimeout(() => (wheelLocked = false), 620);
        }
      };

      viewport.addEventListener("pointerdown", onPointerDown);
      viewport.addEventListener("pointermove", onPointerMove);
      viewport.addEventListener("pointerup", finishDrag);
      viewport.addEventListener("pointercancel", finishDrag);
      viewport.addEventListener("wheel", onWheel, { passive: false });

      return () => {
        transition?.kill();
        clearTimeout(wheelReset);
        resizeObserver.disconnect();
        viewport.removeEventListener("pointerdown", onPointerDown);
        viewport.removeEventListener("pointermove", onPointerMove);
        viewport.removeEventListener("pointerup", finishDrag);
        viewport.removeEventListener("pointercancel", finishDrag);
        viewport.removeEventListener("wheel", onWheel);
        navigate.current = () => undefined;
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="journey" className="journey-explorer" aria-label="Journey">
      <div className="jr-stage">
        <div className="jr-year-wrap">
          <RollingYear />
        </div>
        <div className="jr-content" aria-live="polite">
          {journey.map((milestone, index) => (
            <article
              className="jr-panel"
              data-panel={index}
              aria-hidden={active !== index}
              key={milestone.kicker}
            >
              <p className="jr-supporting jr-period">{milestone.yearsLong}</p>
              <h3 className="jr-kicker">
                {milestone.kicker.split(" ").map((word, wordIndex) => (
                  <span className="jr-heading-word" key={`${word}-${wordIndex}`}>
                    <span>{word}&nbsp;</span>
                  </span>
                ))}
              </h3>
              <div className="jr-supporting jr-position">
                <p>{milestone.role}</p>
                {milestone.org && <p>{milestone.org}</p>}
              </div>
              <p className="jr-description">{milestone.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="jr-timeline-shell">
        <div className="jr-track-viewport" ref={trackViewport}>
          <div className="jr-track" ref={track}>
            <span className="jr-track-line" aria-hidden="true" />
            <div className="jr-markers">
              {journey.map((milestone, index) => (
                <button
                  type="button"
                  className={`jr-marker${active === index ? " is-active" : ""}`}
                  onClick={() => navigate.current(index)}
                  aria-label={`${milestone.yearsLong}: ${milestone.kicker}`}
                  aria-current={active === index ? "step" : undefined}
                  key={milestone.kicker}
                >
                  <span className="jr-marker-dot" aria-hidden="true" />
                  <span className="jr-marker-label">{YEAR_LABELS[index]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="jr-controls" aria-label="Journey timeline controls">
          <button
            type="button"
            onClick={() => navigate.current(active - 1)}
            disabled={active === 0}
            aria-label="Previous milestone"
          >
            <Arrow direction="previous" />
          </button>
          <button
            type="button"
            onClick={() => navigate.current(active + 1)}
            disabled={active === journey.length - 1}
            aria-label="Next milestone"
          >
            <Arrow direction="next" />
          </button>
        </div>
      </div>
    </section>
  );
}
