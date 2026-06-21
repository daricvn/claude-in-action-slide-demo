# CLAUDE.md

SolidJS + UnoCSS + Vite slide deck ("Claude in Action"). Glassmorphism, animated
canvas background, unique entrance transition per slide.

**Read [ARCHITECTURE.md](ARCHITECTURE.md) before any structural change** — it is
the source of truth for layout, state flow, z-index layering, transitions, and
performance constraints. This file is only the quick map.

## Commands
- `npm run dev` — dev server, http://localhost:3000
- `npm run build` — prod build to `dist/` (use to verify; no test suite)

## Where things live
- `src/App.tsx` — orchestrator: `current`/`modalOpen` signals, slide track, keys, swipe.
- `src/slides.ts` — `SLIDES[]` content model (`{ icon, title, bullets[], insight }`).
- `src/styles.css` — base canvas + `.enter-*` entrance keyframes + bullet stagger.
- `src/components/` — `Orbs`, `ParticleField`, `SlideNav`, `AllSlidesModal`.
- `unocss.config.ts` — theme colours + `glass`/`glass-pill`/`text-gradient` shortcuts.

## Adding a demo video to a slide

`VideoModal` + `onWatchDemo` pattern lives in `src/App.tsx`. To wire a video into any slide:

1. **Drop video** into `src/assets/` (e.g. `demo-foo.mp4`).
2. **Import** it at the top of `App.tsx` alongside other asset imports:
   ```ts
   import demoFoo from './assets/demo-foo.mp4';
   ```
3. **Target the slide by zero-based index** in the `<For each={SLIDES}>` render. Pass `onWatchDemo` only for that index:
   ```tsx
   onWatchDemo={i() === N ? () => setVideoOpen(true) : undefined}
   ```
   where `N` = `SLIDES` index (0-based), e.g. slide 9 (last) = `8`.
4. **If adding a second independent video**, add a new signal (`videoFooOpen`) and a second `<VideoModal>` instance with its own `src` and `onClose`. Do not reuse the existing `videoOpen` signal for a different video.
5. `VideoModal` closes on: X button (top-right), clicking the dark overlay, or Escape key. No auto-close on video end.

## Rules
- UnoCSS preset is `presetWind3` — needs blur/shadow/ring/gradient utilities. Not `presetMini`.
- Background layers (`Orbs`, `ParticleField`) sit at `z-0`. Never negative z — drops them behind `body`, deck goes black.
- Performance is load-bearing: scoped `will-change`, capped `glass` blur, throttled/capped canvas. Do not naively revert — see ARCHITECTURE.md § Performance.
- New slide = append `SLIDES` + add a `VARIANTS[]` entry in `App.tsx`. Keep aligned.
- Design tokens live once in `unocss.config.ts`. Reuse shortcuts, don't inline new glass recipes.
- Verify visual/transition work in the browser — build passing ≠ it renders.
