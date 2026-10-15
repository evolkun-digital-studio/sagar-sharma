# Redesign brief: Sagar Sharma portfolio → premium, minimal, quietly animated

You are a senior product designer + frontend engineer. Redesign the portfolio site in this repo for **Sagar Sharma, Chief Technology Officer of SR18 Group**. It must feel like the personal site of the person who runs technology for a serious tech company: calm, precise, expensive, minimal. Think the restraint of Linear, Vercel, Stripe Press or Teenage Engineering — not their layouts, their discipline. Every element earns its place; motion is slow, exact and purposeful.

Work on the existing codebase. Do not start a new project.

---

## 0. Ground rules (read first)

1. **Read before editing.** Open and read every file in `src/components/site/`, plus `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx` and `AGENTS.md` before changing anything.
2. **Git / Lovable:** this repo syncs to Lovable. Never force-push, rebase, amend or squash pushed commits. Create a branch `redesign/premium-minimal`, commit in small logical steps, push the branch and open a PR. Do not commit to `main` directly.
3. **Content is fixed.** Use the copy already in `src/components/site/data.ts` and the current components. Do not invent facts, numbers, clients, awards, locations, testimonials or stats. You may shorten or tighten wording, but never add claims.
4. **No new visual libraries.** The stack already has everything: React 19, TanStack Start, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG are free and registered in `core.ts`), `@gsap/react`, Lenis, `motion`, Three.js and anime.js. Fonts are added via npm `@fontsource-variable/*` and self-hosted (see §2).
5. **Verify everything** (see §9): type-check, build, run it, and look at it at 390px and 1440px before you call any step done.

---

## 1. What is wrong today (fix all of these)

- **Flat, monotone page.** Every section after the hero uses the same cool grey (`--moonlit: #cdd2d8`). There's no rhythm, so nothing feels premium.
- **Three competing typefaces.** Space Grotesk (loaded from the Google Fonts CDN in `styles.css`), Newsreader serif in scattered places (Journey titles, Writing titles, Purpose paragraph, contact links) and Geist. Pick one system (§2).
- **Accessibility failures** on the grey background: signal red `#d74642` is 2.85:1, `#59636c` is 4.03:1 and `#9ca6af` is 1.63:1. All fail WCAG AA for body/small text.
- **Template tells:**
  - small UPPERCASE tracked red eyebrow labels on every section;
  - meta strings joined with " · " in the hero;
  - "Independent technology portfolio" filler text.
- **Hero lost its depth.** The subject cut-out `<img>` is commented out in `Hero.tsx`, so the name no longer sits "in the room". There's also a dead import, `@/assets/sagar-subject.webp`, which no longer exists (the file is `sagar-subject1.webp`). It only builds because the import is unused.
- **The Principles section blurs** between states (`filter: blur(14px)`), which looks muddy mid-scroll and is expensive. It also leaves huge empty areas.
- **Type scale is too timid.** Headlines were shrunk to 36–78px, so sections read like a template rather than an editorial page.
- **Grain overlay** sits over flat grey and makes it look dirty rather than filmic.

---

## 2. Design system (implement as tokens in `src/styles.css`)

### Typeface: one family, two cuts

- **Geist** (variable, weights 100–900) for everything: display, headings, body, UI. It's already partly in the repo.
- **Geist Mono** (variable) only for numerals and system metadata: years, the journey counter, the principle index `01 / 06` and the copy-email confirmation. Nowhere else.
- Install with `npm i @fontsource-variable/geist @fontsource-variable/geist-mono`. Copy only the latin `wght-normal` woff2 files into `src/assets/fonts/`, then declare `@font-face` in `styles.css` the same way the existing fonts are declared. Then uninstall the npm packages so the repo stays lean (or keep them; your call, but self-host either way).
- **Remove** the Space Grotesk `@import url("https://fonts.googleapis.com/...")` and remove Newsreader entirely: the two `@font-face` rules, both woff2 files and every `.serif` usage.
- Update the `<link rel="preload">` font tags in `src/routes/__root.tsx` to the new files.

### Type scale (fluid, set as CSS custom properties)

