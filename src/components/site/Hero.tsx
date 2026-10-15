import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import plateUrl from "@/assets/sagar-plate.webp";
import subjectUrl from "@/assets/sagar-subject1.webp";
import { gsap, SplitText, registerGsap, onReady, prefersReducedMotion, isFinePointer, NO_REDUCE } from "./core";
import { person } from "./data";

registerGsap();

const IMG_AR = 1248 / 832;
/** Keep the supplied photograph in its natural colour. */
const MONO = false;
/** Where his face sits in the photograph (0–1), used to aim framing and the camera push-in. */
const FACE = { x: 0.6, y: 0.4 };

/**
 * Where the photograph sits in the frame. Plate (WebGL) and subject (DOM) share it exactly.
 * The office shot is landscape: it covers the viewport, slightly over-scaled for parallax.
 */
function frameRect(w: number, h: number) {
  const over = 1.04;
  let iw = w * over;
  let ih = iw / IMG_AR;
  if (ih < h * over) {
    ih = h * over;
    iw = ih * IMG_AR;
  }
  const wide = w / h > 1.05;
  // centre on the face, clamped so the photo always covers the frame
  const fx = wide ? 0.5 : FACE.x;
  const x = Math.min(0, Math.max(w - iw, w / 2 - iw * fx));
  const y = Math.min(0, Math.max(h - ih, h * 0.42 - ih * FACE.y));
  return { x, y, w: iw, h: ih, wide };
}

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uRes;       // css px
  uniform float uDpr;
  uniform vec4 uRect;      // x, y, w, h in css px (top-left origin)
  uniform vec2 uLight;     // css px
  uniform float uTime;
  uniform float uReveal;
  uniform float uScroll;
  uniform float uMono;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
    vec2 uv = (p - uRect.xy) / uRect.zw;
    vec3 col = vec3(0.0);

    if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
      vec3 rgb = texture2D(uTex, vec2(uv.x, 1.0 - uv.y)).rgb;
      float l = dot(rgb, vec3(0.299, 0.587, 0.114));
      // calmer grade: saturation x0.85, a very slight cool lift in the shadows
      vec3 graded = mix(vec3(l), rgb, 0.85);
      graded += vec3(-0.004, 0.003, 0.012) * (1.0 - smoothstep(0.0, 0.45, l));
      vec3 base = mix(graded, vec3(l), uMono);
      // the room is kept low; a soft key light follows the pointer
      float d = distance(p, uLight) / uRes.y;
      float spot = smoothstep(0.62, 0.0, d);
      col = base * (0.52 + spot * 0.58);
    }

    // lens vignette
    vec2 q = gl_FragCoord.xy / (uRes * uDpr) - 0.5;
    q.x *= uRes.x / uRes.y;
    col *= smoothstep(1.25, 0.25, length(q));

    // film grain
    float g = hash(floor(gl_FragCoord.xy / 1.5) + floor(uTime * 24.0)) - 0.5;
    col += g * 0.045;

    col *= uReveal * (1.0 - uScroll * 0.9);
    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

