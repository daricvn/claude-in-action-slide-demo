import {
  createSignal,
  onMount,
  onCleanup,
  For,
  Show,
  type Component,
  type Accessor,
} from 'solid-js';
import { Lightbulb, Sparkles, Play, X } from 'lucide-solid';
import { SLIDES, type Slide } from './slides';
import Orbs from './components/Orbs';
import ParticleField from './components/ParticleField';
import SlideNav from './components/SlideNav';
import AllSlidesModal from './components/AllSlidesModal';
import slide1 from './assets/slide-1.jpg';
import slide2 from './assets/slide-2.jpg';
import slide3 from './assets/slide-3.jpg';
import slide4 from './assets/slide-4.jpg';
import slide5 from './assets/slide-5.jpg';
import slide6 from './assets/slide-6.jpg';
import slide7 from './assets/slide-7.jpg';
import slide8 from './assets/slide-8.jpg';
import slide9 from './assets/slide-9.jpg';
import demoMempalace from './assets/demo-mempalace.mp4';

// Per-content-slide background art. Index i maps to SLIDES[i] (slide i+1).
const SLIDE_IMAGES = [
  slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9,
];

const TOTAL = SLIDES.length + 1; // 10: hero + nine content slides
const pad = (n: number) => String(n).padStart(2, '0');

// Unique entrance per content slide (1..9). Each maps to an .enter-* keyframe
// defined in styles.css: rise, zoom, 3D flip, door, curtain, tilt, focus-blur,
// unfold, glide-skew. The hero uses .enter-hero.
const VARIANTS = [
  'enter-rise',
  'enter-zoom',
  'enter-flipx',
  'enter-door',
  'enter-curtain',
  'enter-tilt',
  'enter-focus',
  'enter-unfold',
  'enter-glide',
];

// Slow "Ken Burns" drift for each slide's background photo: scale + pan +
// opacity breathe + faint blur. One of six ambient flavours per slide, mapped
// to @keyframes amb-* in styles.css. Each only runs while its card .is-active
// (gated in CSS), so the nine off-screen cards never animate. Index aligns to
// SLIDES[i]; cycles every six slides.
const AMBIENT = [
  'ambient-1',
  'ambient-2',
  'ambient-3',
  'ambient-4',
  'ambient-5',
  'ambient-6',
  'ambient-1',
  'ambient-2',
  'ambient-3',
];

