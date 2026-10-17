import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { CompleteShelfLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { RevealLines } from "./Chapter";
import { getLenis, gsap, NO_REDUCE, registerGsap } from "./core";
import { flagshipProjects } from "./data";

const FLAGSHIP_SCENE_URL = "/landing-pages/flagship-projects-shelf.html";

registerGsap();

export function FlagshipProjectsScene() {
  const frame = useRef<HTMLDivElement>(null);
  const [sceneSource, setSceneSource] = useState<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const controller = new AbortController();
    setLoadError(false);

    fetch(FLAGSHIP_SCENE_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load flagship scene: ${response.status}`);
        return response.text();
      })
      .then(setSceneSource)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      });

    return () => controller.abort();
  }, [shouldLoad]);

  useEffect(() => {
    const relayVerticalWheel = (event: MessageEvent) => {
      const iframe = frame.current?.querySelector("iframe");
      if (event.source !== iframe?.contentWindow) return;
      if (event.data?.type !== "flagship-projects:wheel") return;
      const deltaY = Number(event.data.deltaY);
      if (!Number.isFinite(deltaY) || deltaY === 0) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(window.scrollY + deltaY, { immediate: true, force: true });
        return;
      }
      window.scrollBy({ top: deltaY, left: 0, behavior: "auto" });
    };

    window.addEventListener("message", relayVerticalWheel);
    return () => window.removeEventListener("message", relayVerticalWheel);
  }, []);

  return (
    <div ref={frame} className="flagship-threeui-frame" aria-label="Interactive flagship projects">
      {sceneSource ? (
        <CompleteShelfLandingPage
          srcDoc={sceneSource}
          headingFont="iowan-old-style"
          bodyFont="inter"
          headingWeight="400"
          bodyWeight="400"
          primaryColor="#c87046"
          headingSize={60}
          bodySize={12}
          headingLetterSpacing={-0.055}
        />
      ) : loadError ? (
        <div className="fp-scene-state" role="status">
          <p>Interactive view unavailable.</p>
          <span>The project details remain available below.</span>
        </div>
      ) : (
        <div className="fp-scene-state fp-scene-state--loading" role="status" aria-live="polite">
          <p>Preparing the project shelf</p>
          <span aria-hidden className="fp-loading-line" />
        </div>
      )}
    </div>
  );
}

export function FlagshipProjects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(NO_REDUCE, () => {
        const select = gsap.utils.selector(root);

        gsap.from(select(".fp-intro"), {
          y: 18,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: select(".fp-header")[0], start: "top 84%" },
        });

        gsap.from(select(".flagship-threeui-frame"), {
          y: 28,
          autoAlpha: 0,
          duration: 1.15,
          ease: "expo.out",
          scrollTrigger: { trigger: select(".flagship-threeui-frame")[0], start: "top 88%" },
        });

        select(".fp-mobile-row").forEach((row) => {
          gsap.from(row, {
            y: 18,
            autoAlpha: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 92%" },
          });
        });
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="flagship-projects"
      aria-label="Flagship Projects"
      className="surface-white relative"
    >
      <FlagshipProjectsScene />

      <div className="wrap">
        <header className="fp-header max-w-[900px]">
          {/* <p className="fp-intro t-small font-semibold tracking-[0.12em] text-mute uppercase">
            Systems I&apos;ve Architected
          </p> */}
          {/* <RevealLines as="h2" className="t-h1 mt-5 max-w-[18ch]">
            Flagship Projects
          </RevealLines> */}
          {/* <p className="fp-intro mt-6 max-w-[44ch] text-[15px] leading-[1.7] text-graphite">
            Systems built across platforms, cloud infrastructure, and automation.
          </p> */}
        </header>


        {/* <ol className="fp-mobile-list mt-12" aria-label="Flagship project details">
          {flagshipProjects.map((project) => (
            <li
              key={project.number}
              className="fp-mobile-row border-t border-hair py-9 last:border-b"
            >
              <div className="fp-mobile-heading">
                <p className="t-mono text-mute">Project {project.number}</p>
                <h3 className="mt-3 text-[24px] leading-[1.12] font-semibold tracking-[-0.025em] text-ink">
                  {project.title}
                </h3>
                <p className="mt-3 text-[11px] leading-[1.5] font-semibold tracking-[0.1em] text-mute uppercase">
                  {project.subtitle}
                </p>
              </div>
              <dl className="fp-mobile-meta mt-7 grid gap-6">
                <div>
                  <dt className="t-small font-semibold text-ink">Technology</dt>
                  <dd className="mt-2 text-[14px] leading-[1.65] text-graphite">
                    {project.technology}
                  </dd>
                </div>
                <div>
                  <dt className="t-small font-semibold text-ink">Description</dt>
                  <dd className="mt-2 text-[14px] leading-[1.65] text-graphite">
                    {project.description}
                  </dd>
                </div>
                <div>
                  <dt className="t-small font-semibold text-ink">Outcome</dt>
                  <dd className="mt-2 text-[14px] leading-[1.65] text-graphite">
                    {project.outcome}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol> */}
      </div>
    </section>
  );
}
