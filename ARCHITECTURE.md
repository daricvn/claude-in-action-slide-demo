# ARCHITECTURE.md

Presentation-grade slide deck — **"Claude in Action"** — SolidJS + UnoCSS + Vite. Glassmorphism design, animated canvas background, unique entrance transition per slide. Localized EN/VI.

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

## File map

```
index.html              # Inter font load, #root, theme-color
src/
  index.tsx             # entry: imports uno.css + styles.css, renders <App>
  App.tsx               # orchestrator — state, nav, transitions, slide track, VideoModal
  slides.ts             # structural model: SLIDE_ICONS[] (icon per slide) + SLIDE_COUNT
  i18n.ts               # locale signal + en/vi dicts (UI strings + SlideText per slide)
  styles.css            # base canvas + entrance keyframes + bullet stagger + ambient
  components/
    Orbs.tsx            # blurred colour orbs (far background layer)
    ParticleField.tsx   # animated <canvas> constellation (near bg layer)
    SlideNav.tsx        # fixed bottom glass nav pill
    AllSlidesModal.tsx  # "All Slides" overview grid modal
    LanguageSwitcher.tsx # flag dropdown (top-left), flips locale signal
unocss.config.ts        # theme colours + glass/glass-pill/text-gradient shortcuts
```

---

## Component graph

```
App (src/App.tsx)
├── LanguageSwitcher                    (z-40, top-left, flips locale)
├── Orbs            slide={current()}   ← background layer 1 (z-0, blurred orbs)
├── ParticleField  slide={current()}   ← background layer 2 (z-0, canvas)
├── progress bar                        (z-40)
├── slide track    translateX(-current*100vw)   (z-10)
│   ├── HeroSlide        (slide 0, local component)
│   └── ContentSlide ×N  (slides 1–N, local component, .map over SLIDE_ICONS)
├── SlideNav                            (z-40)
├── AllSlidesModal                      (z-50)
└── VideoModal                          (z-50, shared, driven by activeVideo signal)
```

`HeroSlide`, `ContentSlide`, and `VideoModal` defined locally in `App.tsx` (not exported) — presentation-only, share `App`'s signals via closures/props.

---

## State & data flow

Signals in `App.tsx`:

- `current` — `createSignal<number>` (0..SLIDE_COUNT). Drives **everything**: track `translateX`, orb/particle colour, progress bar, active-slide entrance, nav indicator.
- `modalOpen` — `createSignal<boolean>` for overview modal.
- `activeVideo` — `createSignal<string | null>` for `VideoModal`. `null` = closed.

Signal in `i18n.ts` (module-level, shared):

- `locale` — `createSignal<Locale>` (`'en'` | `'vi'`), persisted to `localStorage`. `t()` returns active dict. Components read `t()` inside JSX → deck re-renders on locale flip.

Each slide gets `active={() => current() === i}` (accessor, lazy so only relevant slide re-renders). When `active()` flips true, card gains `is-active`, triggering CSS entrance.

---

## Data model

**`src/slides.ts`** — structural model only:
- `SLIDE_ICONS: IconComponent[]` — one lucide icon per content slide, index-aligned with `t().slides[i]`.
- `SLIDE_COUNT` — `SLIDE_ICONS.length` (excludes hero).

**`src/i18n.ts`** — all user-facing text:
- `SlideText: { title, bullets, insight? }` per slide per locale.
- `en.slides[]` and `vi.slides[]` — must stay index-aligned with `SLIDE_ICONS[]`.
- `en.ui` / `vi.ui` — non-slide strings (hero eyebrow, nav labels, etc.).

**`App.tsx`** — four parallel arrays (index i = content slide i, 0-based):

| Array | Purpose |
|-------|---------|
| `SLIDE_IMAGES[]` | Background photo asset per slide |
| `VARIANTS[]` | Entrance transition class (`.enter-*`) per slide |
| `AMBIENT[]` | Slow Ken Burns drift class (`ambient-*`) per slide |

**`SLIDE_DEMOS`** — `Record<number, Demo[]>` in `App.tsx`. Zero-based slide index → array of `{ label: Record<Locale, string>; src: string }`. Each demo renders its own labelled "Watch" button; all play in the shared `VideoModal`. To add a demo: import asset, append entry under target index. No new signal or modal needed.

---

## Rendering layers (z-index)

