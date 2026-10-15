import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import plateUrl from "@/assets/sagar-plate.webp";
import subjectUrl from "@/assets/sagar-subject.webp";
import { gsap, SplitText, registerGsap, onReady, prefersReducedMotion } from "./core";
import { focusAreas, person } from "./data";

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
      vec3 base = mix(rgb, vec3(l), uMono);
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

const SUBJECT_FILTER = "saturate(1.04) contrast(1.03)";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const glHost = useRef<HTMLDivElement>(null);
  const subject = useRef<HTMLImageElement>(null);
  const uniforms = useRef<Record<string, THREE.IUniform> | null>(null);

  /* ---------------- WebGL plate ---------------- */
  useEffect(() => {
    const host = glHost.current!;
    const reduce = prefersReducedMotion();
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    const dpr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x24292e, 1);
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
      light.tx = r.x + r.z * (FACE.x + 0.1);
      light.ty = r.y + r.w * (FACE.y - 0.12);
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      (u.uRes.value as THREE.Vector2).set(w, h);
      const f = frameRect(w, h);
      (u.uRect.value as THREE.Vector4).set(f.x, f.y, f.w, f.h);
      const s = subject.current;
      if (s)
        Object.assign(s.style, {
          left: `${f.x}px`,
          top: `${f.y}px`,
          width: `${f.w}px`,
          height: `${f.h}px`,
        });
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
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.set(q(".hero-subject"), { autoAlpha: 0, scale: 1.04 });
      gsap.set(q(".hero-cap"), { autoAlpha: 0 });

      let split: SplitText | null = null;
      const off = onReady(() => {
        split = SplitText.create(q(".hero-name"), {
          type: "lines",
          mask: "lines",
          linesClass: "line-mask",
        });
        const u = uniforms.current!;
        const tl = gsap.timeline();
        tl.to(u.uReveal, { value: 1, duration: 2.6, ease: "power2.inOut" }, 0)
          .to(
            q(".hero-subject"),
            { autoAlpha: 1, scale: 1, duration: 2.4, ease: "power2.inOut" },
            0.2,
          )
          .from(split.lines, { yPercent: 105, duration: 1.8, stagger: 0.14, ease: "expo.out" }, 1.0)
          .to(
            q(".hero-cap"),
            { autoAlpha: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" },
            1.6,
          );
      });

      // push in on the face, then cut to black
      const shot = { v: 0 };
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=90%",
          scrub: 0.8,
          pin: true,
        },
      });
      st.to(q(".hero-stage"), { scale: 1.35, ease: "power1.in" }, 0)
        .to(
          q(".hero-name-wrap"),
          { yPercent: -18, autoAlpha: 0, filter: "blur(10px)", ease: "power1.in" },
          0,
        )
        // fade the caption wrapper, not the .hero-cap items: the intro owns their opacity,
        // and a scrubbed tween on them would restore their pre-intro value (0) on the way back up
        .to(q(".hero-caps"), { autoAlpha: 0, y: -20, ease: "none", duration: 0.4 }, 0)
        .to(
          q(".hero-subject"),
          { filter: `${SUBJECT_FILTER} brightness(0.15)`, ease: "power2.in" },
          0.2,
        )
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

      return () => {
        off();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative h-[100svh] min-h-[600px] overflow-hidden text-bone"
    >
      <div ref={stage} className="hero-stage absolute inset-0 will-change-transform">
        <div ref={glHost} aria-hidden className="absolute inset-0" />
        {/* the name lives in the room — between the wall and the man */}
        <div className="hero-name-wrap absolute inset-0 z-30">
          <div className="hero-name-inner absolute bottom-[24svh] left-5 md:top-[30svh] md:bottom-auto md:left-[5vw]">
            <p className="hero-cap mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-bone/80 md:text-[12px]">
              {person.role}
            </p>
            <h1 className="hero-name display text-[clamp(38px,11vw,64px)] text-bone md:text-[min(5vw,9svh)]">
              <span className="block">
                {person.first} <span>{person.last}</span>
              </span>
              {/* <span className="block pl-[0.5em] md:pl-[-0.44em]">{person.last}</span> */}
            </h1>
          </div>
        </div>

        {/* <img
          ref={subject}
          src={subjectUrl}
          alt="Sagar Sharma, Chief Technology Officer of SR18 Group"
          width={1248}
          height={832}
          fetchPriority="high"
          className="hero-subject absolute z-20 max-w-none will-change-transform"
          style={{
            left: 0,
            top: 0,
            filter: `${SUBJECT_FILTER} brightness(1)`,
          }}
        /> */}
      </div>

      {/* editorial metadata and one clear next action */}
      <div className="hero-caps pointer-events-none absolute inset-0 z-40 flex flex-col justify-between px-5 pt-28 pb-6 md:px-[5vw] md:pt-32 md:pb-8">
        <div className="hero-cap flex items-start justify-between gap-8 text-[11px] uppercase tracking-[0.14em]">
          <div className="border-l-2 border-white pl-4">
            <p className="text-bone/80">{person.org}</p>
            <p className="mt-2 max-w-[32ch] text-bone/45">{focusAreas.slice(0, 3).join(" · ")}</p>
          </div>
        </div>

        <div className="hero-cap flex items-end justify-between gap-8">
          <p className="max-w-[30ch] text-[14px] leading-[1.55] text-bone/80 md:max-w-[34ch] md:text-[15px]">
            Building technology ecosystems that help businesses scale with confidence.
          </p>
        </div>
      </div>
      <style>{`@keyframes scrollcue { from { transform: translateY(-100%) } to { transform: translateY(200%) } }`}</style>
    </section>
  );
}