/* -------------------------------------------------------------------------- */
/* Hero (slide 0)                                                             */
/* -------------------------------------------------------------------------- */
const HeroSlide: Component<{ active: Accessor<boolean> }> = (props) => (
  <div
    class="slide-card enter-hero glass relative rounded-3xl px-10 sm:px-20 py-16 sm:py-20 max-w-4xl text-center overflow-hidden"
    classList={{ 'is-active': props.active() }}
  >
    {/* Inner top highlight for that real-glass sheen. */}
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

    <div class="slide-icon mx-auto mb-8 grid place-items-center w-16 h-16 rounded-2xl glass-pill text-cyanGlow">
      <Sparkles size={30} />
    </div>

    <p
      class="reveal text-xs sm:text-sm font-medium tracking-[0.35em] uppercase text-cyanGlow/80 mb-6"
      style={{ 'transition-delay': props.active() ? '0.15s' : '0s' }}
    >
      Enterprise Engineering Keynote
    </p>

    <h1
      class="reveal text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05]"
      style={{ 'transition-delay': props.active() ? '0.25s' : '0s' }}
      aria-label="Claude in Action"
    >
      {/* Per-letter wave: each glyph carries its own gradient (a transformed
          inline-block breaks bg-clip-text inherited from a parent), bobs on an
          infinite loop, staggered by index. Animation + will-change are gated to
          .is-active in styles.css so the off-screen hero never stays promoted. */}
      <For each={[...'Claude in Action']}>
        {(ch, i) => (
          <span
            class="wave-letter text-gradient"
            style={{ 'animation-delay': `${i() * 0.08}s` }}
            aria-hidden="true"
          >
            {ch === ' ' ? ' ' : ch}
          </span>
        )}
      </For>
    </h1>

    <p
      class="reveal mt-6 text-lg sm:text-2xl text-white/70 font-light max-w-2xl mx-auto"
      style={{ 'transition-delay': props.active() ? '0.4s' : '0s' }}
    >
      Scaling AI workflows for Enterprise Engineering
    </p>

    <div
      class="reveal mt-10 inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill text-sm text-white/60"
      style={{ 'transition-delay': props.active() ? '0.55s' : '0s' }}
    >
      <span class="w-1.5 h-1.5 rounded-full bg-emeraldGlow" />
      Presented by Huy Truong, Darick Nguyen
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Video modal                                                                 */
/* -------------------------------------------------------------------------- */
const VideoModal: Component<{ open: boolean; src: string; onClose: () => void }> = (props) => (
  <Show when={props.open}>
    <div
      class="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={props.onClose}
    >
      <button
        class="absolute top-4 right-4 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
        onClick={(e) => { e.stopPropagation(); props.onClose(); }}
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
  slide: Slide;
  index: number; // 1-based content index (1..9)
  variant: string; // .enter-* entrance class — unique per slide
  ambient: string; // ambient-* drift class — slow Ken Burns on the bg photo
  image: string; // per-slide background art (Vite-resolved URL)
  active: Accessor<boolean>;
  onWatchDemo?: () => void;
}> = (props) => {
  const Icon = props.slide.icon;
  return (
    <div
      class="slide-card glass relative rounded-3xl px-9 sm:px-14 py-11 sm:py-14 w-full max-w-4xl overflow-hidden flex flex-col min-h-[460px] sm:min-h-[520px]"
      classList={{
        'is-active': props.active(),
        [props.variant]: true,
        [props.ambient]: true,
      }}
    >
      {/* Background art — sits on the frosted glass fill, kept low-opacity.
          Opacity + transform are owned by the amb-* keyframes (gated active). */}
      <div
        class="slide-bg-art absolute inset-0 bg-cover bg-center"
        style={{ 'background-image': `url(${props.image})` }}
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
          {pad(props.index)} / 09
        </span>
      </div>

      {/* Title */}
      <h2
        class="reveal text-3xl sm:text-[2.6rem] font-bold tracking-tight text-white leading-tight mb-8 text-balance"
        style={{ 'transition-delay': props.active() ? '0.12s' : '0s' }}
      >
        {props.slide.title}
      </h2>

      {/* Bullets — staggered */}
      <ul class="space-y-4">
        <For each={props.slide.bullets}>
          {(bullet, i) => (
            <li
              class="reveal flex items-start gap-4"
              style={{
                'transition-delay': props.active()
                  ? `${0.22 + i() * 0.08}s`
                  : '0s',
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
      <div
        class="reveal mt-8 inline-flex items-center gap-3 pl-3 pr-6 py-3 rounded-full glass-pill"
        style={{ 'transition-delay': props.active() ? '0.7s' : '0s' }}
      >
        <span class="grid place-items-center w-7 h-7 rounded-full bg-violetGlow/15 text-violetGlow">
          <Lightbulb size={15} />
        </span>
        <span class="text-sm sm:text-base text-white/90">
          <span class="text-violetGlow font-bold">Key Insight: </span>
          {props.slide.insight}
        </span>
      </div>

      <Show when={props.onWatchDemo}>
        <button
          class="reveal mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-pill text-sm text-white/90 hover:text-white cursor-pointer"
          style={{ 'transition-delay': props.active() ? '0.82s' : '0s' }}
          onClick={(e) => { e.stopPropagation(); props.onWatchDemo!(); }}
        >
          <Play size={14} class="text-cyanGlow" fill="currentColor" />
          Watch Demo
        </button>
      </Show>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* App                                                                        */
/* -------------------------------------------------------------------------- */
const App: Component = () => {
  const [current, setCurrent] = createSignal(0);
  const [modalOpen, setModalOpen] = createSignal(false);
  const [videoOpen, setVideoOpen] = createSignal(false);

  const goto = (i: number) => setCurrent(Math.max(0, Math.min(TOTAL - 1, i)));
  const next = () => goto(current() + 1);
  const prev = () => goto(current() - 1);

  /* --- Keyboard navigation --------------------------------------------- */
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setVideoOpen(false);
      setModalOpen(false);
      return;
    }
    if (modalOpen() || videoOpen()) return;

    switch (e.key) {
      case 'ArrowRight':
        next();
        break;
      case 'ArrowLeft':
        prev();
        break;
      case ' ': // Space / Shift+Space
        e.preventDefault();
        e.shiftKey ? prev() : next();
        break;
      case 'Home':
        goto(0);
        break;
      case 'End':
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
    if (e.pointerType === 'mouse') return; // mouse uses the nav, not swipe
    startX = e.clientX;
    tracking = true;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  };

  onMount(() => window.addEventListener('keydown', onKey));
  onCleanup(() => window.removeEventListener('keydown', onKey));

  return (
    <main
      class="relative h-full w-full overflow-hidden text-white select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Living background: blurred colour orbs (far) + animated constellation */}
      <Orbs slide={current()} />
      <ParticleField slide={current()} />

      {/* Top progress bar */}
      <div class="fixed top-0 inset-x-0 h-[3px] z-40 bg-white/5">
        <div
          class="h-full bg-gradient-to-r from-cyanGlow via-violetGlow to-emeraldGlow shadow-[0_0_14px_rgba(192,132,252,0.7)]"
          style={{
            width: `${(current() / (TOTAL - 1)) * 100}%`,
            transition: 'width 0.7s cubic-bezier(0.23,1,0.32,1)',
          }}
        />
      </div>

      {/* Horizontal slide track */}
      <div
        class="relative z-10 flex h-full"
        style={{
          width: `${TOTAL * 100}vw`,
          transform: `translateX(-${current() * 100}vw)`,
          transition: 'transform 0.7s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* Slide 0 — hero */}
        <section class="w-screen h-full shrink-0 grid place-items-center px-6">
          <HeroSlide active={() => current() === 0} />
        </section>

        {/* Slides 1–9 — content */}
        <For each={SLIDES}>
          {(slide, i) => (
            <section class="w-screen h-full shrink-0 grid place-items-center px-6">
              <ContentSlide
                slide={slide}
                index={i() + 1}
                variant={VARIANTS[i()]}
                ambient={AMBIENT[i()]}
                image={SLIDE_IMAGES[i()]}
                active={() => current() === i() + 1}
                onWatchDemo={i() === 8 ? () => setVideoOpen(true) : undefined}
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

      {/* Demo video overlay */}
      <VideoModal open={videoOpen()} src={demoMempalace} onClose={() => setVideoOpen(false)} />

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
