import { For, type Component } from 'solid-js';

/**
 * Living background: 6 large blurred orbs that smoothly reposition and shift
 * colour/opacity whenever the active slide changes. Each orb's position is a
 * deterministic function of `slide` (sine/cosine offsets), so navigation feels
 * like a single continuous, expensive motion rather than a hard cut.
 *
 * All movement is pure CSS transition on `transform`/`opacity` — cheap and
 * buttery. The layer is fixed, behind everything, and ignores pointer events.
 */

const PALETTE = [
  '#67E8F9', // cyan
  '#C084FC', // violet
  '#6EE7B7', // emerald
  '#818CF8', // indigo
];

interface OrbDef {
  /** Diameter in vmax. */
  size: number;
  /** Phase offsets that make each orb travel on its own path. */
  phase: number;
  freqX: number;
  freqY: number;
  baseOpacity: number;
}

const ORBS: OrbDef[] = [
  { size: 42, phase: 0.0, freqX: 1.0, freqY: 0.7, baseOpacity: 0.5 },
  { size: 36, phase: 1.7, freqX: 0.8, freqY: 1.1, baseOpacity: 0.42 },
  { size: 50, phase: 3.1, freqX: 1.2, freqY: 0.5, baseOpacity: 0.38 },
  { size: 30, phase: 4.4, freqX: 0.6, freqY: 1.3, baseOpacity: 0.46 },
  { size: 44, phase: 5.6, freqX: 1.1, freqY: 0.9, baseOpacity: 0.34 },
  { size: 26, phase: 2.3, freqX: 1.4, freqY: 1.2, baseOpacity: 0.4 },
];

/** Map an orb + current slide to a screen position (in %) and tint. */
function orbStyle(orb: OrbDef, index: number, slide: number) {
  const t = slide * 0.9; // how far the field "rotates" per slide
  // Travel across the viewport on a smooth sinusoidal path.
  const x = 50 + 38 * Math.sin(t * orb.freqX + orb.phase);
  const y = 50 + 34 * Math.cos(t * orb.freqY + orb.phase * 1.3);
  // Colour gently cycles through the palette as you advance.
  const color = PALETTE[(index + slide) % PALETTE.length];
  // Opacity breathes a little per slide for extra life (1.35× = bolder colour).
  const opacity = orb.baseOpacity * 1.35 * (0.8 + 0.2 * Math.sin(t + index));

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${orb.size}vmax`,
    height: `${orb.size}vmax`,
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color}00 72%)`,
    opacity: `${opacity}`,
  };
}

const Orbs: Component<{ slide: number }> = (props) => {
  return (
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep vignette to anchor the cosmic background. */}
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#0d0d1a_0%,#05050a_60%,#020205_100%)]" />

      <For each={ORBS}>
        {(orb, i) => (
          <div
            class="orb absolute rounded-full blur-3xl"
            style={{
              ...orbStyle(orb, i(), props.slide),
              // The signature glide: long, keynote-grade easing.
              // (transform is owned by the looping orb-drift-* keyframe; left/
              //  top/opacity/background still transition on slide change.)
              transition:
                'left 1.4s cubic-bezier(0.22,1,0.36,1), top 1.4s cubic-bezier(0.22,1,0.36,1), opacity 1.4s ease, background 1.4s ease',
              // Endless slow drift — one of three vectors, phase-shifted per orb
              // via negative delay so they never move in lockstep.
              animation: `orb-drift-${(i() % 3) + 1} ${20 + i() * 2.5}s ease-in-out ${-i() * 4}s infinite`,
            }}
          />
        )}
      </For>

      {/* Faint grain/sheen overlay for a premium, non-flat finish. */}
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(103,232,249,0.06)_0%,transparent_50%)]" />
    </div>
  );
};

export default Orbs;
