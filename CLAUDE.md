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

## Adding or replacing slides

Four parallel arrays in `App.tsx` must stay index-aligned with each other and with `SLIDE_ICONS[]` in `slides.ts`:

| Array | Purpose | File |
|-------|---------|------|
| `SLIDE_IMAGES[]` | Background photo per slide | `App.tsx` |
| `VARIANTS[]` | Entrance transition class per slide | `App.tsx` |
| `AMBIENT[]` | Slow Ken Burns drift class per slide | `App.tsx` |
| `SLIDE_ICONS[]` | Icon component per slide | `slides.ts` |

Plus one `SlideText` entry per locale in `i18n.ts`.

### Adding a new slide

1. **Image** — drop photo into `src/assets/` (e.g. `slide-10.jpg`), import it in `App.tsx`, and append to `SLIDE_IMAGES[]`.
2. **Icon** — append an icon from `lucide-solid` to `SLIDE_ICONS[]` in `slides.ts`; increment `SLIDE_COUNT`.
3. **Text** — append a `SlideText` (`{ title, bullets, insight? }`) to both `en.slides` and `vi.slides` in `i18n.ts`. Index must match the icon.
4. **Entrance transition** — append one `.enter-*` class name to `VARIANTS[]` in `App.tsx`. Available keyframes (defined in `styles.css`): `enter-rise`, `enter-zoom`, `enter-flipx`, `enter-door`, `enter-curtain`, `enter-tilt`, `enter-focus`, `enter-unfold`, `enter-glide`. To add a new transition: write its `@keyframes enter-<name>` in `styles.css`, wire up `.enter-<name>.slide-card.is-active` and `.enter-<name>.slide-card.is-exiting` CSS rules following the pattern of existing variants, then use the class name in `VARIANTS[]`.
5. **Ambient animation** — append one `ambient-*` class to `AMBIENT[]`. Six flavours cycle (`ambient-1`–`ambient-6`); pick any or repeat. Each runs its `@keyframes amb-*` **only while `.is-active`** — off-screen slides never animate (perf constraint). To add a new ambient flavour: write `@keyframes amb-<n>` in `styles.css` and add `.ambient-<n>.is-active .slide-bg-art { animation-name: amb-<n>; animation-duration: Xs; }`. Keep scale ≥ 1.05 and pan offsets within scale headroom so `bg-cover` never exposes glass beneath.

### Replacing a slide's content

- **Text only** — edit the matching index in `en.slides` / `vi.slides` in `i18n.ts`.
- **Image** — swap the import and update `SLIDE_IMAGES[i]` in `App.tsx`.
- **Transition** — change `VARIANTS[i]` to a different `.enter-*` class.
- **Ambient** — change `AMBIENT[i]` to a different `ambient-*` class.
- **Icon** — replace `SLIDE_ICONS[i]` in `slides.ts` (no count change needed).
- Keep all five arrays at the same length as `SLIDE_COUNT`.

### Full slide replacement (rewrite all content)

Replace every entry in `SLIDE_IMAGES[]`, `VARIANTS[]`, `AMBIENT[]`, `SLIDE_ICONS[]`, and both locale `slides[]` arrays simultaneously. Update `SLIDE_COUNT` if the count changes. Verify array lengths match before building.

## Rules
- UnoCSS preset is `presetWind3` — needs blur/shadow/ring/gradient utilities. Not `presetMini`.
- Background layers (`Orbs`, `ParticleField`) sit at `z-0`. Never negative z — drops them behind `body`, deck goes black.
- Performance is load-bearing: scoped `will-change`, capped `glass` blur, throttled/capped canvas. Do not naively revert — see ARCHITECTURE.md § Performance.
- New slide = append `SLIDE_ICONS` (slides.ts) + a `SlideText` entry per locale in `i18n.ts` + a `VARIANTS[]` entry in `App.tsx`. Keep arrays aligned.
- Design tokens live once in `unocss.config.ts`. Reuse shortcuts, don't inline new glass recipes.
- Verify visual/transition work in the browser — build passing ≠ it renders.