const SUBJECT_FILTER = "saturate(0.85) contrast(1.03)";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const glHost = useRef<HTMLDivElement>(null);
  const subject = useRef<HTMLDivElement>(null);
  const uniforms = useRef<Record<string, THREE.IUniform> | null>(null);
  /** pointer position over the hero in css px, or null when at rest */
  const pointer = useRef<{ x: number; y: number } | null>(null);

  /* ---------------- WebGL plate ---------------- */
  useEffect(() => {
    const host = glHost.current!;
    const reduce = prefersReducedMotion();
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const dpr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x0e0f11, 1);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const tex = new THREE.TextureLoader().load(plateUrl);
    tex.colorSpace = THREE.NoColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    const u: Record<string, THREE.IUniform> = {
      uTex: { value: tex },
      uRes: { value: new THREE.Vector2(1, 1) },
      uDpr: { value: dpr },
      uRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uLight: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uReveal: { value: reduce ? 1 : 0 },
      uScroll: { value: 0 },
      uMono: { value: MONO ? 1 : 0 },
    };
    uniforms.current = u;
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: u });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(quad);

    const light = { x: 0, y: 0, tx: 0, ty: 0 };
    const rest = () => {
      const r = u.uRect.value as THREE.Vector4;
      // static light: a backlight on the wall behind his head
      const rx = r.x + r.z * (FACE.x + 0.1);
      const ry = r.y + r.w * (FACE.y - 0.12);
      const p = pointer.current;
      // barely perceptible: the light leans toward the cursor, it does not chase it
      light.tx = p ? rx + (p.x - rx) * 0.35 : rx;
      light.ty = p ? ry + (p.y - ry) * 0.35 : ry;
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      (u.uRes.value as THREE.Vector2).set(w, h);
      const f = frameRect(w, h);
      (u.uRect.value as THREE.Vector4).set(f.x, f.y, f.w, f.h);
      const s = subject.current;
      if (s) Object.assign(s.style, { left: `${f.x}px`, top: `${f.y}px`, width: `${f.w}px`, height: `${f.h}px` });
      const st = stage.current;
      if (st) st.style.transformOrigin = `${f.x + f.w * FACE.x}px ${f.y + f.h * FACE.y}px`;
      rest();
      light.x = light.tx;
      light.y = light.ty;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const t0 = performance.now();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      // skip drawing while the hero is scrolled out of view
      const b = host.getBoundingClientRect();
      if (b.bottom <= 0 || b.top >= window.innerHeight) return;
      rest();
      light.x += (light.tx - light.x) * 0.06;
      light.y += (light.ty - light.y) * 0.06;
      (u.uLight.value as THREE.Vector2).set(light.x, light.y);
      if (!reduce) u.uTime.value = (performance.now() - t0) / 1000;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      tex.dispose();
      mat.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  /* ---------------- choreography ---------------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const q = gsap.utils.selector(root);

        gsap.set(q(".hero-subject"), { autoAlpha: 0, scale: 1.04 });
        gsap.set(q(".hero-cap"), { autoAlpha: 0 });

        let split: SplitText | null = null;
        const off = onReady(() => {
          split = SplitText.create(q(".hero-name"), { type: "lines", mask: "lines", linesClass: "split-line" });
          const u = uniforms.current!;
          gsap
            .timeline()
            .to(u.uReveal, { value: 1, duration: 2.4, ease: "power2.inOut" }, 0)
            .to(q(".hero-subject"), { autoAlpha: 1, scale: 1, duration: 2.2, ease: "power2.inOut" }, 0.2)
            .from(split.lines, { yPercent: 105, duration: 1.6, stagger: 0.12, ease: "expo.out" }, 0.9)
            .to(q(".hero-cap"), { autoAlpha: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" }, 1.8);
        });

        // pinned scroll-out: push in on his face, the room goes to ink
        const shot = { v: 0 };
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=90%", scrub: 0.8, pin: true } })
          .to(q(".hero-stage"), { scale: 1.3, ease: "power1.in" }, 0)
          .to(q(".hero-name-wrap"), { yPercent: -18, autoAlpha: 0, filter: "blur(10px)", ease: "power1.in" }, 0)
          .to(q(".hero-cap"), { autoAlpha: 0, y: -20, ease: "none", duration: 0.4 }, 0)
          .to(q(".hero-dim"), { opacity: 0.85, ease: "power2.in" }, 0.2)
          .to(
            shot,
            {
              v: 1,
              ease: "power2.in",
              onUpdate: () => {
                if (uniforms.current) uniforms.current.uScroll.value = shot.v;
              },
            },
            0,
          );

        // subtle pointer parallax and key light, fine pointers only
        let unbind = () => {};
        if (isFinePointer()) {
          const el = root.current!;
          const sx = gsap.quickTo(q(".hero-subject-img")[0], "x", { duration: 1.4, ease: "power3.out" });
          const sy = gsap.quickTo(q(".hero-subject-img")[0], "y", { duration: 1.4, ease: "power3.out" });
          const nx = gsap.quickTo(q(".hero-name-inner")[0], "x", { duration: 1.4, ease: "power3.out" });
          const ny = gsap.quickTo(q(".hero-name-inner")[0], "y", { duration: 1.4, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            sx(px * 24);
            sy(py * 24);
            nx(px * -36);
            ny(py * -36);
            pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          };
          const leave = () => {
            sx(0);
            sy(0);
            nx(0);
            ny(0);
            pointer.current = null;
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          unbind = () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
            pointer.current = null;
          };
        }

        return () => {
          off();
          unbind();
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="surface-ink relative h-[100svh] min-h-[600px] overflow-hidden">
      <div ref={stage} className="hero-stage absolute inset-0 will-change-transform">
        <div ref={glHost} aria-hidden className="absolute inset-0 z-0" />

        {/* left legibility gradient */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 z-[5] w-full max-md:bg-linear-to-b max-md:from-ink/70 max-md:via-ink/5 max-md:to-ink/70 md:w-[62%] md:bg-linear-to-r md:from-ink/70 md:via-ink/25 md:to-transparent"
        />

        {/* the name lives in the room: behind him on desktop, in front on mobile */}
        <div className="hero-name-wrap absolute inset-0 z-30 md:z-10">
          <div className="hero-name-inner absolute bottom-[26svh] left-(--gutter) md:top-[30svh] md:bottom-auto">
            <h1 className="hero-name t-display text-mist">
              <span className="block">{person.first}</span>
              <span className="block pl-[0.5em] md:pl-[2.4em]">{person.last}</span>
            </h1>
          </div>
        </div>

        <div ref={subject} className="hero-subject absolute z-20">
          <img
            src={subjectUrl}
            alt="Sagar Sharma, Chief Technology Officer of SR18 Group"
            width={1248}
            height={832}
            fetchPriority="high"
            className="hero-subject-img h-full w-full max-w-none will-change-transform"
            style={{ filter: SUBJECT_FILTER }}
          />
        </div>

        {/* darkens the subject as the pinned hero scrolls out */}
        <div aria-hidden className="hero-dim pointer-events-none absolute inset-0 z-[25] bg-ink opacity-0" />
      </div>

      {/* captions */}
      <div className="pointer-events-none absolute inset-0 z-40">
        <div className="wrap flex h-full flex-col justify-between pt-24 pb-6 md:pt-28 md:pb-8">
          <p className="hero-cap t-small text-mist-mute">
            {person.role}, {person.org}
          </p>
          <div className="hero-cap flex items-end justify-between gap-8">
            <p className="text-[17px] leading-[1.5] text-mist max-w-[34ch]">
              Building technology ecosystems that help businesses scale with confidence.
            </p>
            <div className="t-small flex items-end gap-4 text-mist-mute">
              <span>Scroll</span>
              <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-hair-dark">
                <span className="hero-cue absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(.7,0,.2,1)_infinite] bg-signal" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollcue { from { transform: translateY(-100%) } to { transform: translateY(200%) } } @media (prefers-reduced-motion: reduce) { .hero-cue { animation: none } }`}</style>
    </section>
  );
}