| Token | Size | Weight / leading / tracking | Use |
|---|---|---|---|
| `--t-display` | `clamp(56px, 9vw, 168px)` | 500, line-height 0.92, letter-spacing −0.045em | hero name, contact statement |
| `--t-h1` | `clamp(40px, 5.6vw, 104px)` | 500, 0.98, −0.04em | section statements |
| `--t-h2` | `clamp(28px, 3vw, 52px)` | 500, 1.05, −0.03em | sub-statements, industry names, principle text |
| `--t-h3` | `clamp(20px, 1.6vw, 26px)` | 500, 1.2, −0.015em | item titles |
| `--t-body` | `17px` | 400, 1.65, −0.005em | paragraphs, max 62ch |
| `--t-small` | `14px` | 400, 1.5 | captions, meta |
| `--t-mono` | `13px` Geist Mono | 400, letter-spacing 0, `font-variant-numeric: tabular-nums` | numerals, counters |

- Sentence case everywhere. No uppercase tracked labels.
- Section labels become a small 14px graphite line of plain text (e.g. "The Group") followed by a hairline that draws across. Keep `ChapterMark`, restyled.

### Colour: two surfaces, one accent, strict usage

```
--paper:      #F4F4F1   light surface
--ink:        #0E0F11   dark surface + primary text on paper
--graphite:   #3A3E44   secondary text on paper        (9.8:1 on paper)
--mute:       #686D75   tertiary text on paper         (4.7:1 on paper)
--mist:       #EDEDEA   primary text on ink            (16.4:1 on ink)
--mist-mute:  #9A9FA7   secondary text on ink          (7.2:1 on ink)
--hair:       rgba(14,15,17,0.10)   hairlines on paper
--hair-dark:  rgba(237,237,234,0.12) hairlines on ink
--signal:     #C23B33 on paper (4.8:1) / #E5534B on ink (5.2:1)
```

- The **signal accent** is allowed in exactly four places: focus rings, the hero scroll cue, the active tick on the Principles progress bar, and link hover underlines. Never for labels or headings.
- Keep the existing Tailwind aliases (`bone`, `film`, `ash`, `smoke`, `rule`) pointing at the new tokens so shadcn UI files don't break. Use the new names in new code.
- **No gradients as decoration, no glassmorphism, no drop shadows, no rounded cards.** Radius is 0, except the one pill button (copy email) at 999px.

### Section rhythm (alternate surfaces)

Hero (photo) → Purpose **paper** → The Group **ink** → Journey **paper** → Principles **ink** → Practice **paper** → Writing **paper** → Contact **ink**.

### Layout

- 12-column grid, page gutter `max(20px, 5vw)`, column gap 24px, max content width 1600px, centred.
- Vertical section padding `clamp(112px, 14vw, 208px)`. Generous whitespace is the premium signal.
- Left-aligned everything. The only centred element is the Principles statement.
- Hairlines (1px, `--hair`) as the only structural device. No boxes.

### Grain

Remove the global `.grain` overlay. Film grain lives only inside the hero shader, where it already exists.

---

## 3. Motion system (one language, applied everywhere)

- **Library roles.** GSAP + ScrollTrigger + SplitText for all scroll and reveal motion. Lenis for smooth scroll (keep `SmoothScroll.tsx`, set `lerp: 0.09`). `motion` only for the menu overlay and the copy-button state swap. anime.js only in the preloader. Three.js only in the hero.
- **Easing.**
  - Reveals: `expo.out`, 1.1–1.4s.
  - Scrubbed scroll: `none` or `power1.inOut`.
  - Overlays/curtains: `cubic-bezier(0.7, 0, 0.2, 1)`.
  - Never use bounce, elastic or back.
- **Reveal pattern (the only entrance animation).** Text lines rise out of masks: SplitText `type: "lines", mask: "lines"`, `yPercent: 100 → 0`, stagger 0.08. Hairlines draw with `scaleX 0 → 1` from the left. Images open with a `clip-path` inset. Nothing simply fades up, and no section-wide fade-in.
- **Hover.** Text shifts 6–8px or an underline draws (`background-size 0% → 100%`), 0.6s `expo.out`. One hover effect per element type, consistent site-wide.
- **No `filter: blur` anywhere except the hero name on scroll-out.** Remove the blur transitions in Principles and the preloader.
- **Critical gotcha.** Never put a CSS `transition` on an element whose `transform` GSAP animates. GSAP reads the mid-transition value and the element gets stuck off-position (this already bit this project once). Put hover transitions on an inner `<span>` and animate the outer element with GSAP.
- **Reduced motion.** Wrap every animation in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. With reduced motion:
  - content renders static and fully visible;
  - the preloader is skipped;
  - Lenis is off;
  - pinned sections become normal stacked layouts.
