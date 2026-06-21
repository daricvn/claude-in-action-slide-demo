import { For, Show, type Component } from 'solid-js';
import { X, Sparkles } from 'lucide-solid';
import { SLIDES } from '../slides';

/**
 * Glass overlay listing every slide as a clickable mini-card. Clicking a card
 * jumps to that slide and closes the modal. The hero (slide 0) is shown first,
 * followed by the eight content slides.
 */
const AllSlidesModal: Component<{
  open: boolean;
  current: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}> = (props) => {
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <Show when={props.open}>
      <div
        class="modal-backdrop-enter fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 bg-black/50 backdrop-blur-md"
        onClick={props.onClose}
      >
        <div
          class="modal-panel-enter glass rounded-3xl w-full max-w-6xl max-h-[86vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div class="flex items-center justify-between px-8 py-6 border-b border-white/10">
            <div class="flex items-center gap-3">
              <span class="grid place-items-center w-9 h-9 rounded-xl glass-pill text-cyanGlow">
                <Sparkles size={18} />
              </span>
              <div>
                <p class="text-white font-semibold tracking-tight">All Slides</p>
                <p class="text-xs text-white/40">
                  {SLIDES.length + 1} slides · click to jump
                </p>
              </div>
            </div>
            <button
              class="grid place-items-center w-10 h-10 rounded-full glass-pill text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={props.onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Grid */}
          <div class="overflow-y-auto px-8 py-7">
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <For each={[null, ...SLIDES]}>
                {(slide, i) => {
                  const idx = i();
                  const active = idx === props.current;
                  const Icon = slide?.icon;
                  return (
                    <button
                      onClick={() => props.onSelect(idx)}
                      class="modal-card-enter group relative text-left rounded-2xl p-5 h-32 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1"
                      style={{ 'animation-delay': `${80 + idx * 45}ms` }}
                      classList={{
                        'bg-white/10 border-cyanGlow/40 ring-1 ring-cyanGlow/30':
                          active,
                        'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]':
                          !active,
                      }}
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-[11px] font-mono tracking-widest text-white/40">
                          {pad(idx)}
                        </span>
                        <Show
                          when={Icon}
                          fallback={
                            <span class="text-cyanGlow">
                              <Sparkles size={18} />
                            </span>
                          }
                        >
                          <span class="text-white/60 group-hover:text-cyanGlow transition-colors">
                            {Icon && <Icon size={18} />}
                          </span>
                        </Show>
                      </div>
                      <p class="text-sm font-medium leading-snug text-white/85 line-clamp-3">
                        {slide ? slide.title : 'Claude in Action'}
                      </p>
                    </button>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default AllSlidesModal;
