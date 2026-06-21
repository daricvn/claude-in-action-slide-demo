# ARCHITECTURE.md

Presentation-grade slide deck — **"Claude in Action"** — SolidJS + UnoCSS + Vite. Glassmorphism design, animated canvas background, unique entrance transition per slide.

> First read for any agent/human touching repo. Keep current: update same change that alters structure, slide model, or layering.

---

## Stack

| Concern        | Choice                                   | Source of truth         |
| -------------- | ---------------------------------------- | ----------------------- |
| UI framework   | SolidJS 1.9 (fine-grained reactivity)    | `package.json`          |
| Styling        | UnoCSS — `presetWind3` (Tailwind-compat) | `unocss.config.ts`      |
| Build / dev    | Vite 7 (`vite-plugin-solid`, port 3000)  | `vite.config.ts`        |
| Icons          | `lucide-solid`                           | `src/slides.ts`         |
| Language       | TypeScript (strict), JSX → `solid-js`    | `tsconfig.json`         |

`presetWind3` required — not `presetMini`. Design uses `backdrop-blur`, `blur-3xl`, `shadow-2xl`, `ring`, gradient utilities absent from `presetMini`. (`@unocss/preset-mini` stays as transitive dep, not active preset.)

---

## Run

```bash
npm run dev      # vite dev server → http://localhost:3000
npm run build    # production build → dist/
npm run serve    # preview the built dist/
```

---

## File map

```
index.html              # Inter font load, #root, theme-color
src/
  index.tsx             # entry: imports uno.css + styles.css, renders <App>
  App.tsx               # orchestrator — state, nav, transitions, slide track
  slides.ts             # SLIDES[] data model + lucide icon per slide
  styles.css            # base canvas + entrance keyframes + bullet stagger
  components/
    Orbs.tsx            # blurred colour orbs (far background layer)
    ParticleField.tsx   # animated <canvas> constellation (near bg layer)
    SlideNav.tsx        # fixed bottom glass nav pill
    AllSlidesModal.tsx  # "All Slides" overview grid modal
unocss.config.ts        # theme colours + glass/glass-pill/text-gradient shortcuts
```

---

## Component graph

```
App (src/App.tsx)
├── Orbs            slide={current()}   ← background layer 1 (z-0, blurred orbs)
├── ParticleField  slide={current()}   ← background layer 2 (z-0, canvas)
├── progress bar                        (z-40)
├── slide track    translateX(-current*100vw)   (z-10)
│   ├── HeroSlide        (slide 0, local component)
│   └── ContentSlide ×9  (slides 1–9, local component, .map over SLIDES)
├── SlideNav                            (z-40)
└── AllSlidesModal                      (z-50)
```

`HeroSlide` and `ContentSlide` defined locally in `App.tsx` (not exported) — presentation-only, share `App`'s `current()` signal via `active` accessor.

---

## State & data flow

Single source of truth in `App.tsx`:

- `current` — `createSignal<number>` (0–9). Drives **everything**: track `translateX`, orb/particle colour, progress bar, active-slide entrance, nav indicator.
- `modalOpen` — `createSignal<boolean>` for overview modal.

Each slide gets `active={() => current() === i}` (accessor, lazy so only relevant slide re-renders). When `active()` flips true, card gains `is-active`, triggering CSS entrance.

`SLIDES` (`src/slides.ts`) — content model, array of `{ icon, title, bullets[], insight }`. Slide 0 (hero) bespoke, not in `SLIDES`; total count `SLIDES.length + 1`.

---

## Rendering layers (z-index)

Background: two **fixed** layers behind content. Both at `z-0` (above opaque `body` bg, below content) — negative z-index drops them behind `body`, renders deck black.

| Layer            | z      | What                                              |
| ---------------- | ------ | ------------------------------------------------- |
| `body` bg        | —      | `#05050a` base canvas (`styles.css`)              |
| `Orbs`           | `z-0`  | 6 blurred radial orbs, glide on slide change      |
| `ParticleField`  | `z-0`  | animated constellation `<canvas>` (paints on top) |
| slide track      | `z-10` | glass cards                                       |
| progress / nav   | `z-40` | top bar + bottom nav pill                         |
| modal            | `z-50` | overview grid                                     |

---

## Transitions (the "wow")

1. **Slide track** — horizontal flex, width `1000vw`, `transform: translateX(-current*100vw)`, `0.7s cubic-bezier(0.23,1,0.32,1)`.
2. **Per-slide entrance** — each card has unique `.enter-*` class (`VARIANTS[]` in `App.tsx`) mapped to `@keyframes` in `styles.css`: hero (blur-scale), rise, zoom, flip-x (3D), door (rotateY), curtain (clip-path), tilt, focus-blur, unfold (rotateX), glide-skew. Played via CSS `animation` on `.is-active`, so revisiting replays.
3. **Bullet stagger** — `.reveal` elements with inline `transition-delay` per index; some variants override reveal vector (left / scale / right).
4. **Background** — orbs reposition on sinusoidal paths; canvas field colour lerps to active slide's accent.

---

## Performance notes (load-bearing — do not naively revert)

Glass + live canvas has real perf cliff. Mitigations:

- **`will-change` scoped to `.is-active` only**, not all `.slide-card` / `.reveal`. Blanket `will-change` GPU-promotes all 10 cards (across 1000vw track) with retained blur buffers — expensive.
- **`glass` blur capped at `backdrop-blur-lg` (16px)**, fill bumped to `/8`. Larger blur re-blurs animated canvas behind every card every frame — dominant cost. (`unocss.config.ts`)
- **`ParticleField` throttled to ~30fps, DPR capped at 1.5, particle count capped at 90, no `ctx.shadowBlur`** (halo ring + bright core under `lighter` compositing instead). Link pass is O(n²), hence node cap.

---

## Input handling

All in `App.tsx`:

- **Keyboard** (window listener): `←/→`, `Space` / `Shift+Space`, `Home`/`End`, digits `0–9` jump, `Escape` closes modal.
- **Touch/pointer swipe**: pointer down/up on `<main>`, >60px horizontal delta navigates (mouse excluded — uses nav).

---

## Conventions

- Design tokens in `unocss.config.ts` once: brand colours (`cyanGlow` #67E8F9, `violetGlow` #C084FC, `emeraldGlow` #6EE7B7, `cosmic`) + shortcuts (`glass`, `glass-pill`, `text-gradient`). Reuse — don't inline new glass recipes per component.
- Custom CSS utilities can't express (keyframes, base canvas, staggered reveal) in `styles.css`. Everything else UnoCSS utility classes.
- New content slide = append to `SLIDES` + add `VARIANTS[]` entry. Keep arrays aligned.