- **Performance.**
  - Animate only `transform`, `opacity` and `clip-path`.
  - Cap WebGL DPR at 1.75.
  - Pause the WebGL loop when the hero is off-screen using a per-frame `getBoundingClientRect()` check, **not** IntersectionObserver (the pinned hero breaks IO in dev mode; this is already fixed in `Hero.tsx`, keep it).

---

## 4. Section-by-section spec

### 4.1 Preloader (`Preloader.tsx`)

Shorten to ≤ 1.8s and simplify.

- Ink full-screen. The name "Sagar Sharma" in `--t-h2` Geist 500 rises out of a line mask.
- Under it, a 1px hairline (`--hair-dark`) fills left → right as a progress bar. A Geist Mono `000 → 100` counter sits bottom-right.
- Exit: the whole ink panel wipes upward (`clip-path: inset(0 0 100% 0)`, 1.0s, film ease). Call `markReady()` at ~40% of the wipe so the hero intro overlaps.
- Remove "SR18 Group presents", the letterbox bars and all blur.
- Skip the preloader on repeat visits in the same tab with `sessionStorage` (wrap in try/catch).

### 4.2 Navigation (`Nav.tsx`)

- Fixed top bar, `mix-blend-difference`, text in `--mist`.
  - Left: "Sagar Sharma" (14px, 500).
  - Centre (≥1024px): "Chief Technology Officer, SR18 Group" in `--mist-mute`.
  - Right: "Index" + two-line icon.
- Hide on scroll down, show on scroll up (keep the existing logic).
- **Index overlay:** paper surface, opens with a top-down `clip-path` wipe.
  - Left 8 columns: section links in `--t-h1`, staggered line-mask reveal. Hovering one dims the others to 30% opacity.
  - Right column: "Find me" (LinkedIn, email) and the role line.
  - Esc closes it. Lenis stops while it's open. Focus is trapped and returns to the button on close.

### 4.3 Hero (`Hero.tsx`), the one signature moment

- **Keep the Three.js plate shader** (dimmed room, soft light, grain, push-in on scroll). Keep the colour photo (`MONO = false`), but grade it calmer: multiply saturation by ~0.85 in the shader and add a very slight cool lift in the shadows, so it reads expensive rather than stock.
- **Restore the depth layer.**
  - Re-enable the subject `<img>` using `@/assets/sagar-subject1.webp` and fix the dead import.
  - Layer order: plate canvas (z-0) → left legibility gradient (`from-ink/70 via-ink/25 to-transparent`, 62% width on desktop) → **name** (z-10) → **subject cut-out** (z-20) → captions (z-40).
  - The name sits behind him. Tune position so at 1440×900 the last letter of "Sharma" just tucks behind his shoulder without hurting legibility.
  - On mobile (<768px) put the name in front of the subject (z-30), bottom-left.
- **Name.** `--t-display`, two lines ("Sagar" / indented "Sharma"), `--mist`.
- **Remove** the uppercase red eyebrow, the "SR18 GROUP" bordered block with " · " joined focus areas, and "Independent technology portfolio". Replace with:
  - top-left under the nav: "Chief Technology Officer, SR18 Group" (14px, `--mist-mute`);
  - bottom-left: the tagline "Building technology ecosystems that help businesses scale with confidence." (17px, `--mist`, max 34ch);
  - bottom-right: "Scroll" with the existing animated 1px cue line (the cue line uses `--signal`).
- **Intro (after `markReady`):**
  1. plate `uReveal 0 → 1` over 2.4s;
  2. subject fades in with `scale 1.04 → 1`;
  3. name lines rise from masks (stagger 0.12);
  4. captions fade in last.
- **Scroll-out** (pinned for 90% of viewport height, as now): stage scales to 1.3 toward his face, the name drifts up and blurs out, the subject darkens, the plate fades to ink. Then the hard cut to the paper Purpose section is the cinematic beat.
- **Pointer.** Re-add the subtle parallax (subject ±12px, name ∓18px) and the soft light following the cursor, fine pointers only. Keep it barely perceptible.

### 4.4 Purpose (`Purpose.tsx`), paper

- `ChapterMark` "Purpose".
- Statement "Technology should never exist for its own sake." in `--t-h1`, max 14ch, line-mask reveal.
- The 21:9 office still (`sagar-still.webp`, colour, same calm grade via CSS `saturate(.85)`) opens from a centred slit `inset(46% 22%) → inset(0)` on scroll (scrubbed), with the inner image scaling `1.25 → 1.05`.
  - Subtitle inside the frame, bottom-centre, 15px `--mist`: “Design for the decade, not the quarter.”
  - On mobile the frame is 4:3, centred on him (`object-position: 62% 50%`).
