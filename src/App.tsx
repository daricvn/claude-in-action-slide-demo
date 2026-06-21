import {
  createSignal,
  batch,
  onMount,
  onCleanup,
  For,
  Show,
  type Component,
  type Accessor,
} from "solid-js";
import { Lightbulb, Sparkles, Play, X, Maximize2, Minimize2 } from "lucide-solid";
import { SLIDE_ICONS, SLIDE_COUNT, type IconComponent } from "./slides";
import { locale, t, type Locale, type SlideText } from "./i18n";
import Orbs from "./components/Orbs";
import ParticleField from "./components/ParticleField";
import SlideNav from "./components/SlideNav";
import AllSlidesModal from "./components/AllSlidesModal";
import LanguageSwitcher from "./components/LanguageSwitcher";
import slide1 from "./assets/slide-1.jpg";
import slide2 from "./assets/slide-2.jpg";
import slide3 from "./assets/slide-3.jpg";
import slide4 from "./assets/slide-4.jpg";
import slide5 from "./assets/slide-5.jpg";
import slide6 from "./assets/slide-6.jpg";
import slide7 from "./assets/slide-7.jpg";
import slide8 from "./assets/slide-8.jpg";
import slide9 from "./assets/slide-9.jpg";
import demoMempalace from "./assets/demo-mempalace.mp4";

// Per-content-slide background art. Index i maps to SLIDES[i] (slide i+1).
const SLIDE_IMAGES = [
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
  slide7,
  slide8,
  slide9
];

const TOTAL = SLIDE_COUNT + 1; // hero + content slides
const pad = (n: number) => String(n).padStart(2, "0");

// Unique entrance per content slide (1..8). Each maps to an .enter-* keyframe
// defined in styles.css: rise, zoom, 3D flip, door, curtain, tilt, focus-blur,
// unfold. The hero uses .enter-hero.
const VARIANTS = [
  "enter-rise",
  "enter-zoom",
  "enter-flipx",
  "enter-door",
  "enter-curtain",
  "enter-tilt",
  "enter-focus",
  "enter-unfold",
  "enter-rise",
  "enter-zoom",
  "enter-curtain",
];

// Slow "Ken Burns" drift for each slide's background photo: scale + pan +
// opacity breathe + faint blur. One of six ambient flavours per slide, mapped
// to @keyframes amb-* in styles.css. Each only runs while its card .is-active
// (gated in CSS), so the nine off-screen cards never animate. Index aligns to
// SLIDES[i]; cycles every six slides.
const AMBIENT = [
  "ambient-1",
  "ambient-2",
  "ambient-3",
  "ambient-4",
  "ambient-5",
  "ambient-6",
  "ambient-1",
  "ambient-2",
  "ambient-3",
];

