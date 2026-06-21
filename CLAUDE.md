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
- `src/slides.ts` — structural model: `SLIDE_ICONS[]` (icon per slide) + `SLIDE_COUNT`.
- `src/i18n.ts` — `locale` signal + `en`/`vi` dicts: UI strings + per-slide `SlideText`. `t()` = active dict.
- `src/styles.css` — base canvas + `.enter-*` entrance keyframes + bullet stagger.
- `src/components/` — `Orbs`, `ParticleField`, `SlideNav`, `AllSlidesModal`, `LanguageSwitcher` (flag dropdown, top-left).
- `unocss.config.ts` — theme colours + `glass`/`glass-pill`/`text-gradient` shortcuts.

## Localization
All user-facing text lives in `src/i18n.ts` (`en`/`vi`). Slide *icons* stay in
`slides.ts`; `SLIDE_ICONS[i]` aligns by index with `t().slides[i]`. Components
read `t()` inside JSX so the deck re-renders on locale change. `LanguageSwitcher`
flips `locale` (persisted to localStorage). Add a language = extend `Locale`,
`LOCALES`, the `DICTS` map, and a flag SVG in `LanguageSwitcher.tsx`.

## Adding a demo video to a slide

Videos are data-driven via the `SLIDE_DEMOS` map in `src/App.tsx`. A slide can
carry **any number** of demos; each renders its own labelled "Watch" button, and
all of them play in one shared `VideoModal` (driven by the `activeVideo` signal).
To add a video to any slide:

1. **Drop video** into `src/assets/` (e.g. `demo-foo.mp4`).
2. **Import** it at the top of `App.tsx` alongside other asset imports:
   ```ts
   import demoFoo from './assets/demo-foo.mp4';
   ```
3. **Append a `{ label, src }` entry** under the target slide's zero-based index
   in `SLIDE_DEMOS`. `label` is **localized** — one string per `Locale`:
   ```ts
   const SLIDE_DEMOS: Record<number, Demo[]> = {
     6: [
       { label: { en: 'Watch Mempalace Demo', vi: 'Xem demo Mempalace' }, src: demoMempalace },
       { label: { en: 'Watch Foo Demo', vi: 'Xem demo Foo' }, src: demoFoo }, // second demo, same slide
     ],
   };
   ```
   where the key `N` = slide index (0-based), e.g. last slide = `SLIDE_COUNT - 1`.
4. **No new signal or second `<VideoModal>` is needed.** Every demo button calls
   `onPlay(src)` → `setActiveVideo(src)`, and the single shared modal plays it.
   The button renders `label[locale()]`, so make it specific per video.
5. `VideoModal` closes on: X button (top-right), clicking the dark overlay, or
   Escape key (resets `activeVideo` to `null`). No auto-close on video end.

## Rules
- UnoCSS preset is `presetWind3` — needs blur/shadow/ring/gradient utilities. Not `presetMini`.
- Background layers (`Orbs`, `ParticleField`) sit at `z-0`. Never negative z — drops them behind `body`, deck goes black.
- Performance is load-bearing: scoped `will-change`, capped `glass` blur, throttled/capped canvas. Do not naively revert — see ARCHITECTURE.md § Performance.
- New slide = append `SLIDE_ICONS` (slides.ts) + a `SlideText` entry per locale in `i18n.ts` + a `VARIANTS[]` entry in `App.tsx`. Keep arrays aligned.
- Design tokens live once in `unocss.config.ts`. Reuse shortcuts, don't inline new glass recipes.
- Verify visual/transition work in the browser — build passing ≠ it renders.