- Below: a 12-col split.
  - Left 8 columns: "Technology should solve business problems… long-term value." in `--t-h2` Geist 400, with the existing word-by-word opacity scrub (0.15 → 1).
  - Right 3 columns: the two short paragraphs, 15px `--graphite`.

### 4.5 The Group (`Group.tsx`), ink

- `ChapterMark` "The Group".
- Statement "One architecture across five industries." in `--t-h1`. To its right (columns 10–12), the first-person paragraph in `--mist-mute`.
- **Industry index.** Five rows separated by `--hair-dark`. Each row is a 12-col grid: industry name in `--t-h2` (columns 1–6), description 15px `--mist-mute` (columns 8–11), and a small `→` that appears on hover (column 12).
- **Hover (desktop):** the other rows dim to 30%, the hovered name shifts 8px right (inner span), the description goes to `--mist`, and a 1px `--signal` underline draws under the name.
- **Entrance:** each row's hairline draws, then its name rises from a mask, staggered as rows enter.
- **Focus areas:** one quiet line at the bottom. Label "Focus areas" 14px `--mist-mute`, then the seven areas as a comma-separated sentence in `--t-h3` `--mist`.

### 4.6 Journey (`Journey.tsx`), paper

- Keep the sticky odometer year (it's the section's signature). Restyle it in **Geist Mono**, weight 300, `clamp(80px, 13vw, 200px)`, `--ink`. Digits roll with `expo.inOut` 1.4s, staggered 0.07s per digit.
- Under the year: the period ("2012 — 2016") 14px `--mute` and a Geist Mono `01 / 05` counter.
- Right column (columns 8–12): five entries, each `min-height: 72svh`, vertically centred:
  - period 14px `--mute`;
  - kicker in `--t-h2`;
  - role + org (org in `--graphite`);
  - body 17px `--graphite`, max 46ch.
- Inactive entries sit at 35% opacity on desktop. A 1px progress line on the left fills as you scroll.
- Use `onEnter` and `onEnterBack` (not `onToggle`) to set the active entry, so fast scrolling can't skip the last one.
- **Mobile:** the year sticks to the top with a paper background behind it, smaller (72px). Entries stack below at full opacity.

### 4.7 Principles (`Principles.tsx`), ink, pinned

- Pinned for `n × 80vh`. One principle at a time, left-aligned at columns 2–10, in `--t-h1` Geist 500 `--mist`, max 18ch.
- **Transition:** the outgoing lines slide up out of their masks (`yPercent 0 → −100`); the incoming lines rise in (`100 → 0`), stagger 0.06, overlapping by 0.2. **No blur, no letter-spacing tween.**
- The first principle is fully visible when the pin starts (no empty frame).
- **Bottom bar:** "Leadership philosophy" 14px `--mist-mute` on the left. On the right, six 24px ticks (inactive `--hair-dark`, past `--mist-mute`, current `--signal`) and a Geist Mono `01 / 06`, `aria-live="polite"`.
- **Reduced motion:** a stacked list of six statements in `--t-h2`.

### 4.8 Practice (`Practice.tsx`), paper

- `ChapterMark` "Practice". Statement "Eight disciplines that compound." in `--t-h1`.
- 4 × 2 grid (2 × 4 on tablet, 1 column on mobile). Each cell:
  - 1px top hairline (`--hair`) with a second `--ink` hairline that draws across on hover;
  - title in `--t-h3` with 24px space above;
  - body 15px `--graphite`, max 34ch.
- No icons, no numbers, no cards.
- **Entrance:** cells stagger in (y 24 → 0, opacity 0 → 1, 0.06s apart) once the grid hits 80% of the viewport.

### 4.9 Writing (`Practice.tsx` → `Writing`), paper

- `ChapterMark` "Writing". Four rows, hairline-separated.
  - Title in `--t-h2` Geist 500 (columns 1–9).
  - Tag 14px `--mute` right-aligned (columns 10–11).
  - `↗` in column 12 that slides 4px up and right on hover.
- Hover: the other rows dim to 30% and the title shifts 8px (inner span).
- The essays don't exist yet. Until real URLs are added to `data.ts`:
  - render each row as a non-link `<div>`;
  - show the tag as "Coming soon";
  - drop the hover affordance;
  - support an optional `href` field per item so rows become real links once filled in.