// Demo videos per content slide, keyed by zero-based slide index. A slide can
// carry any number of demos; each renders its own labelled "Watch" button and
// plays in the shared VideoModal. To add a video: import the asset above, then
// append a `{ label, src }` entry under the target slide's index here. `label`
// is localized — one string per Locale (resolved via `locale()` at render).
type Demo = { label: Record<Locale, string>; src: string };
const SLIDE_DEMOS: Record<number, Demo[]> = {
  6: [
    {
      label: {
        en: "Watch Mempalace Demo",
        vi: "Xem demo Mempalace",
      },
      src: demoMempalace,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Hero (slide 0)                                                             */
/* -------------------------------------------------------------------------- */
const HeroSlide: Component<{
  active: Accessor<boolean>;
  exiting: Accessor<boolean>;
}> = (props) => (
  <div
    class="slide-card enter-hero glass relative rounded-3xl px-10 sm:px-20 py-16 sm:py-20 max-w-4xl text-center overflow-hidden"
    classList={{ "is-active": props.active(), "is-exiting": props.exiting() }}
  >
    {/* Inner top highlight for that real-glass sheen. */}
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

    <div class="slide-icon mx-auto mb-8 grid place-items-center w-16 h-16 rounded-2xl glass-pill text-cyanGlow">
      <Sparkles size={30} />
    </div>

    <p
      class="reveal text-xs sm:text-sm font-medium tracking-[0.35em] uppercase text-cyanGlow/80 mb-6"
      style={{ "transition-delay": props.active() ? "0.15s" : "0s" }}
    >
      {t().ui.heroEyebrow}
    </p>

    <h1
      class="reveal text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05]"
      style={{ "transition-delay": props.active() ? "0.25s" : "0s" }}
      aria-label="Claude in Action"
    >
      {/* Per-letter wave: each glyph carries its own gradient (a transformed
          inline-block breaks bg-clip-text inherited from a parent), bobs on an
          infinite loop, staggered by index. Animation + will-change are gated to
          .is-active in styles.css so the off-screen hero never stays promoted. */}
      <For each={[..."Claude in Action"]}>
        {(ch, i) => (
          <span
            class="wave-letter text-gradient"
            style={{ "animation-delay": `${i() * 0.08}s` }}
            aria-hidden="true"
          >
            {ch === " " ? " " : ch}
          </span>
        )}
      </For>
    </h1>

    <p
      class="reveal mt-6 text-lg sm:text-2xl text-white/70 font-light max-w-2xl mx-auto"
      style={{ "transition-delay": props.active() ? "0.4s" : "0s" }}
    >
      {t().ui.heroSubtitle}
    </p>

    <div
      class="reveal mt-10 inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill text-sm text-white/60"
      style={{ "transition-delay": props.active() ? "0.55s" : "0s" }}
    >
      <span class="w-1.5 h-1.5 rounded-full bg-emeraldGlow" />
      {t().ui.presentedBy}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Video modal                                                                 */
/* -------------------------------------------------------------------------- */
const VideoModal: Component<{
  open: boolean;
  src: string;
  onClose: () => void;
}> = (props) => (
  <Show when={props.open}>
    <div
      class="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={props.onClose}
    >
      <button
        class="absolute top-4 right-4 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          props.onClose();
        }}
        aria-label="Close video"
      >
        <X size={20} />
      </button>
      <video
        class="w-full h-full object-contain"
        src={props.src}
        autoplay
        controls
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  </Show>
);

/* -------------------------------------------------------------------------- */
/* Content slide (1–9)                                                        */
/* -------------------------------------------------------------------------- */
const ContentSlide: Component<{
  icon: IconComponent; // structural — from SLIDE_ICONS, locale-independent
  text: SlideText; // localized title/bullets/insight — reactive on locale
  index: number; // 1-based content index (1..10)
  variant: string; // .enter-* entrance class — unique per slide
  ambient: string; // ambient-* drift class — slow Ken Burns on the bg photo
  image: string; // per-slide background art (Vite-resolved URL)
  active: Accessor<boolean>;
  exiting: Accessor<boolean>;
  demos?: Demo[]; // zero or more demo videos for this slide
  onPlay?: (src: string) => void; // open a demo in the shared VideoModal
}> = (props) => {
  const Icon = props.icon;
  return (
    <div
      class="slide-card glass relative rounded-3xl px-9 sm:px-14 py-11 sm:py-14 w-full max-w-4xl overflow-hidden flex flex-col min-h-[460px] sm:min-h-[520px]"
      classList={{
        "is-active": props.active(),
        "is-exiting": props.exiting(),
        [props.variant]: true,
        [props.ambient]: true,
      }}
    >
      {/* Background art — sits on the frosted glass fill, kept low-opacity.
          Opacity + transform are owned by the amb-* keyframes (gated active). */}
      <div
        class="slide-bg-art absolute inset-0 bg-cover bg-center"
        style={{ "background-image": `url(${props.image})` }}
        aria-hidden="true"
      />
      {/* Dark wash for contrast: keeps text + glass readable over any photo. */}
      <div
        class="absolute inset-0 bg-gradient-to-t from-cosmic/80 via-cosmic/50 to-cosmic/40"
        aria-hidden="true"
      />

      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

      {/* Foreground content stays above the image + overlay layers. */}
      <div class="relative z-10 flex flex-col flex-1">
        {/* Header: icon + slide number */}
        <div class="flex items-start justify-between mb-7">
          <div class="slide-icon grid place-items-center w-16 h-16 rounded-2xl glass-pill text-cyanGlow">
            <Icon size={30} stroke-width={1.6} />
          </div>
          <span class="font-mono text-sm tracking-[0.25em] text-white/35 mt-2">
            {pad(props.index)} / {pad(SLIDE_COUNT)}
          </span>
        </div>

        {/* Title */}
        <h2
          class="reveal text-3xl sm:text-[2.6rem] font-bold tracking-tight text-white leading-tight mb-8 text-balance"
          style={{ "transition-delay": props.active() ? "0.12s" : "0s" }}
        >
          {props.text.title}
        </h2>

        {/* Bullets — staggered */}
        <ul class="space-y-4">
          <For each={props.text.bullets}>
            {(bullet, i) => (
              <li
                class="reveal flex items-start gap-4"
                style={{
                  "transition-delay": props.active()
                    ? `${0.22 + i() * 0.08}s`
                    : "0s",
                }}
              >
                {/* Gradient marker */}
                <span class="mt-2 shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-cyanGlow to-violetGlow shadow-[0_0_12px_rgba(103,232,249,0.6)]" />
                <span class="text-lg sm:text-xl text-white/85 leading-relaxed">
                  {bullet}
                </span>
              </li>
            )}
          </For>
        </ul>

        {/* Spacer pushes insight pill to bottom regardless of bullet count */}
        <div class="flex-1" />

        {/* Key insight pill */}
        <Show when={!!props.text.insight}>
          <div
            class="reveal mt-8 inline-flex items-center gap-3 pl-3 pr-6 py-3 rounded-full glass-pill"
            style={{ "transition-delay": props.active() ? "0.7s" : "0s" }}
          >
            <span class="grid place-items-center w-7 h-7 rounded-full bg-violetGlow/15 text-violetGlow">
              <Lightbulb size={15} />
            </span>
            <span class="text-sm sm:text-base text-white/90">
              <span class="text-violetGlow font-bold">{t().ui.keyInsight}</span>
              {props.text.insight}
            </span>
          </div>
        </Show>

        <Show when={props.demos?.length}>
          <div class="flex flex-wrap gap-3">
            <For each={props.demos}>
              {(demo, i) => (
                <button
                  class="reveal mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-pill text-sm text-white/90 hover:text-white cursor-pointer"
                  style={{
                    "transition-delay": props.active()
                      ? `${0.82 + i() * 0.08}s`
                      : "0s",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onPlay?.(demo.src);
                  }}
                >
                  <Play size={14} class="text-cyanGlow" fill="currentColor" />
                  {demo.label[locale()]}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* App                                                                        */
/* -------------------------------------------------------------------------- */
const App: Component = () => {
  const [current, setCurrent] = createSignal(0);       // track position
  const [activeIndex, setActiveIndex] = createSignal(0); // controls is-active / enter animation
  const [exitingIndex, setExitingIndex] = createSignal(-1); // controls is-exiting / exit animation
  const [modalOpen, setModalOpen] = createSignal(false);
  const [activeVideo, setActiveVideo] = createSignal<string | null>(null);
  const [isFullscreen, setIsFullscreen] = createSignal(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  let exitTimer: ReturnType<typeof setTimeout> | null = null;

  const EXIT_DURATION = 500; // ms — matches longest .is-exiting CSS animation

  const goto = (i: number) => {
    if (exitingIndex() !== -1) return; // locked during transition
    const target = Math.max(0, Math.min(TOTAL - 1, i));
    if (target === current()) return;

    batch(() => {
      setExitingIndex(current());
      setActiveIndex(-1);
    });

    if (exitTimer) clearTimeout(exitTimer);
    exitTimer = setTimeout(() => {
      exitTimer = null;
      batch(() => {
        setExitingIndex(-1);
        setCurrent(target);
        setActiveIndex(target);
      });
    }, EXIT_DURATION);
  };

  const next = () => goto(current() + 1);
  const prev = () => goto(current() - 1);

  /* --- Keyboard navigation --------------------------------------------- */
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveVideo(null);
      setModalOpen(false);
      return;
    }
    if (modalOpen() || activeVideo()) return;

    switch (e.key) {
      case "ArrowRight":
        next();
        break;
      case "ArrowLeft":
        prev();
        break;
      case " ": // Space / Shift+Space
        e.preventDefault();
        e.shiftKey ? prev() : next();
        break;
      case "Home":
        goto(0);
        break;
      case "End":
        goto(TOTAL - 1);
        break;
      default:
        // Number keys 1..9 jump to content slides; 0 jumps to hero.
        if (/^[0-9]$/.test(e.key)) goto(Number(e.key));
    }
  };

  /* --- Touch / pointer swipe ------------------------------------------- */
  let startX = 0;
  let tracking = false;
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return; // mouse uses the nav, not swipe
    startX = e.clientX;
    tracking = true;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  };

  const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

  onMount(() => {
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreenChange);
  });
  onCleanup(() => {
    window.removeEventListener("keydown", onKey);
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    if (exitTimer) clearTimeout(exitTimer);
  });

  return (
    <main
      class="relative h-full w-full overflow-hidden text-white select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Living background: blurred colour orbs (far) + animated constellation */}
      <Orbs slide={current()} />
      <ParticleField slide={current()} />

      {/* Language switcher — fixed top-left, flag-only trigger */}
      <LanguageSwitcher />

      {/* Fullscreen toggle — fixed top-right */}
      <button
        class="fixed top-3 right-3 z-40 grid place-items-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer transition-colors backdrop-blur-sm"
        onClick={toggleFullscreen}
        aria-label={isFullscreen() ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen() ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Top progress bar */}
      <div class="fixed top-0 inset-x-0 h-[3px] z-40 bg-white/5">
        <div
          class="h-full bg-gradient-to-r from-cyanGlow via-violetGlow to-emeraldGlow shadow-[0_0_14px_rgba(192,132,252,0.7)]"
          style={{
            width: `${(current() / (TOTAL - 1)) * 100}%`,
            transition: "width 0.7s cubic-bezier(0.23,1,0.32,1)",
          }}
        />
      </div>

      {/* Horizontal slide track */}
      <div
        class="relative z-10 flex h-full"
        style={{
          width: `${TOTAL * 100}vw`,
          transform: `translateX(-${current() * 100}vw)`,
          transition: "none",
        }}
      >
        {/* Slide 0 — hero */}
        <section class="w-screen h-full shrink-0 grid place-items-center px-6">
          <HeroSlide
            active={() => activeIndex() === 0}
            exiting={() => exitingIndex() === 0}
          />
        </section>

        {/* Content slides — icons are structural; text comes from i18n and is
            read inside JSX so the cards re-render when the locale flips. */}
        <For each={SLIDE_ICONS}>
          {(icon, i) => (
            <section class="w-screen h-full shrink-0 grid place-items-center px-6">
              <ContentSlide
                icon={icon}
                text={t().slides[i()]}
                index={i() + 1}
                variant={VARIANTS[i()]}
                ambient={AMBIENT[i()]}
                image={SLIDE_IMAGES[i()]}
                active={() => activeIndex() === i() + 1}
                exiting={() => exitingIndex() === i() + 1}
                demos={SLIDE_DEMOS[i()]}
                onPlay={setActiveVideo}
              />
            </section>
          )}
        </For>
      </div>

      {/* Bottom navigation */}
      <SlideNav
        current={current()}
        total={TOTAL}
        onPrev={prev}
        onNext={next}
        onOpenGrid={() => setModalOpen(true)}
      />

      {/* Demo video overlay — shared by every slide's demo buttons */}
      <VideoModal
        open={activeVideo() !== null}
        src={activeVideo() ?? ""}
        onClose={() => setActiveVideo(null)}
      />

      {/* All-slides overview */}
      <AllSlidesModal
        open={modalOpen()}
        current={current()}
        onClose={() => setModalOpen(false)}
        onSelect={(i) => {
          goto(i);
          setModalOpen(false);
        }}
      />
    </main>
  );
};

export default App;