Background: two **fixed** layers behind content. Both at `z-0` (above opaque `body` bg, below content) — negative z-index drops them behind `body`, renders deck black.

| Layer            | z      | What                                              |
| ---------------- | ------ | ------------------------------------------------- |
| `body` bg        | —      | `#05050a` base canvas (`styles.css`)              |
| `Orbs`           | `z-0`  | 6 blurred radial orbs, glide on slide change      |
| `ParticleField`  | `z-0`  | animated constellation `<canvas>` (paints on top) |
| slide track      | `z-10` | glass cards                                       |
| progress / nav / lang | `z-40` | top bar + bottom nav pill + LanguageSwitcher |
| modal / video    | `z-50` | AllSlidesModal + VideoModal                       |

---

## Transitions (the "wow")

1. **Slide track** — horizontal flex, width `(SLIDE_COUNT+1)*100vw`, `transform: translateX(-current*100vw)`, `0.7s cubic-bezier(0.23,1,0.32,1)`.
2. **Per-slide entrance** — each card has unique `.enter-*` class (`VARIANTS[]` in `App.tsx`) mapped to `@keyframes` in `styles.css`: hero (blur-scale), rise, zoom, flip-x (3D), door (rotateY), curtain (clip-path), tilt, focus-blur, unfold (rotateX), glide-skew. Played via CSS `animation` on `.is-active`, so revisiting replays.
3. **Bullet stagger** — `.reveal` elements with inline `transition-delay` per index; some variants override reveal vector (left / scale / right).
4. **Background photo** — `.slide-bg-art` runs ambient Ken Burns (`amb-*` keyframes) only while `.is-active`. Off-screen slides never animate (perf constraint). Six flavours (`ambient-1`–`ambient-6`), assigned per slide in `AMBIENT[]`.
5. **Orbs / canvas** — orbs reposition on sinusoidal paths; canvas field colour lerps to active slide's accent.

---

## Performance notes (load-bearing — do not naively revert)

Glass + live canvas has real perf cliff. Mitigations:

- **`will-change` scoped to `.is-active` only**, not all `.slide-card` / `.reveal`. Blanket `will-change` GPU-promotes all cards (across full-width track) with retained blur buffers — expensive.
- **`glass` blur capped at `backdrop-blur-lg` (16px)**, fill bumped to `/8`. Larger blur re-blurs animated canvas behind every card every frame — dominant cost. (`unocss.config.ts`)
- **`ParticleField` throttled to ~30fps, DPR capped at 1.5, particle count capped at 90, no `ctx.shadowBlur`** (halo ring + bright core under `lighter` compositing instead). Link pass is O(n²), hence node cap.
- **Ambient keyframes gated to `.is-active`** — off-screen slides never run `@keyframes amb-*`.

---

## Input handling

All in `App.tsx`:

- **Keyboard** (window listener): `←/→`, `Space` / `Shift+Space`, `Home`/`End`, digits `0–9` jump, `Escape` closes modal or video.
- **Touch/pointer swipe**: pointer down/up on `<main>`, >60px horizontal delta navigates (mouse excluded — uses nav).

---

## Localization

`src/i18n.ts` owns all user-facing text. `locale` signal (module-level) drives `t()`. `LanguageSwitcher` flips `locale`, persisted to `localStorage`.

To add a language: extend `Locale` type, `LOCALES` array, `DICTS` map, and add a flag SVG in `LanguageSwitcher.tsx`.

Slide icons live in `slides.ts` (not localized); `SLIDE_ICONS[i]` aligns by index with `t().slides[i]`.

---

## Conventions

- Design tokens in `unocss.config.ts` once: brand colours (`cyanGlow` #67E8F9, `violetGlow` #C084FC, `emeraldGlow` #6EE7B7, `cosmic`) + shortcuts (`glass`, `glass-pill`, `text-gradient`). Reuse — don't inline new glass recipes per component.
- Custom CSS that utilities can't express (keyframes, base canvas, staggered reveal) goes in `styles.css`. Everything else UnoCSS utility classes.
- New content slide = append to `SLIDE_ICONS[]` + `SLIDE_IMAGES[]` + `VARIANTS[]` + `AMBIENT[]` (App.tsx) + `SlideText` per locale (i18n.ts). Keep all arrays length = `SLIDE_COUNT`.
- Demo video for slide N = import asset in `App.tsx`, append `{ label, src }` to `SLIDE_DEMOS[N]`. No new signal or modal.