### 4.10 Contact + footer (`Contact.tsx`), ink

- `ChapterMark` "Contact". "Let's build technology that lasts." in `--t-display`, max 11ch, line-mask reveal.
- A three-column row:
  - **Email:** the address in `--t-h2` with the draw-line hover (`--signal` underline), plus a pill "Copy" button that swaps to "Copied" using `motion` and a Geist Mono label.
  - **LinkedIn**.
  - **Schedule a conversation** (mailto with a subject, as now).
  - Each column has a 14px `--mist-mute` label.
- **Footer:**
  - hairline; then a row with "© {year} Sagar Sharma", the role line and "Back to top" (Lenis scroll);
  - then the giant "Sagar Sharma" in Geist 500, fitted to **96%** of viewport width (fix the current 78%) and clipped at the baseline. It rises from below as the footer scrolls in (scrubbed `yPercent 100 → 0`).

---

## 5. Hero image notes

- Assets live in `src/assets/`:
  - `sagar-plate.webp`: the full room, 1248×832;
  - `sagar-subject1.webp`: the cut-out on the same canvas, so it aligns pixel-for-pixel with the plate;
  - `sagar-still.webp`: the 21:9 crop.
- Delete unused assets and imports (`sagar-portrait.jpg` if unused, the dead `sagar-subject.webp` import).
- The photo is low resolution. If `public/` or the repo later gets a larger original, regenerate all three crops from it at 2× and keep the same aspect ratios.
- The source photo carries a Gemini sparkle mark bottom-right. Do **not** remove, inpaint or crop it out specifically; leave the image as supplied.

---

## 6. SEO & meta (`src/routes/__root.tsx`)

- Title: "Sagar Sharma, Chief Technology Officer, SR18 Group". Keep or refine the description and the OG/Twitter tags.
- Add JSON-LD `Person` schema:
  - `name`, `jobTitle`, `worksFor` (Organization "SR18 Group");
  - `alumniOf` "Delhi Technological University";
  - `sameAs` the LinkedIn URL from `data.ts`.
- Set `theme-color` to `#0E0F11`.
- One `<h1>` (the hero name). Each section heading is an `<h2>`; items are `<h3>`.

---

## 7. Accessibility

- All text meets WCAG AA. The palette in §2 is pre-checked; don't introduce new text colours without checking contrast.
- Visible focus: a 2px `--signal` outline with 4px offset on every interactive element.
- Keyboard: the menu, copy button, links and back-to-top all work by keyboard. The menu traps focus and closes on Esc.
- The hero `<canvas>` is `aria-hidden`. The subject image keeps its alt text. Decorative SVGs and hairlines are `aria-hidden`.
- `prefers-reduced-motion` is fully honoured (§3).

---

## 8. Don'ts (these make it look templated)

- No uppercase letter-spaced eyebrow labels.
- No " · " joined meta strings.
- No `→` appended to button text (the hover arrows in rows are fine).
- No gradients as decoration, glass, glow, drop shadows, rounded cards or icon grids.
- No numbered markers on non-sequential content. Journey and Principles are sequences; Practice, Group and Writing are not.
- No new fonts beyond Geist + Geist Mono. No CDN font links.
- No invented copy, metrics or logos.
- No custom cursor (it was intentionally removed).

---

## 9. Verification (must pass before each commit)

1. `npx tsc --noEmit` reports no new errors, and `npm run build` succeeds.
2. `npm run dev` runs, and the browser console has no errors and no hydration warnings.
3. Check every section at **390×844, 768×1024, 1440×900 and 1920×1080**:
   - no horizontal scroll;
   - no text overlapping the subject's face;
   - the name readable over the window light;
   - pinned sections release correctly;
   - the odometer reaches the last year.
4. Test with **Emulate prefers-reduced-motion** turned on: everything is visible and static, and there's no preloader.
5. Lighthouse (mobile): Performance ≥ 85, Accessibility ≥ 95, SEO 100.
6. Write a short PR description: what changed per section, before/after screenshots at 1440 and 390, and any open items (essay URLs, real email/LinkedIn, a higher-resolution photo).

Work through it in this order:
1. tokens and fonts;
2. nav and preloader;
3. hero;
4. Purpose;
5. Group;
6. Journey;
7. Principles;
8. Practice and Writing;
9. Contact;
10. SEO and accessibility pass.

Commit after each step.
