import { type Component } from 'solid-js';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-solid';
import { t } from '../i18n';

/**
 * Fixed glass navigation pill at the bottom-center: previous / next chevrons,
 * the current-slide indicator ("03 / 10"), and an "All Slides" button.
 */
const SlideNav: Component<{
  current: number;
  total: number; // total slide count, including the hero
  onPrev: () => void;
  onNext: () => void;
  onOpenGrid: () => void;
}> = (props) => {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div class="glass rounded-full px-3 py-2.5 flex items-center gap-2 sm:gap-3">
        {/* Previous — defined glass circle, cyan accent at rest */}
        <button
          onClick={props.onPrev}
          disabled={props.current === 0}
          class="grid place-items-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-cyanGlow transition-all duration-300 enabled:hover:bg-cyanGlow/15 enabled:hover:border-cyanGlow/40 enabled:hover:scale-105 enabled:hover:shadow-[0_0_20px_rgba(103,232,249,0.35)] disabled:opacity-20 disabled:text-white/40 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Indicator — current number in accent, total muted */}
        <div class="px-2 min-w-[5.5rem] text-center select-none">
          <span class="font-mono text-lg font-semibold text-cyanGlow tabular-nums">
            {pad(props.current + 1)}
          </span>
          <span class="font-mono text-sm text-white/35"> / {pad(props.total)}</span>
        </div>

        {/* Next — defined glass circle, cyan accent at rest */}
        <button
          onClick={props.onNext}
          disabled={props.current === props.total - 1}
          class="grid place-items-center w-11 h-11 rounded-full bg-white/5 border border-white/10 text-cyanGlow transition-all duration-300 enabled:hover:bg-cyanGlow/15 enabled:hover:border-cyanGlow/40 enabled:hover:scale-105 enabled:hover:shadow-[0_0_20px_rgba(103,232,249,0.35)] disabled:opacity-20 disabled:text-white/40 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Divider */}
        <div class="w-px h-7 bg-white/10 mx-0.5" />

        {/* All slides — violet accent icon, defined at rest */}
        <button
          onClick={props.onOpenGrid}
          class="flex items-center gap-2 h-11 pl-3 pr-4 rounded-full bg-white/5 border border-white/10 text-white/85 transition-all duration-300 hover:bg-violetGlow/15 hover:border-violetGlow/40 hover:shadow-[0_0_20px_rgba(192,132,252,0.3)]"
          aria-label="Show all slides"
        >
          <LayoutGrid size={18} class="text-violetGlow" />
          <span class="hidden sm:inline text-sm font-medium">{t().ui.allSlides}</span>
        </button>
      </div>
    </div>
  );
};

export default SlideNav;
